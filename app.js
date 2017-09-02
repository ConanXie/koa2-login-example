import Koa from 'koa'
import koaRouter from 'koa-router'
import views from 'koa-views'
import serve from 'koa-static'
import bodyparser from 'koa-bodyparser'
import session from 'koa-generic-session'
import redis from 'koa-redis'

// the port for server
import { port } from './config'

const app = new Koa()
const router = koaRouter()

// cookie key
app.keys = ['koa']
// redis session
app.use(session({
  store: redis()
}))

// parse the request body
app.use(bodyparser())

// templates
app.use(views(__dirname + '/views', {
  map: {
    html: 'nunjucks'
  }
}))

app
  .use(router.routes())
  .use(router.allowedMethods())

import routes from './routes'
routes(app)

// static files path
app.use(serve('assets'))

// error handler
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.body = err.message
    ctx.status = err.status || 500
  }
  if (ctx.status !== 404) return
  ctx.status = 404
  // ctx.redirect('/404')
})

app.listen(port, () => console.log(`Listening on ${port}`))
