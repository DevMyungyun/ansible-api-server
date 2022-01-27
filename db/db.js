const {
	Pool
} = require('pg');
const conf = require('../config.js');

const pool = new Pool({
	host: conf.dbserver,
	user: conf.dbuser,
	password: conf.dbpass,
	database: conf.database,
	port: conf.dbport,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

const errorMsg = {
	"200": {
		0: "success",
		1: "success create",
		2: "there is connected hosts",
		3: "process kill",
	},
	"403": {
		0: "check a input data",
		1: "duplicate key value",	
	},
	"500": {
		0: "fail create",
		1: "database Error",
		2: "data not found in database"
	},
	"900": "not supported"
};

class db {
	query(queryString, params, callback) {
		const start = Date.now();
		const curDate = Date(start);
		return pool.query(queryString, params, (err, rows) => {
			const duration = Date.now() - start;
			console.log('>>> ' + curDate + ' excuted query', {
				queryString,
				duration,
				rows: rows.rowCount
			});
			callback(err, rows);
		})
	}

	iquery (queryString, params, callback) {
		const start = Date.now();
		const curDate = Date(start);
		return pool.query(queryString, params, (err, rows) => {
			const duration = Date.now() - start;
			console.log('>>> ' + curDate + ' excuted query', {
				queryString,
				duration
			});
			callback(err, rows);
		});
	}

	resultMsg (vcode, vdata) {
		var vresult = {};
		vresult['code'] = vcode;
		vresult['statusMsg'] = errorMsg[vcode];
		vresult['data'] = vdata;
		return vresult;
	}
}

let DB = new db();

module.exports = DB;