const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const inventoryBuilder = require('../dto/inventoryBuilder')
const sql = require('../db/sql/inventorySql.js')

const addslashes = require('../db/addslashes.js');

/* POST Inventory (Insert) */
router.post('/', (req, res, next) => {
	const dto = new inventoryBuilder().setName(addslashes(req.body.name))
								.setContent(addslashes(req.body.content))
								.setUse_yn(req.body.use_yn ? addslashes(req.body.use_yn) : "Y")
								.build();

	db.query(sql.post(), [dto.name, dto.content, dto.use_yn], (err) => {
		if (err) return next(err);
		
		res.json(db.resultMsg('a001', req.body));
	});
});

/* PUT Inventory (Update) */
router.put('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	const dto = new inventoryBuilder().setName(addslashes(req.body.name))
								.setContent(addslashes(req.body.content))
								.setUse_yn(req.body.use_yn ? addslashes(req.body.use_yn) : "Y")
								.build();

	db.query(sql.update, [dto.name, dto.content, dto.use_yn, seq], (err, rows) => {
		if (err) return next(err);
		
		res.json(db.resultMsg('a001', req.body));
	});
});

/* DELETE Inventory (delete) */
router.delete('/', (req, res, next) => {
	let seq = req.query.seq ? addslashes(req.query.seq) : "";

	db.query(sql.delete, [seq], (err) => {
		if (err) return next(err);
		
		res.json(db.resultMsg('a001', seq));
	});
});

/* GET Inventory (SELECT ONE) */
router.get('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.getOneRow(), [seq], (err, rows) => {
		if (err) return next(err);
		res.json(db.resultMsg('a001', rows.rows[0]))
	});

});

router.get('/detailCHstList', (req, res, next) => {
	let vdata = {};
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.detailCHstList(vseq)

			db.query(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				totalCount(req).then((result) => {
					vdata['rowCount'] = rows.rowCount;
					vdata['totalCount'] = result;
					// vdata['page'] = vpage;
					// vdata['pageSize'] = vpageSize
					vdata['list'] = rows.rows;

					if (vdata.rowCount < 1) {
						res.json(db.resultMsg('500'[2], rows.rows[0]));
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
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Inventory ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}

});

/* GET Inventory listing. */
router.get('/', (req, res, next) => {
	let data = {};
	const page = req.query.page ? addslashes(req.query.page) : "";
	const pageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	const name = req.query.name ? addslashes(req.query.name) : "";

	// for open search-inventory.html value
	let vsearchInv = req.query.searchInv ? addslashes(req.query.searchInv) : "";

	if (page == "" || page < 1) {
		page = 1;
	}
	if (pageSize == "" || pageSize < 1) {
		pageSize = 15;
	}
	let start = (page - 1) * pageSize;

	db.query(sql.getList(name), [pageSize, page], (err, rows) => {
		if (err) return next(err);

		totalCount(req).then((result) => {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = page;
			data['pageSize'] = pageSize
			data['list'] = rows.rows;

			res.json(db.resultMsg('200', data));
		}).catch((err) => {
			if (err) console.error(err);
		});
	});
});

/* Get Modal Inventory Listing */
router.get('/joinIid', (req, res, next) => {
	let vdata = {};
	let vhid = req.query.hid ? addslashes(req.query.hid) : "";

	if (vhid) {
		if (isNaN(vhid) === false) {
			let stringQuery = sql.joinIid(vhid)

			db.query(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				totalCount(req).then((result) => {
					vdata['rowCount'] = rows.rowCount;
					vdata['totalCount'] = result;
					// vdata['page'] = vpage;
					// vdata['pageSize'] = vpageSize
					vdata['list'] = rows.rows;

					if (vdata.rowCount < 1) {
						res.json(db.resultMsg('500'[2], rows.rows[0]));
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
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Inventory ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}
});



/* Get Modal connected Hosts Listing */
router.get('/connectedHosts', (req, res, next) => {
	let vdata = {};
	let viid = req.query.iid ? addslashes(req.query.iid) : "";

	if (viid) {
		if (isNaN(viid) === false) {
			let stringQuery = sql.connectedHosts(viid)

			let imsi = db.query(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				totalCount(req).then((result) => {
					vdata['rowCount'] = rows.rowCount;
					vdata['totalCount'] = result;
					vdata['list'] = rows.rows;

					if (vdata.rowCount < 1) {
						res.json(db.resultMsg('500'[2], rows.rows[0]));
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
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Inventory ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}
});

function totalCount(req) {
	let vdata = {};
	let vname = req.query.name ? addslashes(req.query.name) : "";

	let stringQuery = sql.totalCount(vname)

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