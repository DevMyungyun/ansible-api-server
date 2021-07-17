import pool from '../dbconfig/dbconnector';
import indexSql from '../sql/indexSql';
import fs from 'fs';

class indexController {

    constructor() {}

    public async get(req, res) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM t_hosts";
            const {
                rows
            } = await client.query(sql);
            const todos = rows;

            client.release();

            res.send(todos);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async getPlaybook(req, res) {
        try {
            const playbookFolder: string = process.env.playbook;
            let playbookArr: Array < string > = new Array;
            fs.readdir(playbookFolder, (err, files): void => {
                if (files) {
                    files.forEach((item) => {
                        // if (item.match(/.yaml/g) == '.yaml' || item.match(/.yml/g) == '.yml') {
                        playbookArr.push(item);
                        // }
                    });
                    let vresult = {}
                    vresult['code'] = '200';
                    vresult['filesLength'] = playbookArr.length;
                    vresult['data'] = playbookArr;

                    res.send(vresult);
                }
            })
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async getCommonCode(req, res) {
        try {
            const vinv: string = req.query.inv;
            //? addslashes(req.query.inv) : "";

            const client = await pool.connect();

            const sql: string = indexSql.commonCode();

            const {
                rows
            } = await client.query(sql, [vinv]);
            const result = rows;

            client.release();

            res.send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    // Todo
    // Recap logic Edit
    public async analyzePlaybookRecap(req, res) {
        try {
            const vseq: number = req.query.seq;
            //? addslashes(req.query.inv) : "";
            
            const client = await pool.connect();

            const sql: string = indexSql.analyzePlaybookRecap();
            
            const {
                rows
            } = await client.query(sql, [vseq]);
            
            client.release();

            let pbResult = '';
            let resResult = '';
            rows.rows.forEach((item) => {
                pbResult += item.stdout;
            });

            if (pbResult.indexOf('PLAY RECAP') > -1) {
                //Play RECAP Parsing
                let playRecap = pbResult.split('\\n');
                //console.log(playRecap);
                // excuted hosts
                let hosts = [];
                let pbSuccessOrFail = [];
                playRecap.forEach((item) => {
                    if (item.indexOf('ok=') > -1 && item.indexOf('changed=') > -1) {
                        // whole space remove
                        hosts.push(item.replace(/(\s*)/g, ""));
                        pbSuccessOrFail.push(item);
                    }
                });
                // success, fail split
                let vsof = [];
                pbSuccessOrFail.forEach((item) => {
                    if (item != '') {
                        vsof.push(item.split('\\n'));
                        // vsof.push(item.replace(/(\s*)/g,""));
                    }
                });
                // console.log('####################11 : ' + vsof);

                let vsof2 = '';
                pbSuccessOrFail.forEach((item) => {
                    if (item != '') {
                        vsof2 += item.split(' ');
                        // vsof.push(item.replace(/(\s*)/g,""));
                    }
                });
                // console.log('####################22 : ' + vsof2);

                let vsof3 = vsof2.split(',');
                let vsof4 = [];
                vsof3.forEach((item) => {
                    if (item.indexOf('ok=') > -1 || item.indexOf('changed=') > -1 || item.indexOf('unreachable=') > -1 || item.indexOf('failed=') > -1) {
                        vsof4.push(item.substring(item.lastIndexOf('=') + 1));
                    }
                });
                //console.log('####################33 : ' + vsof4);

                resResult += 'The number of executed hosts : ' + hosts.length + '\\n';

                let successCountArr = [];

                for (let i = 0; i < vsof4.length; i += 4) {
                    if (parseInt(vsof4[i]) > 0) {
                        successCountArr.push(vsof[i]);
                    }
                }

                console.log(successCountArr);

                resResult += 'The number of Successed hosts : ' + successCountArr.length + '\\n';

                let failCountArr = [];

                for (let i = 3; i < vsof4.length; i += 4) {
                    if (parseInt(vsof4[i]) > 0) {
                        failCountArr.push(vsof[i]);
                    }
                }

                resResult += 'The number of failed hosts : ' + failCountArr.length + '\\n';

                let unReacherableCountArr = [];

                for (let i = 2; i < vsof4.length; i += 4) {
                    if (parseInt(vsof4[i]) > 0) {
                        unReacherableCountArr.push(vsof[i]);
                    }
                }

                resResult += 'The number of unreachabled hosts : ' + unReacherableCountArr.length + '\\n';
                // console.log(resResult);

                res.json(resResult);

            } else {
                let resResult = '';
                resResult += 'Some error occured while PlayBook is executed\\nCheck Host or variables again...';
                res.json(resResult);
            }

        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }

}

export default indexController;