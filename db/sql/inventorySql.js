class sql {
  post (vname, vcontent, vuse_yn) {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_inventory ( name, content, total_hosts, use_yn, create_id ) ";
    stringQuery += " VALUES ( \'" + vname + "\',\'" + vcontent + "\', 0,\'" + vuse_yn + "\', \'admin\')";
    return stringQuery
  }
  
  update (vname, vcontent, vuse_yn, vseq) {
    let stringQuery = "";
    stringQuery += " UPDATE t_inventory SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    if (vname) {
      stringQuery += " , name = \'" + vname + "\' ";
    }
    if (vcontent) {
      stringQuery += " , content = \'" + vcontent + "\' ";
    }
    if (vuse_yn) {
      stringQuery += " , use_yn = \'" + vuse_yn + "\' ";
    }
    stringQuery += " WHERE iid = " + vseq + " ";
    return stringQuery
  }
  
  delete (item) {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_inventory ";
    stringQuery += " WHERE iid IN ( " + item + " ) ";
    return stringQuery
  }
  
  getOneRow (vseq) {
    let stringQuery = "";
    stringQuery += " SELECT iid, name, content, total_hosts, use_yn, create_dt , create_id, update_dt, update_id "
    stringQuery += " FROM t_inventory "
    stringQuery += " WHERE iid = " + vseq + " "
    return stringQuery
  }
  
  getList (vname, vsearchInv) {
    let stringQuery = "";
    stringQuery += " SELECT iid, name, content, total_hosts, use_yn, to_char(create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , create_id, to_char(update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt ";
    stringQuery += " FROM t_inventory ";
    if (vname.length > 1) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    if (vsearchInv) {
      stringQuery += " WHERE use_yn = \'Y\' ";
    }
    stringQuery += " ORDER BY iid DESC ";
    // stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
  
    return stringQuery
  }
  
  detailCHstList (vseq) {
    let stringQuery = "";
    stringQuery += " SELECT e.hid, e.name, e.domain, e.ip, e.os, to_char(e.create_dt, \'yyyy-mm-dd HH24:mi:ss\') as create_dt ";
    stringQuery += " FROM t_inventory i  ";
    stringQuery += " FULL OUTER JOIN (SELECT h.hid, h.name, h.ip, h.os, h.domain, h.create_dt, ih.iid ";
    stringQuery += "                  FROM t_hosts h, t_Ivt_hst ih ";
    stringQuery += "                  WHERE h.hid = ih.hid  ";
    stringQuery += "                  ORDER BY h.hid asc) e ";
    stringQuery += " ON i.iid = e.iid ";
    stringQuery += " GROUP BY i.iid, e.hid, e.name, e.domain, e.ip, e.os, e.create_dt ";
    stringQuery += " HAVING i.iid = " + vseq + " ";
    stringQuery += " ORDER BY e.name ASC ";
    return stringQuery
  }
  
  joinIid (vhid) {
    let stringQuery = "";
    stringQuery += " SELECT i.iid as iid, i.name, i.content, i.total_hosts, i.use_yn, to_char(i.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , to_char(i.update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt, i.create_id, ih.iid as chkIid";
    stringQuery += " from t_inventory i  ";
    stringQuery += " left outer join t_Ivt_hst ih  ";
    stringQuery += " on i.iid = ih.iid and ih.hid = " + vhid;
    stringQuery += " ORDER BY i.iid DESC ";
    return stringQuery
  }
  
  connectedHosts (viid) {
    let stringQuery = "";
    stringQuery += " SELECT h.hid as hid, h.name, h.content, h.domain, h.os, h.ip, h.use_yn, to_char(h.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , h.create_id, ih.hid as chkHid";
    stringQuery += " from t_hosts h, t_Ivt_hst ih ";
    stringQuery += " where h.hid = ih.hid and ih.iid = " + viid;
    stringQuery += " ORDER BY h.name ASC ";
    return stringQuery
  }
  
  totalCount (vname) {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_inventory ';
    if (vname.length > 1) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    return stringQuery
  }
  
  chkConnectedHost (viid) {
    let stringQuery = "";
    stringQuery += " SELECT total_hosts ";
    stringQuery += " FROM t_inventory ";
    stringQuery += " WHERE iid = " + viid;
    return stringQuery
  }
  
  getIidSeq () {
    let stringQuery = "";
    stringQuery += " SELECT NEXTVAL('t_inventory_iid_seq'); ";
    return stringQuery
  }

}

let SQL = new sql();


module.exports = SQL;