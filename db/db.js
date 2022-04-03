const {
	Pool
} = require('pg');
const conf = require('../config.js');
const statusMessage = require('../error/statusMessage.json');

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
				duration
			});
			
			callback(err, rows);
		})
	}

	resultMsg (code, data) {
		var result = {};	
		result['code'] = code;
		result['statusMsg'] = statusMessage[code];
		result['data'] = data;
		return result;
	}
}

let DB = new db();

module.exports = DB;