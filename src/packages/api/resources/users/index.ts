import Router from 'express-promise-router'
import {
  userinfo, updateProfile
} from '~/packages/api/resources/users/controller'

const router = Router()

router.route('/userinfo').post(userinfo)
router.route('/updateProfile').post(updateProfile)

export default router
