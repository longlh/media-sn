module.exports = (req, res, next) => {
  req._params.pageSize = req.app.parent.get('config').pageSize;

  next();
};
