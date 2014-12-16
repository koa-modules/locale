'use strict';

/**
 *  Module dependences.
 */

var delegate = require('delegates');

/**
 *  Expose
 *
 *  @param {Object} app
 *  @param {Object} opts 
 *    - lang {String} language key name.
 *
 *  @return {Object} app
 */

module.exports = function (app, opts) {
  var context = app.context;
  var request = app.request;

  opts = opts || {};
  var langKey = opts.lang || 'lang';

  // From query, `lang=en`
  request.getLocaleFromQuery = function () {
    return this.query[langKey];
  };

  // From subdomain, `en.koajs.com`
  request.getLocaleFromSubdomain = function () {
    return this.subdomains.pop();
  };

  // From accept-language, `Accept-Language: zh-CN`
  request.getLocaleFromHeader = function () {
    var accept = this.acceptsLanguages() || '',
      reg = /(^|,\s*)([a-z-]+)/gi,
      match, locale;
    while ((match = reg.exec(accept))) {
      if (!locale) {
        locale = match[2];
      }
    }
    return locale;
  };

  // From cookie, `lang=zh-CN`
  request.getLocaleFromCookie = function () {
    return this.ctx.cookies.get(langKey);
  };

  // From URL, `http://koajs.com/en`
  request.getLocaleFromUrl = function () {
    var segments = this.path.substring(1).split('/');
    return segments.shift();
  };

  /**
   *  Delegate to this.ctx.
   */

  delegate(context, 'request')
    .method('getLocaleFromQuery')
    .method('getLocaleFromSubdomain')
    .method('getLocaleFromHeader')
    .method('getLocaleFromCookie')
    .method('getLocaleFromUrl');

  return app;
};
