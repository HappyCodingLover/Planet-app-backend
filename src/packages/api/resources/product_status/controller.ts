import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { ProductStatus } from '~/packages/database/models/status'

export const status = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const status = await getConnection()
    .createQueryBuilder(ProductStatus, 'productStatus')
    .orderBy('productStatus.name_fr', 'ASC')
    .getMany()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: status })
}

// export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//   const { title, price, categoryId, description, urls } = req.body
//   try {
//     const result = await getConnection()
//       .createQueryBuilder()
//       .insert()
//       .into(Products)
//       .values([
//         {
//           name_fr: title,
//           price: price,
//           categoriesSubs_id: categoryId,
//         },
//       ])
//       .returning('id')
//       .execute()
//     const arr = await Promise.all(
//       urls.map((url: any) => {
//         return {
//           product_id: result.identifiers[0].id,
//           name: '',
//           url: url.url,
//         }
//       }),
//     )
//     await getConnection().createQueryBuilder().insert().into(ProductImages).values(arr).execute()

//     return res.status(httpStatus.OK).send({ success: true, message: 'success' })
//   } catch (error) {
//     console.error(error)
//     return res.status(httpStatus.OK).send({ success: false, message: 'failed adding product' })
//   }
// }
