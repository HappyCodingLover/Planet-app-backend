import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Products } from '~/packages/database/models/products'

export const listings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const products = await getConnection().getRepository(Products).find({
    take: 5,
  })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: products })
}

export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { title, price, categoryId, description } = req.body
  try {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Products)
      .values([
        {
          name_fr: title,
          price: price,
          categoriesSubs_id: categoryId,
        },
      ])
      .execute()

    return res.status(httpStatus.OK).send({ success: true, message: 'success' })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.OK).send({ success: false, message: 'failed adding product' })
  }
}
