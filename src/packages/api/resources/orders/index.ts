import Router from 'express-promise-router'
import { createOrder, myTotalTransactionAmount, transactionHistory } from '~/packages/api/resources/orders/controller'

const router = Router()

router.route('/create').post(createOrder)
router.route('/total-transaction-amount').post(myTotalTransactionAmount)
router.route('/transaction-history').post(transactionHistory)

export default router
