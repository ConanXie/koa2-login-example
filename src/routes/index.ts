import * as Koa from "koa"
import api from "./api"
import pages from "./pages"

export default (app: Koa) => {
  app
    .use(pages.routes())
    .use(pages.allowedMethods())
    .use(api.routes())
    .use(api.allowedMethods())
}
