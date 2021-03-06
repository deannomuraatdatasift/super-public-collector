"use strict";
const	staticCache	= require('koa-static-cache'),
	koa			= require('koa.io'),
	bodyParser	= require('koa-bodyparser'),
	favicon		= require('koa-favicon'),
	router		= require('koa-router')(),
	index		= require('./routes/index'),
	path		= require('path');

// wire in the scheduler
require('./lib/schedule');

var app = koa();
app.use(bodyParser());
app.use(favicon());
app.use(staticCache(path.join(__dirname, 'public')));
app.use(index.routes());

// development error handler
router.get('*', function* pageNotFound(next) {
	this.status = 404;
	this.body = "404";
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(function *(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = err.message;
		this.app.emit('error', err, this);
	}
});

app.use(function *(next) {
  throw new Error('some error');
});

/**
 * Socket.io
 */
app.io.use(function* (next) {
	// on connect
	console.log('somebody connected');

	yield* next;

	// on disconnect
	console.log('somebody disconnected');
});

/**
 * router for socket event
 */
app.io.route('clientEvent', function* (next, data) {
	console.log("event from user.");
});

module.exports = app;
