import { Context } from "koa"
import { compareSync } from "bcryptjs"
import User from "../models/user"

export const renderUpdate = async (ctx: Context) => {
  if (ctx.session!.user) {
    await ctx.render("update")
  } else {
    ctx.redirect("/")
  }
}

interface UpdateRequest {
  pass: string
  pass1: string
  pass2: string
}

export const update = async (ctx: Context) => {
  const { pass, pass1, pass2 } = ctx.request.body as UpdateRequest
  if (!pass || !pass1 || !pass2 || pass1 !== pass2) {
    ctx.throw(400, "Input error.")
  } else {
    const user = await User.findById(ctx.session!.user)
    const isIdentical = compareSync(pass, user!.password)
    if (isIdentical) {
      user!.changePassword(pass1)
      // empty session
      ctx.session = null
      ctx.body = "The password has been updated, please sign in again."
    } else {
      ctx.throw(400, "The old password is incorrect.")
    }
  }
}
