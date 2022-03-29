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
    db.query(stringQuery + item, [], (err, rows) => {
      if (err) {
        return next(err);
        res.json(db.resultMsg('500'[0], req.body));
      }
      console.log('>>> Success to delete ' + item + ' table ');
    });
  });
  res.json(db.resultMsg('200'[1], req.body));
});

/* Create database table */
router.get('/createDB', (req, res, next) => {
  try {
    createIvtTable().then((itresult) => {
      createIvtIndex().then((iresult) => {
          createHostTable().then((hresult) => {
              createIvtHostJoin().then((jresult) => {
                  createTriggerFunc().then((fresult) => {
                    createTrigger()
                  });
              });
          });
      });
    });

    createTempTable()
    createJobTable()
    createJobEventTable()
    createCredTable()
    createAdhocTable()
  
    createCommonCodeTable().then((ccresult) => {
        istCommonCodeTable()
    });

    res.json(db.resultMsg('200'[1], req.body));
  } catch (err) {
    console.log("error occur when database table creating : ", err);
    res.json(db.resultMsg('500'[0], req.body));
  }
});

// Create Inventory table
function createIvtTable() {
  let stringQuery = sql.invTable()

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create Inventory index
function createIvtIndex() {
  let stringQuery = sql.invIndex()

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}
// Create Credential table
function createCredTable() {
  let stringQuery = sql.credTable()

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

// Create Common Code Insert table
function istCommonCodeTable() {
  let stringQuery = sql.insertCommonCode()

  return new Promise((resolve, reject) => {
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
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
    db.query(stringQuery, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}


module.exports = router;