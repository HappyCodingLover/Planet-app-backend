import Router from 'express-promise-router'
import { mondialRelay, createShipment } from '~/packages/api/resources/delivery/controller'

const router = Router()

router.route('/mondialRelay').post(mondialRelay)
router.route('/createShipment').post(createShipment)

export default router
