function isAuthorized(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}

function isNotAuthorized(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/");
}

module.exports = { isAuthorized, isNotAuthorized };
