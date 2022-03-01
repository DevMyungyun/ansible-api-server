const express = require('express');
const router = express.Router();
const fs = require('fs');

const db = require('../db/db.js');
const sql = require('../db/sql/hostSql.js');
const addslashes = require('../db/addslashes.js');

/* Post Hosts (Insert) */
router.post('/', (req, res, next) => {
	let vname = req.body.name ? addslashes(req.body.name) : "";
	let vdomain = req.body.domain ? addslashes(req.body.domain) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let vos = req.body.os ? addslashes(req.body.os) : "";
	let vip = req.body.ip ? addslashes(req.body.ip) : "";
	let vdatasource = req.body.datasource ? addslashes(req.body.datasource) : "";
	let vdatacenter = req.body.datacenter ? addslashes(req.body.datacenter) : "";
	let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "Y";
	let viid = req.body.iid ? addslashes(req.body.iid) : "";
	viid = viid.split(',');

	let stringQuery = sql.post(vname, vdomain, vcontent, vos, vip, vuse_yn, vdatasource, vdatacenter)

	db.iquery(stringQuery, [], (err, rows) => {
		if (err) {
			if (err.code === '23505') {
				res.json(db.resultMsg('403'[1], req.body));
			} else {
				return next(err);
			}
		} else {
			if (rows.rowCount < 1) {
				res.json(db.resultMsg('403'[1], req.body));
			} else {
				console.log('### Successfully insert datas');
				res.json(db.resultMsg('200'[0], req.body));

				// When you want to set Inventory at the same time..
				// getHidSeq().then( (result) => {
				//     //console.log('### NEXTVAL : '+result);
				//     let vhid = result;
				//     vhid = Number(vhid)-1;
				//     delInvHost(vhid).then( (delResult) => {
				//         console.log('### After delete : ' + delResult);
				//         if(viid.length > 0) {
				//             insertHostInv(viid, vhid).then( (istResult) => {
				//                 console.log('### After INSERT : '+istResult);
				//             });
				//         }
				//         res.json(db.resultMsg('200'[0], req.body));
				//     });
				// });
			}
		}
	});

});

/* PUT Hosts (Update) */
router.put('/', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";
	let vname = req.body.name ? addslashes(req.body.name) : "";
	let vdomain = req.body.domain ? addslashes(req.body.domain) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let vos = req.body.os ? addslashes(req.body.os) : "";
	let vip = req.body.ip ? addslashes(req.body.ip) : "";
	let vdatasource = req.body.datasource ? addslashes(req.body.datasource) : "";
	let vdatacenter = req.body.datacenter ? addslashes(req.body.datacenter) : "";
	let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "";
	let viid = req.body.iid ? addslashes(req.body.iid) : "";
	if (viid) {
		viid = viid.split(',');
	}

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.update(vname, vdomain, vcontent, vos, vip, vuse_yn, vdatasource, vdatacenter, vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					if (err.code === '23505') {
						res.json(db.resultMsg('403'[1], req.body));
					} else {
						return next(err);
					}
				} else {
					if (rows.rowCount < 1) {
						res.json(db.resultMsg('403'[1], req.body));
					} else {
						res.json(db.resultMsg('200'[0], req.body));
					}
				}
			});

		} else {
			// console.log(db.resultMsg('500'[2], req.body));
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		// console.log(db.resultMsg('500'[2], req.body));
		console.log("Host ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}
});

/* DELETE Hosts (delete) */
router.delete('/', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (typeof vseq == 'string') {
			let stringQuery = sql.delete(vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}

				if (rows.rowCount < 1) {
					res.json(db.resultMsg('403'[1], req.body));
				} else {
					res.json(db.resultMsg('200'[0], req.body));

					delInvHost(vseq).then((delResult) => {
						console.log('### Successfully delete Inventory-Host join row : ' + delResult);
					}).catch(err => {
						if (err) {
							console.log('### Delete Inventory-Host join table Error :' + err);
						}
					});
				}
			});
		} else {
			console.log("Type error! Please input String type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Host ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}
});

/* GET Hosts (SELECT ONE) */
router.get('/o', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.getOneRow(vseq)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				if (rows.rowCount < 1) {
					res.json(db.resultMsg('500'[2], rows.rows[0]));
				} else {
					// console.log(db.resultMsg('200'[0], rows.rows));
					res.json(db.resultMsg('200'[0], rows.rows[0]));
				}
			});
		} else {
			console.log("Type error! Please input Integer type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	} else {
		console.log("Host ID does not exist!!");
		res.json(db.resultMsg('403'[0], req.body));
	}
});

/* GET Hosts listing. */
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

	db.iquery(stringQuery, [], (err, rows) => {
		if (err) {
			return next(err);
		}

		totalCount(req).then((result) => {
			vdata['rowCount'] = rows.rowCount;
			vdata['totalCount'] = result;
			vdata['page'] = vpage;
			vdata['pageSize'] = vpageSize;
			vdata['list'] = rows.rows;

			if (vdata.rowCount < 1) {
				res.json(db.resultMsg('500'[2], rows.rows));
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


/* Get Modal Inventory Listing */
router.get('/connectedIvts', (req, res, next) => {
	let vdata = {};
	let vhid = req.query.hid ? addslashes(req.query.hid) : "";

	if (vhid) {
		if (isNaN(vhid) === false) {
			let stringQuery = sql.connectedIvts(vhid)

			db.iquery(stringQuery, [], (err, rows) => {
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
						// console.log(db.resultMsg('200'[0], vdata));
						res.json(db.resultMsg('200'[0], vdata));
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

/* Get Modal Inventory Listing */
router.get('/joinHid', (req, res, next) => {
	let vdata = {};
	let viid = req.query.iid ? addslashes(req.query.iid) : "";

	if (viid) {
		if (isNaN(viid) === false) {
			let stringQuery = sql.joinHid(viid)

			db.iquery(stringQuery, [], (err, rows) => {
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
						// console.log(db.resultMsg('200'[0], vdata));
						res.json(db.resultMsg('200'[0], vdata));
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

function getHidSeq() {

	return new Promise((resolve, reject) => {
		let stringQuery = sql.getHidSeq()
		db.iquery(stringQuery, [], (err, rows) => {
			if (err) {
				return reject(err);
			}
			if (rows.rowCount < 1) {
				console.log('500 [2]: Get hid Sequence err');
				// res.json(db.resultMsg('500'[2], rows.rows));
			} else {
				resolve(rows.rows[0].nextval);
				console.log('200 [0]: Get hid Sequence success');
				// res.json(db.resultMsg('200'[0], rows.rows));
			}
		});
	});
}

function insertHostInv(viid, vhid) {

	return new Promise((resolve, reject) => {
		if (viid || vhid) {
			if (isNaN(viid) === false || isNaN(vhid) === false) {
				let stringQuery = sql.insertHostInv(viid, vhid)
				db.iquery(stringQuery, [], (err, rows) => {
					if (err) {
						return reject(err);
						// res.json(db.resultMsg('403'[1], req.body));
					} else {
						if (rows.rowCount < 1) {
							console.log('403: Insert into Inventory-Host join table err');
							resolve(rows.rows[0]);
							// res.json(db.resultMsg('403'[1], req.body));
						} else {
							console.log('200: Insert ino Inventory-Host join table success');
							resolve(rows.rows[0]);
							// res.json(db.resultMsg('200'[0], req.body));
						}
					}
				});
			} else {
				console.log("Type error! Please input Integer type ID!!");
				res.json(db.resultMsg('403'[0], req.body));
			}
		} else {
			console.log("Inventory-host ID does not exist!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	});
}

function delInvHost(vhid) {
	return new Promise((resolve, reject) => {
		if (vhid) {
			let stringQuery = sql.delInvHost(vhid)

			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return reject(err);
				}
				resolve(rows);
			});


		} else {
			console.log("Inventory-Host ID does not exist!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	});
}

module.exports = router;