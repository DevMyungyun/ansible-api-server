class query {

  checkNameDuplicate(): string {
    let stringQuery = "";
    stringQuery += " select name ";
    stringQuery += " from t_credentials ";
    stringQuery += " where name ilike ? ";
    return stringQuery
  };

  post (vname: string, vcontent: string, vmid: number, encryptedPw: string, encryptePK: string, vtype: string): string {
    let stringQuery: string = "";
    stringQuery += " INSERT INTO t_credentials ( name, content, mid, mpw, private_key, type, create_id) ";
    stringQuery += " VALUES (  \'" + vname + "\', \'" + vcontent + "\', \'" + vmid + "\', \'" + encryptedPw + "\', \'" + encryptePK + "\', \'" + vtype + "\', \'admin\') ";
    return stringQuery
  }

  update (vcontent: string, vmid: number, encryptedPw: string, encryptePK: string, vname: string): string {
    let stringQuery: string = "";
    stringQuery += " UPDATE t_credentials SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    if (vcontent) {
      stringQuery += " , content = \'" + vcontent + "\' ";
    }
    if (vmid) {
      stringQuery += " , mid = \'" + vmid + "\' ";
    }
    if (encryptedPw) {
      stringQuery += " , mpw = \'" + encryptedPw + "\' ";
    }
    if (encryptePK) {
      stringQuery += " , private_key = \'" + encryptePK + "\' ";
    }
    stringQuery += " WHERE name = \'" + vname + "\' ";
    return stringQuery
  }

  delete (nameString: string): string {
    let stringQuery: string = "";
    stringQuery += " DELETE FROM t_credentials ";
    stringQuery += " WHERE name  In ( " + nameString + " ) ";
    return stringQuery
  }

  getOneRow (vname: string): string {
    let stringQuery: string = "";
    stringQuery += " SELECT name, content, mid, private_key, type, vcenter_host, create_dt, create_id, update_dt, update_id ";
    stringQuery += " FROM  t_credentials ";
    stringQuery += " WHERE name = \'" + vname + "\' ";
    return stringQuery
  }

  getList (vname: string): string {
    let stringQuery: string = "";
    stringQuery += " SELECT name, content, mid, type, vcenter_host, to_char(create_dt, \'yyyy-mm-dd hh24:mm:ss\') as create_dt, create_id, update_id, to_char(update_dt, \'yyyy-mm-dd hh24:mm:ss\') as update_dt ";
    stringQuery += " FROM t_credentials ";
    if (vname.length > 2) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    stringQuery += " ORDER BY name DESC ";
    //stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
    return stringQuery
  }

  totalCount (vname: string): string {
    let stringQuery: string = 'SELECT COUNT(*) AS total FROM t_credentials ';
    if (vname.length > 2) {
      stringQuery += " WHERE name like \'%" + vname + "%\' ";
    }
    return stringQuery
  }

}

const credentialSql = new query()

export default credentialSql;