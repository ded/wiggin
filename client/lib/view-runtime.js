/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */
provide('client/lib/view-runtime', function () {
  var exports = {}

  /**
   * Merge two attribute objects giving precedence
   * to values in object `b`. Classes are special-cased
   * allowing for arrays and merging/joining appropriately
   * resulting in a string.
   *
   * @param {Object} a
   * @param {Object} b
   * @return {Object} a
   * @api private
   */
  exports.merge = function merge(a, b) {
    var ac = a['class']
      , bc = b['class']
      , key

    if (ac || bc) {
      ac = ac || []
      bc = bc || []
      if (!Array.isArray(ac)) ac = [ac]
      if (!Array.isArray(bc)) bc = [bc]
      a['class'] = ac.concat(bc).filter(nulls)
    }

    for (key in b) {
      if (key != 'class') {
        a[key] = b[key]
      }
    }

    return a
  }

  /**
   * Filter null `val`s.
   *
   * @param {*} val
   * @return {Boolean}
   * @api private
   */
  function nulls(val) {
    return val != null && val !== ''
  }

  /**
   * join array as classes.
   *
   * @param {*} val
   * @return {String}
   * @api private
   */
  function joinClasses(val) {
    return Array.isArray(val) ? val.map(joinClasses).filter(nulls).join(' ') : val
  }

  /**
   * Render the given attributes object.
   *
   * @param {Object} obj
   * @param {Object} escaped
   * @return {String}
   * @api private
   */
  exports.attrs = function attrs(obj, escaped) {
    var buf = []
      , terse = obj.terse
      , keys
      , len
      , i
      , key
      , val

    delete obj.terse
    keys = Object.keys(obj)
    len = keys.length

    if (len) {
      buf.push('')
      for (i = 0; i < len; ++i) {
        key = keys[i]
        val = obj[key]

        if ('boolean' == typeof val || null == val) {
          if (val) {
            terse
              ? buf.push(key)
              : buf.push(key + '="' + key + '"')
          }
        } else if (0 === key.indexOf('data') && 'string' != typeof val) {
          buf.push(key + '=\'' + JSON.stringify(val) + '\'')
        } else if ('class' == key) {
          if (escaped && escaped[key]) {
            if (val = exports.escape(joinClasses(val))) {
              buf.push(key + '="' + val + '"')
            }
          } else {
            if (val = joinClasses(val)) {
              buf.push(key + '="' + val + '"')
            }
          }
        } else if (escaped && escaped[key]) {
          buf.push(key + '="' + exports.escape(val) + '"')
        } else {
          buf.push(key + '="' + val + '"')
        }
      }
    }

    return buf.join(' ')
  }

  /**
   * Escape the given string of `html`.
   *
   * @param {String} html
   * @return {String}
   * @api private
   */
  exports.escape = function escape(html) {
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }

  exports.rethrow = function rethrow() {}

  return this.jade = exports

}());
