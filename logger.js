/////////////////////////////////////////////////////////
//
// logger.js - Logger (Winston) Wrapper
//
/////////////////////////////////////////////////////////

/**
 * Module dependencies.
 */
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

module.exports = function(module) {
	return createLogger({
		level: process.env.LOG_LEVEL || 'debug',
		transports: [
            new transports.Console()
        ],
		format: combine(
			label({ label: module.filename }),
			timestamp(),
			printf(info => {
				return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
			})
		),
	});
}