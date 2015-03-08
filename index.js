/*!
 * locale
 * Copyright(c) 2015 Fangdun Cai
 * MIT Licensed
 */

'use strict';

/**
 * Module dependences.
 */

var delegate = require('delegates');

/**
 * Expose
 *
 * @param {Object} app
 * @param {String} key - locale key name.
 *
 * @returns {Object} app
 */

module.exports = function(app, key) {
  key = key || 'locale';
  var request = app.request;

  // From query, `locale=en`
  Object.defineProperty(request, 'getLocaleFromQuery', {
    value: function() {
      return this.query[key];
    }
  });

  // From query, `locale=en`
  Object.defineProperty(request, 'getLocaleFromSubdomain', {
    value: function() {
      return this.subdomains.pop();
    }
  });

  // From accept-language, `Accept-Language: zh-CN`
  Object.defineProperty(request, 'getLocaleFromHeader', {
    value: function() {
      var accept = this.acceptsLanguages() || '',
        reg = /(^|,\s*)([a-z-]+)/gi,
        match, locale;
      while ((match = reg.exec(accept))) {
        if (!locale) {
          locale = match[2];
        }
      }
      return locale;
    }
  });

  // From cookie, `locale=zh-CN`
  Object.defineProperty(request, 'getLocaleFromCookie', {
    value: function() {
      return this.ctx.cookies.get(key);
    }
  });

  // From URL, `http://koajs.com/en`
  Object.defineProperty(request, 'getLocaleFromUrl', {
    value: function() {
      var segments = this.path.substring(1).split('/');
      return segments.shift();
    }
  });

  // From The Latest Domain, `http://koajs.com`, `http://kojs.cn`
  Object.defineProperty(request, 'getLocaleFromTLD', {
    value: function() {
      return this.hostname.split('.').pop();
    }
  });

  /**
   * Delegate to this.ctx.
   */

  delegate(app.context, 'request')
    .method('getLocaleFromQuery')
    .method('getLocaleFromSubdomain')
    .method('getLocaleFromHeader')
    .method('getLocaleFromCookie')
    .method('getLocaleFromUrl')
    .method('getLocaleFromTLD');

  return app;
};