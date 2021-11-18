import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection, Not } from 'typeorm'
import { Products } from '~/packages/database/models/products'
import { ProductImages } from '~/packages/database/models/productImages'
import { Favorite } from '~/packages/database/models/favorite'
import { Brands } from '~/packages/database/models/brands'
import { User } from '~/packages/database/models/user'
import { Categories } from '~/packages/database/models/categories'
import { Carrier_size } from '~/packages/database/models/carrier_size'

const onetimeCount = 20

export const listings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { page, id } = req.body
  const [products, total] = await getConnection()
    .getRepository(Products)
    .findAndCount({ skip: page * onetimeCount, take: onetimeCount, where: { user_id: Not(id) } })
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
      const carrier = await getConnection()
        .getRepository(Carrier_size)
        .findOne({ where: { id: product.carrier_size_id } })
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
      const category = await getConnection()
        .getRepository(Categories)
        .findOne({
          where: {
            id: product.categoriesSubs_id,
          },
        })
      return {
        ...product,
        images: productImages,
        favorites: favorites,
        brand: brand,
        user: user,
        category: category,
        carrier: carrier,
      }
    }),
  )
  return res
    .status(httpStatus.OK)
    .send({ success: true, message: 'success', data: { data: arr, next: total > (page + 1) * 3 ? page + 1 : -1 } })
}

export const favListings = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, page } = req.body

  const [products, total] = await getConnection().getRepository(Products).findAndCount()

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
      .slice(page * onetimeCount, (page + 1) * onetimeCount)
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
        const category = await getConnection()
          .getRepository(Categories)
          .findOne({
            where: {
              id: product.categoriesSubs_id,
            },
          })
        const user = await getConnection()
          .getRepository(User)
          .findOne({
            where: {
              id: product.user_id,
            },
          })

        return { ...product, images: productImages, favorites: favorites, brand: brand, user: user, category: category }
      }),
  )

  return res
    .status(httpStatus.OK)
    .send({ success: true, message: 'success', data: { data: arr, next: total > (page + 1) * 3 ? page + 1 : -1 } })
}

export const search = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { keyword, categoryId } = req.body
  let result
  if (categoryId) {
    result = await getConnection()
      .getRepository(Products)
      .createQueryBuilder('products')
      .where(
        '(LOWER(products.name_fr) like :keyword OR LOWER(products.description) like :keyword) AND products.categoriesSubs_id = :categoryId',
        { keyword: `%${keyword.toLowerCase()}%`, categoryId },
      )
      .getMany()
  } else
    result = await getConnection()
      .getRepository(Products)
      .createQueryBuilder('products')
      .where('LOWER(products.name_fr) like :keyword OR LOWER(products.description) like :keyword', {
        keyword: `%${keyword.toLowerCase()}%`,
      })
      .getMany()
  const arr = await Promise.all(
    result.map(async (product: any) => {
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
      const category = await getConnection()
        .getRepository(Categories)
        .findOne({
          where: {
            id: product.categoriesSubs_id,
          },
        })
      return { ...product, images: productImages, favorites: favorites, brand: brand, user: user, category: category }
    }),
  )
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: arr })
}

export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { title, price, categoryId, carrier_size_id, description, brandId, statusId, urls, userId } = req.body
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
          carrier_size_id: carrier_size_id,
          user_id: userId,
          description: description,
          active: true,
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
  const { userId, page } = req.body
  // const [products, total] = await getConnection()
  //   .getRepository(Products)
  //   .findAndCount({ skip: page * onetimeCount, take: onetimeCount, where: { user_id: Not(id) } })
  const [userProducts, total] = await getConnection()
    .getRepository(Products)
    .findAndCount({
      skip: page * onetimeCount,
      take: onetimeCount,
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
      const category = await getConnection()
        .getRepository(Categories)
        .findOne({
          where: {
            id: product.categoriesSubs_id,
          },
        })

      return { ...product, images: productImages, favorites: favorites, brand: brand, category: category }
    }),
  )
  return res
    .status(httpStatus.OK)
    .send({ success: true, message: 'success', data: { data: arr, next: total > (page + 1) * 3 ? page + 1 : -1 } })
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

export const favListingsCount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId } = req.body
  const products = await getConnection().getRepository(Products).find()

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
  const count = favProducts.filter((listing) => listing !== null).length
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: count })
}
