/**
* Populate res.locals with data commonly used in views
*/
module.exports = function (req, res, next) {
  res.locals['_csrf_token'] = req.csrfToken()
  next()
}
