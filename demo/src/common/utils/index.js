/**
 * 获取地址栏参数值
 * @param name
 * @returns {null}
 * @constructor
 */
var config = require('../../../config')
export function GetQueryString (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  var s = window.location.search
  var href = window.location.href
  var index = href.indexOf('?')
  if (s === '') {
    r = href.substr(index + 1).match(reg)
  }
  if (r != null) return unescape(r[2])
  return null
}

export function GetServerBase () {
  return GetEvn() ? config.build : config.dev
}

export function GetEvn () {
  return process.env.NODE_ENV === 'production'
}
