const db = require('../db/db.js');
const sql = require('../db/sql/adhocSql.js');

describe('DB Connect Test', function() {
    it('Query', function (done) {
        
		db.query(sql.getOneRow, [1], (err, rows) => {
			if (err) {
				console.error(err);
			}

			if (rows.rowCount < 1) {
				console.log(rows);
			} else {
				console.log(rows);
			}
		});
		
        done();
    })
})
