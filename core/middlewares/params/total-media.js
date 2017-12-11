module.exports = (req, res, next) => {
  req._params.totalMedia = req.app.parent.get('shared').mediaCount;

  next();
};
