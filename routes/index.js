const express = require('express');
const router = express.Router();
const fs = require('fs');

const conf = require('../config.js');
const db = require('../db/db.js');
const sql = require('../db/sql/indexSql.js');

//const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

const addslashes = require('../db/addslashes.js');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express'
  });
});

/* Playbook List */
router.get('/playbook', (req, res, next) => {
  const playbookFolder = conf.playbook;
  let pbArray = new Array;
  fs.readdir(playbookFolder, (err, files) => {
    if (err) {
      console.log(err);
    }
    if (files) {
      files.forEach((item) => {
        if (item != null) {
          if (item.match(/.yaml/g) == '.yaml' || item.match(/.yml/g) == '.yml') {
            pbArray.push(item);
          }
        }
      });
      // console.log(pbArray);
      res.json(playbookRes('200'[0], pbArray.length, pbArray));
    }
  });
});


function playbookRes(vcode, length, files) {
  let vresult = {}

  vresult['code'] = vcode;
  vresult['filesLength'] = length;
  vresult['data'] = files;

  return vresult;
}


/* GET Common Code */
router.get('/commonCode', (req, res, next) => {
  let vinv = req.query.inv ? addslashes(req.query.inv) : "";

  if (vinv) {
    if (typeof vinv == 'string') {
      let stringQuery = sql.commonCode(vinv)

      db.iquery(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rowCount < 1) {
          res.json(db.resultMsg('500'[2], rows.rows));
        } else {
          let vcodeArr = []
          rows.rows.forEach((result) => {
            if (result != null) {
              vcodeArr.push(result.code_name);
            }
          });

          res.json(db.resultMsg('200'[0], vcodeArr));
        }
      });
    } else {
      console.log("Type error! Please input String type ID!!");
      res.json(db.resultMsg('403'[0], req.body));
    }
  } else {
    console.log("Job template ID does not exist!!");
    res.json(db.resultMsg('403'[0], req.body));
  }

});


router.get('/getJoinIvt', (req, res, next) => {
  let vhid = req.query.hid ? addslashes(req.query.hid) : "";

  if (vhid) {
    if (isNaN(vhid) === false) {
      let stringQuery = sql.getJoinInv(vhid)

      db.iquery(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rowCount < 1) {
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
    console.log("Host ID does not exist!!");
    res.json(db.resultMsg('403'[0], req.body));
  }

});

router.get('/chkIvnDupl', (req, res, next) => {
  let viname = req.query.name ? addslashes(req.query.name) : "";

  if (viname) {
    if (typeof viname === 'string') {
      let stringQuery = sql.chkInvDupl(viname)

      db.iquery(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rowCount < 1) {
          res.json(db.resultMsg('500'[2], rows.rows));
        } else {
          // console.log(db.resultMsg('200'[0], rows.rows[0]));
          res.json(db.resultMsg('200'[0], rows.rows));
        }
      });

    } else {
      console.log("Type error! Please input String type name!!");
      res.json(db.resultMsg('403'[0], req.body));
    }
  } else {
    console.log("Inventory name does not exist!!");
    res.json(db.resultMsg('403'[0], req.body));
  }

});

router.get('/chkHstDupl', (req, res, next) => {
  let vhname = req.query.name ? addslashes(req.query.name) : "";
  if (vhname) {
    if (typeof vhname == 'string') {
      let stringQuery = sql.chkHostDupl(vhname)

      db.iquery(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rowCount < 1) {
          res.json(db.resultMsg('500'[2], rows.rows));
        } else {
          // console.log(db.resultMsg('200'[0], rows.rows[0]));
          res.json(db.resultMsg('200'[0], rows.rows));
        }
      });

    } else {
      console.log("Type error! Please input String type name!!");
      res.json(db.resultMsg('403'[0], req.body));
    }
  } else {
    console.log("Inventory name does not exist!!");
    res.json(db.resultMsg('403'[0], req.body));
  }

});

router.get('/chkCredDupl', (req, res, next) => {
  let vcname = req.query.name ? addslashes(req.query.name) : "";

  if (vcname) {
    if (typeof vcname === 'string') {
      let stringQuery = sql.chkCredDupl(vcname)

      db.iquery(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rowCount < 1) {
          res.json(db.resultMsg('500'[2], rows.rows));
        } else {
          // console.log(db.resultMsg('200'[0], rows.rows[0]));
          res.json(db.resultMsg('200'[0], rows.rows));
        }
      });

    } else {
      console.log("Type error! Please input String type name!!");
      res.json(db.resultMsg('403'[0], req.body));
    }
  } else {
    console.log("Credential name does not exist!!");
    res.json(db.resultMsg('403'[0], req.body));
  }

});

router.get('/analyzedResult', (req, res, next) => {
  let vseq = req.query.seq ? addslashes(req.query.seq) : "";

  if (vseq) {
    if (isNaN(vseq) === false) {
      let stringQuery = sql.analyzedResult(vseq)

      db.iquery(stringQuery, [], (err, rows) => {
        if (err) {
          return next(err);
        }
        if (rows.rows == "") {
          res.json(db.resultMsg('500'[2], rows.rows));
        } else {
          // console.log(db.resultMsg('200'[0], rows.rows[0]));
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

            res.json(db.resultMsg('200'[0], resResult));

          } else {
            let resResult = '';
            resResult += 'Some error occured while PlayBook is executed\\nCheck Host or variables again...';
            res.json(db.resultMsg('200'[0], resResult));
          }

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

router.get('/terminateJob', (req, res, next) => {

  let killPsCmd = 'killall -9 ansible; killall -9 ansible-playbook;';
  console.log('#### kill process comand : ' + killPsCmd);
  exec(killPsCmd, (err, stdout, stderr) => {
    console.log('### Kill Process stdout : ' + stdout);
    console.log('### Kill Process stderr : ' + stderr);
    if (err != null) {
      console.log('### Kill Process error : ' + err);
      res.json(db.resultMsg('200'[3], stderr));
    } else if (stdout != null) {
      res.json(db.resultMsg('200'[0], stdout));
    }

  });

});

router.get('/terminateOneJob', (req, res, next) => {
  let vpid = req.query.pid ? addslashes(req.query.pid) : "";

  killProcess(vpid).then((result) => {
    console.log('### after kill process : ' + result);

    let lookupPsCheck = 'ps -ef | grep ' + vpid + ' | awk \'{print $2,$3}\' ';
    exec(lookupPsCheck, (err, stdout, stderr) => {
      console.log('### lookup check Process stdout : ' + stdout);

      let vpid1 = stdout.split('\n');
      let vpid2 = [];
      let killPs = '';
      vpid1.forEach((result) => {
        vpid2.push(result.split(' '));
      });
      vpid2 = vpid2.toString();
      let vpid3 = vpid2.split(',');

      console.log('### lookup check Process array : ' + vpid3);
      if (vpid3[0] == vpid) {
        killPs += 'kill -9 ' + vpid + ' ; ';

        exec(killPs, (err, stdout, stderr) => {
          console.log('### kill process : ' + stdout);
          console.log('### kill process error command : ' + stderr);
          if (err != null) {
            console.log('### Kill Process error : ' + err);
          }
        });
      }

      res.json(db.resultMsg('200'[3], stderr));
    });

  }).catch((err) => {
    if (err) {
      console.log('### error while kill process : ' + err);
    }
  });
});

function killProcess(vpid) {
  let lookupPs = 'ps -ef | grep ' + vpid + ' | awk \'{print $2,$3}\' ';
  //console.log('#### lookup process comand : '+lookupPs);


  return new Promise((resolve, reject) => {

    for (let i = 0; i < 2; i++) {
      exec(lookupPs, (err, stdout, stderr) => {
        //console.log('### lookup Process stdout : '+ stdout);

        let vppid1 = stdout.split('\n');
        let vppid2 = [];
        let killPs = '';
        vppid1.forEach((result) => {
          vppid2.push(result.split(' '));
        });
        vppid2 = vppid2.toString();
        let vppid3 = vppid2.split(',');
        let vppid4 = vppid3.slice(0, Number(vppid3.length - 5));
        console.log('### ppid : ' + vppid4);

        for (let j = 2; j < vppid4.length; j += 2) {
          killPs += 'kill -9 ' + vppid4[j] + ' ; ';
        }

        console.log('### kill process : ' + killPs);

        exec(killPs, (killErr, killStdout, killStderr) => {

          console.log('### kill process : ' + killStdout);
          resolve(killStdout);
          if (killErr != null) {
            console.log('### Kill Process error : ' + killErr);
            return reject(killErr);
            // res.json(db.resultMsg('200'[3], killStdout));
          }
        });

        if (err != null) {
          console.log('### Kill Process error : ' + err);

          //res.json(db.resultMsg('200'[3], stderr));
        }
      });
    }
  });
}

module.exports = router;