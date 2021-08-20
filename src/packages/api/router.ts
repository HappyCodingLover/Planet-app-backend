import * as express from 'express'
import authRouter from '~/packages/api/resources/auth/index'

const router = express.Router()

router.use('/api/auth', authRouter)

export default router
