import crypto from 'crypto'

import User from '../../models/user'
import Find from '../../models/find'
import { port, host } from '../../config'
import sendEmail from './sendEmail'

export const renderForgot = async ctx => {
  if (ctx.session.user) {
    ctx.redirect('/')
    return
  }
  await ctx.render('forgot')
}

export const forgot = async ctx => {
  const { email } = ctx.request.body
  const user = await User.findOne({ email })
  if (!user) {
    ctx.throw(400, `Can't find that email, sorry.`)
    return
  }

  // create hash
  const hmac = crypto.createHmac('sha256', 'findpass')
  hmac.update(email + Date.now())
  const hash = hmac.digest('hex')

  const mainhost = /localhost/.test(host) ? `${host}:${port}` : host
  const url = `${mainhost}/findpass/${hash}`
  const option = {
    address: email,
    subject: 'Please reset your password',
    html: `
      <h1>A demo based on koa</h1>
      <p>We heard that you lost your password. Sorry about that!</p>
      <p>But don’t worry! You can use the following link within the next day to reset your password:</p>
      <a href="${url}">${url}</a>
    `
  }
  try {
    const response = await sendEmail(option)
    // Save verify data to database when email sent.
    const find = new Find({
      user: user._id,
      verify: hash
    })
    await find.save()
    ctx.body = 'Check your email for a link to reset your password.'
  } catch (error) {
    console.log(error)
    ctx.throw(400, 'Your email address is unavailable.')
  }
}

export const find = async (ctx, next) => {
  const { verify } = ctx.params
  if (!/^[0-9a-z]{64}$/.test(verify)) {
    ctx.throw(400, 'Verification code error')
    return
  }

  try {
    await new Promise(async (resolve, reject) => {
      const result = await Find.findOne({ verify })
      if (result) {
        const { status, deadline } = result
        if (status) {
          reject('This verification code has been used.')
          return
        }
        if (Date.now() < deadline) {
          resolve('successful')
        } else {
          reject('This verification code is outdated.')
        }
      } else {
        reject('This verification code is unavailable.')
      }
    })
    // Save verification code to session
    ctx.session.find = verify
    await ctx.render('reset')

  } catch (error) {
    ctx.throw(400, error)
  }
}

export const reset = async ctx => {
  const { pass1, pass2 } = ctx.request.body
  const verify = ctx.session.find
  if (!pass1 || !pass2) {
    ctx.throw(400, 'The passwords are required.')
    return
  }
  if (pass1 !== pass2) {
    ctx.throw(400, `Password doesn't match the confirmation.`)
    return
  }
  try {
    const saved = await new Promise(async (resolve, reject) => {
      const find = await Find.findOne({ verify })
      // The code is not be used, and not outdated.
      if (find && !find.status && find.deadline > Date.now()) {
        const user = await User.findOne({ _id: find.user })
        user.changePass(pass1)
        find.status = true
        await find.save()
        resolve('Password has been successfully updated.')
      } else {
        reject('This verification code is unavailable.')
      }
    })

    ctx.session = null
    ctx.body = saved
  } catch (error) {
    ctx.throw(400, error)
  }
}
