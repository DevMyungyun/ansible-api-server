const pg = require('pg');
const conf = require('../config.js');

const config = {
	host: conf.dbserver,
	user: conf.dbuser,
	password: conf.dbpass,
	database: conf.database,
	port: conf.dbport
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
			console.log('>>>>>',result);
			var aaa = tcount();
			vdata['tcount'] = aaa;
			vdata['data'] = result.rows[0];
			res.json(vdata);
		})
		.catch(err => {
			console.log(err);
		});
};

function tcount() {
	return 100;
};


module.exports = test;