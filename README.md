# koa-locale [![Build Status](https://travis-ci.org/fundon/koa-locale.svg)](https://travis-ci.org/fundon/koa-locale)

Get locale variable from query, subdomain, accept-languages or cookie for koa.

### Installation

```
npm install koa-locale
```

### Usage

```js
var app = require('koa')();
var locale = require('koa-locale');

locale(app, {
  // the `lang-key` defaults to `lang`
  lang: 'language'
});

app.use(function *(next) {
  // query: '?language=en'
  this.body = this.getLocaleFromQuery();
});
```

### API

#### ctx.getLocaleFromQuery(), ctx.request.getLocaleFromQuery()

#### ctx.getLocaleFromSubdomain(), ctx.request.getLocaleFromSubdomain()

#### ctx.getLocaleFromHeader(), ctx.request.getLocaleFromHeader()

#### ctx.getLocaleFromCookie(), ctx.request.getLocaleFromCookie()


### License

MIT
