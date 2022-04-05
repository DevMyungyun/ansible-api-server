class sql {

  commonCode () {
    let stringQuery = "";
    stringQuery += " SELECT code_name ";
    stringQuery += " FROM  t_codes ";
    stringQuery += " WHERE cinv = $1 ";
    return stringQuery
  };
  
  getJoinInv  () {
    let stringQuery = "";
    stringQuery += " select i.iid, i.name ";
    stringQuery += " from t_inventory i, t_ivt_hst ih ";
    stringQuery += " where i.iid = ih.iid ";
    stringQuery += " and hid = $1 ";
    stringQuery += " ORDER BY iid ASC ";
    return stringQuery
  };
  
  chkInvDupl () {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_inventory ";
    stringQuery += " where name ilike $1 ";
    return stringQuery
  };
  
  chkHostDupl () {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_hosts ";
    stringQuery += " where name ilike $1 ";
    return stringQuery
  };
  
  chkCredDupl () {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_credentials ";
    stringQuery += " where name ilike $1 ";
    return stringQuery
  };
  
  analyzedResult () {
    let stringQuery = "";
    stringQuery += " SELECT eid, jid, create_dt, stdout ";
    stringQuery += " FROM t_jobevents ";
    stringQuery += " WHERE jid = $1 ";
    stringQuery += "  ";
    return stringQuery
  };
  
}

let SQL = new sql();

module.exports = SQL;