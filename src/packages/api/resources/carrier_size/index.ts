import Router from 'express-promise-router'
import { carrier_sizes } from '~/packages/api/resources/carrier_size/controller'

const router = Router()

router.route('/').get(carrier_sizes)

export default router
