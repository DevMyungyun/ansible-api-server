const express = require('express');
const router = express.Router();
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
const {
  resolve
} = require('path');

const key = new rsa(conf.rsa);

const vran = 'f' + (Math.random() * (1 << 30)).toString(16).replace('.', '');
const vdic = conf.fileStorage + vran;
let vjid = ""
let vjdata = {};

/* POST Adhoc Job Event (Insert) */
router.post('/playbook', (req, res, next) => {
  const tid = req.body.tid ? addslashes(req.body.tid) : "";

  selectJobTemplate(tid).then((resultJT) => {
    if (resultJT === undefined) {
      console.log('>>> Template ID does not exist in database');
      return res.json(db.resultMsg('a501', req.body));
    }
    if (resultJT.use_yn == 'Y') {
      const returnCode = jobExecute(next, resultJT, 'AP');
      return res.json(db.resultMsg(returnCode, tid));

    } else if (resultJT.use_yn == 'N') {
      console.log('>>> This Playbook Template does not allow to use');
      return res.json(db.resultMsg('a502', req.body));
    }
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });
  // Excuting Ansible-PlayBook is end
});

router.post('/adhoc', (req, res, next) => {
  const tid = req.body.tid ? addslashes(req.body.tid) : "";

  // ADHOC excute
  selectAHTemplate(tid).then((resultAHT) => {
    if (resultAHT === undefined) {
      console.log('>>> Template ID does not exist in database');
      return res.json(db.resultMsg('a501', req.body));
    }
    if (resultAHT.use_yn == 'Y') {
      let varg = resultAHT.argument;

      const returnCode = jobExecute(next, resultAHT, 'AH', varg);
      return res.json(db.resultMsg(returnCode, {
        'tid': tid
      }));

    } else if (resultAHT.use_yn == 'N') {
      console.log('>>> This Ad-Hoc Template does not allow to use');
      return res.json(db.resultMsg('a502', req.body));
    }
  }).catch((err) => {
    if (err) {
      console.error(err);
    }
  });
});
/* PUT Job Event (Update) */
router.put('/:seq', (req, res, next) => {
  return res.json(db.resultMsg('a900', req.body));
});

/* DELETE Job Event (delete) */
router.delete('/:seq', (req, res, next) => {
  return res.json(db.resultMsg('a900', req.body));
});

/* GET Job Event (SELECT ONE) */
router.get('/:seq', (req, res, next) => {
  let seq = req.params.seq ? addslashes(req.params.seq) : "";

  db.query(sql.getOneRow(), [seq], (err, rows) => {
    if (err) {
      return next(err);
    }
    return res.json(db.resultMsg('a001', rows.rows));
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

      return res.json(db.resultMsg('a001', data));
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

async function jobExecute(next, resultT, chk_template, varg) {
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
    const credential = await selectCred(resultT.cname);

    // Host
    const targetHosts = await selectHosts(resultT.iid);

    if (vverb === 0) vverb = '-v';
    else if (vverb === 1) vverb = '-vv';
    else if (vverb === 2) vverb = '-vvv';
    else if (vverb === 3) vverb = '-vvvv';
    else if (vverb === 4) vverb = '-vvvvv';
    else vverb = '-v'

    // Directory Create
    await mkDir(vdic);
    // Create hosts file
    await writeFile(inventoryUrl, targetHosts);

    // Check Credential
    let vCredential = '';
    if (credential !== undefined) {
      vCredential += credential.mid !== undefined ? `\nansible_user: ${credential.mid.replace(/\\\\/g, '\\')}` : ``;
      vCredential += credential.mpw !== undefined ? `\nansible_password: \'${key.decrypt(credential.mpw, 'utf8')}\'` : ``;
      vCredential += credential.private_key !== undefined ? `\nansible_ssh_private_key_file: ${pkUrl}` : ``;

      await writeFile(pkUrl, key.decrypt(credential.private_key, 'utf8').replace(/\\n/g, '\n'));
      await fileChmod(pkUrl, '600');
    }

    // Create Env file
    await writeFile(envUrl, resultT.variables.replace(/\\n/g, '\n') + vCredential);

    //Job Insert
    const jobResult = await insertJob(resultT);
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
      return 'a004';
    });
  } catch (err) {
    next(err)
  }
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

      return resolve(rows.rows[0]);
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
      return resolve(imsi);
    });
  });
}

function mkDir(dic) {
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

function rmDir(dic) {
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

function writeFile(filename, data) {
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

function fileChmod(path, chmode) {
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

function insertJob(data) {
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

function getJid() {
  return new Promise((resolve, reject) => {
    db.query(sql.getJidQuery(), [], (err, rows) => {
      if (err) {
        return reject(err);
      }
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
      console.log(">>> successfully insert job datas");
    });
  });
}

function updateJobevent(vcode, vjid) {

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


module.exports = router;