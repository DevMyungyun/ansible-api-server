'use strict';

const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const sql = require('../db/sql/jobeventSql.js');
const addslashes = require('../db/addslashes.js');
const {
  resolve
} = require('path');

const jobeventHelper = require('../helper/jobevent.js');

const jHelper = new jobeventHelper().build();

/* POST Adhoc Job Event (Insert) */
router.post('/playbook', (req, res, next) => {
  const tid = req.body.tid ? addslashes(req.body.tid) : "";

  jHelper.selectJobTemplate(tid).then((resultJT) => {
    if (resultJT === undefined) {
      console.log('>>> Template ID does not exist in database');
      return res.json(db.resultMsg('a501', req.body));
    }
    if (resultJT.use_yn == 'Y') {
      const returnCode = jHelper.jobExecute(next, resultJT, 'AP');
      return res.json(db.resultMsg(returnCode, tid));

    } else if (resultJT.use_yn == 'N') {
      console.log('>>> This Playbook Template does not allow to use');
      return res.json(db.resultMsg('a502', req.body));
    }
  }).catch((err) => {
    if (err) next(err);
  });
  // Excuting Ansible-PlayBook is end
});

router.post('/adhoc', (req, res, next) => {
  const tid = req.body.tid ? addslashes(req.body.tid) : "";

  // ADHOC excute
  jHelper.selectAHTemplate(tid).then((resultAHT) => {
    if (resultAHT === undefined) {
      console.log('>>> Template ID does not exist in database');
      return res.json(db.resultMsg('a501', req.body));
    }
    if (resultAHT.use_yn == 'Y') {
      let varg = resultAHT.argument;

      const returnCode = jHelper.jobExecute(next, resultAHT, 'AH', varg);
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

    jHelper.totalCount().then((result) => {
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


module.exports = router;