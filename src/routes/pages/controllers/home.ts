import { Context } from "koa"
import User, { UserDocument } from "../models/user"

interface Data {
  name?: string
  email?: string
}

export default async (ctx: Context) => {
  const data: Data = {}
  const { user } = ctx.session!
  if (user) {
    // user info
    const result = await User.findById(user) as UserDocument
    if (result) {
      data.name = result.name
      data.email = result.email
    }
  }
  await ctx.render("index", data)
}
