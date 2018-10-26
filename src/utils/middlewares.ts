import { Context as KoaContext } from "koa"

interface Context extends KoaContext {
  code?: number
}

export async function errorHandler(ctx: Context, next: () => void) {
  try {
    await next()
  } catch (err) {
    // console.error(err)
    ctx.body = {
      code: err.code || -1,
      message: err.message || "SOMETHING_HAS_GONE_WRONG",
    }
    ctx.status = err.status || 500
  }
  // if (ctx.status !== 404) return
  // await ctx.render()
}

export async function successHandler(ctx: Context, next: () => void) {
  await next()
  // console.log(ctx.type)
  if (ctx.status >= 200 && ctx.status < 400 && ctx.type === "application/json") {
    ctx.body = {
      code: 0,
      data: ctx.body,
      message: "success",
    }
  }
}
