import Router from 'express-promise-router'
import * as passport from 'passport'
import {
  register,
  login,
} from '~/packages/api/resources/auth/controller'

const router = Router()

router.route('/login').post(login)
router.route('/register').post(register)

export default router
