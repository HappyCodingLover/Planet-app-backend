import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Messages } from '~/packages/database/models/messages'

export const messages = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.body
  const messages = await getConnection().getRepository(Messages).find({ fromUserId: id })

  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: messages })
}
