#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('ansibletest:server');
var http = require('http');
var conf = require('../config.js');
var exec = require('child_process').exec;

/**
 * Module CLI Setting
 */
var program = require('yargs');

program
    .locale('en')
    .usage('$0 <cmd> [args]')

    .command('start', 'Start serving Automation API', function(cmd) {
        return cmd

    }, (argv) => {
        console.log('Automation is listening on the port ' + argv);
        console.log(argv);

    })
    .command('stop', 'Automation is stopped', function(cmd) {
        return cmd
    }, () => {
        searchPS();
        console.log('Automation stop');
    })
    .command('status', 'Automation current status is ', function(cmd) {
        return cmd
    }, () => {

    })
    .option('v', {
        alias: 'verbose',
        boolean: true,
        describe: 'Increase Automation command line verbosity'
    })
    .showHelpOnFail(true, 'Specify --help for available options')
    .help('help')
    .alias('h', 'help')
    .epilog('Copyright 2018 ITMSG All rights reserved')
    .argv

function searchPS() {
    var ps = exec('ps -axj | grep automation', function(error, stdout, stderr) {
        var resultArray = [];
        var extractedValue = [];
        resultArray = stdout.split(' ');
        resultArray.forEach(function(item){
            if(item !== '') {
                extractedValue.push(item);
            }
        });

        console.log(extractedValue);
        if(extractedValue[6] === 'Sl+') {
            var killPS = exec('kill -9 '+extractedValue[1], function(kerror, kstdout, kstderr) {
                console.log('stdout : ' + kstdout);
                console.log('stderr : ' + kstderr);
                if( kerror !== null) {
                    console.log('exec error: ' + kerror);
                }
            })
        }
        console.log('stdout : ' + stdout);
        console.log('stderr : ' + stderr);
        if( error !== null) {
            console.log('exec error: ' + error);
        }
    });
}

/**
 * Get port from environment and store in Express.
 */

// var port = normalizePort(process.env.PORT || '3000');
var port = normalizePort(conf.webport || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}
