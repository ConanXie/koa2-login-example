import Router from 'koa-router'
import auth from '../auth'

const router = new Router({
  prefix: '/api'
})

const getLine = id => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        line: '真実はいつも一つ'
      })
    }, 500)
  })
}

router.get('/line', auth, async (ctx, next) => {
  const data = await getLine(ctx.session.user)
  ctx.body = data
})

export default router
