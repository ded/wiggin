provide('client/lib/request', function () {
  var utils = require('app/lib/utils')
    , request = require('reqwest')

  $.ajaxSetup({
    /**
     * filters incoming JSON for all `type:json` requests
     * stripping off xss prefix
     */
    dataFilter: function (response, type) {
      if (type == 'json') {
        var resp = utils.parse(response)

        // for empty responses
        if (resp.match(/^\s*$/)) resp = '{}'

        return resp
      }

      return response
    }
  })
  return {
    send: function (options) {
      if (options.method !== 'get') {
        options.headers = options.headers || {}
        options.headers['x-csrf-token'] = window['_csrf_token']
      }
      var req = request(options)
      return req
    }
  }
}())
