const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const sql = require('../db/sql/jobSql.js');
const jobBuilder = require('../dto/jobBuilder');
const addslashes = require('../db/addslashes.js');

/* POST Job (Insert) */
router.post('/', (req, res, next) => {
	// let viid = req.body.iid ? addslashes(req.body.iid) : "";
	// let viname = req.body.iname ? addslashes(req.body.iname) : "";
	// let vtid = req.body.tid ? addslashes(req.body.tid) : "";
	// let vtname = req.body.tname ? addslashes(req.body.tname) : "";
	// let vstatus = req.body.status ? addslashes(req.body.status) : "";

	const dto = new jobBuilder().setIid(addslashes(req.body.iid))
								.setIname(addslashes(req.body.iname))
								.setTid(addslashes(req.body.tid))
								.setTname(addslashes(req.body.tname))
								.setStatus(addslashes(req.body.status))
								.build();

	db.query(sql.post(), [dto.iid, dto.iname, dto.tid
							, dto.tname, dto.status], (err, rows) => {
		if (err) return next(err);

		res.json(db.resultMsg('a001', req.body));
	});
});

/* PUT Job (Update) */
router.put('/:seq', (req, res, next) => {
	res.json(db.resultMsg('900', req.body));
});

/* DELETE Job (delete) */
router.delete('/:seq', (req, res, next) => {
	res.json(db.resultMsg('900', req.body));
});

/* GET Job (SELECT ONE) */
router.get('/:seq', (req, res, next) => {
	const seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.getOneRow(), [seq], (err, rows) => {
		if (err) {
			return next(err);
		}
		res.json(db.resultMsg('a001', rows.rows[0]));
	});
});

/* GET Job listing. */
router.get('/', (req, res, next) => {
	let data = {};
	const page = req.query.page ? addslashes(req.query.page) : "";
	const pageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	const tname = req.query.tname ? addslashes(req.query.tname) : "";
	const iname = req.query.iname ? addslashes(req.query.iname) : "";
	const status = req.query.status ? addslashes(req.query.status) : "";
	// Todo variable check
	// const tcheck = req.query.chk_temp ? addslashes(req.query.chk_temp) : "";

	if (page == "" || page < 1) {
		page = 1;
	}
	if (pageSize) {
		if (pageSize == "" || pageSize < 1) {
			pageSize = 15;
		}
	}

	const start = (page - 1) * pageSize;

	db.query(sql.getList(tname, iname, status), [pageSize, start], (err, rows) => {
		if (err) {
			return next(err);
		}
		totalCount(req).then((result) => {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = page;
			data['pageSize'] = pageSize;
			data['list'] = rows.rows;

			if (data.list == "") {
				res.json(db.resultMsg('500'[2], rows.rows[0]));
			} else {
				res.json(db.resultMsg('a001', data));
			}
		}).catch((err) => {
			if (err) {
				console.log(err);
			}
		});
	});
});

function totalCount(req) {
	let tname = req.query.tname ? addslashes(req.query.tname) : "";
	let iname = req.query.iname ? addslashes(req.query.iname) : "";
	let status = req.query.status ? addslashes(req.query.status) : "";

	let stringQuery = sql.totalCount(tname, iname, status)

	return new Promise((resolve, reject) => {
		db.query(stringQuery, [], (err, rows) => {
			if (err) {
				return reject(err);
			}
			resolve(rows.rows[0].total);
		});
	});
}

module.exports = router;