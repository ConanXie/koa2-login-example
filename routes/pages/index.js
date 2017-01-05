import Router from 'koa-router'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import wellknown from 'nodemailer-wellknown'

const route = new Router()

// database model
import User from '../../model/user'
import Find from '../../model/find'

// config
import { port, host, email as emailConfig } from '../../config'

const sendMail = (option) => {
  const { address, subject, html } = option
  const { service, sender, pass } = emailConfig
  // send email
  const config = wellknown(service)
  config.auth = {
    user: sender,
    pass: pass
  }
  const transport = nodemailer.createTransport(smtpTransport(config))
  const mailOptions = {
    from: sender,
    to: address,
    subject,
    html
  }
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error)
      } else {
        resolve(`Message sent ${info.response}`)
      }
    })
  })
}

route.get('/', async (ctx, next) => {
  let data
  if (ctx.session.user) {
    const { name, email, joindate } = await User.findById(ctx.session.user).exec()
    data = { name, email, joindate }
  }
  await ctx.render('index', data)
})

route.get('/login', async (ctx, next) => {
  if (ctx.session.user) {
    ctx.redirect('/')
  } else {
    await ctx.render('login')
  }
})

route.post('/login', async (ctx, next) => {
  // console.log(ctx.request.body)
  const { email, password } = ctx.request.body
  /**
   * login
   */
  const login = async (email, pass) => {
    try {
      const user = await User.findOne({ email }).exec()
      if (user) {
        const { status, password } = user
        if (status) {
          const check = bcrypt.compareSync(pass, password)
          if (check) {
            return { code: 0, msg: 'success', id: user._id }
          } else {
            return { code: 102, msg: 'password error' }
          }
        } else {
          return { code: 103, msg: 'user not active' }
        }
      } else {
        return { code: 101, msg: 'user not exist' }
      }
    } catch (error) {
      throw error
    }
  }
  const data = await login(email, password)
  if (!data.code) {
    ctx.session.user = data.id
    ctx.redirect('/')
  } else {
    ctx.body = data.msg
  }
})

route.get('/signup', async (ctx, next) => {
  await ctx.render('signup')
})
route.post('/signup', async (ctx, next) => {
  const { email, user, password } = ctx.request.body

  const checkUser = async () => {
    try {
      const user = await User.findOne({ email }).exec()
      if (user) {
        return { code: 201, msg: 'email exist' }
      } else {
        return { code: 0, msg: 'new user' }
      }
    } catch (error) {
      throw error
    }
  }
  const checkUserResult = await checkUser()
  if (checkUserResult.code) {
    ctx.body = checkUserResult.msg
  } else {
    // create hash
    const hmac = crypto.createHmac('sha256', 'signup')
    hmac.update(email + Date.now())
    const hash = hmac.digest('hex')
    const newUser = new User({
      email,
      name: user,
      password,
      verify: hash
    })
    try {
      const user = await newUser.save()
      if (user) {
        const option = {
          address: email,
          subject: 'Account activation',
          html: `
            <h1>A koa2 demo</h1>
            <p>Activate your account via <a href="${host}:${port}/activation/${hash}">${host}:${port}/activation/${hash}</a></p>
          `
        }
        try {
          const response = await sendMail(option)
          ctx.body = 'activation email has sent, check your new email'
        } catch (error) {
          ctx.body = 'your email not available'
        }
      }
    } catch (err) {
      throw err
    }
  }
})

route.get('/activation/:verify', async (ctx) => {
  const { verify } = ctx.params
  if (!/^[0-9a-z]{64}$/.test(verify)) {
    ctx.body = 'verify code error'
  }
  const data = await new Promise(async (resolve, reject) => {
    const user = await User.findOne({ verify }).exec()
    if (user) {
      if (!user.status) {
        user.status = true
        user.save()
        resolve({ code: 0, msg: 'activation success' })
      } else {
        resolve({ code: 501, msg: 'code has been used' })
      }
    } else {
      resolve({ code: 502, msg: 'code not exist' })
    }
  })
  ctx.body = data.msg
})

route.get('/logout', (ctx, next) => {
  ctx.session = null
  ctx.redirect('/')
})

route.get('/forgot', async (ctx, next) => {
  if (ctx.session.user) {
    ctx.redirect('/')
  }
  await ctx.render('forgot')
})

route.post('/forgot', async (ctx, next) => {
  const { email } = ctx.request.body
  const user = await User.findOne({ email }).exec()
  if (!user) {
    ctx.body = 'email not exist'
  } else {
    // create hash
    const hmac = crypto.createHmac('sha256', 'findpass')
    hmac.update(email + Date.now())
    const hash = hmac.digest('hex')

    // store verify
    const find = new Find({
      user: user._id,
      verify: hash,
      deadline: Date.now()
    })
    const result = await find.save()
    if (result) {
      const option = {
        address: email,
        subject: 'Retrieve password',
        html: `
          <h1>A koa2 demo</h1>
          <p>Set new password via <a href="${host}:${port}/findpass/${hash}">${host}:${port}/findpass/${hash}</a></p>
        `
      }
      try {
        const response = await sendMail(option)
        ctx.body = 'email has sent, check your new email'
      } catch (error) {
        ctx.body = 'your email not available'
      }
    }
  }
})

route.get('/findpass/:verify', async (ctx, next) => {
  const { verify } = ctx.params
  if (!/^[0-9a-z]{64}$/.test(verify)) {
    ctx.body = 'verify code error'
  }
  const data = await new Promise((resolve, reject) => {
    Find.findOne({ verify }).sort({ '_id': -1 }).exec().then(find => {
      if (find) {
        if (find.status) {
          resolve({ code: 303, msg: 'verify has been used' })
        }
        if (Date.now() < find.deadline) {
          resolve({ code: 0 })
        } else {
          resolve({ code: 301, msg: 'verify link failed' })
        }
      } else {
        resolve({ code: 302, msg: 'verify code error' })
      }
    })
  })
  if (!data.code) {
    ctx.session.find = verify
    await ctx.render('reset')
  } else {
    ctx.body = data.msg
  }
})

route.post('/reset', async (ctx, next) => {
  const { pass1, pass2 } = ctx.request.body
  const verify = ctx.session.find
  if (!pass1 || !pass2) {
    return ctx.body = 'password required'
  }
  if (pass1 !== pass2) {
    return ctx.body = 'incorrect password'
  }
  const data = await new Promise((resolve, reject) => {
    Find.findOne({ verify }).exec().then((find) => {
      if (find && !find.status && find.deadline > Date.now()) {
        User.findOne({ _id: find.user }).exec().then(user => {
          user.storePass(pass1)
          if (user) {
            find.status = 1
            find.save()
            resolve({ code: 0 })
          }
        })
      } else {
        resolve({ code: 401, msg: 'verify code error or failed, try again' })
      }
    })
  })
  if (!data.code) {
    ctx.session = null
    ctx.body = 'password modified success'
  } else {
    ctx.body = data.msg
  }
})

route.get('/modify', async (ctx) => {
  if (ctx.session.user) {
    await ctx.render('modify')
  } else {
    ctx.redirect('/')
  }
})
route.post('/modify', async (ctx) => {
  const { pass, pass1, pass2 } = ctx.request.body
  if (!pass || !pass1 || !pass2 || pass1 !== pass2) {
    ctx.body = 'password input error'
  } else {
    if (!ctx.session.user) {
      ctx.body = 'not login'
    } else {
      const user = await User.findById(ctx.session.user).exec()
      const check = bcrypt.compareSync(pass, user.password)
      if (check) {
        user.password = pass1
        await user.save()
        ctx.session = null
        ctx.body = 'modified success'
      } else {
        ctx.body = 'original password error'
      }
    }
  }
})

route.get('/sign', (ctx, next) => {
  console.log(ctx.session)
  ctx.body = `<h1>${ctx.session.sign}</h1>`
})

export default route