const express = require('express');
const router = express.Router();

const db = require('../db/db.js');
const hostBuilder = require('../dto/hostBuilder');
const hostSql = require('../db/sql/hostSql.js');
const invHostSql = require('../db/sql/invHostSql.js');
const addslashes = require('../db/addslashes.js');

/* Post Hosts (Insert) */
router.post('/', (req, res, next) => {
	const dto = new hostBuilder().setName(addslashes(req.body.name))
								.setContent(addslashes(req.body.content))
								.setDomain(addslashes(req.body.domain))
								.setOs(addslashes(req.body.os))
								.setIp(addslashes(req.body.ip))
								.setDatasource(addslashes(req.body.datasource))
								.setDatacenter(addslashes(req.body.datacenter))
								.setUse_yn(req.body.use_yn ? addslashes(req.body.use_yn) : "Y")
								.build();

	db.query(hostSql.post(), [dto.name, dto.content, dto.domain,
						dto.os, dto.ip, dto.use_yn,
						dto.datasource, dto.datacenter], (err) => {
		if (err) return next(err);
			
		return res.json(db.resultMsg('a001', req.body));

	});

});

/* PUT Hosts (Update) */
router.put('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";
	
	const dto = new hostBuilder().setName(addslashes(req.body.name))
								.setContent(addslashes(req.body.content))
								.setDomain(addslashes(req.body.domain))
								.setOs(addslashes(req.body.os))
								.setIp(addslashes(req.body.ip))
								.setDatasource(addslashes(req.body.datasource))
								.setDatacenter(addslashes(req.body.datacenter))
								.setUse_yn(req.body.use_yn ? addslashes(req.body.use_yn) : "Y")
								.build();

	db.query(hostSql.update(), [dto.name, dto.content, dto.domain,
							dto.os, dto.ip, dto.use_yn,
							dto.datasource, dto.datacenter, seq], (err) => {
		if(err) return next(err);
		return res.json(db.resultMsg('a001', req.body));
	});
});

/* DELETE Hosts (delete) */
router.delete('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(hostSql.delete(), [seq], (hErr) => {
		if (hErr) return next(hErr);

		db.query(invHostSql.deleteHid(), [[seq]], (ihErr) => {
			if(ihErr) return next(ihErr);
			res.json(db.resultMsg('a001', seq));
		});
	});
});

/* GET Hosts (SELECT ONE) */
router.get('/:seq', (req, res, next) => {
	let seq = req.params.seq ? addslashes(req.params.seq) : "";

	db.query(hostSql.getOneRow(), [seq], (err, rows) => {
		if (err) return next(err);

		res.json(db.resultMsg('a001', rows.rows));
	});
});

/* GET Hosts listing. */
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
	const start = (page - 1) * pageSize;

	db.query(hostSql.getList(name), [pageSize, start], (err, rows) => {
		if (err) return next(err);

		totalCount(name).then((result) => {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = page;
			data['pageSize'] = pageSize;
			data['list'] = rows.rows;

			res.json(db.resultMsg('a001', data));
		}).catch((err) => {
			if (err) console.error(err);
		});
	});
});


/* Get Modal Inventory Listing */
router.get('/joinedIventory', (req, res, next) => {
	let data = {};
	let page = req.query.page ? addslashes(req.query.page) : "";
	let pageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	let hid = req.query.hid ? addslashes(req.query.hid) : "";

	if (page == "" || page < 1) {
		page = 1;
	}
	if (pageSize == "" || pageSize < 1) {
		pageSize = 15;
	}
	const start = (page - 1) * pageSize;

	db.query(hostSql.joinedIventory(), [hid, pageSize, start], (err, rows) => {
		if (err) return next(err);
		
		totalCount(req).then((result) => {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = vpage;
			data['pageSize'] = vpageSize
			data['list'] = rows.rows;

			res.json(db.resultMsg('a001', data));

		}).catch((err) => {
			if (err) console.error(err);
		});
	});
});

/* Get Modal Inventory Listing */
router.get('/joinedHid', (req, res, next) => {
	let data = {};
	let iid = req.query.iid ? addslashes(req.query.iid) : "";

	if (page == "" || page < 1) {
		page = 1;
	}
	if (pageSize == "" || pageSize < 1) {
		pageSize = 15;
	}
	const start = (page - 1) * pageSize;

	db.query(hostSql.joinHid, [iid, pageSize, start], (err, rows) => {
		if (err) return next(err);

		totalCount(req).then((result) => {
			data['rowCount'] = rows.rowCount;
			data['totalCount'] = result;
			data['page'] = vpage;
			data['pageSize'] = vpageSize
			data['list'] = rows.rows;

			res.json(db.resultMsg('a001', data));
			
		}).catch((err) => {
			if (err) console.error(err);
		});
	});
});

function totalCount(name) {
	let vdata = {};

	return new Promise((resolve, reject) => {
		db.query(hostSql.totalCount(name), [], (err, rows) => {
			if (err) return reject(err);
			resolve(rows.rows[0].total);

		});
	});
}

function getHidSeq() {

	return new Promise((resolve, reject) => {
		db.query(hostSql.getHidSeq(), [], (err, rows) => {
			if (err) return reject(err);
			
			resolve(rows.rows[0].nextval);	
		});
	});
}

function delJoinedHost(hid) {
	return new Promise((resolve, reject) => {
		db.query(invHostSql.deleteIid(), [iid], (err, rows) => {
			if (err) return reject(err);

			resolve(rows);
		});
	});
}

module.exports = router;