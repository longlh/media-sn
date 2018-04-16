import sm from 'sitemap'

import config from 'infrastructure/config'
import Media from 'models/media'

const ttl = config.sitemap.ttl || (600 * 1e3)
const cache = {
  time: 0,
  value: null
}

export function generate() {
  return [
    (req, res, next) => {
      const now = Date.now()

      if (cache.time + ttl > now) {
        res.header('Content-Type', 'application/xml')
        res.send(cache.value)

        return
      }

      next()
    },

    (req, res, next) => {
      const urls = [
        { url: '/', changefreq: 'daily', priority: 0.5 }
      ]

      Media.find({ deleted: { $ne: true } })
        .select('hash path')
        .cursor()
        .on('data', m => {
          urls.push({
            url: `/m/${m.hash}`,
            img: m.path,
            changefreq: 'monthly',
            priority: 0.5
          })
        })
        .on('close', () => {
          const sitemap = sm.createSitemap({
            hostname: config.url,
            cacheTime: ttl,
            urls: urls
          })

          cache.time = Date.now()
          cache.value = sitemap.toString()

          res.header('Content-Type', 'application/xml')
          res.send(cache.value)
        })
    }
  ]
}
