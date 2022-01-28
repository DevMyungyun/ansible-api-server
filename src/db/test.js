const pg = require('pg');
const conf = require('../config.js');

const config = {
	host: conf.db.dbserver,
	user: conf.db.dbuser,
	password: conf.db.dbpass,
	database: conf.db.database,
	port: conf.db.dbport
};



var test = () => {};

test.list = (res) => {
	var vdata = {};
	var client = new pg.Client(config);

	client.connect(err => {
		if (err) throw err;
	});

	var Query = 'SELECT NOW()';

	client.query(Query)
		.then(result => {
			console.log(result);
			var aaa = tcount();
			vdata['tcount'] = aaa;
			vdata['data'] = result.rows[0];
			res.json(vdata);
		})
		.catch(err => {
			console.log(err);
		});
};

tcount() => {
	return 100;
}


module.exports = test;