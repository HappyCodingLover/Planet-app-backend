import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Products } from '~/packages/database/models/products'
import { ProductImages } from '~/packages/database/models/productImages'
import { Favorite } from '~/packages/database/models/favorite'
import { Brands } from '~/packages/database/models/brands'
import { User } from '~/packages/database/models/user'

export const listings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { page } = req.body
  const [products, total] = await getConnection()
    .getRepository(Products)
    .findAndCount({ skip: page * 5, take: 5 })
  const arr = await Promise.all(
    products.map(async (product: any) => {
      const productImages = await getConnection()
        .getRepository(ProductImages)
        .createQueryBuilder('productImages')
        .where('productImages.product_id = :id', { id: product.id })
        .getMany()
      const favorites = await getConnection()
        .getRepository(Favorite)
        .find({
          where: {
            id_product: product.id,
            active: true,
          },
        })
      const brand = await getConnection()
        .getRepository(Brands)
        .findOne({
          where: {
            id: product.brand_id,
          },
        })
      const user = await getConnection()
        .getRepository(User)
        .findOne({
          where: {
            id: product.user_id,
          },
        })

      return { ...product, images: productImages, favorites: favorites, brand: brand, user: user }
    }),
  )
  return res
    .status(httpStatus.OK)
    .send({ success: true, message: 'success', data: { data: arr, next: total > (page + 1) * 3 ? page + 1 : -1 } })
}

export const favListings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, page } = req.body

  const [products, total] = await getConnection().getRepository(Products).findAndCount()

  console.log('__products', products)

  const favProducts = await Promise.all(
    products.map(async (product: any) => {
      const favs = await getConnection()
        .getRepository(Favorite)
        .findOne({
          where: {
            id_product: product.id,
            id_users: userId,
            active: true,
          },
        })
      if (favs !== undefined) return product
      else return null
    }),
  )

  const arr = await Promise.all(
    favProducts
      .filter((prod) => prod !== null)
      .slice(page * 5, (page + 1) * 5)
      .map(async (product: any) => {
        const productImages = await getConnection()
          .getRepository(ProductImages)
          .createQueryBuilder('productImages')
          .where('productImages.product_id = :id', { id: product.id })
          .getMany()
        const favorites = await getConnection()
          .getRepository(Favorite)
          .find({
            where: {
              id_product: product.id,
              active: true,
            },
          })
        const brand = await getConnection()
          .getRepository(Brands)
          .findOne({
            where: {
              id: product.brand_id,
            },
          })
        const user = await getConnection()
          .getRepository(User)
          .findOne({
            where: {
              id: product.user_id,
            },
          })

        return { ...product, images: productImages, favorites: favorites, brand: brand, user: user }
      }),
  )
  console.log('__arr', arr)

  return res
    .status(httpStatus.OK)
    .send({ success: true, message: 'success', data: { data: arr, next: total > (page + 1) * 3 ? page + 1 : -1 } })
}

export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { title, price, categoryId, description, brandId, statusId, urls, userId } = req.body
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
          brand_id: brandId,
          status_id: statusId,
          user_id: userId,
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

export const myListings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId } = req.body
  const userProducts = await getConnection()
    .getRepository(Products)
    .find({
      where: {
        user_id: userId,
      },
    })
  const arr = await Promise.all(
    userProducts.map(async (product: any) => {
      const productImages = await getConnection()
        .getRepository(ProductImages)
        .createQueryBuilder('productImages')
        .where('productImages.product_id = :id', { id: product.id })
        .getMany()
      const favorites = await getConnection()
        .getRepository(Favorite)
        .find({
          where: {
            id_product: product.id,
            active: true,
          },
        })
      const brand = await getConnection()
        .getRepository(Brands)
        .findOne({
          where: {
            id: product.brand_id,
          },
        })

      return { ...product, images: productImages, favorites: favorites, brand: brand }
    }),
  )
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: arr })
}

export const userListingsCount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId } = req.body
  const userProducts = await getConnection()
    .getRepository(Products)
    .find({
      where: {
        user_id: userId,
      },
    })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: userProducts.length })
}
