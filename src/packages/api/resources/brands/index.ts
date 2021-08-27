import Router from 'express-promise-router'
import { brands } from '~/packages/api/resources/brands/controller'

const router = Router()

router.route('/').get(brands)

export default router
