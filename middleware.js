exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must logged in to make changes");
    return res.redirect("/login");
  }
  next();
};
