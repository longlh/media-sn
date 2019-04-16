export default async (server) => {
  server.get('/', (req, res, next) => {
    res.render('pages/list/view.ect')
  })
}
