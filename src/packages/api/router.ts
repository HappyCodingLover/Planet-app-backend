import * as express from 'express'
import authRouter from '~/packages/api/resources/auth/index'
import productsRouter from '~/packages/api/resources/products/index'
import categoriesRouter from '~/packages/api/resources/categories/index'
import brandsRouter from '~/packages/api/resources/brands/index'
import carrier_sizeRouter from '~/packages/api/resources/carrier_size/index'
import statusRouter from '~/packages/api/resources/product_status/index'
import favoriteRouter from '~/packages/api/resources/favorite/index'
import paymentRouter from '~/packages/api/resources/payment/index'
import messagesRouter from '~/packages/api/resources/messages/index'
import usersRouter from '~/packages/api/resources/users/index'

const router = express.Router()

router.use('/api/auth', authRouter)
router.use('/api/products', productsRouter)
router.use('/api/categories', categoriesRouter)
router.use('/api/brands', brandsRouter)
router.use('/api/carrier_size', carrier_sizeRouter)
router.use('/api/status', statusRouter)
router.use('/api/favorite', favoriteRouter)
router.use('/api/payment', paymentRouter)
router.use('/api/messages', messagesRouter)
router.use('/api/users', usersRouter)

export default router
