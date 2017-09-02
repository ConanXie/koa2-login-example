import pages from './pages'
import api from './api'

export default app => {
  app.use(pages.routes())
  app.use(api.routes())
}
