class query {
  
  istMultiIid (viid: Array<number>, vhid: number) {
    let stringQuery: string = "";
    stringQuery += " INSERT INTO t_Ivt_hst ( iid, hid ) ";
    stringQuery += " VALUES ";
    stringQuery += " ( " + viid[0] + ", " + vhid + " ) ";
    for (let i = 1; i < viid.length; i++) {
      stringQuery += " , ( " + viid[i] + ", " + vhid + " ) ";
    }
    return stringQuery
  };
  
  istMultiHid (viid: number, vhid: Array<number>) {
    let stringQuery: string = "";
    stringQuery += " INSERT INTO t_Ivt_hst ( iid, hid ) ";
    stringQuery += " VALUES ";
    stringQuery += " ( " + viid + ", " + vhid[0] + " ) ";
    for (let i = 1; i < vhid.length; i++) {
      stringQuery += " , ( " + viid + ", " + vhid[i] + " ) ";
    }
    return stringQuery
  };
  
  deleteHid (vhid: number) {
    let stringQuery: string = "";
    stringQuery += " DELETE FROM t_Ivt_hst ";
    stringQuery += " WHERE hid IN ( " + vhid + " ) ";
    return stringQuery
  };
  
  deleteIid (viid: number) {
    let stringQuery: string = "";
    stringQuery += " DELETE FROM t_Ivt_hst ";
    stringQuery += " WHERE iid IN ( " + viid + " ) ";
    return stringQuery
  };
  
  getOneRow (vseq: number) {
    let stringQuery: string = "";
    stringQuery += " SELECT iid, hid ";
    stringQuery += " FROM t_Ivt_hst ";
    stringQuery += " WHERE iid = " + vseq + " ";
    return stringQuery
  };
  
  getList (viid: number, vpageSize: number, vstart: number) {
    let stringQuery: string = "";
    stringQuery += " select i.iid, h.hid, h.name, h.content, h.use_yn, h.create_dt, h.create_id ";
    stringQuery += " from t_hosts h, t_ivt_hst i ";
    stringQuery += " where i.hid = h.hid ";
    if (viid) {
      stringQuery += " and iid = " + viid + " ";
    }
    // stringQuery += " SELECT iid, hid FROM t_Ivt_hst ";
    // stringQuery += " ORDER BY iid ASC ";
    stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
    return stringQuery
  };
  
  totalCount (viid: number) {
    let stringQuery: string = "";
    stringQuery += " select count(*) ";
    stringQuery += " from t_hosts h, t_ivt_hst i ";
    stringQuery += " where i.hid = h.hid ";
    if (viid) {
      stringQuery += " and iid = " + viid + " ";
    }
    return stringQuery
  };
  
}

let invHstQuery = new query();

export default invHstQuery;