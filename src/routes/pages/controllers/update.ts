import { compareSync } from 'bcryptjs'
import User from '../../models/user'

export const renderUpdate = async ctx => {
  if (ctx.session.user) {
    await ctx.render('update')
  } else {
    ctx.redirect('/')
  }
}

export const update = async ctx => {
  const { pass, pass1, pass2 } = ctx.request.body
  if (!pass || !pass1 || !pass2 || pass1 !== pass2) {
    ctx.throw(400, 'Input error.')
  } else {
    const user = await User.findById(ctx.session.user)
    const isIdentical = compareSync(pass, user.password)
    if (isIdentical) {
      user.changePass(pass1)
      // empty session
      ctx.session = null
      ctx.body = 'The password has been updated, please sign in again.'
    } else {
      ctx.throw(400, 'The old password is incorrect.')
    }
  }
}
