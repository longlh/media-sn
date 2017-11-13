function listing() {
  return [
    (req, res, next) => {
      const { currentPage, pageSize, totalMedia } = req._params;
      const { app } = req;

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

      for (let alias = first; alias >= last; alias--) {
        aliases.push(alias);
      }

      // handle cache
      const cachedMedia = [];
      const missingAliases = [];
      let cache = app.parent.get('shared').cache;

      aliases.forEach(alias => {
        let media = cache[alias];

        if (media) {
          cachedMedia.push(media);
        } else {
          missingAliases.push(alias);
        }
      });

      if (missingAliases.length === 0) {
        // all in cache
        res.locals.media = cachedMedia;

        return next();
      }

      app.parent.get('models').Media
        .find({
          alias: {
            $in: missingAliases
          }
        })
        .lean()
        .then(media => {
          const list = cachedMedia.concat(media)
            .sort((prev, next) => next.alias - prev.alias);

          list.forEach(media => {
            cache[media.alias] = media;
          })

          res.locals.media = list;

          next();
        });
    },
    (req, res, next) => {
      const { currentPage } = req._params;

      res.render('list', {
        page: currentPage
      });
    }
  ];
}

function legacySingle() {
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
      let { media } = res.locals;

      res.redirect(`/m/${media.hash}`)

      // res.render('media', {
      //   prev: `/${media.alias - 1}`,
      //   next: `/${media.alias + 1}`
      // });
    }
  ];
}

function single() {
  return [
    (req, res, next) => {
      let { hash, totalMedia } = req._params;
      let { app } = req;

      app.parent.get('models').Media
        .findOne({
          hash: hash
        })
        .lean()
        .then(media => {
          if (!media) {
            return res.redirect('/');
          }

          let alias = media.alias

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

          res.locals.media = cache[alias] = media;

          next();
        });
    },
    (req, res, next) => {
      let { media } = res.locals;

      res.render('media', {
        prev: `/${media.alias - 1}`,
        next: `/${media.alias + 1}`
      });
    }
  ];
}

module.exports = {
  listing,
  single,
  legacySingle
};
