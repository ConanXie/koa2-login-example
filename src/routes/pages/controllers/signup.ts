import { Context } from "koa"
import { createHmac } from "crypto"

import User from "../models/user"
import sendEmail from "../../../utils/sendEmail"

export const renderSignup = async (ctx: Context) => {
  await ctx.render("signup")
}

interface SignupRequest {
  email: string
  username: string
  password: string
}

export const signup = async (ctx: Context) => {
  const {
    email,
    username,
    password,
  } = ctx.request.body as SignupRequest

  // Check if the email is registered
  try {
    const user = await User.findOne({ email })
    if (user) {
      ctx.throw(400, "The email has been registered.")
    }
  } catch (error) {
    ctx.throw(400, error)
  }
  // Create hash verify code
  const hmac = createHmac("sha256", "signup")
  hmac.update(email + Date.now())
  const verify = hmac.digest("hex")

  const mainhost = /localhost/.test(process.env.DOMAIN as string)
    ? `${process.env.DOMAIN}:${process.env.PORT}`
    : process.env.DOMAIN
  const url = `${mainhost}/activation/${verify}`
  const option = {
    address: email,
    subject: "Account activation",
    // tslint:disable-next-line:object-literal-sort-keys
    html: `
      <h1>A demo based on koa</h1>
      <p>Thank you for registering. But you still need a step.</p>
      <p>Click the following link to activate your account.</p>
      <a href="${url}">${url}</a>
    `,
  }
  try {
    await sendEmail(option)

    // Save account to database after email sent.
    const user = new User({
      email,
      name: username,
      password,
      verify,
    })
    await user.save()

    ctx.body = "The activation email has sent. Check your new email please."
  } catch (error) {
    // console.log(error)
    ctx.throw(400, "Your email address is not available.")
  }

}

export const active = async (ctx: Context) => {
  const { verify } = ctx.params

  if (!/^[0-9a-z]{64}$/.test(verify)) {
    ctx.throw(400, "Invalid activation code")
  }
  try {
    const result = await User.findOne({ verify })
    if (result) {
      if (!result.status) {
        result.status = true
        await result.save()
        ctx.body = "Activation successful"
      } else {
        ctx.throw(400, "Activation code is not available.")
      }
    } else {
      ctx.throw(400, "Activation code does not exist.")
    }
  } catch (error) {
    ctx.throw(400, error)
  }
}
