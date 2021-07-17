class query {

  getInventoryListByHost(): string {
    let stringQuery = "";
    stringQuery += " select i.iid, i.name ";
    stringQuery += " from t_inventory i, t_ivt_hst ih ";
    stringQuery += " where i.iid = ih.iid ";
    stringQuery += " and hid = ? ";
    stringQuery += " ORDER BY iid ASC ";
    return stringQuery
  };

  checkNameDuplicate(): string {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_inventory ";
    stringQuery += " where name ilike ? ";
    return stringQuery
  };

  post (vname: string, vcontent: string, vuse_yn: string): string {
    let stringQuery: string = "";
    stringQuery += " INSERT INTO t_inventory ( name, content, total_hosts, use_yn, create_id ) ";
    stringQuery += " VALUES ( \'" + vname + "\',\'" + vcontent + "\', 0,\'" + vuse_yn + "\', \'admin\')";
    return stringQuery
  }
  
  update (vname: string, vcontent: string, vuse_yn: string, vseq: number): string {
    let stringQuery: string = "";
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
  
  delete (viid: string): string {
    let stringQuery: string = "";
    stringQuery += " DELETE FROM t_inventory ";
    stringQuery += " WHERE iid IN ( " + viid + " ) ";
    return stringQuery
  }
  
  getOneRow (vseq: number): string {
    let stringQuery: string = "";
    stringQuery += " SELECT iid, name, content, total_hosts, use_yn, create_dt , create_id, update_dt, update_id "
    stringQuery += " FROM t_inventory "
    stringQuery += " WHERE iid = " + vseq + " "
    return stringQuery
  }
  
  getList (vname: string, vsearchInv: string): string {
    let stringQuery: string = "";
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
  
  detailCHstList (vseq: number): string {
    let stringQuery: string = "";
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
  
  joinIid (vhid: number): string {
    let stringQuery: string = "";
    stringQuery += " SELECT i.iid as iid, i.name, i.content, i.total_hosts, i.use_yn, to_char(i.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , to_char(i.update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt, i.create_id, ih.iid as chkIid";
    stringQuery += " from t_inventory i  ";
    stringQuery += " left outer join t_Ivt_hst ih  ";
    stringQuery += " on i.iid = ih.iid and ih.hid = " + vhid;
    stringQuery += " ORDER BY i.iid DESC ";
    return stringQuery
  }
  
  connectedHosts (viid: number): string {
    let stringQuery: string = "";
    stringQuery += " SELECT h.hid as hid, h.name, h.content, h.domain, h.os, h.ip, h.use_yn, to_char(h.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , h.create_id, ih.hid as chkHid";
    stringQuery += " from t_hosts h, t_Ivt_hst ih ";
    stringQuery += " where h.hid = ih.hid and ih.iid = " + viid;
    stringQuery += " ORDER BY h.name ASC ";
    return stringQuery
  }
  
  totalCount (vname: string): string {
    let stringQuery: string = 'SELECT COUNT(*) AS total FROM t_inventory ';
    if (vname.length > 1) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    return stringQuery
  }
  
  chkConnectedHost (viid: number): string {
    let stringQuery: string = "";
    stringQuery += " SELECT total_hosts ";
    stringQuery += " FROM t_inventory ";
    stringQuery += " WHERE iid = " + viid;
    return stringQuery
  }
  
  getIidSeq (): string {
    let stringQuery: string = "";
    stringQuery += " SELECT NEXTVAL('t_inventory_iid_seq'); ";
    return stringQuery
  }
  
  insertInvHst (viid: number, vhid: Array<number>): string {
    let stringQuery: string = "";
    stringQuery += " INSERT INTO t_Ivt_hst ( iid, hid ) ";
    stringQuery += " VALUES ";
    stringQuery += " ( " + viid + ", " + vhid[0] + " ) ";
    for (let i = 1; i < vhid.length; i++) {
      stringQuery += " , ( " + viid + ", " + vhid[i] + " ) ";
    }
    return stringQuery
  }
  
  delInvHst (viid: number): string {
    let stringQuery: string = "";
    stringQuery += " DELETE FROM t_Ivt_hst ";
    stringQuery += " WHERE iid IN ( " + viid + " ) ";
    return stringQuery
  }

}

let inventoryQuery = new query();


export default inventoryQuery;