import Router from 'express-promise-router'
import { cities, regions, departments, getCityByPostcode } from '~/packages/api/resources/address/controller'

const router = Router()

router.route('/cities').post(cities)
router.route('/regions').post(regions)
router.route('/departments').post(departments)
router.route('/getCityByPostcode').post(getCityByPostcode)

export default router
