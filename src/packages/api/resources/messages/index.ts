import Router from 'express-promise-router'
import { messages } from '~/packages/api/resources/messages/controller'

const router = Router()

router.route('/messages').post(messages)

export default router
