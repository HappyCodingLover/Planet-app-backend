import * as express from 'express'
import authRouter from '~/packages/api/resources/auth/index'
import productsRouter from '~/packages/api/resources/products/index'
import categoriesRouter from '~/packages/api/resources/categories/index'

const router = express.Router()

router.use('/api/auth', authRouter)
router.use('/api/products', productsRouter)
router.use('/api/categories', categoriesRouter)

export default router
