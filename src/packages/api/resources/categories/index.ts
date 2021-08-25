import Router from 'express-promise-router'
import { categories } from '~/packages/api/resources/categories/controller'

const router = Router()

router.route('/').get(categories)

export default router
