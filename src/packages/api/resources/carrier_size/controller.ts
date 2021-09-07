import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Carrier_size } from '~/packages/database/models/carrier_size'

export const carrier_sizes = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const carrier_sizes = await getConnection()
    .createQueryBuilder(Carrier_size, 'carrier_size')
    .orderBy('carrier_size.nom', 'ASC')
    .getMany()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: carrier_sizes })
}