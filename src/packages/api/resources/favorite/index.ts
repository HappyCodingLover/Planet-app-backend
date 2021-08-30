import Router from 'express-promise-router'
import { addProduct, getFavoriteProduct } from '~/packages/api/resources/favorite/controller'

const router = Router()

router.route('/').post(addProduct)
router.route('/product').get(getFavoriteProduct)

export default router
