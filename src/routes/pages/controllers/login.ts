import { Context } from "koa"
import { compareSync } from "bcryptjs"

import User, { UserDocument } from "../models/user"

interface LoginRequest {
  email: string
  password: string
}

export const renderLogin = async (ctx: Context) => {
  if (ctx.session!.user) {
    ctx.redirect("/")
  } else {
    await ctx.render("login")
  }
}

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body as LoginRequest

  try {
    const id = await checkInput(email, password)
    ctx.session!.user = id
    ctx.redirect("/")

  } catch (error) {
    ctx.throw(400, error)
  }
}

function checkInput(email: string, pass: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email }) as UserDocument
    if (user) {
      const { _id, status, password } = user
      if (status) {
        const isIdentical = compareSync(pass, password)
        if (isIdentical) {
          resolve(_id)
        } else {
          reject("Incorrect email or password.")
        }
      } else {
        reject("The email is not active.")
      }
    } else {
      reject("Incorrect email or password.")
    }
  })
}
