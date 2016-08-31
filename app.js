import Koa from 'koa'
import koaRouter from 'koa-router'
import views from 'koa-views'
import serve from 'koa-static'
import bodyparser from 'koa-bodyparser'
import session from 'koa-generic-session'
import redisStore from 'koa-redis'
import convert from 'koa-convert'

const app = new Koa()
const router = koaRouter()
// session
app.keys = ['my-secret']
// redis session
app.use(convert(session({
  store: redisStore()
})))
// bodyparser
app.use(bodyparser())
// views
app.use(views(__dirname + '/views', {
  map: {
    html: 'nunjucks'
  }
}))
// routes
import routes from './routes'
routes(app)

// static
app.use(serve('static'))

// mongodb
import './model/config'

app.listen(3010, () => {
  console.log(`Listening on 3010`)
})
