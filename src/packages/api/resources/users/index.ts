import Router from 'express-promise-router'
import {
  userinfo, updateProfile, mondialRelay, updateAddress
} from '~/packages/api/resources/users/controller'

const router = Router()

router.route('/userinfo').post(userinfo)
router.route('/updateProfile').post(updateProfile)
router.route('/updateAddress').post(updateAddress)
router.route('/mondialRelay').post(mondialRelay)

export default router
