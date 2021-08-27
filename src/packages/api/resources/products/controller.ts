import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Products } from '~/packages/database/models/products'
import { ProductImages } from '~/packages/database/models/productImages'

export const listings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const products = await getConnection().getRepository(Products).find()
  const arr = await Promise.all(
    products.map(async (product: any) => {
      console.log('__productId', product.id)
      const productImages = await getConnection()
        .getRepository(ProductImages)
        .createQueryBuilder('productImages')
        .where('productImages.product_id = :id', { id: product.id })
        .getMany()
      return {...product, images: {productImages}}
    }),
  )
  console.log('__arr', arr)
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: arr })
}

export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { title, price, categoryId, description, urls } = req.body
  try {
    const result = await getConnection()
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
      .returning('id')
      .execute()
    const arr = await Promise.all(
      urls.map((url: any) => {
        return {
          product_id: result.identifiers[0].id,
          name: '',
          url: url.url,
        }
      }),
    )
    await getConnection().createQueryBuilder().insert().into(ProductImages).values(arr).execute()

    return res.status(httpStatus.OK).send({ success: true, message: 'success' })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.OK).send({ success: false, message: 'failed adding product' })
  }
}
