import Router from 'koa-router'

import auth from '../auth'

const router = new Router()

// Controllers
import home from './home'
import { renderLogin, login } from './login'
import { renderSignup, signup, active } from './signup'
import { renderForgot, forgot, find, reset } from './forgot'
import { renderUpdate, update } from './update'

router.get('/', home)

router.get('/login', renderLogin)

router.post('/login', login)

router.get('/signup', renderSignup)

router.post('/signup', signup)

router.get('/activation/:verify', active)

router.get('/logout', (ctx, next) => {
  ctx.session = null
  ctx.redirect('/')
})

router.get('/forgot', renderForgot)

router.post('/forgot', forgot)

router.get('/findpass/:verify', find)

router.post('/reset', reset)

router.get('/update', renderUpdate)

router.post('/update', auth, update)

export default router
