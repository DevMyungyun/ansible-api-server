class sql {
	post () {
		let stringQuery = "";
		stringQuery += " INSERT INTO t_jobs ( iid, iname, tid, tname, chk_temp, status, start_dt ) ";
		stringQuery += " VALUES ( $1, $2, $3, $4, $5, 'P', now())";
		return stringQuery
	}
	
	getOneRow () {
		let stringQuery = "";
		stringQuery += " SELECT jid, iid, iname, tid, tname, status, forks, limits, verb, variables, chk_temp, to_char(start_dt, \'yyyy.mm.dd hh24:mi:ss\') AS start_dt , to_char(end_dt, \'yyyy.mm.dd hh24:mi:ss\') AS end_dt ";
		stringQuery += " FROM t_jobs ";
		stringQuery += " WHERE jid = $1 ";
		return stringQuery
	}
	
	getList (tname, iname, status) {
		let stringQuery = "";
		stringQuery += " SELECT jid, iid, iname, tid, tname, forks, verb, variables, limits, to_char(start_dt, \'yyyy-mm-dd hh24:mi:ss\') AS start_dt , to_char(end_dt, \'yyyy-mm-dd hh24:mi:ss\') AS end_dt, ";
		stringQuery += " CASE WHEN chk_temp = \'AP\' THEN \'Playbook\' WHEN chk_temp = \'AH\' THEN \'ADHOC\' END AS chk_temp, ";
		stringQuery += " CASE WHEN status = \'P\' THEN \'Proceeding\' WHEN status = \'S\' THEN \'Success\' WHEN status = \'F\' then \'Fail\' END AS status ";
		stringQuery += " FROM t_jobs ";
		if (tname.length > 2) {
			stringQuery += " WHERE tname like \'%" + tname + "%\' ";
		}
		if (iname.length > 2) {
			stringQuery += " WHERE iname like \'%" + iname + "%\' ";
		}
		if (status.length > 0) {
			stringQuery += " WHERE status like \'%" + status + "%\' ";
		}
		stringQuery += " ORDER BY jid DESC ";
		stringQuery += " LIMIT $1 OFFSET $2 ";
		return stringQuery
	}
	
	totalCount (tname, iname, status) {
		let stringQuery = 'SELECT COUNT(*) AS total FROM t_jobs ';
		if (tname.length > 2) {
			stringQuery += " WHERE tname like \'%" + tname + "%\' ";
		}
		if (iname.length > 2) {
			stringQuery += " WHERE iname like \'%" + iname + "%\' ";
		}
		if (status.length > 0) {
			stringQuery += " WHERE status like \'" + status + "\' ";
		}
		return stringQuery
	}
	
}

let SQL = new sql()


module.exports = SQL;