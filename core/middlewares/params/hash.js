module.exports = (req, res, next) => {
  let { hash } = req.params;

  req._params.hash = hash;

  next();
};
