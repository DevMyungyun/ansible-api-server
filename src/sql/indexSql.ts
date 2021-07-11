class query {

  commonCode(vinv: string): string {
    let stringQuery = "";
    stringQuery += " SELECT code_name ";
    stringQuery += " FROM  t_codes ";
    stringQuery += " WHERE cinv = \'" + vinv + "\' ";
    return stringQuery
  };

  getJoinInv(vhid: number): string {
    let stringQuery = "";
    stringQuery += " select i.iid, i.name ";
    stringQuery += " from t_inventory i, t_ivt_hst ih ";
    stringQuery += " where i.iid = ih.iid ";
    stringQuery += " and hid = " + vhid + " ";
    stringQuery += " ORDER BY iid ASC ";
    return stringQuery
  };

  chkInvDupl(viname: string): string {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_inventory ";
    stringQuery += " where name ilike \'" + viname + "\' ";
    return stringQuery
  };

  chkHostDupl(vhname: string): string {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_hosts ";
    stringQuery += " where name ilike \'" + vhname + "\' ";
    return stringQuery
  };

  chkCredDupl(vcname: string): string {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_credentials ";
    stringQuery += " where name ilike \'" + vcname + "\' ";
    return stringQuery
  };

  analyzedResult(vseq: number): string {
    let stringQuery = "";
    stringQuery += " SELECT eid, jid, create_dt, stdout ";
    stringQuery += " FROM t_jobevents ";
    stringQuery += " WHERE jid = " + vseq + " ";
    stringQuery += "  ";
    return stringQuery
  };

}

let indexQuery = new query();

export default indexQuery;