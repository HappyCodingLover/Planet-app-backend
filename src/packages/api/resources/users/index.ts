import Router from 'express-promise-router'
import {
  userinfo
} from '~/packages/api/resources/users/controller'

const router = Router()

router.route('/userinfo').post(userinfo)

export default router
