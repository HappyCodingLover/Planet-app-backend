import Router from 'express-promise-router'
import { mondialRelay } from '~/packages/api/resources/delivery/controller'

const router = Router()

router.route('/mondialRelay').post(mondialRelay)

export default router
