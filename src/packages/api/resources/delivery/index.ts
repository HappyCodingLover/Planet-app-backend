import Router from 'express-promise-router'
import { mondialRelay, createShipment, searchMondialRelays } from '~/packages/api/resources/delivery/controller'

const router = Router()

router.route('/mondialRelay').post(mondialRelay)
router.route('/createShipment').post(createShipment)
router.route('/search-mondialRelays').post(searchMondialRelays)

export default router
