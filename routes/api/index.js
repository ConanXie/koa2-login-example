import Router from 'koa-router'

const route = new Router({
  prefix: '/api'
})

const getInfo = (id) => {
  let data
  switch (id) {
    case '1':
      data = {
        name: '江户川柯南',
        age: 7,
        favorite: ['足球']
      }
      break
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, 1500)
  })
}

route.get('/userInfo', async (ctx, next) => {
  console.log(ctx.session)
  const data = await getInfo(ctx.session.user)
  ctx.body = data
})

export default route