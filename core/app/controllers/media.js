function listing() {
  return [
    (req, res, next) => {
      const { currentPage, pageSize, totalMedia } = req._params;

      let app = req.app;

      if (isNaN(currentPage)) {
        return res.redirect('/');
      }

      const totalPage = Math.ceil(totalMedia / pageSize);

      if (currentPage > totalPage || currentPage < 1) {
        return res.redirect('/');
      }

      let nextPage = 0;
      let prevPage = 0;

      if (currentPage === 1) {
        nextPage = currentPage + 1;
        prevPage = totalPage;
      } else if (currentPage === totalPage) {
        prevPage = currentPage - 1;
        nextPage = 1;
      } else {
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
      }

      res.locals.next = `/page/${nextPage}`;
      res.locals.prev = `/page/${prevPage}`;

      const aliases = [];
      const first = totalMedia - (currentPage - 1) * pageSize;
      const last = totalMedia - (currentPage) * pageSize + 1;

      for (let alias = first; alias > last; alias--) {
        aliases.push(alias);
      }

      app.parent.get('models').Media
        .find({
          alias: {
            $in: aliases
          }
        })
        .sort('-alias')
        .exec()
        .then(media => {
          res.locals.media = media;

          res.render('index');
        });
    }
  ];
}

function single() {
  return [
    (req, res, next) => {
      let { alias, totalMedia } = req._params;
      let { app } = req;

      let desiredAlias = alias % (totalMedia + 1);

      if (alias === 0) {
        return res.redirect('/' + totalMedia);
      } else if (desiredAlias === 0) {
        return res.redirect('/1');
      } else if (alias !== desiredAlias) {
        return res.redirect('/' + desiredAlias);
      }

      let cache = app.parent.get('shared').cache;

      if (cache[alias]) {
        res.locals.media = cache[alias];

        return next();
      }

      app.parent.get('models').Media
        .findOne({
          alias: alias
        })
        .lean()
        .then(media => {
          if (!media) {
            return res.redirect('/');
          }

          res.locals.media = cache[alias] = media;

          next();
        });
    },
    (req, res, next) => {
      let app = req.app;
      let count = app.parent.get('shared').mediaCount;
      let media = res.locals.media;

      let ratio = (media.height / media.width * 100) + '%';

      res.render('detail', {
        media: media,
        prev: '/' + (media.alias - 1),
        next: '/' + (media.alias + 1),
        mediaCount: count,
        ratio: ratio
      });
    }
  ];
}

module.exports = {
  listing,
  single
};
