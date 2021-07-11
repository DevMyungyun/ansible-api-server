import pool from '../dbconfig/dbconnector';
import indexService from '../service/indexService';
import indexQuery from '../sql/indexSql';

class indexController implements indexService{

    constructor() {}

    public async get(req, res) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM t_hosts";
            const { rows } = await client.query(sql);
            const todos = rows;

            client.release();

            res.send(todos);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default indexController;