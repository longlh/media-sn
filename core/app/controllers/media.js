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

      let Indexing = app.parent.get('workers').Indexing
      let Media = app.parent.get('models').Media
      let cache = app.parent.get('shared').cache

      Indexing
        .pagination(currentPage, pageSize)
        .then(hashes => {
          const cachedMedia = []
          const missedHashes = []

          hashes.forEach(hash => {
            let media = cache[hash]

            if (media) {
              cachedMedia.push(media)
            } else {
              missedHashes.push(hash)
            }
          })

          if (missedHashes.length === 0) {
            res.locals.media = cachedMedia

            return next()
          }

          Media
            .find({
              hash: { $in: missedHashes }
            })
            .lean()
            .then(media => {
              const list = cachedMedia.concat(media)
                .sort((prev, next) => next.alias - prev.alias)

              // put to cache
              list.forEach(media => cache[media.hash] = media)

              res.locals.media = list

              next();
            })
        })
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
      let { alias, totalMedia } = req._params
      let { app } = req

      let desiredAlias = alias % (totalMedia + 1);

      let Indexing = app.parent.get('workers').Indexing

      return Indexing
        .pick(desiredAlias - 1)
        .then(hash => {
          res.redirect(`/m/${hash}`)
        })
    }
  ]
}

function single() {
  return [
    (req, res, next) => {
      let { hash, totalMedia } = req._params
      let { app } = req

      let cache = app.parent.get('shared').cache

      if (cache[hash]) {
        res.locals.media = cache[hash]

        return next()
      }

      app.parent.get('models').Media
        .findOne({ hash: hash })
        .lean()
        .then(media => {
          if (!media) {
            return res.redirect('/');
          }

          res.locals.media = cache[hash] = media;

          next();
        });
    },
    (req, res, next) => {
      let { media } = res.locals
      let { app } = req

      let Indexing = app.parent.get('workers').Indexing

      Indexing
        .siblings(media.hash)
        .then(result => {
          res.render('media', {
            prev: `/m/${result.prev}`,
            next: `/m/${result.next}`
          })
        })
    }
  ];
}

module.exports = {
  listing,
  single,
  legacySingle
};
