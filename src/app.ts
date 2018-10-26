import { config } from "dotenv"
import * as Koa from "koa"
import * as bodyparser from "koa-bodyparser"
import * as session from "koa-generic-session"
import * as redis from "koa-redis"
import * as staticServe from "koa-static"
import * as views from "koa-views"
import * as path from "path"
import routes from "./routes"
import { errorHandler, successHandler } from "./utils/middlewares"

config()
import "./mongo"

const app = new Koa()

// cookie key
app.keys = ["koa"]
// redis session
app
  .use(session({
    store: redis({}),
  }))
  // parse the request body
  .use(bodyparser())
  // resolve static files
  .use(staticServe("assets"))
  // templates
  .use(views(path.resolve(process.cwd(), "views"), {
    extension: "hbs",
    map: {
      hbs: "handlebars",
    },
    options: {
      partials: {
        header: "partials/header",
        layout: "partials/layout",
      },
    },
  }))
  .use(errorHandler)
  .use(successHandler)

routes(app)

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))
