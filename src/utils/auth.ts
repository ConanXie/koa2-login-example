import { Context } from "koa"

export default async (ctx: Context, next: () => void) => {
  if (!ctx.session || !ctx.session.user) {
    ctx.throw(403, "You are not authorized.")
  }
  await next()
}
