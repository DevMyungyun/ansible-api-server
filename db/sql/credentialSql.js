class sql {
  post () {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_credentials ( name, content, mid, mpw, private_key, type, create_id) ";
    stringQuery += " VALUES ( $1, $2, $3, $4, $5, $6, \'admin\') ";
    return stringQuery
  }

  update (mpw, private_key) {
    let stringQuery = "";
    stringQuery += " UPDATE t_credentials SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    stringQuery += " , content = $1 ";
    stringQuery += " , mid = $2 ";
    if(mpw.length > 1) stringQuery += " , mpw = \'"+ mpw +"\' ";
    stringQuery += " , type = $3 ";
    if(private_key.length > 1) stringQuery += " , private_key = \'"+ private_key +"\' ";
    stringQuery += " WHERE name = $4 ";
    return stringQuery
  }

  delete () {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_credentials ";
    stringQuery += " WHERE name In ( $1 ) ";
    return stringQuery
  }

  getOneRow () {
    let stringQuery = "";
    stringQuery += " SELECT name, content, mid, private_key, type, vcenter_host, create_dt, create_id, update_dt, update_id ";
    stringQuery += " FROM  t_credentials ";
    stringQuery += " WHERE name = $1 ";
    return stringQuery
  }

  getList (name) {
    let stringQuery = "";
    stringQuery += " SELECT name, content, mid, type, vcenter_host, to_char(create_dt, \'yyyy-mm-dd hh24:mm:ss\') as create_dt, create_id, update_id, to_char(update_dt, \'yyyy-mm-dd hh24:mm:ss\') as update_dt ";
    stringQuery += " FROM t_credentials ";
    if (name.length > 2) {
      stringQuery += " WHERE name like \'%" + name + "%\' ";
    }
    stringQuery += " LIMIT $1 OFFSET $2";
    return stringQuery
  }

  totalCount (name) {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_credentials ';
    if (name.length > 2) {
      stringQuery += " WHERE name like \'%" + name + "%\' ";
    }
    return stringQuery
  }

}

const SQL = new sql()

module.exports = SQL;