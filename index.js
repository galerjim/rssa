/////////////////////////////////////////////////////////
//
// index.js - This handles the network layer for the app
//
/////////////////////////////////////////////////////////

/**
 * Module dependencies.
 */
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});
const app = require('./server/app.js');
const http = require('http');

/**
 * Get log level from environment.
 */
logger.level = process.env.LOG_LEVEL || 'debug';
app.set('logger', logger);

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Cleanup before server shutdown
 */

process.on('exit', onClose);
process.on('SIGINT', onClose);
process.on('uncaughtException', onClose);

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
            logger.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use');
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
    logger.info('Listening on ' + bind);
}

/**
 * when server shuts down
 */

function onClose(err) {
    logger.error('Shutting down server with error = ' + err);
    process.exit();
}