import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Brands } from '~/packages/database/models/brands'

export const brands = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const brands = await getConnection().createQueryBuilder(Brands, 'brands').orderBy('brands.name', 'ASC').getMany()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: brands })
}

export const addBrand = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const data = req.body
  const exists = await getConnection()
    .getRepository(Brands)
    .createQueryBuilder('brands')
    .where('brands.name = :name', data)
    .getCount()
  let result
  if (!exists) result = await getConnection().createQueryBuilder().insert().into(Brands).values([data]).execute()
  const brands = await getConnection().createQueryBuilder(Brands, 'brands').orderBy('brands.name', 'ASC').getMany()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: brands })
}
