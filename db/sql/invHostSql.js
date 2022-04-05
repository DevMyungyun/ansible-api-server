class sql {
  
  post (viid, vhid) {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_Ivt_hst ( iid, hid ) ";
    stringQuery += " VALUES %L ";
    return stringQuery
  };
  
  // istMultiHid (viid, vhid) {
  //   let stringQuery = "";
  //   stringQuery += " INSERT INTO t_Ivt_hst ( iid, hid ) ";
  //   stringQuery += " VALUES ";
  //   stringQuery += " ( " + viid + ", " + vhid[0] + " ) ";
  //   for (let i = 1; i < vhid.length; i++) {
  //     stringQuery += " , ( " + viid + ", " + vhid[i] + " ) ";
  //   }
  //   return stringQuery
  // };
  
  deleteHid () {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_Ivt_hst ";
    stringQuery += " WHERE hid = ANY( $1::int[] ) ";
    return stringQuery
  };
  
  deleteIid () {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_Ivt_hst ";
    stringQuery += " WHERE iid = ANY ( $1::int[] ) ";
    return stringQuery
  };
  
  getRowsByIid () {
    let stringQuery = "";
    stringQuery += " SELECT iid, hid ";
    stringQuery += " FROM t_Ivt_hst ";
    stringQuery += " WHERE iid = $1 ";
    return stringQuery
  };

  getRowsByHid () {
    let stringQuery = "";
    stringQuery += " SELECT iid, hid ";
    stringQuery += " FROM t_Ivt_hst ";
    stringQuery += " WHERE Hid = $1 ";
    return stringQuery
  };
  
}

let SQL = new sql();

module.exports = SQL;