import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Categories } from '~/packages/database/models/categories'

export const categories = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const categories = await getConnection().getRepository(Categories).find()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: categories })
}