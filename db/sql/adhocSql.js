 class sql {
   
  // post (vname, vcontent, viid, viname, vcname, vmodule, varg, vforks, vlimits, vverb, vvariables, vuse_yn) {
  //   let stringQuery = "";
  //   stringQuery += " INSERT INTO t_adhoc ( name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, create_id) ";
  //   stringQuery += " VALUES (  \'" + vname + "\', \'" + vcontent + "\', " + viid + ", \'" + viname + "\', \'" + vcname + "\', \'" + vmodule + "\', \'" + varg + "\', " + vforks + ", \'" + vlimits + "\', " + vverb + ", \'" + vvariables + "\', \'" + vuse_yn + "\', \'admin\') ";
  //   return stringQuery
  // }

  post () {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_adhoc (name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, create_id) ";
    stringQuery += " VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, \'admin\') ";
    return stringQuery
  }

  // update (vname, vcontent, viid, viname, vcname, vmodule, varg, vforks, vlimits, vverb, vvariables, vuse_yn, vseq) {
  //   let stringQuery = "";
  //   stringQuery += " UPDATE t_adhoc SET ";
  //   stringQuery += " update_dt = now() ";
  //   stringQuery += " , update_id = \'admin\' ";
  //   if (vname) {
  //     stringQuery += " , name = \'" + vname + "\' ";
  //   }
  //   if (vcontent) {
  //     stringQuery += " , content = \'" + vcontent + "\' ";
  //   }
  //   if (viid) {
  //     stringQuery += " , iid = " + viid + " ";
  //   }
  //   if (viname) {
  //     stringQuery += " , iname = \'" + viname + "\' ";
  //   }
  //   if (vcname) {
  //     stringQuery += " , cname = \'" + vcname + "\' ";
  //   }
  //   if (vmodule) {
  //     stringQuery += " , module = \'" + vmodule + "\' ";
  //   }
  //   stringQuery += " , argument = \'" + varg + "\' ";
  //   if (vforks) {
  //     stringQuery += " , forks = " + vforks + " ";
  //   }
  //   stringQuery += " , limits = \'" + vlimits + "\' ";
  //   if (vverb) {
  //     stringQuery += " , verb = " + vverb + " ";
  //   }
  //   stringQuery += " , variables = \'" + vvariables + "\' ";
  //   if (vuse_yn) {
  //     stringQuery += " , use_yn = \'" + vuse_yn + "\' ";
  //   }
  //   stringQuery += " WHERE tid = " + vseq + " ";
  //   return stringQuery
  // }

  update () {
    let stringQuery = " UPDATE t_adhoc SET ";
    stringQuery += " update_dt = now() ";
    stringQuery += " , update_id = \'admin\' ";
    stringQuery += " , name = $1 ";
    stringQuery += " , content = $2 ";
    stringQuery += " , iid = $3 ";
    stringQuery += " , iname = $4";
    stringQuery += " , cname = $5 ";
    stringQuery += " , module = $6 ";
    stringQuery += " , argument = $7 ";
    stringQuery += " , forks = $8 ";
    stringQuery += " , limits = $9 ";
    stringQuery += " , verb =  $10 ";
    stringQuery += " , variables = $11 ";
    stringQuery += " , use_yn = $12 ";
    stringQuery += " WHERE tid = $13 ";
    return stringQuery
  }

  delete () {
    let stringQuery = "";
    stringQuery += " DELETE FROM t_adhoc ";
    stringQuery += " WHERE tid  In ( $1 ) ";
    return stringQuery
  }

  getOneRow () {
    let stringQuery = "";
    stringQuery += " SELECT tid, name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, create_dt, create_id, update_dt, update_id ";
    stringQuery += " FROM  t_adhoc ";
    stringQuery += " WHERE tid = $1 ";
    return stringQuery
  }

  getList (name) {
    let stringQuery = "";
    stringQuery += " SELECT tid, name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, to_char(create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , create_id, to_char(update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt , update_id ";
    stringQuery += " FROM t_adhoc ";
    if (name.length > 2) {
      stringQuery += " WHERE name like \'%" + name + "%\' ";
    }
    stringQuery += " LIMIT $1 OFFSET $2";
    return stringQuery
  
  }

  totalCount (name) {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_adhoc ';
    if (name.length > 2) {
      stringQuery += " WHERE name like \'%" + name + "%\' ";
    }
    return stringQuery
  }

 }

let SQL  = new sql()


module.exports = SQL;