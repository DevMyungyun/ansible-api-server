import express, { Application, Router } from 'express';
import bodyParser from 'body-parser';
import pool from './dbconfig/dbconnector';

import indexRouter from './routers/indexRouter';
import inventoryRouter from './routers/inventoryRouter';
import hostRouter from './routers/hostRouter';
import credentialRouter from './routers/credentialRouter';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    }

    private dbConnect() {
        pool.connect(function (err, client, done) {
            if (err) throw new Error(err);
            console.log('DB Connected');
          }); 
    }

    private routerConfig() {
        this.app.use('/', indexRouter);
        this.app.use('/inventory', inventoryRouter);
        this.app.use('/host', hostRouter);
        this.app.use('/credential', credentialRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;