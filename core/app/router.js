import params from 'middlewares/params'

import { list as listMedia } from './controllers/media'

export default app => {
  app.get('/',
    params({ currentPage: 1, tag: 'all' }, 'page-size', 'total-media'),
    listMedia()
  )

  app.get('/page/:page([0-9]+)',
    params({ tag: 'all' }, 'current-page', 'page-size', 'total-media'),
    listMedia()
  )

  app.get('/tags/:tag',
    params({ currentPage: 1 }, 'page-size', 'total-media', 'tag'),
    listMedia()
  )

  app.get('/tags/:tag/page/:page([0-9]+)',
    params({}, 'current-page', 'page-size', 'total-media', 'tag'),
    listMedia()
  )

  return app
}
