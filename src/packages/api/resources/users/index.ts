import Router from 'express-promise-router'
import {
  userinfo, updateProfile, mondialRelay
} from '~/packages/api/resources/users/controller'

const router = Router()

router.route('/userinfo').post(userinfo)
router.route('/updateProfile').post(updateProfile)
router.route('/mondialRelay').post(mondialRelay)

export default router
