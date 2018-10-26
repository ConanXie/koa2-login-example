import * as Router from "koa-router"
import auth from "../../utils/auth"

const router = new Router({
  prefix: "/api",
})

const getLine = (id: string): Promise<object> => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      line: "真実はいつも一つ",
    })
  }, 500)
})

router.get("/line", auth, async ctx => {
  const data = await getLine(ctx.session!.user)
  ctx.body = data
})

export default router
