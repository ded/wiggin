provide('client/lib/utils', {
  htmlEscape: function (html) {
    return String(html)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }
, queryParams: function () {
    return require('qs').parse(window.location.search.replace('?', ''))
  }
})
