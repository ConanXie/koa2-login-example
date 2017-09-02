import { compareSync } from 'bcryptjs'

import User from '../../models/user'

export const renderLogin = async (ctx, next) => {
  if (ctx.session.user) {
    ctx.redirect('/')
  } else {
    await ctx.render('login')
  }
}

const checkInput = (email, pass) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ email })
    if (user) {
      const { _id, status, password } = user
      if (status) {
        const isIdentical = compareSync(pass, password)
        if (isIdentical) {
          resolve(_id)
        } else {
          reject('Incorrect email or password.')
        }
      } else {
        reject('The email is not active.')
      }
    } else {
      reject('Incorrect email or password.')
    }
  })
}

export const login = async (ctx, next) => {
  const { email, password } = ctx.request.body

  try {
    const id = await checkInput(email, password)
    ctx.session.user = id
    ctx.redirect('/')

  } catch (error) {
    ctx.throw(400, error)
  }
}
