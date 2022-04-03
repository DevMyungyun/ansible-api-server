const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const addslashes = require('../db/addslashes.js');

const adhocBuilder = require('../dto/adhocBuilder')
const sql = require('../db/sql/adhocSql.js')

// Post adhoc template (Insert)
router.post('/', function (req, res) {
	const body = req.body;
	const dto = new adhocBuilder().setName(addslashes(body.name))
								.setContent(addslashes(body.content))
								.setIid(addslashes(body.iid))
								.setIname(addslashes(body.iname))
								.setCname(addslashes(body.cname))
								.setModule( addslashes(body.module))
								.setVerb(addslashes(body.verb))
								.setArg(body.argument ? addslashes(req.body.argument) : "")
								.setForks(body.forks ? addslashes(body.forks) : 1)
								.setLimits(body.limits ? addslashes(body.limits) : "")
								.setVariables(body.variables ? addslashes(body.variables) : "---")
								.setUse_yn(body.use_yn ? addslashes(body.use_yn) : "Y")
                                .build();

	db.query(sql.post(), [dto.name, dto.content, dto.iid
							, dto.iname, dto.cname, dto.module
							, dto.arg, dto.forks, dto.limits
							, dto.verb, dto.variables, dto.use_yn], 
							(err) => {
		if (err) {
			next(err);
		}

		return res.json(db.resultMsg('a001', req.body));
	});
});

/* PUT adhoc template (Update) */
router.put('/', function (req, res, next) {
	const seq = req.query.seq ? addslashes(req.query.seq) : "";
	const body = req.body;

	const dto = new adhocBuilder().setName(addslashes(body.name))
								.setContent(addslashes(body.content))
								.setIid(addslashes(body.iid))
								.setIname(addslashes(body.iname))
								.setCname(addslashes(body.cname))
								.setModule( addslashes(body.module))
								.setVerb(addslashes(body.verb))
								.setArg(body.argument ? addslashes(req.body.argument) : "")
								.setForks(body.forks ? addslashes(body.forks) : 1)
								.setLimits(body.limits ? addslashes(body.limits) : "")
								.setVariables(body.variables ? addslashes(body.variables) : "---")
								.setUse_yn(body.use_yn ? addslashes(body.use_yn) : "Y")
								.build();

	db.query(sql.update(), [dto.name, dto.content, dto.iid
							, dto.iname, dto.cname, dto.module
							, dto.arg, dto.forks, dto.limits
							, dto.verb, dto.variables, dto.use_yn, seq], (err, rows) => {
		if (err) {
			next(err);
		}
		return res.json(db.resultMsg('a001', req.body));
	});

});

/* DELETE adhoc template (delete) */
router.delete('/:seq', function (req, res, next) {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(sql.delete(), [seq], (err) => {
		if (err) {
			next(err);
		}
		return res.json(db.resultMsg('a001', req.body));
	});	
});

/* GET adhoc template (SELECT ONE) */
router.get('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";
	let code = "a001";
	
	db.query(sql.getOneRow(), [seq], (err, rows) => {
		if (err) next(err);
		if (rows.rowCount === 0 ) code = "a003"
		return res.json(db.resultMsg(code, rows.rows));
	});
});

/* GET adhoc template listing. */
router.get('/', function (req, res, next) {
	let code = "a001";
	let data = {};
	let page = req.query.page ? addslashes(req.query.page) : "";
	let pageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	const name = req.query.name ? addslashes(req.query.name) : "";

	if (page == "" || page < 1) {
		page = 1;
	}
	if (pageSize == "" || pageSize < 1) {
		pageSize = 15;
	}
	const start = (page - 1) * pageSize;

	db.query(sql.getList(name), [pageSize, start], (err, rows) => {
		if (err) next(err);
		if (rows.rowCount === 0) code ="a003"

		totalCount(name).then(function (result) {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = page;
			data['pageSize'] = pageSize;
			data['list'] = rows.rows;

			res.json(db.resultMsg(code, data));
		}).catch(function (err) {
			if (err) {
				console.error(err);
				next(err);
			}
		});
	});
});


function totalCount(name) {

	return new Promise(function (resolve, reject) {
		db.query(sql.totalCount(name), [], (err, rows) => {
			if (err) {
				return reject(err);
			}
			resolve(rows.rows[0].total);

		});
	});
}

module.exports = router;