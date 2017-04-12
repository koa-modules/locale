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

describe('koa-locale', () => {

  describe('getLocaleFromQuery()', () => {
    it('should get a locale from query', done => {
      var app = new koa();

      locale(app);

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromQuery();
      });

      request(app.listen())
        .get('/?locale=zh-CN')
        .expect(/zh-CN/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromSubdomain()', () => {
    var app = new koa();

    locale(app);

    var enApp = new koa();
    enApp.use(ctx => {
      ctx.body = ctx.getLocaleFromSubdomain();
    });
    enApp = compose(enApp.middleware);

    var zhCNApp = new koa();
    zhCNApp.use(ctx => {
      ctx.body = ctx.getLocaleFromSubdomain();
    });
    zhCNApp = compose(zhCNApp.middleware);

    app.use((ctx, next) => {
      switch (ctx.host) {
        case 'en.koajs.com':
          return enApp(ctx, next);
        case 'zh-CN.koajs.com':
          return zhCNApp(ctx, next);
      }
      return next();
    });

    app.use(ctx => {
      ctx.body = ctx.getLocaleFromSubdomain() || '';
    });

    it('should be return `en` ', done => {
      request(app.listen())
        .get('/')
        .set('Host', 'en.koajs.com')
        .expect(/en/)
        .expect(200, done);
    });

    it('should be return `zh-CN` ', done => {
      request(app.listen())
        .get('/')
        .set('Host', 'zh-CN.koajs.com')
        .expect(/zh-cn/i)
        .expect(200, done);
    });

    it('should be empty string', done => {
      request(app.listen())
        .get('/')
        .expect('')
        .expect(200, done);
    });
  });

  describe('getLocaleFromHeader()', () => {
    it('should get a locale from the `Accept-Language` of header', done => {
      var app = new koa();

      locale(app);

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromHeader();
      });

      request(app.listen())
        .get('/')
        .set('Accept-Language', 'zh-TW')
        .expect(/zh-TW/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromHeader()', () => {
    it('should get multi locales from the `Accept-Language` of header', done => {
      var app = new koa();

      locale(app);

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromHeader(true).join(',');
      });

      request(app.listen())
        .get('/')
        .set('Accept-Language', 'en,en-US;q=0.8')
        .expect(/en,en-US/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromCookie()', () => {
    it('should get a locale from cookie', done => {
      var app = new koa();

      locale(app, 'lang');

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromCookie();
      });

      request(app.listen())
        .get('/')
        .set('Cookie', 'lang=en')
        .expect(/en/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromUrl()', () => {
    it('should get a locale from URL', done => {
      var app = new koa();

      locale(app);

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromUrl();
      });

      request(app.listen())
        .get('/en')
        .expect(/en/)
        .expect(200, done);
    });

    it('should get a locale from URL with given `options.offset`', done => {
      var app = new koa();

      locale(app);

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromUrl({
          offset: 2
        });
      });

      request(app.listen())
        .get('/foo/bar/en')
        .expect(/en/)
        .expect(200, done);
    });
  });

  describe('getLocaleFromTLD()', () => {
    var app;
    beforeEach(function() {
      app = new koa();

      locale(app);

      app.use(ctx => {
        ctx.body = ctx.getLocaleFromTLD();
      });

      app = http.createServer(app.callback());
      app.listen();
    });

    // You should change `/etc/hosts`.
    it('should get `cn` locale from the last domain', done => {
      request('http://koajs.cn:' + app.address().port)
        .get('/')
        .expect(/cn/)
        .expect(200, done);
    });

    it('should get `io` locale from the last domain', done => {
      request('http://koajs.io:' + app.address().port)
        .get('/')
        .expect(/io/)
        .expect(200, done);
    });
  });
});
