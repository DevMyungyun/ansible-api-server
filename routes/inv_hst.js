const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const sql = require('../db/sql/inv_hstSql.js')
const addslashes = require('../db/addslashes.js');

/* Post Ivt_hst multiple Inventory ID (Insert) */
router.post('/istMultiIid', (req, res, next) => {
	let viid = req.body.iid ? addslashes(req.body.iid) : "";
	let vhid = req.body.hid ? addslashes(req.body.hid) : "";

	if (viid) {
		viid = viid.split(',');
	}

	if (viid && vhid) {
		let stringQuery = sql.istMultiIid(viid, vhid)
		db.iquery(stringQuery, [], (err, rows) => {
			if (err) {
				//console.log('### Inventory-Host join table insert error : '+err);
				res.json(db.resultMsg('601', err));
			} else {
				if (rows.rowCount < 1) {
					console.log('840 : Insert into Inventory-Host join table err');
					res.json(db.resultMsg('840', req.body));
				} else {
					console.log('200 : Insert ino Inventory-Host join table success');
					res.json(db.resultMsg('200', req.body));
				}
			}
		});

	} else {
		console.log("Inventory-host ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}
});

/* Post Ivt_hst (Insert) */
router.post('/istMultiHid', (req, res, next) => {
	let viid = req.body.iid ? addslashes(req.body.iid) : "";
	let vhid = req.body.hid ? addslashes(req.body.hid) : "";

	if (vhid) {
		vhid = vhid.split(',');
	}

	if (viid && vhid) {
		let stringQuery = sql.istMultiHid(viid, vhid)
		db.iquery(stringQuery, [], (err, rows) => {
			if (err) {
				//console.log('### Inventory-Host join table insert error : '+err);
				res.json(db.resultMsg('601', err));
			} else {
				if (rows.rowCount < 1) {
					console.log('840 : Insert into Inventory-Host join table err');
					res.json(db.resultMsg('840', req.body));
				} else {
					console.log('200 : Insert ino Inventory-Host join table success');
					res.json(db.resultMsg('200', req.body));
				}
			}
		});

	} else {
		console.log("Inventory-host ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}
});

/* PUT Ivt_hst (Update) */
router.put('/:seq', (req, res, next) => {
	res.json(db.resultMsg('900', req.body));
});


/* DELETE Ivt_hst (delete) */
router.delete('/', (req, res, next) => {
	let vhid = req.query.hid ? addslashes(req.query.hid) : "";
	let viid = req.query.iid ? addslashes(req.query.iid) : "";

	if (vhid) {
		if (typeof vhid == 'string') {
			let stringQuery = sql.deleteHid(vhid)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}

				if (rows.rowCount < 1) {
					res.json(db.resultMsg('840', req.body));
				} else {
					res.json(db.resultMsg('200', req.body));
				}
			});

		} else {
			console.log("Type error! Please input String type ID!!");
			res.json(db.resultMsg('820', req.body));
		}
	} else if (viid) {
		if (typeof viid == 'string') {
			let stringQuery = sql.deleteIid(viid)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}

				if (rows.rowCount < 1) {
					res.json(db.resultMsg('840', req.body));
				} else {
					res.json(db.resultMsg('200', req.body));
				}
			});

		} else {
			console.log("Type error! Please input String type ID!!");
			res.json(db.resultMsg('820', req.body));
		}
	} else {
		console.log("Inventory-Host ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}

});


/* GET Ivt_hst (SELECT ONE) */
router.get('/o', (req, res, next) => {
	let vseq = req.params.seq ? addslashes(req.params.seq) : "";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.getOneRow(vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				if (rows.rowCount < 1) {
					res.json(db.resultMsg('602', rows.rows));
				} else {
					// console.log(db.resultMsg('200', rows.rows));
					res.json(db.resultMsg('200', rows.rows));
				}
			});
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('820', req.body));
		}
	} else {
		console.log("Inventory-Host ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}

});

/* GET Ivt_hst listing. */
router.get('/', (req, res, next) => {
	let vdata = {};
	let vpage = req.query.page ? addslashes(req.query.page) : "";
	let vpageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	let viid = req.query.iid ? addslashes(req.query.iid) : "";

	if (vpage == "" || vpage < 1) {
		vpage = 1;
	}
	if (vpageSize == "" || vpageSize < 1) {
		vpageSize = 15;
	}
	let vstart = (vpage - 1) * vpageSize;

	let stringQuery = sql.getList(viid, vpageSize, vstart)
	let imsi = db.query(stringQuery, [], (err, rows) => {
		if (err) {
			return next(err);
		}

		totalCount(req).then((result) => {
			vdata['rowCount'] = rows.rowCount;
			vdata['totalCount'] = result;
			vdata['page'] = vpage;
			vdata['pageSize'] = vpageSize
			vdata['list'] = rows.rows;

			if (vdata.rowCount < 1) {
				res.json(db.resultMsg('602', rows.rows));
			} else {
				// console.log(db.resultMsg('200', vdata));
				res.json(db.resultMsg('200', vdata));
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
	let viid = req.query.iid ? addslashes(req.query.iid) : "";

	let stringQuery = sql.totalCount(viid)

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