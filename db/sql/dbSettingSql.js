class sql {

  createDB () {
    let stringQuery = "";
    stringQuery += "create database automation ";
    return stringQuery
  }

  dropTable () {
    let stringQuery = "";
    stringQuery += " drop table ";
    return stringQuery
  }
  
  invTable () {
    let stringQuery = "";
    stringQuery += " create table t_inventory( ";
    stringQuery += " iid serial Not Null primary key, ";
    stringQuery += " name varchar (255) Not Null unique, ";
    stringQuery += " content varchar (255), ";
    stringQuery += " total_hosts int, ";
    stringQuery += " use_yn varchar (1) default 'Y', ";
    stringQuery += " create_dt timestamp default now(), ";
    stringQuery += " create_id varchar(50), ";
    stringQuery += " update_dt timestamp, ";
    stringQuery += " update_id varchar(50) ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  invIndex () {
    let stringQuery = " create unique index idx_ivt_name on t_inventory(name) ";
    return stringQuery
  }
  
  invHostJoin () {
    let stringQuery = "";
    stringQuery += " create table t_Ivt_hst( ";
    stringQuery += " iid int Not Null, ";
    stringQuery += " hid int Not Null ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  hostTable () {
    let stringQuery = "";
    stringQuery += " create table t_hosts ( ";
    stringQuery += " hid	 serial     Not Null    primary key, ";
    stringQuery += " name 	varchar(255) Not Null    unique, ";
    stringQuery += " domain 	varchar(255), ";
    stringQuery += " content 	varchar(255), ";
    stringQuery += " os 	varchar(255), ";
    stringQuery += " os_detail 	varchar(255), ";
    stringQuery += " ip 	varchar(255), ";
    stringQuery += " datasource 	varchar(30), ";
    stringQuery += " datacenter 	varchar(255), ";
    stringQuery += " use_yn 	varchar(1) default 'Y', ";
    stringQuery += " create_dt 	timestamp default now(), ";
    stringQuery += " create_id 	varchar(50), ";
    stringQuery += " update_dt 	timestamp, ";
    stringQuery += " update_id 	varchar(50) ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  hostIndex () {
    let stringQuery = " create unique index idx_hst_name on t_hosts(name) ";
    return stringQuery
  }
  
  tempTable () {
    let stringQuery = "";
    stringQuery += " create table t_jobtemps ( ";
    stringQuery += " tid 	serial 	Not Null 	primary key, ";
    stringQuery += " name 	varchar(255) 	Not Null, ";
    stringQuery += " content 	varchar(255), ";
    stringQuery += " iid 	int 	Not Null, ";
    stringQuery += " iname 	varchar(255), ";
    stringQuery += " playbook 	varchar(255) 	Not Null, ";
    stringQuery += " forks 	int 	Not Null, ";
    stringQuery += " limits 	varchar(1024), ";
    stringQuery += " verb 	int, ";
    stringQuery += " variables 	text, ";
    stringQuery += " cname 	varchar(255), ";
    stringQuery += " use_yn  	varchar(1) default 'Y', ";
    stringQuery += " create_dt 	timestamp default now(), ";
    stringQuery += " create_id 	varchar	(50), ";
    stringQuery += " update_dt 	timestamp, ";
    stringQuery += " update_id 	varchar	(50) ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  jobTable () {
    let stringQuery = "";
    stringQuery += " create table t_jobs ( ";
    stringQuery += " jid 	serial 	Not Null 	primary key, ";
    stringQuery += " iid 	int 	Not Null, ";
    stringQuery += " iname 	varchar(255), ";
    stringQuery += " tid 	int 	Not Null, ";
    stringQuery += " tname 	varchar(255), ";
    stringQuery += " chk_temp	varchar(4) Not Null, ";
    stringQuery += " status 	varchar(1), ";
    stringQuery += " start_dt 	timestamp, ";
    stringQuery += " end_dt 	timestamp, ";
    // stringQuery += " forks	int	Not Null, ";
    // stringQuery += " verb	int, ";
    // stringQuery += " variables	text, ";
    // stringQuery += " limits 	varchar(1024) ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  jobEventTable () {
    let stringQuery = "";
    stringQuery += " create table t_jobevents ( ";
    stringQuery += " eid 	serial 	Not Null 	primary key, ";
    stringQuery += " jid 	int 	Not Null, ";
    stringQuery += " pid 	int 	Not Null, ";
    stringQuery += " chk_temp	varchar(4) Not Null, ";
    stringQuery += " create_dt 	timestamp 	Not Null, ";
    stringQuery += " stdout 	text ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  credTable () {
    let stringQuery = "";
    stringQuery += " create table t_credentials ( ";
    stringQuery += " name	varchar(255)	Not Null	primary key, ";
    stringQuery += " content varchar(255), ";
    stringQuery += " mid 	varchar(255), ";
    stringQuery += " mpw 	varchar(1024), ";
    stringQuery += " private_key 	text, ";
    stringQuery += " create_dt 	timestamp default now(), ";
    stringQuery += " create_id 	varchar(50), ";
    stringQuery += " update_dt 	timestamp, ";
    stringQuery += " update_id 	varchar(50) ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  adhocTable () {
    let stringQuery = "";
    stringQuery += " create table t_adhoc ( ";
    stringQuery += " tid 	serial 	Not Null 	primary key, ";
    stringQuery += " name 	varchar(255) 	Not Null, ";
    stringQuery += " content 	varchar(255), ";
    stringQuery += " iid 	int 	Not Null, ";
    stringQuery += " iname 	varchar(255), ";
    stringQuery += " module 	varchar(255) 	Not Null, ";
    stringQuery += " argument 	varchar(1024), ";
    stringQuery += " forks 	int 	Not Null, ";
    stringQuery += " limits 	varchar(1024), ";
    stringQuery += " verb 	int, ";
    stringQuery += " variables 	text, ";
    stringQuery += " cname 	varchar(255), ";
    stringQuery += " use_yn  	varchar(1) default 'Y', ";
    stringQuery += " create_dt 	timestamp default now(), ";
    stringQuery += " create_id 	varchar	(50), ";
    stringQuery += " update_dt 	timestamp, ";
    stringQuery += " update_id 	varchar	(50) ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  commonCodeTable () {
    let stringQuery = "";
    stringQuery += " create table t_codes ( ";
    stringQuery += " cid 	serial 	Not Null 	primary key, ";
    stringQuery += " cinv 	varchar(255) 	Not Null, ";
    stringQuery += " code_name 	varchar(255) Not Null, ";
    stringQuery += " create_dt 	timestamp default now(), ";
    stringQuery += " update_dt 	timestamp ";
    stringQuery += " ) ";
    return stringQuery
  }
  
  insertCommonCode () {
    let stringQuery = "";
    stringQuery += " INSERT INTO t_codes ( cinv, code_name ) ";
    stringQuery += " VALUES ( 'domain', ''), ";
    stringQuery += " ( 'domain', 'corp.doosan.com'), ";
    stringQuery += " ( 'os', 'Windows'), ";
    stringQuery += " ( 'os', 'Linux'), ";
    stringQuery += " ( 'os', 'VMware'), ";
    stringQuery += " ( 'module', 'command'), ";
    stringQuery += " ( 'module', 'shell'), ";
    stringQuery += " ( 'module', 'yum'), ";
    stringQuery += " ( 'module', 'apt'), ";
    stringQuery += " ( 'module', 'apt_key'), ";
    stringQuery += " ( 'module', 'apt_repository'), ";
    stringQuery += " ( 'module', 'apt_rpm'), ";
    stringQuery += " ( 'module', 'service'), ";
    stringQuery += " ( 'module', 'group'), ";
    stringQuery += " ( 'module', 'user'), ";
    stringQuery += " ( 'module', 'mount'), ";
    stringQuery += " ( 'module', 'ping'), ";
    stringQuery += " ( 'module', 'selinux'), ";
    stringQuery += " ( 'module', 'setup'), ";
    stringQuery += " ( 'module', 'win_ping'), ";
    stringQuery += " ( 'module', 'win_service'), ";
    stringQuery += " ( 'module', 'win_update'), ";
    stringQuery += " ( 'module', 'win_group'), ";
    stringQuery += " ( 'module', 'win_user') ";
    return stringQuery
  }
  
  triggerFunc () {
    let stringQuery = "";
    stringQuery += " CREATE OR REPLACE FUNCTION update_ivt_hst () ";
    stringQuery += "  RETURNS TRIGGER AS ";
    stringQuery += "   $$ ";
    stringQuery += "   BEGIN ";
    stringQuery += "       IF (TG_OP = 'DELETE') THEN ";
    stringQuery += "           UPDATE t_inventory SET ";
    stringQuery += "           total_hosts = total_hosts - 1 ";
    stringQuery += "           WHERE iid=OLD.iid; ";
    stringQuery += "           RETURN OLD; ";
    stringQuery += "       ELSIF (TG_OP = 'UPDATE') THEN ";
    stringQuery += "           RETURN NEW; ";
    stringQuery += "       ELSIF (TG_OP = 'INSERT') THEN ";
    stringQuery += "           UPDATE t_inventory SET ";
    stringQuery += "           total_hosts = total_hosts + 1 ";
    stringQuery += "           WHERE iid=NEW.iid; ";
    stringQuery += "           RETURN NEW; ";
    stringQuery += "       END IF; ";
    stringQuery += "   END; ";
    stringQuery += "   $$ LANGUAGE plpgsql; ";
    return stringQuery
  }
  
  trigger () {
    let stringQuery = "";
    stringQuery += " CREATE TRIGGER update_ivt_hst ";
    stringQuery += "    AFTER INSERT OR UPDATE OR DELETE ";
    stringQuery += "    ON public.t_ivt_hst ";
    stringQuery += "    FOR EACH ROW ";
    stringQuery += "    EXECUTE PROCEDURE public.update_ivt_hst(); ";
    return stringQuery
  }

}

const SQL = new sql()

module.exports = SQL;