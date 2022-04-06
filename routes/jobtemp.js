const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const jobTempBuilder = require('../dto/jobTempBuilder');
const sql = require('../db/sql/jobtempSql.js');
const addslashes = require('../db/addslashes.js');


// Post Jobtemp (Insert)
router.post('/', (req, res, next) => {
	// let vname = req.body.name ? addslashes(req.body.name) : "";
	// let vcontent = req.body.content ? addslashes(req.body.content) : "";
	// let viid = req.body.iid ? addslashes(req.body.iid) : "";
	// let viname = req.body.iname ? addslashes(req.body.iname) : "";
	// let vcname = req.body.cname ? addslashes(req.body.cname) : "";
	// let vplaybook = req.body.playbook ? addslashes(req.body.playbook) : "";
	// let vforks = req.body.forks ? addslashes(req.body.forks) : "";
	// let vlimits = req.body.limits ? addslashes(req.body.limits) : "";
	// let vverb = req.body.verb ? addslashes(req.body.verb) : "";
	// let vvariables = req.body.variables ? addslashes(req.body.variables) : "---";
	// let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "Y";

	const dto = new jobTempBuilder().setName(addslashes(body.name))
									.setContent(addslashes(body.content))
									.setIid(addslashes(body.iid))
									.setIname(addslashes(body.iname))
									.setCname(addslashes(body.cname))
									.setModule( addslashes(body.module))
									.setVerb(addslashes(body.verb))
									.setForks(body.forks ? addslashes(body.forks) : 1)
									.setLimits(body.limits ? addslashes(body.limits) : "")
									.setVariables(body.variables ? addslashes(body.variables) : "---")
									.setUse_yn(body.use_yn ? addslashes(body.use_yn) : "Y")
									.build();

	db.query(sql.post(), [dto.name, dto.content, dto.iid
						, dto.iname, dto.cname, dto.module
						, dto.forks, dto.limits	, dto.verb
						, dto.variables, dto.use_yn], (err, rows) => {
		if (err) return next(err);
		res.json(db.resultMsg('a001', req.body));
	});
});

/* PUT Jobtemp (Update) */
router.put('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";
	// let vname = req.body.name ? addslashes(req.body.name) : "";
	// let vcontent = req.body.content ? addslashes(req.body.content) : "";
	// let viid = req.body.iid ? addslashes(req.body.iid) : "";
	// let viname = req.body.iname ? addslashes(req.body.iname) : "";
	// let vcname = req.body.cname ? addslashes(req.body.cname) : "";
	// let vplaybook = req.body.playbook ? addslashes(req.body.playbook) : "";
	// let vforks = req.body.forks ? addslashes(req.body.forks) : "";
	// let vlimits = req.body.limits ? addslashes(req.body.limits) : "";
	// let vverb = req.body.verb ? addslashes(req.body.verb) : "";
	// let vvariables = req.body.variables ? addslashes(req.body.variables) : "---";
	// let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "Y";

	
	const dto = new jobTempBuilder().setName(addslashes(body.name))
									.setContent(addslashes(body.content))
									.setIid(addslashes(body.iid))
									.setIname(addslashes(body.iname))
									.setCname(addslashes(body.cname))
									.setModule( addslashes(body.module))
									.setVerb(addslashes(body.verb))
									.setForks(body.forks ? addslashes(body.forks) : 1)
									.setLimits(body.limits ? addslashes(body.limits) : "")
									.setVariables(body.variables ? addslashes(body.variables) : "---")
									.setUse_yn(body.use_yn ? addslashes(body.use_yn) : "Y")
									.build();

	db.query(sql.update, [dto.name, dto.content, dto.iid
		, dto.iname, dto.cname, dto.module
		, dto.forks, dto.limits	, dto.verb
		, dto.variables, dto.use_yn, seq], (err, rows) => {
		if (err) {
			return next(err);
		}
		res.json(db.resultMsg('a001', req.body));
			});
});

/* DELETE Jobtemp (delete) */
router.delete('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.delete(), [seq], (err, rows) => {
		if (err) return next(err);
			res.json(db.resultMsg('a001', req.body));
	});
});

/* GET Jobtemps (SELECT ONE) */
router.get('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.getOneRow, [seq], (err, rows) => {
		if (err) {
			return next(err);
		}
			res.json(db.resultMsg('a001', rows.rows[0]));
	});
});

/* GET Jobtemps listing. */
router.get('/', (req, res, next) => {
	let data = {};
	let page = req.query.page ? addslashes(req.query.page) : "";
	let pageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	let name = req.query.name ? addslashes(req.query.name) : "";

	if (page == "" || page < 1) {
		page = 1;
	}
	if (pageSize == "" || pageSize < 1) {
		pageSize = 15;
	}
	let start = (page - 1) * pageSize;

	let imsi = db.query(sql.getList(name), [pageSize, start], (err, rows) => {
		if (err) return next(err);

		totalCount(req).then((result) => {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = page;
			data['pageSize'] = pageSize;
			data['list'] = rows.rows;

			res.json(db.resultMsg('a001', data));
		}).catch((err) => {
			if (err) {
				console.error(err);
			}
		});
	});
});

function totalCount(req) {
	let vname = req.query.name ? addslashes(req.query.name) : "";
	let stringQuery = sql.totalCount(vname)

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