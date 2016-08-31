import Router from 'koa-router'

const route = new Router()

// database model
import userModel from '../../model/user'

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
  const login = (user, pw) => {
    return new Promise((resolve, reject) => {
      userModel.findOne({ name: user }, (err, user) => {
        if (err) {
          reject(err)
        } else {
          if (user) {
            if (user.password === pw) {
              resolve({ code: 0, msg: 'success', id: user._id })
            } else {
              resolve({ code: 102, msg: 'password error' })
            }
          } else {
            resolve({ code: 101, msg: 'user not exist' })
          }
        }
      })
    })
  }
  let data
  try {
    data = await login(user, password)
  } catch (e) {
    throw e
  }
  if (!data.code) {
    ctx.session.user = data.id
    ctx.redirect('/')
  } else {
    ctx.body = data.msg
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