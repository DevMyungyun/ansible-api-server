import pool from '../dbconfig/dbconnector';
import hostSql from '../sql/hostSql';

class hostController {

    constructor() {}

    public async get(req, res) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM t_hosts";
            const {
                rows
            } = await client.query(sql);
            const todos = rows;

            client.release();

            res.send(todos);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async checkNameDuplicate(req, res) {
        try {
            const vhname: string = req.query.name;
            //? addslashes(req.query.inv) : "";
            const client = await pool.connect();
            const sql: string = hostSql.checkNameDuplicate();    
            const {
                rows
            } = await client.query(sql,[vhname]);
            const result = rows;
            client.release();
            res.send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    
}

export default hostController;