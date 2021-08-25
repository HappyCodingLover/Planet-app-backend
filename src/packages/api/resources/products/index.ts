import Router from 'express-promise-router'
import {
  listings, addProduct
} from '~/packages/api/resources/products/controller'

const router = Router()

router.route('/listings').get(listings)
router.route('/listings').post(addProduct)

export default router
