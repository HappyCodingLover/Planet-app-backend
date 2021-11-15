import Router from 'express-promise-router'
import { cities, regions, departments, getCityByPostcode, getPointRelaysByCity } from '~/packages/api/resources/address/controller'

const router = Router()

router.route('/cities').post(cities)
router.route('/regions').post(regions)
router.route('/departments').post(departments)
router.route('/getCityByPostcode').post(getCityByPostcode)
router.route('/get-pointRelay-by-city').post(getPointRelaysByCity)

export default router
