import pool from '../dbconfig/dbconnector';
import credentialSql from '../sql/credentialSql';

class credentialController {

    constructor() {}

    public async get(req, res) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM t_crednetial";
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
            const vcname: string = req.query.name;
            //? addslashes(req.query.inv) : "";
            const client = await pool.connect();
            const sql: string = credentialSql.checkNameDuplicate();    
            const {
                rows
            } = await client.query(sql,[vcname]);
            const result = rows;
            client.release();
            res.send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    
}

export default credentialController;