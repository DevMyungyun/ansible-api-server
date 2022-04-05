const express = require('express');
const router = express.Router();
const format = require('pg-format');

const db = require('../db/db.js');
const sql = require('../db/sql/invHostSql.js')
const addslashes = require('../db/addslashes.js');

/* Post Ivt_hst multiple Inventory ID (Insert) */
router.post('/', (req, res, next) => {
	let iidHid = req.body.iidHid ? req.body.iidHid : "";
	const values = iidHid.map(v => [v.iid, v.hid])

	db.query(format(sql.post(), values), [], (err, rows) => {
		if (err) return next(err);
		
		res.json(db.resultMsg('a001', req.body));
	});
});

/* GET iid (SELECT ONE) */
router.get('/iid/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.getRowsByIid(), [seq], (err, rows) => {
		if (err) return next(err);
		res.json(db.resultMsg('a001', rows.rows));
	});
});

/* GET hid (SELECT ONE) */
router.get('/hid/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.getRowsByHid(), [seq], (err, rows) => {
		if (err) return next(err);
		res.json(db.resultMsg('a001', rows.rows));
	});
});

module.exports = router;