//////////////////////////////////////
//
// app.js - Express App for the study
//
//////////////////////////////////////

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const monk = require('monk');
const useragent = require('express-useragent');
const app = express();

if (app.get('env') === 'development') env = require('../env.js');

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../client'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client'), {
    etag: false,
    maxAge: 0,
    setHeaders: function(res, path) {
        res.setHeader('Cache-Control', 'no-cache, no-store');
    }
}));
app.use(useragent.express());

app.use(ignoreFavicon);
//ignore favicon 
function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({
            nope: true
        });
    } else {
        next();
    }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

module.exports = app;