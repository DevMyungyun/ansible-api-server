const spawn = require('child_process').spawn;
// const exec = require('child_process').exec;
const fs = require('fs');
const rimraf = require('rimraf');
const rsa = require('node-rsa');
const conf = require('../config.js');

const db = require('../db/db.js');
const sql = require('../db/sql/jobeventSql.js');
const jobSql = require('../db/sql/jobSql');
const addslashes = require('../db/addslashes.js');

const key = new rsa(conf.rsa);
let vjid = ""
let vjdata = {};
const tid = addslashes(1);
const ran = 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
const dic = conf.fileStorage + ran;
        

describe('Job Test', function () {
    it('job event test', function (done) {
        
        selectAHTemplate(tid).then((resultAHT) => {
            if (resultAHT != null && resultAHT.use_yn == 'Y') {
              let varg = resultAHT.argument;
              jobExecute(resultAHT, 'AH', varg, vjid, vjdata);
              done();
            }
    })
})

async function jobExecute(resultT, chk_template, varg) {
// Directory Create
await mkDir(dic);
resultT['chk_temp'] = chk_template;
const credentail = await selectCred(resultT.cname);
// .then((resultMCred) => {
//   const vmid = resultMCred.mid;
//   const vmpw = resultMCred.mpw;
//   const vmpk = resultMCred.private_key;
console.log(credentail);

const selectedHosts = await selectedHosts(resultT.iid);
console.log(selectedHosts);
//Host
selectHosts(resultT.iid).then((resultH) => {
    const inventoryUrl = dic + "/hosts";
    const envUrl = dic + "/vars";
    const pkUrl = dic + "/id_dsa_pk";
    const vforksCli = '--forks=' + resultT.forks;
    const vverb = resultT.verb;
    const vlimits = resultT.limits;
    const playbookUrlorModule = (resultT['chk_temp'] === 'AP') ?
        conf.playbook + resultT.playbook : resultT.module;


    if (vverb === 0) {
        vverb = '-v';
    } else if (vverb === 1) {
        vverb = '-vv';
    } else if (vverb === 2) {
        vverb = '-vvv';
    } else if (vverb === 3) {
        vverb = '-vvvv';
    } else if (vverb === 4) {
        vverb = '-vvvvv';
    } else {
        vverb = '-v'
    }

    // Create hosts file
    writeFile(inventoryUrl, resultH);

    // Create Vars file
    // console.log(resultT);

    let vCredential = '';

    if (((vmpk == null) && (vmid && vmpw)) || ((vmpk == '') && (vmid && vmpw))) {
        vCredential = '\nansible_user: ' + vmid.replace(/\\\\/g, '\\') + '\nansible_password: \'' + key.decrypt(vmpw, 'utf8') + '\'\n';
    } else if (((vmpk != null) && (vmid && vmpw)) || ((vmpk != '') && (vmid && vmpw))) {
        let decryptPK = key.decrypt(vmpk, 'utf8')
        writeFile(pkUrl, decryptPK.replace(/\\n/g, '\n'));
        fileChmod(pkUrl, '600');
        vCredential = '\nansible_ssh_private_key_file: ' + pkUrl + '\nansible_user: ' + vmid.replace(/\\\\/g, '\\') + '\nansible_ssh_password: \'' + key.decrypt(vmpw, 'utf8') + '\'\n';
    } else {
        vCredential = '';
    }

    writeFile(envUrl, resultT.variables.replace(/\\n/g, '\n') + vCredential);

    //Job Insert
    insertJob(resultT).then((result) => {
        vjid = result;
        vjdata['jid'] = vjid;
    });

    let args = (resultT['chk_temp'] === 'AP') ? ['-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, playbookUrlorModule] :
        ['hosts', '-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, '-m', playbookUrlorModule];

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
        } else {
            args
        }
    }

    console.log('### COMMAND ARGS :  ', args);

    const ansible = spawn('ansible-playbook', args, {
        stdio: ['inherit', 'pipe']
    });

    ansible.stdout.on('data', (data) => {
        const vpid = ansible.pid
        insertJobevent(data, vjid, vpid, vcheck);
    });

    ansible.stderr.on('data', (data) => {
        console.log(new Date() + 'ipconfig error...');
    });

    ansible.on('close', (code) => {
        console.log(new Date() + 'ansible-playbook complete...' + code);
        updateJobevent(code, vjid);
        // DELETE Directory
        rmDir(dic);
        res.json(db.resultMsg('a001', vjdata));
    });
})
// .catch((err) => {
//     if (err) {
//         console.log(err);
//     }
// });

function selectJobTemplate(tid) {
    return new Promise((resolve, reject) => {
        db.query(sql.selectJobTempQuery(), [tid], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows.rows[0]);
        });
    });
}

function selectAHTemplate(tid) {
    return new Promise((resolve, reject) => {
        db.query(sql.selectAHTempQuery(), [tid], (err, rows) => {
            if (err) {
                return reject(err);
            }

            resolve(rows.rows[0]);
        });
    });
}

function selectCred(cname) {
    return new Promise((resolve, reject) => {
        db.query(sql.selectCredQuery(), [cname], (err, rows) => {
            if (err) {
                return reject(err);
            }

            resolve(rows.rows[0]);
        });
    });
}

function selectHosts(iid) {
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
            resolve(imsi);
        });
    });
}

function mkDir(dic) {
    fs.mkdir(dic, (err) => {
        if (err) {
            console.log('fail to create directory, ', err);
        }
        console.log('### successfully create directory');
    });
}

function rmDir(dic) {
    rimraf(dic, (err) => {
        if (err) {
            return reject(err);
        }
        console.log('### successfully delete directory');
    });
}

function writeFile(filename, data) {
    try {
        fs.writeFileSync(filename, data, 'utf8');
        console.log('### successfully write into the file');
    } catch (err) {
        console.log(err);
    }
}

function fileChmod(path, chmode) {
    try {
        fs.chmodSync(path, chmode);
        console.log('### successfully change the file mode');
    } catch (err) {
        console.log(err);
    }
}

function selectJid() {
    return new Promise((resolve, reject) => {
        db.query(sql.selectJidQuery(), [], (err, rows) => {
            if (err) {
                return reject(err);
            }
            console.log("total func: " + rows.rows[0].currval);
            resolve(rows.rows[0].currval);

        });
    });
}

function insertJob(data) {
    return new Promise((resolve, reject) => {
        db.query(jobSql.post(), [data.iid, data.iname, data.tid, data.tname, data.chk_temp], (err, rows) => {
            if (err) {
                return reject(err);
            }

            getJid().then((result) => {
                resolve(result);
            });
        });
    });
}

function getJid() {
    return new Promise((resolve, reject) => {
        db.query(sql.getJidQuery(), [], (err, rows) => {
            if (err) {
                return reject(err);
            }
            // console.log(rows.rows[0].currval);
            resolve(rows.rows[0].currval);
        });
    });
}

function insertJobevent(data, vjid, vpid, vcheck) {

    return new Promise((resolve, reject) => {
        db.query(sql.insertJobeventQuery(data), [vjid, vpid, vcheck], (err, rows) => {
            if (err) {
                return reject(err);
            }
            // console.log("successfully insert job datas");
        });
    });
}

function updateJobevent(vcode, vjid) {

    db.query(sql.updateJobeventQuery(), [vcode, vjid], (err, rows) => {
        if (err) {
            return reject(err);
        }
    });
}