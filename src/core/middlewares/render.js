export default (view) => (req, res) => {
  res.render(view.endsWith('/view.ect') ?
    view : `${view}/view.ect`
  )
}
