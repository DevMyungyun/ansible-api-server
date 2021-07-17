class query {

  commonCode(): string {
    let stringQuery = "";
    stringQuery += " SELECT code_name ";
    stringQuery += " FROM  t_codes ";
    stringQuery += " WHERE cinv = $1 ";
    return stringQuery
  };

  analyzePlaybookRecap(): string {
    let stringQuery = "";
    stringQuery += " SELECT eid, jid, create_dt, stdout ";
    stringQuery += " FROM t_jobevents ";
    stringQuery += " WHERE jid = $1 ";
    return stringQuery
  };

}

let indexQuery = new query();

export default indexQuery;