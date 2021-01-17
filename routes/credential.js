const express = require('express');
const router = express.Router();
const rsa = require('node-rsa');

const db = require('../db/db.js');
const sql = require('../db/sql/credentialSql.js')
const addslashes = require('../db/addslashes.js');
const conf = require('../config.js');

const key = new rsa(conf.rsa);

// Post credential (Insert)
router.post('/', (req, res, next) => {
	let vname = req.body.name ? addslashes(req.body.name) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let vmid = req.body.mid ? addslashes(req.body.mid) : "";
	let vmpw = req.body.mpw ? addslashes(req.body.mpw) : "";
	let vtype = req.body.type ? addslashes(req.body.type) : "";
	let vpk = req.body.private_key ? addslashes(req.body.private_key) : "";
	let encryptedPw = '';
	let encryptePK = '';

	if (vmpw) {
		encryptedPw = key.encrypt(vmpw, 'base64');
	}

	if (vpk) {
		encryptePK = key.encrypt(vpk, 'base64');
	}

	let stringQuery = sql.post(vname, vcontent, vmid, encryptedPw, encryptePK, vtype)

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
});

/* PUT credential (Update) */
router.put('/', (req, res, next) => {
	let vname = req.query.name ? addslashes(req.query.name) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let vmid = req.body.mid ? addslashes(req.body.mid) : "";
	let vmpw = req.body.mpw ? addslashes(req.body.mpw) : "";
	let vpk = req.body.private_key ? addslashes(req.body.private_key) : "";
	let encryptedPw = '';
	let encryptePK = '';

	if (vmpw) {
		encryptedPw = key.encrypt(vmpw, 'base64');
	}

	if (vpk) {
		encryptePK = key.encrypt(vpk, 'base64');
	}

	if (vname) {
		if (typeof vname == 'string') {
			let stringQuery = sql.update(vcontent, vmid, encryptedPw, encryptePK, vname)

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
		console.log("Credential ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}

});

/* DELETE credential (delete) */
router.delete('/', (req, res, next) => {
	let vname = req.query.name ? addslashes(req.query.name) : "";
	let nameArray = vname.split(',');
	let nameString = '';
	nameString += '\'' + nameArray[0] + '\''

	for (var i = 1; i < nameArray.length; i++) {
		nameString += ', \'' + nameArray[i] + '\''
	}

	if (nameString) {
		if (typeof nameString === 'string') {
			let stringQuery = sql.delete(nameString)

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
		console.log("Credential ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}

});

/* GET Credential (SELECT ONE) */
router.get('/o', (req, res, next) => {
	let vname = req.query.name ? addslashes(req.query.name) : "";

	if (vname) {
		if (typeof vname === 'string') {
			let stringQuery = sql.getOneRow(vname)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				if (rows.rowCount < 1) {
					res.json(db.resultMsg('602', rows.rows[0]));
				} else {
					res.json(db.resultMsg('200', rows.rows[0]));
				}
			});
		} else {
			console.log("Type error! Please input String type ID!!");
			res.json(db.resultMsg('820', req.body));
		}
	} else {
		console.log("Credential ID does not exist!!");
		res.json(db.resultMsg('820', req.body));
	}

});

/* GET Credential listing. */
router.get('/', (req, res, next) => {
	let vdata = {};
	let vpage = req.query.page ? addslashes(req.query.page) : "";
	let vpageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	let vname = req.query.name ? addslashes(req.query.name) : "";

	if (vpage == "" || vpage < 1) {
		vpage = 1;
	}
	if (vpageSize == "" || vpageSize < 1) {
		vpageSize = 15;
	}
	let vstart = (vpage - 1) * vpageSize;

	let stringQuery = sql.getList(vname)

	let imsi = db.iquery(stringQuery, [], (err, rows) => {
		if (err) {
			return next(err);
		}

		totalCount(req).then((result) => {
			vdata['rowCount'] = rows.rowCount;
			vdata['totalCount'] = result;
			// vdata['page'] = vpage;
			// vdata['pageSize'] = vpageSize;
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