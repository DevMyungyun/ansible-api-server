const addslashes = require('../addslashes.js');

class sql {

  getOneRow (vseq) {
    let stringQuery = "";
    stringQuery += " SELECT je.*, j.end_dt  ";
    stringQuery += " from (  ";
    stringQuery += " SELECT *, 0 sort_order from t_jobevents where jid=" + vseq + " and (stdout not like '%ok=%' and stdout not like '%RECAP%') ";
    stringQuery += " union all ";
    stringQuery += " SELECT *, 1 sort_order from t_jobevents where jid=" + vseq + " and stdout like '%RECAP%'  ";
    stringQuery += " union all  ";
    stringQuery += " SELECT *, 2 sort_order from t_jobevents where jid=" + vseq + " and stdout like '%ok=%' and stdout like '%changed=%' and stdout like '%failed=%' and stdout not like '%RECAP%' ";
    stringQuery += "  ) je, t_jobs j ";
    stringQuery += " where je.jid = " + vseq + " and j.jid = " + vseq + "  ";
    stringQuery += " order by sort_order, eid asc ";
    return stringQuery
  }
  
  getList (vpageSize, vstart) {
    let stringQuery = "";
    stringQuery += " SELECT eid, jid, create_dt , stdout ";
    stringQuery += " FROM t_jobevents ";
    // stringQuery += " where use_yn = \'Y\' ";
    stringQuery += " ORDER BY eid ASC ";
    stringQuery += " LIMIT " + vpageSize + " OFFSET " + vstart;
    return stringQuery
  }
  
  action () {
    let stringQuery = 'SELECT COUNT(*) AS total FROM t_jobevents ';
    return stringQuery
  
  }
  
  selectJobTempQuery (vtid) {
    let stringQuery = "";
    stringQuery += " SELECT tid, name, content, iid, iname, playbook, forks, limits, verb, variables, cname, use_yn ";
    stringQuery += " FROM  t_jobtemps ";
    stringQuery += " WHERE tid = " + vtid + " ";
    return stringQuery
  }
  
  selectAHTempQuery (vtid) {
    let stringQuery = "";
    stringQuery += " SELECT tid, name, content, iid, iname, module, argument, forks, limits, verb, variables, cname, use_yn ";
    stringQuery += " FROM  t_adhoc ";
    stringQuery += " WHERE tid = " + vtid + " ";
    return stringQuery
  }
  
  selectCredQuery (vcname) {
    let stringQuery = "";
    stringQuery += " SELECT mid, mpw, private_key ";
    stringQuery += " FROM  t_credentials ";
    stringQuery += " WHERE name = \'" + vcname + "\' ";
    return stringQuery
  }
  
  selectHostQuery (viid) {
    let stringQuery = "";
    stringQuery += " select h.name, h.domain, h.ip ";
    stringQuery += " from t_hosts h, t_Ivt_hst i ";
    stringQuery += " where i.hid = h.hid ";
    stringQuery += " and iid = " + viid + " ";
    stringQuery += " and use_yn = \'Y\' ";
    stringQuery += " order by h.name ASC ";
    return stringQuery
  }
  
  selectJidQuery () {
    let stringQuery = 'SELECT CURRVAL(\'t_jobs_jid_seq\' ';
    return stringQuery
  }
  
  insertJobQuery (vdata) {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_jobs ( iid, iname, tid, tname, chk_temp, forks, verb, variables, limits, status, start_dt ) ";
    stringQuery += " VALUES ( " + vdata.iid + ", \'" + vdata.iname + "\', " + vdata.tid + ", \'" + vdata.name + "\', \'" + vdata.chk_temp + "\', " + vdata.forks + ", " + vdata.verb + ", \'" + vdata.variables + "\', \'" + vdata.limits + "\', " + '\'P\'' + ", now() ) ";
    return stringQuery
  }
  
  getJidQuery () {
    let stringQuery = "";
    stringQuery = " SELECT CURRVAL(\'t_jobs_jid_seq\') ";
    return stringQuery
  }
  
  insertJobeventQuery (vjid, vpid, vcheck, data) {
    let stringQuery = "";
    stringQuery = " INSERT INTO t_jobevents ( jid, pid, chk_temp, create_dt, stdout ) ";
    stringQuery += " VALUES ( " + vjid + ", " + vpid + ", \'" + vcheck + "\', NOW(), \'" + addslashes(data) + "\') ";
    return stringQuery
  }
  
  updateJobeventQuery (vcode, vjid) {
    let stringQuery = "";
    if (vcode === 0) {
      stringQuery += " UPDATE t_jobs SET status = \'S\', end_dt = now() ";
      stringQuery += " WHERE jid = " + vjid + " ";
    } else {
      stringQuery += " UPDATE t_jobs SET status = \'F\', end_dt = now() ";
      stringQuery += " WHERE jid = " + vjid + " ";
    }
    return stringQuery
  }
}

let SQL = new sql();

module.exports = SQL;