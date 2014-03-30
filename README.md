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

```
  /?lang=en-US
```

#### ctx.getLocaleFromSubdomain(), ctx.request.getLocaleFromSubdomain()

```
  zh-CN.koajs.com
```

#### ctx.getLocaleFromHeader(), ctx.request.getLocaleFromHeader()

```
  Accept-Language: zh-CN,zh;q=0.5
```

#### ctx.getLocaleFromCookie(), ctx.request.getLocaleFromCookie()

```
  Cookie: lang=zh-TW
```


### License

MIT
