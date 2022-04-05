class sql {
  post () {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_jobtemps ( name, content, iid, iname, cname, playbook, forks, limits, verb, variables, use_yn, create_id) ";
    stringQuery += " VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, \'admin\') ";
    return stringQuery
  }

  update () {
    let stringQuery = "";
    stringQuery += " UPDATE t_jobtemps SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    stringQuery += " , name = $1 ";
    stringQuery += " , content = $2 ";
    stringQuery += " , iid = $3 ";
    stringQuery += " , iname = $4 ";
    stringQuery += " , cname = $5 ";
    stringQuery += " , playbook = $6 ";
    stringQuery += " , forks = $7 ";
    stringQuery += " , limits = $8 ";
    stringQuery += " , verb = $9 ";
    stringQuery += " , variables = $10 ";
    stringQuery += " , use_yn = $11 ";
    stringQuery += " WHERE tid = $12 ";
    return stringQuery
  }

  delete () {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_jobtemps ";
    stringQuery += " WHERE tid  In ( $1 ) ";
    return stringQuery
  }
  
  getOneRow () {
    let stringQuery = "";
    stringQuery += " SELECT tid, name, content, iid, iname, cname, playbook, forks, limits, verb, variables, use_yn, create_dt, create_id, update_dt, update_id ";
    stringQuery += " FROM  t_jobtemps ";
    stringQuery += " WHERE tid = $1 ";
    return stringQuery
  }
  
  getList (vname)  {
    let stringQuery = "";
    stringQuery += " SELECT tid, name, content, iid, iname, cname, playbook, forks, limits, verb, variables, use_yn, to_char(create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , create_id, to_char(update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt , update_dt ";
    stringQuery += " FROM t_jobtemps ";
    if (vname.length > 2) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    stringQuery += " ORDER BY tid DESC ";
    stringQuery += " LIMIT $1 OFFSET $2 ";
    return stringQuery
  }
  
  totalCount (vname) {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_jobtemps ';
    if (vname.length > 2) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    return stringQuery
  }
}

let SQL = new sql()

module.exports = SQL;