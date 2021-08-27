import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Brands } from '~/packages/database/models/brands'

export const brands = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const brands = await getConnection().createQueryBuilder(Brands, 'brands').orderBy('brands.name', 'ASC').getMany()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: brands })
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
