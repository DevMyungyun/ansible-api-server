 class sql {

   post(vname: string, vcontent: string, viid: number, viname: string, vcname: string, vmodule: string, varg: string, vforks: string, vlimits: string, vverb: string, vvariables: string, vuse_yn: string): string {
     let stringQuery: string = "";
     stringQuery += " INSERT INTO t_adhoc ( name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, create_id) ";
     stringQuery += " VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, \'admin\') ";
     return stringQuery
   }

   update(vname: string, vcontent: string, viid: number, viname: string, vcname: string, vmodule: string, varg: string, vforks: string, vlimits: string, vverb: string, vvariables: string, vuse_yn: string, vseq: number): string {
     let stringQuery: string = "";
     stringQuery += " UPDATE t_adhoc SET ";
     stringQuery += " update_dt = now() ";
     stringQuery += " , update_id = \'admin\' ";
     if (vname) {
       stringQuery += " , name = \'" + vname + "\' ";
     }
     if (vcontent) {
       stringQuery += " , content = \'" + vcontent + "\' ";
     }
     if (viid) {
       stringQuery += " , iid = " + viid + " ";
     }
     if (viname) {
       stringQuery += " , iname = \'" + viname + "\' ";
     }
     if (vcname) {
       stringQuery += " , cname = \'" + vcname + "\' ";
     }
     if (vmodule) {
       stringQuery += " , module = \'" + vmodule + "\' ";
     }
     stringQuery += " , argument = \'" + varg + "\' ";
     if (vforks) {
       stringQuery += " , forks = " + vforks + " ";
     }
     stringQuery += " , limits = \'" + vlimits + "\' ";
     if (vverb) {
       stringQuery += " , verb = " + vverb + " ";
     }
     stringQuery += " , variables = \'" + vvariables + "\' ";
     if (vuse_yn) {
       stringQuery += " , use_yn = \'" + vuse_yn + "\' ";
     }
     stringQuery += " WHERE tid = " + vseq + " ";
     return stringQuery
   }

   delete(vseq: number): string {
     let stringQuery: string = "";
     stringQuery += " DELETE FROM t_adhoc ";
     stringQuery += " WHERE tid  In ( ? ) ";
     return stringQuery
   }

   getOneRow(vseq: number): string {
     let stringQuery: string = "";
     stringQuery += " SELECT tid, name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, create_dt, create_id, update_dt, update_id ";
     stringQuery += " FROM  t_adhoc ";
     stringQuery += " WHERE tid = ? ";
     return stringQuery
   }

   getList(vname: string): string {
     let stringQuery: string = "";
     stringQuery += " SELECT tid, name, content, iid, iname, cname, module, argument, forks, limits, verb, variables, use_yn, to_char(create_dt, \'yyyy-mm-dd hh24:mi:ss\') as create_dt , create_id, to_char(update_dt, \'yyyy-mm-dd hh24:mi:ss\') as update_dt , update_id ";
     stringQuery += " FROM t_adhoc ";
     if (vname.length > 2) {
       stringQuery += " WHERE name like \'%?%\' ";
     }
     stringQuery += " ORDER BY tid DESC ";
     // stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
     return stringQuery

   }

   totalCount(vname: string): string {
     let stringQuery = 'SELECT COUNT(*) AS total FROM t_adhoc ';
     if (vname.length > 2) {
       stringQuery += " WHERE name like \'%?%\' ";
     }
     return stringQuery
   }

 }

 let adhocSQL = new sql()


 export default adhocSQL;