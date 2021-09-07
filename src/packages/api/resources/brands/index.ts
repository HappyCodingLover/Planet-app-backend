import Router from 'express-promise-router'
import { brands, addBrand } from '~/packages/api/resources/brands/controller'

const router = Router()

router.route('/').get(brands)
router.route('/add').post(addBrand)

export default router
