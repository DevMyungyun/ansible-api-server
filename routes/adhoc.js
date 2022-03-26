const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const addslashes = require('../db/addslashes.js');

const adhocBuilder = require('../dto/adhocBuilder')
const sql = require('../db/sql/adhocSql.js')

// Post adhoc template (Insert)
router.post('/', function (req, res) {
	const body = req.body;
	const dto = new adhocBuilder().setVname(addslashes(body.name))
                                .setVcontent(addslashes(body.content))
								.setViid(addslashes(body.iid))
								.setViname(addslashes(body.iname))
								.setVcname(addslashes(body.cname))
								.setVmodule( addslashes(body.module))
								.setVverb(addslashes(body.verb))
								.setVarg(body.argument ? addslashes(req.body.argument) : "")
								.setVforks(body.forks ? addslashes(body.forks) : 1)
								.setVlimits(body.limits ? addslashes(body.limits) : "")
								.setVvariables(body.variables ? addslashes(body.variables) : "---")
								.setVuse_yn(body.use_yn ? addslashes(body.use_yn) : "Y")
                                .build();

	db.iquery(sql.post(), [dto.vname, dto.vcontent, dto.viid
							, dto.viname, dto.vcname, dto.vmodule
							, dto.varg, dto.vforks, dto.vlimits
							, dto.vverb, dto.vvariables, dto.vuse_yn], 
							(err) => {
		if (err) {
			console.error("@@@@",err);
			return res.status(500).json(db.resultMsg('500'[1], err))
		}

		return res.json(db.resultMsg('200'[1], req.body));
	});
});

/* PUT adhoc template (Update) */
router.put('/', function (req, res, next) {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";
	let vname = req.body.name ? addslashes(req.body.name) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let viid = req.body.iid ? addslashes(req.body.iid) : "";
	let viname = req.body.iname ? addslashes(req.body.iname) : "";
	let vcname = req.body.cname ? addslashes(req.body.cname) : "";
	let vmodule = req.body.module ? addslashes(req.body.module) : "";
	let varg = req.body.argument ? addslashes(req.body.argument) : "";
	let vforks = req.body.forks ? addslashes(req.body.forks) : "";
	let vlimits = req.body.limits ? addslashes(req.body.limits) : "";
	let vverb = req.body.verb ? addslashes(req.body.verb) : "";
	let vvariables = req.body.variables ? addslashes(req.body.variables) : "---";
	let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "Y";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.update(vname, vcontent, viid, viname, vcname, vmodule, varg, vforks, vlimits, vverb, vvariables, vuse_yn, vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}

				if (rows.rowCount < 1) {
					res.json(db.resultMsg('403'[1], req.body));
				} else {
					res.json(db.resultMsg('200', req.body));
				}
			});
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Job template ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}

});

/* DELETE adhoc template (delete) */
router.delete('/', function (req, res, next) {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (typeof vseq === 'string') {
			let stringQuery = sql.delete(vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}

				if (rows.rowCount < 1) {
					res.json(db.resultMsg('403'[1], req.body));
				} else {
					res.json(db.resultMsg('200', req.body));
				}
			});

		} else {
			console.log("Type error! Please input String type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("ADHOC ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}

});

/* GET adhoc template (SELECT ONE) */
router.get('/o', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.getOneRow(vseq)

			db.query(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				if (rows.rowCount < 1) {
					res.json(db.resultMsg('500'[2], rows.rows[0]));
				} else {
					res.json(db.resultMsg('200', rows.rows[0]));
				}
			});
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Job template ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}

});

/* GET adhoc template listing. */
router.get('/', function (req, res, next) {
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

		totalCount(req).then(function (result) {
			vdata['rowCount'] = rows.rowCount;
			vdata['totalCount'] = result;
			vdata['page'] = vpage;
			vdata['pageSize'] = vpageSize;
			vdata['list'] = rows.rows;

			if (vdata.rowCount < 1) {
				res.json(db.resultMsg('500'[2], rows.rows));
			} else {
				// console.log(db.resultMsg('200', vdata));
				res.json(db.resultMsg('200', vdata));
			}
		}).catch(function (err) {
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

	return new Promise(function (resolve, reject) {
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