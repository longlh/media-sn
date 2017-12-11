module.exports = (req, res, next) => {
  let { page } = req.params;

  req._params.currentPage = parseInt(page, 10);

  next();
};
