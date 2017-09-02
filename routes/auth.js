export default async (ctx, next) => {
  if (ctx.session.user) {
    await next()
  } else {
    ctx.throw(403, 'You are not authorized.')
  }
}
