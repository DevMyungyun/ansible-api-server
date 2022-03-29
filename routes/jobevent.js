const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const fs = require('fs');
const rimraf = require('rimraf');
const rsa = require('node-rsa');
const conf = require('../config.js');

const db = require('../db/db.js');
const sql = require('../db/sql/jobeventSql.js')
const addslashes = require('../db/addslashes.js');
// const func = require('../db/func.js');

const key = new rsa(conf.rsa);
let vjid = "";
let vjdata = {};

/* POST Job Event (Insert) */
router.post('/', (req, res, next) => {
  let vtid = req.body.tid ? addslashes(req.body.tid) : "";
  let vcheck = req.body.chk_temp ? addslashes(req.body.chk_temp) : "";
  let vran = 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
  let vdic = conf.fileStorage + vran;
  let vjid = ""

  // Check which template is going to excute between Playbook and Ad-Hoc
  if (vcheck == 'AP') {
    selectJobTemplate(vtid).then((resultJT) => {
      if (resultJT != null && resultJT.use_yn == 'Y') {
        // Directory Create
        mkDir(vdic);
        resultJT['chk_temp'] = 'AP';
        selectCred(resultJT.cname).then((resultMCred) => {
          const vmid = resultMCred.mid;
          const vmpw = resultMCred.mpw;
          const vmpk = resultMCred.private_key;
          //Host
          selectHosts(resultJT.iid).then((resultH) => {
            let inventoryUrl = vdic + "/hosts";
            let envUrl = vdic + "/vars";
            let pkUrl = vdic + "/id_dsa_pk";
            let vforksCli = '--forks=' + resultJT.forks;
            let playbookUrl = conf.playbook + resultJT.playbook;
            let vverb = resultJT.verb;
            let vlimits = resultJT.limits;

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
            // console.log(resultJT);

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

            writeFile(envUrl, resultJT.variables.replace(/\\n/g, '\n') + vCredential);

            //Job Insert
            insertJob(resultJT).then((result) => {
              vjid = result;
              vjdata['jid'] = vjid;
            });

            let args = ['-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, playbookUrl];

            if (vlimits != '') {
              args.push('--limit');
              args.push('@' + vlimits);
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
              rmDir(vdic);
              res.json(db.resultMsg('200'[0], vjdata));
            });
          }).catch((err) => {
            if (err) {
              console.log(err);
            }
          });
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      } else if (resultJT.use_yn == 'N') {
        console.log('### This Playbook Template does not allow to use');
        res.json(db.resultMsg('500'[0], req.body));
      } else {
        console.log('Job Template ID does not exist in database');
        res.json(db.resultMsg('500'[2], req.body));
      }


    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });

    // Excuting Ansible-PlayBook is end
  } else {
    // ADHOC excute
    selectAHTemplate(vtid).then((resultAHT) => {
      if (resultAHT != null && resultAHT.use_yn == 'Y') {

        // Directory Create
        mkDir(vdic);

        resultAHT['chk_temp'] = 'AH';
        selectCred(resultAHT.cname).then((resultMCred) => {
          const vmid = resultMCred.mid;
          const vmpw = resultMCred.mpw;
          const vmpk = resultMCred.private_key;
          //Host
          selectHosts(resultAHT.iid).then((resultH) => {
            // console.log(resultAHT);
            //console.log('######host : '+resultH);
            let inventoryUrl = vdic + "/hosts";
            let envUrl = vdic + "/vars";
            let pkUrl = vdic + "/id_dsa_pk";
            let vforksCli = '--forks=' + resultAHT.forks;
            let vmodule = resultAHT.module;
            let varg = resultAHT.argument;
            let vverb = resultAHT.verb;
            let vlimits = resultAHT.limits;

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
            // console.log(resultAHT);

            let vCredential = '';

            if (vmpk == null) {
              vCredential = '\nansible_user: ' + vmid.replace(/\\\\/g, '\\') + '\nansible_password: \'' + key.decrypt(vmpw, 'utf8') + '\'\n';
            } else if (vmpk != null) {
              let decryptPK = key.decrypt(vmpk, 'utf8')
              writeFile(pkUrl, decryptPK.replace(/\\n/g, '\n'));
              fileChmod(pkUrl, '600');
              vCredential = '\nansible_ssh_private_key_file: ' + pkUrl + '\nansible_user: ' + vmid.replace(/\\\\/g, '\\') + '\nansible_ssh_pass: \'' + key.decrypt(vmpw, 'utf8') + '\'\n';
            } else {
              vCredential = '';
            }

            writeFile(envUrl, resultAHT.variables.replace(/\\n/g, '\n') + vCredential);

            // Insert Job data
            insertJob(resultAHT).then((result) => {
              vjid = result;
              vjdata['jid'] = vjid;
            });

            const args = ['hosts', '-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, '-m', vmodule];

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

            console.log('### COMMAND ARGS :  ', args);

            const ansible = spawn('ansible', args, {
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
              console.log(new Date() + 'ADHOC command complete...' + code);
              updateJobevent(code, vjid);
              // DELETE Directory
              rmDir(vdic);
              res.json(db.resultMsg('200'[0], vjdata));
            });
          }).catch((err) => {
            if (err) {
              console.log(err);
            }
          });
        }).catch((err) => {
          if (err) {
            console.log(err);
          }
        });
      } else if (resultAHT.use_yn == 'N') {
        console.log('### This Ad-Hoc Template does not allow to use');
        res.json(db.resultMsg('500'[0], req.body));
      } else {
        console.log('ADHOC Template ID does not exist in database');
        res.json(db.resultMsg('500'[2], req.body));
      }
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});

/* PUT Job Event (Update) */
router.put('/:seq', (req, res, next) => {
  res.json(db.resultMsg('900', req.body));
});

/* DELETE Job Event (delete) */
router.delete('/:seq', (req, res, next) => {
  res.json(db.resultMsg('900', req.body));
});

/* GET Job Event (SELECT ONE) */
router.get('/o', (req, res, next) => {
  let vseq = req.query.seq ? addslashes(req.query.seq) : "";

  if (vseq) {
    if (isNaN(vseq) === false) {
      let stringQuery = sql.getOneRow(vseq)

      db.query(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rows == "") {
          res.json(db.resultMsg('500'[2], rows.rows));
        } else {
          // console.log(db.resultMsg('200'[0], rows.rows[0]));
          res.json(db.resultMsg('200'[0], rows.rows));
        }
      });
    } else {
      console.log("Type error! Please input Integer type ID!!");
      res.json(db.resultMsg('403'[0], req.body));
    }
  } else {
    console.log("Job Event ID does not exist!!");
    res.json(db.resultMsg('403'[0], req.body));
  }

});

/* GET Job Event listing. */
router.get('/', (req, res, next) => {
  let vdata = {};
  let vpage = req.query.page ? addslashes(req.query.page) : "";
  let vpageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";

  if (vpage == "" || vpage < 1) {
    vpage = 1;
  }
  if (vpageSize == "" || vpageSize < 1) {
    vpageSize = 15;
  }
  let vstart = (vpage - 1) * vpageSize;

  let stringQuery = sql.getList(vpageSize, vstart)

  let imsi = db.query(stringQuery, [], (err, rows) => {
    if (err) {
      return next(err);
    }

    totalCount().then((result) => {
      vdata['rowCount'] = rows.rowCount;
      vdata['totalCount'] = result;
      vdata['page'] = vpage;
      vdata['pageSize'] = vpageSize
      vdata['list'] = rows.rows;

      if (vdata.rowCount < 1) {
        res.json(db.resultMsg('500'[2], rows.rows));
      } else {
        // console.log(db.resultMsg('200'[0], vdata));
        res.json(db.resultMsg('200'[0], vdata));
      }
    }).catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  });
});

/* Action */
router.get('/Action', (req, res, next) => {});

function totalCount() {
  let vdata = {};
  let stringQuery = sql.action()

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      console.log("total func: " + rows.rows[0].total);
      resolve(rows.rows[0].total);

    });
  });
}


function selectJobTemplate(vtid) {
  let stringQuery = sql.selectJobTempQuery(vtid)

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows.rows[0]);
    });
  });
}

function selectAHTemplate(vtid) {
  let stringQuery = sql.selectAHTempQuery(vtid)

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows.rows[0]);
    });
  });
}

function selectCred(vcname) {
  let stringQuery = sql.selectCredQuery(vcname)

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      resolve(rows.rows[0]);
    });
  });
}

function selectHosts(viid) {
  let stringQuery = sql.selectHostQuery(viid)
  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
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
      // console.log('######[host] :' + imsi);
      resolve(imsi);
    });
  });
}

function mkDir(vdic) {
  fs.mkdir(vdic, (err) => {
    if (err) {
      console.log('fail to create directory, ', err);
    }
    console.log('### successfully create directory');
  });
}

function rmDir(vdic) {
  rimraf(vdic, (err) => {
    if (err) {
      return reject(err);
    }
    console.log('### successfully delete directory');
  });
}

function writeFile(vfilename, vdata) {
  try {
    fs.writeFileSync(vfilename, vdata, 'utf8');
    console.log('### successfully write into the file');
  } catch (err) {
    console.log(err);
  }
}

function fileChmod(vpath, vchmode) {
  try {
    fs.chmodSync(vpath, vchmode);
    console.log('### successfully change the file mode');
  } catch (err) {
    console.log(err);
  }
}

function selectJid() {
  let vdata = {};
  let stringQuery = sql.selectJidQuery()

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      console.log("total func: " + rows.rows[0].currval);
      resolve(rows.rows[0].currval);

    });
  });
}

function insertJob(vdata) {
  let stringQuery = sql.insertJobQuery(vdata)
  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
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
    let stringQuery = sql.getJidQuery()
    db.query(stringQuery, [], (err, rows) => {
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
    let stringQuery = sql.insertJobeventQuery(vjid, vpid, vcheck, data)
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      // console.log("successfully insert job datas");
    });
  });
}

function updateJobevent(vcode, vjid) {
  let stringQuery = sql.updateJobeventQuery(vcode, vjid)

  db.query(stringQuery, [], (err, rows) => {
    if (err) {
      return reject(err);
    }
  });
}


module.exports = router;