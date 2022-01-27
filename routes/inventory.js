const express = require('express');
const router = express.Router();
const db = require('../db/db.js');
const sql = require('../db/sql/inventorySql.js')
const addslashes = require('../db/addslashes.js');

/* POST Inventory (Insert) */
router.post('/', (req, res, next) => {
	let vname = req.body.name ? addslashes(req.body.name) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "Y";
	let vhid = req.body.hid ? addslashes(req.body.hid) : "";
	vhid = vhid.split(',');

	let stringQuery = sql.post(vname, vcontent, vuse_yn)

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
				console.log('200: successfully insert datas');
				// res.json(db.resultMsg('200', req.body));

				getIidSeq().then((result) => {
					//console.log('### NEXTVAL : '+result);
					let viid = result;
					viid = Number(viid) - 1;
					if (vhid.length > 0) {
						insertInvHst(viid, vhid, req, res).then((istResult) => {
							console.log('### After INSERT : ' + istResult);
						});
						res.json(db.resultMsg('200', req.body));
						console.log('### successfully insert with connected hosts ');
					} else if (vhid.length <= 0) {
						res.json(db.resultMsg('200', req.body));
						console.log('### successfully insert without any host ');
					} else {
						res.json(db.resultMsg('200', req.body));
						console.log('### unexpected insert error ');
					}

				});
			}
		}
	});
});

/* PUT Inventory (Update) */
router.put('/', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";
	let vname = req.body.name ? addslashes(req.body.name) : "";
	let vcontent = req.body.content ? addslashes(req.body.content) : "";
	let vuse_yn = req.body.use_yn ? addslashes(req.body.use_yn) : "";
	let vhid = req.body.hid ? addslashes(req.body.hid) : "";
	vhid = vhid.split(',');
	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.update(vname, vcontent, vuse_yn, vseq)

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
						res.json(db.resultMsg('200', req.body));

						// delInvHst(vseq).then(function(delResult) {
						//     if(vhid.length > 0) {
						//         insertInvHst(vseq, vhid, req, res).then(function(istResult){
						//             console.log('### After INSERT : '+istResult);
						//         });
						//     }
						//     res.json(db.resultMsg('200', req.body));
						// });

					}
				}
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

/* DELETE Inventory (delete) */
router.delete('/', (req, res, next) => {
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	let viid = vseq.split(',');
	let chkIid = [];

	deleteIvt(req, res, viid, chkIid).then((result) => {
		if (result != null) {
			// console.log(result);
			// console.log(typeof result);
			chkValidDelete(req, res, result);
		}
	});
});

function deleteIvt(req, res, viid, chkIid) {
	return new Promise((resolve, reject) => {
		if (typeof viid == 'object') {
			let stringQuery = sql.delete(viid)
			db.iquery(stringQuery, [], (err, rows) => {
				if (err) {
					return next(err);
				}
				if (rows.rowCount < 1) {
					res.json(db.resultMsg('403'[1], req.body));
				} else {
					console.log('>>> Success to delete inventory');
				}
				resolve(chkIid);
			});
		} else {
			console.log("Type error! Please input Array type ID!!");
			res.json(db.resultMsg('403'[0], req.body));
		}

		// Can't delete inventory when there is connected
		// viid.forEach( (item) => {
		// chkConnectedHost(item).then( (result) => {
		//     let hostCount = result.rows[0].total_hosts;
		//     if(hostCount == 0) {
		//         if (item) {
		//     		if (typeof item === 'string') {
		//                 let stringQuery = sql.delete(item)
		//     			db.iquery(stringQuery, [], (err, rows) => {
		//     				if (err) {
		//     					return next(err);
		//     				}
		//     				if (rows.rowCount < 1) {
		//     					res.json(db.resultMsg('403'[1], req.body));
		//     				} else {
		//     					console.log('>>> Success to delete inventory');
		//     				}
		//                     resolve(chkIid);
		//     			});
		//     		} else {
		//     			console.log("Type error! Please input Number type ID!!");
		//     			res.json(db.resultMsg('403'[0], req.body));
		//     		}
		//     	} else {
		//     		console.log("Inventory ID does not exist!!");
		//     		res.json(db.resultMsg('403'[0], req.body));
		//     	}
		//     } else if(hostCount > 0) {
		//         chkIid.push(item);
		//         resolve(chkIid);
		//     }
		// });
		// });

	});
}

function chkValidDelete(req, res, chkIid) {

	return new Promise((resolve, reject) => {
		if (chkIid.length > 0) {
			res.json(db.resultMsg('200'[2], req.body));
		} else {
			res.json(db.resultMsg('200', req.body));
		}
	});
}

/* GET Inventory (SELECT ONE) */
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
					res.json(db.resultMsg('500'[2], rows.rows[0]))
				} else {
					// console.log(db.resultMsg('200', rows.rows[0]));
					res.json(db.resultMsg('200', rows.rows[0]))
				}
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

router.get('/detailCHstList', (req, res, next) => {
	let vdata = {};
	let vseq = req.query.seq ? addslashes(req.query.seq) : "";

	if (vseq) {
		if (isNaN(vseq) === false) {
			let stringQuery = sql.detailCHstList(vseq)

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
	let vdata = {};
	let vpage = req.query.page ? addslashes(req.query.page) : "";
	let vpageSize = req.query.pageSize ? addslashes(req.query.pageSize) : "";
	let vname = req.query.name ? addslashes(req.query.name) : "";

	// for open search-inventory.html value
	let vsearchInv = req.query.searchInv ? addslashes(req.query.searchInv) : "";

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
			vdata['pageSize'] = vpageSize
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
});

/* Get Modal Inventory Listing */
router.get('/joinIid', (req, res, next) => {
	let vdata = {};
	let vhid = req.query.hid ? addslashes(req.query.hid) : "";

	if (vhid) {
		if (isNaN(vhid) === false) {
			let stringQuery = sql.joinIid(vhid)

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

			let imsi = db.iquery(stringQuery, [], (err, rows) => {
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

function chkConnectedHost(viid) {
	let stringQuery = sql.chkConnectedHost(viid)

	return new Promise((resolve, reject) => {
		db.iquery(stringQuery, [], (err, rows) => {
			if (err) {
				return reject(err);
			}
			resolve(rows);
		});
	});
}

function getIidSeq() {

	return new Promise((resolve, reject) => {
		let stringQuery = sql.getIidSeq()
		db.iquery(stringQuery, [], (err, rows) => {
			if (err) {
				return reject(err);
			}
			if (rows.rowCount < 1) {
				console.log('500 [2]: Get iid Sequence err');
				// res.json(db.resultMsg('500'[2], rows.rows));
			} else {
				resolve(rows.rows[0].nextval);
				console.log('200 : Get iid Sequence success');
				// res.json(db.resultMsg('200', rows.rows));
			}
		});
	});
}

function insertInvHst(viid, vhid, req, res) {

	return new Promise((resolve, reject) => {
		if (viid && vhid) {
			// console.log(typeof viid);
			// console.log(typeof vhid);
			if (isNaN(viid) === false && typeof vhid == 'object') {
				let stringQuery = sql.insertInvHst(viid, vhid)

				db.iquery(stringQuery, [], (err, rows) => {
					if (err) {
						// console.log(err);
						return reject(err);
						// res.json(db.resultMsg('403'[1], req.body));
					} else {
						if (rows.rowCount < 1) {
							console.log('403 [1]: Insert into Inventory-Host join table err');
							resolve(rows.rows[0]);
							// res.json(db.resultMsg('403'[1], req.body));
						} else {
							console.log('200 : Insert ino Inventory-Host join table success');
							resolve(rows.rows[0]);
							// res.json(db.resultMsg('200', req.body));
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

function delInvHst(viid) {

	return new Promise((resolve, reject) => {
		if (viid) {
			if (isNaN(viid) === false) {
				let stringQuery = sql.delInvHst(viid)
				// if( viid && isNaN(viid) === false ) {
				//     stringQuery += " AND iid = " + viid + " ";
				// }

				db.iquery(stringQuery, [], (err, rows) => {
					if (err) {
						return reject(err);
					}
					resolve(rows);
				});

			} else {
				console.log("Type error! Please input Integer type ID!!");
				res.json(db.resultMsg('403'[0], req.body));
			}
		} else {
			console.log("Inventory-Host ID does not exist!!");
			res.json(db.resultMsg('403'[0], req.body));
		}
	});
}

module.exports = router;