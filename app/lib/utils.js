var template = require('lodash-template')

function parseJson(response) {
  return response.replace(/^]\)}while\(1\);<\/x>/, '')
}

function interpolateBraces(templateArg, context) {
  // interpolate variables that look like '%{name}'
  var templateSettings = { interpolate: /%\{(\w+)\}/ }
  return template(templateArg, (context || {}), templateSettings)
}


module.exports = {
  parseJson: parseJson,
  interpolateBraces: interpolateBraces
}
