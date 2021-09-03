import Router from 'express-promise-router'
import { createPaymentIntent } from '~/packages/api/resources/payment/controller'

const router = Router()

router.route('/payment-sheet').post(createPaymentIntent)

export default router
