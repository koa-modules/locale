'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var http = require('http');
var request = require('supertest');
var koa = require('koa');
var compose = require('koa-compose');
var locale = require('..');

describe('koa-locale', function() {

  describe('getLocaleFromQuery()', function() {
    it('should get a locale from query', function(done) {
      var app = koa();

      locale(app);

      app.use(function*(next) {
        this.body = this.getLocaleFromQuery();
      });

      request(app.listen())
        .get('/?locale=zh-CN')
        .expect(/zh-CN/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromSubdomain()', function() {
    var app = koa();

    locale(app);

    var enApp = koa();
    enApp.use(function*() {
      this.body = this.getLocaleFromSubdomain();
    });
    enApp = compose(enApp);

    var zhCNApp = koa();
    zhCNApp.use(function*() {
      this.body = this.getLocaleFromSubdomain();
    });
    zhCNApp = compose(zhCNApp);

    app.use(function*(next) {
      switch (this.host) {
        case 'en.koajs.com':
          return yield enApp.call(this, next);
        case 'zh-CN.koajs.com':
          return yield zhCNApp.call(this, next);
      }
      yield next;
    });

    app.use(function*(next) {
      this.body = this.getLocaleFromSubdomain();
    });

    it('should be return `en` ', function(done) {
      request(app.listen())
        .get('/')
        .set('Host', 'en.koajs.com')
        .expect(/en/)
        .expect(200, done);
    });

    it('should be return `zh-CN` ', function(done) {
      request(app.listen())
        .get('/')
        .set('Host', 'zh-CN.koajs.com')
        .expect(/zh-cn/i)
        .expect(200, done);
    });

    it('should be `127` ', function(done) {
      request(app.listen())
        .get('/')
        .expect(/127/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromHeader()', function() {
    it('should get a locale from the `Accept-Language` of header', function(done) {
      var app = koa();

      locale(app);

      app.use(function*(next) {
        this.body = this.getLocaleFromHeader();
      });

      request(app.listen())
        .get('/')
        .set('Accept-Language', 'zh-TW')
        .expect(/zh-TW/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromCookie()', function() {
    it('should get a locale from cookie', function(done) {
      var app = koa();

      locale(app, 'lang');

      app.use(function*(next) {
        this.body = this.getLocaleFromCookie();
      });

      request(app.listen())
        .get('/')
        .set('Cookie', 'lang=en')
        .expect(/en/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromUrl()', function() {
    it('should get a locale from URL', function(done) {
      var app = koa();

      locale(app);

      app.use(function*(next) {
        this.body = this.getLocaleFromUrl();
      });

      request(app.listen())
        .get('/en')
        .expect(/en/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromTLD()', function() {
    it('should get a locale from the last domain', function(done) {
      var app = koa();

      locale(app);

      app.use(function*(next) {
        this.body = this.getLocaleFromTLD();
      });

      app = http.createServer(app.callback());
      app.listen()

      request('http://koajs.cn:' + app.address().port)
        .get('/')
        .expect(/cn/)
        .expect(200, done);
    });
  });
});