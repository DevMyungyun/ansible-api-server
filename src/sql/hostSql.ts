class query {

  post (vname:string, vdomain:string, vcontent:string, vos:string, vip:string, vuse_yn:string, vdatasource:string, vdatacenter:string):string {
    let stringQuery:string = "";
    stringQuery += " INSERT INTO t_hosts ( name,  domain,";
    stringQuery += " content, os, ip, use_yn, create_id,  ";
    stringQuery += " datasource, datacenter ) VALUES ( ";
    stringQuery += "\'" + vname + "\', ";
    if (vdomain == null || vdomain == '') {
      vdomain = null;
      stringQuery += " " + vdomain + ", ";
    } else {
      stringQuery += "\'" + vdomain + "\', ";
    }
    if (vcontent == null || vdomain == '') {
      vcontent = null;
      stringQuery += " " + vcontent + ", ";
    } else {
      stringQuery += " \'" + vcontent + "\',  ";
    }
    if (vos == null || vos == '') {
      vos = null;
      stringQuery += " " + vos + ", ";
    } else {
      stringQuery += " \'" + vos + "\', ";
    }
    if (vip == null || vip == '') {
      vip = null;
      stringQuery += " " + vip + ", ";
    } else {
      stringQuery += " \'" + vip + "\', ";
    }
    stringQuery += " \'" + vuse_yn + "\', \'admin\', ";
    if (vdatasource == null || vdatasource == '') {
      vdatasource = null;
      stringQuery += " " + vdatasource + ", ";
    } else {
      stringQuery += " \'" + vdatasource + "\', ";
    }
    if (vdatacenter == null || vdatacenter == '') {
      vdatacenter = null;
      stringQuery += " " + vdatacenter + " ) ";
    } else {
      stringQuery += " \'" + vdatacenter + "\')";
    }
    return stringQuery
  }
  
  update (vname:string, vdomain:string, vcontent:string, vos:string, vip:string, vuse_yn:string, vdatasource:string, vdatacenter: string, vseq: number):string {
    let stringQuery:string = "";
    stringQuery += " UPDATE t_hosts SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    if (vname) {
      stringQuery += " , name = \'" + vname + "\' ";
    }
    stringQuery += " , domain = \'" + vdomain + "\' ";
    if (vcontent) {
      stringQuery += " , content = \'" + vcontent + "\' ";
    }
    if (vos) {
      stringQuery += " , os = \'" + vos + "\' ";
    }
    if (vip) {
      stringQuery += " , ip = \'" + vip + "\' ";
    }
    if (vuse_yn) {
      stringQuery += " , use_yn = \'" + vuse_yn + "\' ";
    }
    if (vdatasource) {
      stringQuery += " , datasource = \'" + vdatasource + "\' ";
    }
    if (vdatacenter) {
      stringQuery += " , datacenter = \'" + vdatacenter + "\' ";
    }
    stringQuery += " WHERE hid = " + vseq + " ";
    return stringQuery
  }
  
  delete (vseq: number):string {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_hosts ";
    stringQuery += " WHERE hid IN ( " + vseq + " ) ";
    return stringQuery
  }
  
  getOneRow (vseq: number): string {
    let stringQuery = "";
    stringQuery += " SELECT hid, name, content, domain, ip, os, use_yn, create_dt, create_id, update_dt, update_id ";
    stringQuery += " FROM t_hosts ";
    stringQuery += " WHERE hid = " + vseq + " ";
    return stringQuery
  }
  
  getList (vname:string):string {
    let stringQuery = "";
    stringQuery += " SELECT hid, name, domain, os, ip, use_yn, to_char(create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt, create_id, to_char(update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt, update_id ";
    stringQuery += " FROM t_hosts  ";
    if (vname.length > 1) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    stringQuery += " ORDER BY name ASC ";
    // stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
    return stringQuery
  }
  
  connectedIvts (vhid:string):string {
    let stringQuery = "";
    stringQuery += " SELECT i.iid as iid, i.name, i.content, i.total_hosts, i.use_yn, to_char(i.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , i.create_id, ih.iid as chkIid";
    stringQuery += " FROM t_inventory i, t_Ivt_hst ih  ";
    stringQuery += " WHERE i.iid = ih.iid and ih.hid = " + vhid;
    stringQuery += " ORDER BY i.iid DESC ";
    return stringQuery
  }
  
  joinHid (viid:number):string {
    let stringQuery = "";
    stringQuery += " SELECT h.hid as hid, h.name, h.content, h.domain, h.os, h.ip, h.use_yn, to_char(h.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , h.create_id, ih.hid as chkHid";
    stringQuery += " from t_hosts h  ";
    stringQuery += " left outer join t_Ivt_hst ih  ";
    stringQuery += " on h.hid = ih.hid and ih.iid = " + viid;
    stringQuery += " ORDER BY h.name ASC ";
    return stringQuery
  }
  
  totalCount (vname:string):string {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_hosts ';
    if (vname.length > 1) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    return stringQuery
  }
  
  getHidSeq ():string {
    let stringQuery = "";
    stringQuery += " SELECT NEXTVAL('t_hosts_hid_seq'); ";
    return stringQuery
  }
  
  insertHostInv (viid: Array<number>, vhid: number):string  {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_Ivt_hst ( iid, hid ) ";
    stringQuery += " VALUES ";
    stringQuery += " ( " + viid[0] + ", " + vhid + " ) ";
    for (let i = 1; i < viid.length; i++) {
      stringQuery += " , ( " + viid[i] + ", " + vhid + " ) ";
    }
    return stringQuery
  }
  
  delInvHost (vhid: number):string {
    let stringQuery ="";
    stringQuery += " DELETE FROM t_Ivt_hst ";
    stringQuery += " WHERE hid IN ( " + vhid + " ) ";
    // if( viid && isNaN(viid) === false ) {
    //     stringQuery += " AND iid = " + viid + " ";
    // }
    return stringQuery
  }
  
}

let hostQuery = new query();


export default hostQuery;