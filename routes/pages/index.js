import Router from 'koa-router'

const route = new Router()

route.get('/', async (ctx, next) => {
  let data
  if (ctx.session.user) {
    data = {
      user: 'conan'
    }
  }
  await ctx.render('index', data)
})

route.get('/login', async (ctx, next) => {
  if (ctx.session.user) {
    ctx.redirect('/')
  } else {
    await ctx.render('login')
  }
})

route.post('/login', async (ctx, next) => {
  console.log(ctx.request.body)
  const { user, password } = ctx.request.body
  if (user !== 'conan') {
    ctx.body = 'user not exist'
  } else if (password !== '111') {
    ctx.body = 'password error'
  } else {
    ctx.session.user = '1'
    ctx.redirect('/')
  }
})

route.get('/logout', (ctx, next) => {
  ctx.session = null
  ctx.redirect('/')
})

route.get('/sign', (ctx, next) => {
  console.log(ctx.session)
  ctx.body = `<h1>${ctx.session.sign}</h1>`
})

export default route