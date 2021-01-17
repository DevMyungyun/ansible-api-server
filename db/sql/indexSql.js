class sql {

  commonCode (vinv) {
    let stringQuery = "";
    stringQuery += " SELECT code_name ";
    stringQuery += " FROM  t_codes ";
    stringQuery += " WHERE cinv = \'" + vinv + "\' ";
    return stringQuery
  };
  
  getJoinInv  (vhid) {
    let stringQuery = "";
    stringQuery += " select i.iid, i.name ";
    stringQuery += " from t_inventory i, t_ivt_hst ih ";
    stringQuery += " where i.iid = ih.iid ";
    stringQuery += " and hid = " + vhid + " ";
    stringQuery += " ORDER BY iid ASC ";
    return stringQuery
  };
  
  chkInvDupl (viname) {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_inventory ";
    stringQuery += " where name ilike \'" + viname + "\' ";
    return stringQuery
  };
  
  chkHostDupl (vhname) {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_hosts ";
    stringQuery += " where name ilike \'" + vhname + "\' ";
    return stringQuery
  };
  
  chkCredDupl (vcname) {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_credentials ";
    stringQuery += " where name ilike \'" + vcname + "\' ";
    return stringQuery
  };
  
  analyzedResult (vseq) {
    let stringQuery = "";
    stringQuery += " SELECT eid, jid, create_dt, stdout ";
    stringQuery += " FROM t_jobevents ";
    stringQuery += " WHERE jid = " + vseq + " ";
    stringQuery += "  ";
    return stringQuery
  };
  
}

let SQL = new sql();

module.exports = SQL;