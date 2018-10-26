import { createHmac } from "crypto"
import { Context } from "koa"

import User from "../models/user"
import Find from "../models/find"
import sendEmail from "../../../utils/sendEmail"

export const renderForgot = async (ctx: Context) => {
  if (ctx.session!.user) {
    ctx.redirect("/")
    return
  }
  await ctx.render("forgot")
}

interface ForgotRequest {
  email: string
}

export const forgot = async (ctx: Context) => {
  const { email } = ctx.request.body as ForgotRequest
  const user = await User.findOne({ email })
  if (!user) {
    ctx.throw(400, "Can't find that email, sorry.")
  }

  // create hash
  const hmac = createHmac("sha256", "findpass")
  hmac.update(email + Date.now())
  const verify = hmac.digest("hex")

  const mainhost = /localhost/.test(process.env.DOMAIN as string)
    ? `${process.env.DOMAIN}:${process.env.PORT}`
    : process.env.DOMAIN
  const url = `${mainhost}/findpass/${verify}`
  const option = {
    address: email,
    subject: "Please reset your password",
    // tslint:disable-next-line:object-literal-sort-keys
    html: `
      <h1>A demo based on koa</h1>
      <p>We heard that you lost your password. Sorry about that!</p>
      <p>But don’t worry! You can use the following link within the next day to reset your password:</p>
      <a href="${url}">${url}</a>
    `,
  }
  try {
    const response = await sendEmail(option)
    // Save verify data to database when email sent.
    const doc = new Find({
      user: user!._id,
      verify,
    })
    await doc!.save()
    ctx.body = "Check your email for a link to reset your password."
  } catch (error) {
    // console.log(error)
    ctx.throw(400, "Your email address is unavailable.")
  }
}

export const find = async (ctx: Context) => {
  const { verify } = ctx.params
  if (!/^[0-9a-z]{64}$/.test(verify)) {
    ctx.throw(400, "Verification code error")
  }

  try {
    const result = await Find.findOne({ verify })
    if (result) {
      const { status, deadline } = result
      if (status) {
        ctx.throw(400, "This verification code has been used.")
      }
      if (Date.now() < deadline.getTime()) {
        // Save verification code to session
        ctx.session!.find = verify
        await ctx.render("reset")
      } else {
        ctx.throw(400, "This verification code is outdated.")
      }
    } else {
      ctx.throw(400, "This verification code is not available.")
    }
  } catch (error) {
    ctx.throw(400, error)
  }
}

interface ResetRequest {
  pass1: string
  pass2: string
}

export const reset = async (ctx: Context) => {
  const { pass1, pass2 } = ctx.request.body as ResetRequest
  const verify = ctx.session!.find
  if (!pass1 || !pass2) {
    ctx.throw(400, "The passwords are required.")
    return
  }
  if (pass1 !== pass2) {
    ctx.throw(400, "Password doesn't match the confirmation.")
  }
  try {
    const doc = await Find.findOne({ verify })
    // The code is not be used, and not outdated.
    if (doc && !doc.status && doc.deadline.getTime() > Date.now()) {
      const user = await User.findOne({ _id: doc.user })
      user!.changePassword(pass1)
      doc.status = true
      await doc.save()
      ctx.session = null
      ctx.body = "Password has been successfully updated."
    } else {
      ctx.throw(400, "This verification code is not available.")
    }
  } catch (error) {
    ctx.throw(400, error)
  }
}
