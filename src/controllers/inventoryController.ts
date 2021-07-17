import pool from '../dbconfig/dbconnector';
import inventorySql from '../sql/inventorySql';

class inventoryController {

    constructor() {}

    public async get(req, res) {
        try {
            const client = await pool.connect();

            const sql = "SELECT * FROM t_inventory";
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

    public async getInventoryListByHost(req, res) {
        try {
            const vhid: number = req.query.hid;
            //? addslashes(req.query.inv) : "";
            const client = await pool.connect();
            const sql: string = inventorySql.getInventoryListByHost();
            const {
                rows
            } = await client.query(sql,[vhid]);
            const result = rows;
            client.release();
            res.send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    }

    public async checkNameDuplicate(req, res) {
        try {
            const viname: string = req.query.name;
            //? addslashes(req.query.inv) : "";
            const client = await pool.connect();
            const sql: string = inventorySql.checkNameDuplicate();    
            const {
                rows
            } = await client.query(sql,[viname]);
            const result = rows;
            client.release();
            res.send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    
}

export default inventoryController;