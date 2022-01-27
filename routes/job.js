const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const sql = require('../db/sql/jobSql.js')
const addslashes = require('../db/addslashes.js');

/* POST Job (Insert) */
router.post('/', (req, res, next) => {
	let viid = req.body.iid ? addslashes(req.body.iid) : "";
	let viname = req.body.iname ? addslashes(req.body.iname) : "";
	let vtid = req.body.tid ? addslashes(req.body.tid) : "";
	let vtname = req.body.tname ? addslashes(req.body.tname) : "";
	let vstatus = req.body.status ? addslashes(req.body.status) : "";

	let stringQuery = sql.post(viid, viname, vtid, vtname)
	db.query(stringQuery, [], (err, rows) => {
		if (err) {
			return next(err);
		}

		if (rows.rowCount < 1) {
			res.json(db.resultMsg('403'[1], req.body));
		} else {
			delete req.body.mpw;
			res.json(db.resultMsg('200'[0], req.body));
		}
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
router.get('/o', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.getOneRow(vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				if (rows.rows == "") {
					res.json(db.resultMsg('500'[2], rows.rows[0]));
				} else {
					// console.log(db.resultMsg('200'[0], rows.rows[0]));
					res.json(db.resultMsg('200'[0], rows.rows[0]));
				}
			});

		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Job ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}

});

/* GET Job listing. */
router.get('/', (req, res, next) => {
	let vdata = {};
	let vpage = req.query.page ? addslashes(req.query.page) : "";
	let vpageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	let vtcheck = req.query.chk_temp ? addslashes(req.query.chk_temp) : "";
	let vtname = req.query.tname ? addslashes(req.query.tname) : "";
	let viname = req.query.iname ? addslashes(req.query.iname) : "";
	let vstatus = req.query.status ? addslashes(req.query.status) : "";

	if (vpage == "" || vpage < 1) {
		vpage = 1;
	}
	if (vpageSize) {
		if (vpageSize == "" || vpageSize < 1) {
			vpageSize = 15;
		}
	}

	let vstart = (vpage - 1) * vpageSize;

	let stringQuery = sql.getList(vtname, viname, vstatus, vpageSize, vstart)


	let imsi = db.iquery(stringQuery, [], (err, rows) => {
		if (err) {
			return next(err);
		}
		totalCount(req).then((result) => {
			vdata['rowCount'] = rows.rowCount;
			vdata['totalCount'] = result;
			vdata['page'] = vpage;
			vdata['pageSize'] = vpageSize;
			vdata['list'] = rows.rows;

			if (vdata.list == "") {
				res.json(db.resultMsg('500'[2], rows.rows[0]));
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

function totalCount(req) {
	let vdata = {};
	let vtname = req.query.tname ? addslashes(req.query.tname) : "";
	let viname = req.query.iname ? addslashes(req.query.iname) : "";
	let vstatus = req.query.status ? addslashes(req.query.status) : "";

	let stringQuery = sql.totalCount(vtname, viname, vstatus)

	return new Promise((resolve, reject) => {
		db.query(stringQuery, [], (err, rows) => {
			if (err) {
				return reject(err);
			}
			// console.log("total func: " + rows.rows[0].total);
			resolve(rows.rows[0].total);
		});
	});
}

module.exports = router;