class sql {
	post (viid, viname, vtid, vtname) {
		let stringQuery = "";
		stringQuery += " INSERT INTO t_jobs ( iid, iname, tid, tname, status, start_dt ) ";
		stringQuery += " VALUES ( " + viid + ", \'" + viname + "\', " + vtid + ", \'" + vtname + "\', 'P', now())";
		return stringQuery
	}
	
	getOneRow (vseq) {
		let stringQuery = "";
		stringQuery += " SELECT jid, iid, iname, tid, tname, status, forks, limits, verb, variables, chk_temp, to_char(start_dt, \'yyyy.mm.dd hh24:mi:ss\') AS start_dt , to_char(end_dt, \'yyyy.mm.dd hh24:mi:ss\') AS end_dt ";
		stringQuery += " FROM t_jobs ";
		stringQuery += " WHERE jid = " + vseq + " ";
		return stringQuery
	}
	
	getList (vtname, viname, vstatus, vpageSize, vstart) {
		let stringQuery = "";
		stringQuery += " SELECT jid, iid, iname, tid, tname, forks, verb, variables, limits, to_char(start_dt, \'yyyy-mm-dd hh24:mi:ss\') AS start_dt , to_char(end_dt, \'yyyy-mm-dd hh24:mi:ss\') AS end_dt, ";
		stringQuery += " CASE WHEN chk_temp = \'AP\' THEN \'Playbook\' WHEN chk_temp = \'AH\' THEN \'ADHOC\' END AS chk_temp, ";
		stringQuery += " CASE WHEN status = \'P\' THEN \'Proceeding\' WHEN status = \'S\' THEN \'Success\' WHEN status = \'F\' then \'Fail\' END AS status ";
		stringQuery += " FROM t_jobs ";
		if (vtname.length > 2) {
			stringQuery += " WHERE tname like \'%" + vtname + "%\' ";
		}
		if (viname.length > 2) {
			stringQuery += " WHERE iname like \'%" + viname + "%\' ";
		}
		if (vstatus.length > 0) {
			stringQuery += " WHERE status like \'%" + vstatus + "%\' ";
		}
		stringQuery += " ORDER BY jid DESC ";
		if (vpageSize) {
			stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
		}
		return stringQuery
	}
	
	totalCount (vtname, viname, vstatus) {
		let stringQuery = 'SELECT COUNT(*) AS total FROM t_jobs ';
		if (vtname.length > 2) {
			stringQuery += " WHERE tname like \'%" + vtname + "%\' ";
		}
		if (viname.length > 2) {
			stringQuery += " WHERE iname like \'%" + viname + "%\' ";
		}
		if (vstatus.length > 0) {
			stringQuery += " WHERE status like \'" + vstatus + "\' ";
		}
		return stringQuery
	}
	
}

let SQL = new sql()


module.exports = SQL;