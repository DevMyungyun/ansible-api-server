const {
	Pool
} = require('pg');
const conf = require('../config.js');
const errorMsg = require('../error/errorMessage.json');

const pool = new Pool({
	host: conf.dbserver,
	user: conf.dbuser,
	password: conf.dbpass,
	database: conf.database,
	port: conf.dbport,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 3000,
});
class db {
	query(queryString, params, callback) {
		const start = Date.now();
		const curDate = Date(start);
		return pool.query(queryString, params, (err, rows) => {
			const duration = Date.now() - start;
			console.log('[' + curDate + '] : ', {
				queryString,
				duration,
				rows: rows
			});
			callback(err, rows);
		})
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