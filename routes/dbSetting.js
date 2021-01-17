const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const sql = require('../db/sql/dbSettingSql.js')

const {
  Pool
} = require('pg');



/* delete dtatbase */
router.get('/deleteDB', (req, res, next) => {
  const deleteTableName = ['t_inventory', 't_hosts', 't_Ivt_hst', 't_jobtemps', 't_jobevents', 't_jobs', 't_credentials', 't_adhoc', 't_codes'];

  let stringQuery = sql.dropTable()

  deleteTableName.forEach((item) => {
    db.iquery(stringQuery + item, [], (err, rows) => {
      if (err) {
        return next(err);
        res.json(db.resultMsg('260', req.body));
      }
      console.log('>>> Success to delete ' + item + ' table ');
    });
  });
  res.json(db.resultMsg('201', req.body));
});



/* Create database table */
router.get('/createTable', (req, res, next) => {

  createIvtTable().then((result) => {
    // console.log(result);
    if (result != null) {
      console.log('Success to create Inventory table');

      createIvtIndex().then((iresult) => {
        if (iresult != null) {
          console.log('>>> Success to create Inventory index');

          createHostTable().then((hresult) => {
            if (hresult != null) {
              console.log('>>> Success to create Host table');

              // createHostIndex().then(function(hresult2){
              //     if(hresult2 != null) {
              //         console.log('>>> Success to create Host index');

              createIvtHostJoin().then((jresult) => {
                if (jresult != null) {
                  console.log('>>> Success to create Inventory-Host join table');

                  createTriggerFunc().then((fresult) => {
                    if (fresult != null) {
                      console.log('>>> Success to create Trigger Function');

                      createTrigger().then((tresult) => {
                        if (tresult != null) {
                          console.log('>>> Success to create Trigger');
                        } else {
                          console.log('>>> Fail to create Trigger');
                          res.json(db.resultMsg('260', req.body));
                        }
                      });
                    } else {
                      console.log('>>> Fail to create Trigger Function');
                      res.json(db.resultMsg('260', req.body));
                    }
                  });
                } else {
                  console.log('>>> Fail to create Inventory-Host join table');
                  res.json(db.resultMsg('260', req.body));
                }
              });

              // } else {
              //     console.log('>>> Fail to create Host index');
              //     res.json(db.resultMsg('260', req.body));
              // }
              // });
            } else {
              console.log('>>> Fail to create Host table');
              res.json(db.resultMsg('260', req.body));
            }
          });

        } else {
          console.log('>>> Fail to create Inventory index');
          res.json(db.resultMsg('260', req.body));
        }
      });
    } else {
      console.log('>>> Fail to create Inventory table');
      res.json(db.resultMsg('260', req.body));
    }
  });


  createTempTable().then((result) => {
    if (result != null) {
      console.log('>>> Success to create Template table');
    } else {
      console.log('>>> Fail to create Template table');
      res.json(db.resultMsg('260', req.body));
    }
  });

  createJobTable().then((result) => {
    if (result != null) {
      console.log('>>> Success to create Job table');
    } else {
      console.log('>>> Fail to create Job table');
      res.json(db.resultMsg('260', req.body));
    }
  });

  createJobEventTable().then((result) => {
    if (result != null) {
      console.log('>>> Success to create Job Event table');
    } else {
      console.log('>>> Fail to create Job Event table');
      res.json(db.resultMsg('260', req.body));
    }
  });

  createCredTable().then((result) => {
    if (result != null) {
      console.log('>>> Success to create Credential table');
    } else {
      console.log('>>> Fail to create Credential table');
      res.json(db.resultMsg('260', req.body));
    }
  });

  createAdhocTable().then((ahresult) => {
    if (ahresult != null) {
      console.log('>>> Success to create ADHOC table');
    } else {
      console.log('>>> fail to create ADHOC table');
    }
  });

  createCommonCodeTable().then((ccresult) => {
    if (ccresult != null) {
      console.log('>>> Success to create Common Code table');

      istCommonCodeTable().then((istResult) => {
        if (istResult != null) {
          console.log('>>> Success to insert Common Code datas');
        } else {
          console.log('>>> Success to insert Common Code datas');
        }
      })
    } else {
      console.log('>>> Success to create Common Code table');
    }
  });

  res.json(db.resultMsg('201', req.body));
});

// Create Inventory table
function createIvtTable() {
  let stringQuery = sql.invTable()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
      // res.json(db.resultMsg('200', rows.rows));
    });
  });
}
// Create Inventory index
function createIvtIndex() {
  let stringQuery = sql.invIndex()

  return new Promise((resolve, reject) => {
    db.iquery(stringQueryIvt_idx, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create Inventory-Host join table
function createIvtHostJoin() {
  let stringQuery = sql.invHostJoin()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create Host table and index
function createHostTable() {
  let stringQuery = sql.hostTable()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
//Create Host index
function createHostIndex() {
  let stringQuery = sql.hostIndex()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create Template table
function createTempTable() {
  let stringQuery = sql.tempTable()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create job table
function createJobTable() {
  let stringQuery = sql.jobTable()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create job event table
function createJobEventTable() {
  let stringQuery = sql.jobEventTable()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create Credential table
function createCredTable() {
  let stringQuery = "";
  stringQuery += " create table t_credentials ( ";
  stringQuery += " name	varchar(255)	Not Null	primary key, ";
  stringQuery += " content varchar(255), ";
  stringQuery += " mid 	varchar(255), ";
  stringQuery += " mpw 	varchar(1024), ";
  stringQuery += " private_key 	text, ";
  stringQuery += " create_dt 	timestamp default now(), ";
  stringQuery += " create_id 	varchar(50), ";
  stringQuery += " update_dt 	timestamp, ";
  stringQuery += " update_id 	varchar(50) ";
  stringQuery += " ) ";

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create AD-HOC Template table
function createAdhocTable() {
  let stringQuery = sql.adhocTable()
  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create Common Code table
function createCommonCodeTable() {
  let stringQuery = sql.commonCodeTable()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create Common Code Insert table
function istCommonCodeTable() {
  let stringQuery = insertCommonCode()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create Trigger function
function createTriggerFunc() {
  let stringQuery = sql.triggerFunc()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create Trigger
function createTrigger() {
  let stringQuery = sql.trigger()

  return new Promise((resolve, reject) => {
    db.iquery(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}


module.exports = router;