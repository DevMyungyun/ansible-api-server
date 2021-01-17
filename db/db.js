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
	"200": "success",
	"201": "success create",
	"260": "fail create",
	"300": "Status Cancel",
	"301": "Status Complete",
	"601": "Database Error",
	"602": "Data not found in database",
	"701": "Do not have user",
	"702": "Password value is invalid",
	"820": "Check a input data",
	"840": "No data was applied.",
	"860": "duplicate key value",
	"870": "There is connected hosts",
	"880": "Process kill",
	"900": "Not supported"
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