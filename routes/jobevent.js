const express = require('express');
const router = express.Router();
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const fs = require('fs');
const rimraf = require('rimraf');
const rsa = require('node-rsa');
const conf = require('../config.js');

const db = require('../db/db.js');
const sql = require('../db/sql/jobeventSql.js');
const jobSql = require('../db/sql/jobSql');
const addslashes = require('../db/addslashes.js');

const key = new rsa(conf.rsa);
let vjdata = {};

/* POST Adhoc Job Event (Insert) */
router.post('/playbook', (req, res, next) => {
  const vtid = req.body.tid ? addslashes(req.body.tid) : "";
  const vran = 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
  const vdic = conf.fileStorage + vran;
  let vjid = ""

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
          const inventoryUrl = vdic + "/hosts";
          const envUrl = vdic + "/vars";
          const pkUrl = vdic + "/id_dsa_pk";
          const vforksCli = '--forks=' + resultJT.forks;
          const playbookUrl = conf.playbook + resultJT.playbook;
          const vverb = resultJT.verb;
          const vlimits = resultJT.limits;

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
            res.json(db.resultMsg('a001', vjdata));
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
      res.json(db.resultMsg('a502', req.body));
    } else {
      console.log('Job Template ID does not exist in database');
      res.json(db.resultMsg('a501', req.body));
    }
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
  // Excuting Ansible-PlayBook is end
});

function jobeventExecute(resultT, chk_template , varg) {
  // Directory Create
  mkDir(vdic);
  resultT['chk_temp'] = chk_template;
  selectCred(resultT.cname).then((resultMCred) => {
    const vmid = resultMCred.mid;
    const vmpw = resultMCred.mpw;
    const vmpk = resultMCred.private_key;
    //Host
    selectHosts(resultT.iid).then((resultH) => {
      const inventoryUrl = vdic + "/hosts";
      const envUrl = vdic + "/vars";
      const pkUrl = vdic + "/id_dsa_pk";
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

      let args = (resultT['chk_temp'] === 'AP') ?
             ['-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, playbookUrlorModule]
             : ['hosts', '-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, '-m', playbookUrlorModule];

      if(resultT['chk_temp'] === 'AP') {
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
        rmDir(vdic);
        res.json(db.resultMsg('a001', vjdata));
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
}


router.post('/adhoc', (req, res, next) => {
  const vtid = req.body.tid ? addslashes(req.body.tid) : "";
  const vran = 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
  const vdic = conf.fileStorage + vran;
  let vjid = ""

  // ADHOC excute
  selectAHTemplate(vtid).then((resultAHT) => {
    if (resultAHT != null && resultAHT.use_yn == 'Y') {
      let varg = resultAHT.argument;

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
          const inventoryUrl = vdic + "/hosts";
          const envUrl = vdic + "/vars";
          const pkUrl = vdic + "/id_dsa_pk";
          const vforksCli = '--forks=' + resultAHT.forks;
          const vmodule = resultAHT.module;
          const vverb = resultAHT.verb;
          const vlimits = resultAHT.limits;

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

          let args = ['hosts', '-i', inventoryUrl, '-e', '@' + envUrl, vforksCli, vverb, '-m', vmodule];

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
            res.json(db.resultMsg('a001', vjdata));
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
      res.json(db.resultMsg('a502', req.body));
    } else {
      console.log('Template ID does not exist in database');
      res.json(db.resultMsg('a501', req.body));
    }
  }).catch((err) => {
    if (err) {
      console.error(err);
    }
  });
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
router.get('/:seq', (req, res, next) => {
  let seq = req.params.seq ? addslashes(req.params.seq) : "";

  db.query(sql.getOneRow(), [seq], (err, rows) => {
    if (err) {
      return next(err);
    }
    res.json(db.resultMsg('a001', rows.rows));
  });
});

/* GET Job Event listing. */
router.get('/', (req, res, next) => {
  let data = {};
  let page = req.query.page ? addslashes(req.query.page) : "";
  let pageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";

  if (page == "" || page < 1) {
    page = 1;
  }
  if (pageSize == "" || pageSize < 1) {
    pageSize = 15;
  }
  let start = (page - 1) * pageSize;

  db.query(sql.getList(), [pageSize, start], (err, rows) => {
    if (err) {
      return next(err);
    }

    totalCount().then((result) => {
      data['rowCount'] = rows.rowCount;
      data['totalCount'] = result;
      data['page'] = page;
      data['pageSize'] = pageSize
      data['list'] = rows.rows;

      res.json(db.resultMsg('a001', data));
    }).catch((err) => {
      if (err) {
        console.error(err);
      }
    });
  });
});

/* Action */
router.get('/Action', (req, res, next) => {});

function totalCount() {
  return new Promise((resolve, reject) => {
    db.query(sql.action(), [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      console.log("total func: " + rows.rows[0].total);
      resolve(rows.rows[0].total);

    });
  });
}


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
    db.query(jobSql.post(), [data.iid, data.iname, data.tid
                            , data.tname, data.chk_temp], (err, rows) => {
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
    db.query( sql.insertJobeventQuery(data), [vjid, vpid, vcheck], (err, rows) => {
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


module.exports = router;