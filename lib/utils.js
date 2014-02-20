module.exports.parse = function (response) {
  return response.replace(/^]\)}while\(1\);<\/x>/, '')
}

module.exports.interpolate = function (s, o) {
  return s.replace(/%\{([^}]+)}/g, function (m, key) {
    return o[key] || ''
  })
}
