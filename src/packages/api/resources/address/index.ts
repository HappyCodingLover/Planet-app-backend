import Router from 'express-promise-router'
import { cities, regions, departments } from '~/packages/api/resources/address/controller'

const router = Router()

router.route('/cities').post(cities)
router.route('/regions').post(regions)
router.route('/departments').post(departments)

export default router
