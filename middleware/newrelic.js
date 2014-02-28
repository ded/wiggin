module.exports = function (client) {
  return function (req, res, next) {
    var r = req.originalRoute
    client.setTransactionName(r.name)
    client.setControllerName(r.controller, r.action)
    next()
  }
}
