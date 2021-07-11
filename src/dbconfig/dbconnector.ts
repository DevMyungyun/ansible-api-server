import { Pool } from 'pg';

const pool = new Pool ({
    max: 20,
    //connectionString: 'postgres://root:newPassword@localhost:port/dbname',
    connectionString: 'postgres://postgres:test1234@192.168.189.130:5432/automation',
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
});

export default pool;