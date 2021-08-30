import Router from 'express-promise-router'
import { status } from '~/packages/api/resources/product_status/controller'

const router = Router()

router.route('/').get(status)

export default router
