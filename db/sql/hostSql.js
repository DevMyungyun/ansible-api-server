class sql {
  post () {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_hosts ( name, content,";
    stringQuery += " domain, os, ip, use_yn, ";
    stringQuery += " datasource, datacenter, create_id ) ";
    stringQuery += " VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, \'admin\' ) ";
    return stringQuery
  }
  
  update () {
    let stringQuery = "";
    stringQuery += " UPDATE t_hosts SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    stringQuery += " , name = $1 ";
    stringQuery += " , content = $2 ";
    stringQuery += " , domain = $3 ";
    stringQuery += " , os = $4 ";
    stringQuery += " , ip = $5 ";
    stringQuery += " , use_yn = $6 ";
    stringQuery += " , datasource = $7 ";
    stringQuery += " , datacenter = $8 ";
    stringQuery += " WHERE hid = $9 ";
    return stringQuery
  }
  
  delete () {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_hosts ";
    stringQuery += " WHERE hid IN ( $1 ) ";
    return stringQuery
  }
  
  getOneRow () {
    let stringQuery = "";
    stringQuery += " SELECT hid, name, content, domain, ip, os, use_yn, create_dt, create_id, update_dt, update_id ";
    stringQuery += " FROM t_hosts ";
    stringQuery += " WHERE hid = $1 ";
    return stringQuery
  }
  
  getList (name) {
    let stringQuery = "";
    stringQuery += " SELECT hid, name, domain, os, ip, use_yn, to_char(create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt, create_id, to_char(update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt, update_id ";
    stringQuery += " FROM t_hosts  ";
    if (name.length > 1) {
      stringQuery += " WHERE name like \'%" + name + "%\' ";
    }
    stringQuery += " ORDER BY name ASC ";
    stringQuery += " LIMIT $1 OFFSET $2";
    return stringQuery
  }
  
  joinedIventory () {
    let stringQuery = "";
    stringQuery += " SELECT i.iid as iid, i.name, i.content, i.total_hosts, i.use_yn, to_char(i.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , i.create_id, ih.iid as chkIid";
    stringQuery += " FROM t_inventory i, t_Ivt_hst ih  ";
    stringQuery += " WHERE i.iid = ih.iid and ih.hid = $1 ";
    stringQuery += " ORDER BY i.iid DESC ";
    stringQuery += " LIMIT $2 OFFSET $3";
    return stringQuery
  }
  
  joinHost () {
    let stringQuery = "";
    stringQuery += " SELECT h.hid as hid, h.name, h.content, h.domain, h.os, h.ip, h.use_yn, to_char(h.create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , h.create_id, ih.hid as chkHid";
    stringQuery += " from t_hosts h  ";
    stringQuery += " left outer join t_Ivt_hst ih  ";
    stringQuery += " on h.hid = ih.hid and ih.iid = $1 ";
    stringQuery += " ORDER BY h.name ASC ";
    stringQuery += " LIMIT $2 OFFSET $3";
    return stringQuery
  }
  
  totalCount (name) {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_hosts ';
    if (name.length > 1) {
      stringQuery += " WHERE name like \'%" + name + "%\' ";
    }
    return stringQuery
  }
  
  getHidSeq () {
    let stringQuery = "";
    stringQuery += " SELECT NEXTVAL('t_hosts_hid_seq'); ";
    return stringQuery
  }

  
}

let SQL = new sql();


module.exports = SQL;