//////////////////////////////////////
//
// app.js - Express App for the study
//
//////////////////////////////////////

/**
 * Module dependencies.
 */
const logger = require('../logger.js')(module);
const express = require('express');
const path = require('path');
const httpLogger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const monk = require('monk');
const useragent = require('express-useragent');

const router = require('./routes/router.js');

// start the express app
const app = express();

// if development environment (default), get the ENV variables
if (app.get('env') === 'development') env = require('../env.js');

// connect to database
const db = monk(process.env.MONGOLAB_URL);
db.then(() => {
	logger.info('Connected to MongoDB');
	app.db = db;
}).catch(() => {
	app.db = null;
	logger.error('Unable to connect to MongoDB');
});

// settings
const encryptionPassword = process.env.ENCRYPTION_PASSWORD;
app.set("ENCRYPTION_PASSWORD", encryptionPassword);
const hashSalt = process.env.HASH_SALT;
app.set("HASH_SALT", hashSalt);
const recommendationServer = process.env.RECOMMENDATION_SERVER;
app.set("RECOMMENDATION_SERVER", recommendationServer);

// iew engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client'));

app.use(httpLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());

// Prevent resource caching 
app.use(express.static(path.join(__dirname, '../client'), {
	etag: false,
	maxAge: 0,
	setHeaders: function(res, path) {
		res.setHeader('Cache-Control', 'no-cache, no-store');
	}
}));
app.use(useragent.express());

// Make our db and settings accessible to our routes
app.use(function(req, res, next) {
	req.db = db;
	req.settings = {}
	req.settings.encryptionPassword = encryptionPassword;
	req.settings.hashSalt = hashSalt;
	req.settings.recommendationServer = recommendationServer;
	next();
});

// Enable CORS
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use('/', router);

// error handler
app.use(function(err, req, res, next) {
	logger.error("Express Error :: " + err.message);
	logger.info(err.stack);
});

module.exports = app;