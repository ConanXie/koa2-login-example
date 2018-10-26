import * as Router from "koa-router"

import auth from "../../utils/auth"

const router = new Router()

// Controllers
import homeController from "./controllers/home"
import { login, renderLogin } from "./controllers/login"
import { active, renderSignup, signup } from "./controllers/signup"
import { renderUpdate, update } from "./controllers/update"
import { find, forgot, renderForgot, reset } from "./controllers/forgot"

router.get("/", homeController)

router.get("/login", renderLogin)

router.post("/login", login)

router.get("/signup", renderSignup)

router.post("/signup", signup)

router.get("/activation/:verify", active)

router.get("/logout", ctx => {
  ctx.session = null
  ctx.redirect("/")
})

router.get("/forgot", renderForgot)

router.post("/forgot", forgot)

router.get("/findpass/:verify", find)

router.post("/reset", reset)

router.get("/update", renderUpdate)

router.post("/update", auth, update)

export default router
