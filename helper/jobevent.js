'use strict';

const spawn = require('child_process').spawn;
// const exec = require('child_process').exec;
const fs = require('fs');
const rimraf = require('rimraf');
const rsa = require('node-rsa');
const conf = require('../config.js');

const db = require('../db/db.js');
const sql = require('../db/sql/jobeventSql.js');
const jobSql = require('../db/sql/jobSql');
const {
    resolve
} = require('path');

const key = new rsa(conf.rsa);
const vran = 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
const vdic = conf.fileStorage + vran;

class jobeventHelper {
    async jobExecute(next, resultT, chk_template, varg) {
        resultT['chk_temp'] = chk_template;
        const inventoryUrl = vdic + "/hosts";
        const envUrl = vdic + "/vars";
        const pkUrl = vdic + "/id_dsa_pk";
        const vforksCli = '--forks=' + resultT.forks;
        let vverb = resultT.verb;
        const vlimits = resultT.limits;
        const playbookUrlorModule = (resultT['chk_temp'] === 'AP') ?
            conf.playbook + resultT.playbook : resultT.module;

        try {
            const credential = await this.selectCred(resultT.cname);

            // Host
            const targetHosts = await this.selectHosts(resultT.iid);

            if (vverb === 0) vverb = '-v';
            else if (vverb === 1) vverb = '-vv';
            else if (vverb === 2) vverb = '-vvv';
            else if (vverb === 3) vverb = '-vvvv';
            else if (vverb === 4) vverb = '-vvvvv';
            else vverb = '-v'

            // Directory Create
            await this.mkDir(vdic);
            // Create hosts file
            await this.writeFile(inventoryUrl, targetHosts);

            // Check Credential
            let vCredential = '';
            if (credential !== undefined) {
                vCredential += credential.mid !== undefined ? `\nansible_user: ${credential.mid.replace(/\\\\/g, '\\')}` : ``;
                vCredential += credential.mpw !== undefined ? `\nansible_password: \'${key.decrypt(credential.mpw, 'utf8')}\'` : ``;
                vCredential += credential.private_key !== undefined ? `\nansible_ssh_private_key_file: ${pkUrl}` : ``;

                await this.writeFile(pkUrl, key.decrypt(credential.private_key, 'utf8').replace(/\\n/g, '\n'));
                await this.fileChmod(pkUrl, '600');
            }

            // Create Env file
            await this.writeFile(envUrl, resultT.variables.replace(/\\n/g, '\n') + vCredential);

            //Job Insert
            const jobResult = await this.insertJob(resultT);
            vjid = jobResult;
            vjdata['jid'] = jobResult;

            let args = (resultT['chk_temp'] === 'AP') ? ['-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, playbookUrlorModule] : ['hosts', '-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, '-m', playbookUrlorModule];

            if (resultT['chk_temp'] === 'AP') {
                // Playbook
                if (vlimits != '') {
                    args.push('--limit');
                    args.push('@' + vlimits);
                }
            } else {
                // ADHOC 
                if (vlimits !== '' && varg === '') {
                    args.push('-l');
                    args.push(vlimits);
                } else if (vlimits === '' && varg !== '') {
                    args.push('-a');
                    args.push(varg);
                } else if (vlimits !== '' && varg !== '') {
                    args.push('-a');
                    args.push(varg);
                    args.push('-l');
                    args.push(vlimits);
                }
            }

            console.log('### COMMAND ARGS :  ', args);

            const ansible = spawn('ansible-playbook', args, {
                stdio: ['inherit', 'pipe']
            });

            ansible.stdout.on('data', (data) => {
                const vpid = ansible.pid
                try {
                    insertJobevent(data, vjid, vpid, resultT['chk_temp']);
                } catch (err) {
                    return 'a504';
                }

            });

            ansible.stderr.on('data', (data) => {
                console.log(new Date() + ' : ipconfig error...');
                rmDir(vdic);
                return 'a504';
            });

            ansible.on('close', (code) => {
                console.log(new Date() + ' : ansible-playbook complete...' + code);
                (code, vjid);
                // DELETE Directory
                rmDir(vdic);
                return 'a001';
            });
        } catch (err) {
            next(err)
        }
    }

    selectJobTemplate(tid) {
        return new Promise((resolve, reject) => {
            db.query(sql.selectJobTempQuery(), [tid], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows.rows[0]);
            });
        });
    }

    selectAHTemplate(tid) {
        return new Promise((resolve, reject) => {
            db.query(sql.selectAHTempQuery(), [tid], (err, rows) => {
                if (err) {
                    return reject(err);
                }

                resolve(rows.rows[0]);
            });
        });
    }

    selectCred(cname) {
        return new Promise((resolve, reject) => {
            db.query(sql.selectCredQuery(), [cname], (err, rows) => {
                if (err) {
                    return reject(err);
                }

                return resolve(rows.rows[0]);
            });
        });
    }

    selectHosts(iid) {
        return new Promise((resolve, reject) => {
            db.query(sql.selectHostQuery(), [iid], (err, rows) => {
                if (err) {
                    return reject(err);
                }

                let imsi = "[hosts]\n";

                for (let i = 0; i < rows.rows.length; i++) {
                    if (rows.rows[i].name != null) {
                        if (rows.rows[i].domain == null || rows.rows[i].domain == '') {
                            imsi += rows.rows[i].name + "\n";
                        } else {
                            imsi += rows.rows[i].name + '.' + rows.rows[i].domain + "\n";
                        }
                    } else {
                        imsi += rows.rows[i].ip + "\n";
                    }
                }
                return resolve(imsi);
            });
        });
    }

    mkDir(dic) {
        return new Promise((resolve, reject) => {
            fs.mkdir(dic, (err) => {
                if (err) {
                    console.log('fail to create directory, ', err);
                    reject(err);
                }
                console.log('### successfully create directory');
                return resolve();
            });
        });
    }

    rmDir(dic) {
        return new Promise((resolve, reject) => {
            rimraf(dic, (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('>>> successfully delete directory');
                return resolve();
            });
        });
    }

    writeFile(filename, data) {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(filename, data, 'utf8');
                console.log('>>> successfully write into the file');
                return resolve();
            } catch (err) {
                reject(err)
            }
        });
    }

    fileChmod(path, chmode) {
        return new Promise((resolve, reject) => {
            try {
                fs.chmodSync(path, chmode);
                console.log('>>> successfully change the file mode');
                return resolve();
            } catch (err) {
                console.log(err);
            }
        });
    }

    insertJob(data) {
        return new Promise((resolve, reject) => {
            db.query(jobSql.post(), [data.iid, data.iname, data.tid, data.tname, data.chk_temp, data.forks, data.verb, data.variables, data.limits], (err, rows) => {
                if (err) {
                    return reject(err);
                }

                getJid().then((result) => {
                    resolve(result);
                });
            });
        });
    }

    getJid() {
        return new Promise((resolve, reject) => {
            db.query(sql.getJidQuery(), [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows.rows[0].currval);
            });
        });
    }

    insertJobevent(data, vjid, vpid, vcheck) {

        return new Promise((resolve, reject) => {
            db.query(sql.insertJobeventQuery(data), [vjid, vpid, vcheck], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                console.log(">>> successfully insert job datas");
            });
        });
    }

    updateJobevent(vcode, vjid) {

        return new Promise((resolve, reject) => {
            db.query(sql.updateJobeventQuery(vcode, vjid), [], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                console.log(">>> successfully job event update");
                return resolve();
            })
        })
    }

    build() {
        return new jobeventHelper();
    } 
}

module.exports = jobeventHelper;