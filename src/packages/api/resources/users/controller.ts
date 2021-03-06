import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Products } from '~/packages/database/models/products'
import { ProductImages } from '~/packages/database/models/productImages'
import { Favorite } from '~/packages/database/models/favorite'
import { Brands } from '~/packages/database/models/brands'
import { User } from '~/packages/database/models/user'
import { Categories } from '~/packages/database/models/categories'
import { http } from 'winston'
import * as path from 'path'
import { Regions } from '~/packages/database/models/regions'
import { Cities } from '~/packages/database/models/city'
import { Departments } from '~/packages/database/models/department'
import { exec } from 'child_process'
import * as jwt from 'jsonwebtoken'
import config from '~/config'

const onetimeCount = 20

export const mondialRelay = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { countryCode, postcode } = req.body
  const phpFilePath = path.resolve(__dirname, '../../../../../mondial-relay-web-api/sample-parcelshop-search.php')
  exec(`php ${phpFilePath} ${countryCode} ${postcode}`, (err, stdout, stderr) => {
    if (err) {
      console.error('err in mondial relay', err.message)
      return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
    } else if (stderr) {
      console.error('err in mondial relay', stderr)
      return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
    } else {
      // console.log(stdout)
      const xxx = stdout.substring(2)
      return res.status(httpStatus.OK).send({ success: true, message: 'success', data: JSON.parse(xxx) })
      // return res.status(httpStatus.OK).send({ success: true, message: 'success' })
    }
  })
}

export const userinfo = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.body
  const user = await getConnection()
    .getRepository(User)
    .findOne({
      where: {
        id: id,
      },
    })
  return res.status(httpStatus.OK).send({
    success: true,
    message: 'success',
    data: {
      id: user.id,
      name: user.name,
      firstname: user.firstname,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      description: user.description_fr,
    },
  })
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

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id, avatar, name, firstname, cities_id, postcode, address1, address2, description_fr, phoneNumber } = req.body
  let user
  if (avatar) {
    user = await getConnection().getRepository(User).save({
      id: id,
      avatar,
      name,
      firstname,
      cities_id,
      postcode,
      address1,
      address2,
      description_fr,
      phoneNumber,
    })
  } else {
    user = await getConnection().getRepository(User).save({
      id: id,
      name,
      firstname,
      cities_id,
      postcode,
      address1,
      address2,
      description_fr,
      phoneNumber,
    })
  }

  const _user = await getConnection()
    .getRepository(User)
    .findOne({ where: { id: user.id } })
  const city = await getConnection()
    .getRepository(Cities)
    .findOne({ where: { id: _user.cities_id } })
  const department = await getConnection()
    .getRepository(Departments)
    .findOne({ where: { code: city.department_code } })
  const region = await getConnection()
    .getRepository(Regions)
    .findOne({ where: { code: department.region_code } })
  const token = jwt.sign(
    {
      id: _user.id,
      email: _user.email,
      name: _user.name,
      firstname: _user.firstname,
      username: _user.username,
      avatar: _user.avatar,
      phoneNumber: _user.phoneNumber,
      description: _user.description_fr,
      address1: _user.address1,
      address2: _user.address2,
      postcode: _user.postcode,
      cities_id: _user.cities_id,
      city: city,
      department: department,
      region: region,
    },
    config.AUTH.TOKEN_SECRET,
    {
      expiresIn: config.AUTH.TOKEN_EXPIRATION_TIME,
    },
  )
  return res.status(httpStatus.OK).send({
    success: true,
    message: 'success',
    data: token,
  })
}

export const updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id, cities_id, address1, address2, postcode } = req.body
  const user = await getConnection().getRepository(User).save({
    id: id,
    address1,
    address2,
    cities_id,
    postcode,
  })
  const _user = await getConnection()
    .getRepository(User)
    .findOne({ where: { id: user.id } })
  const city = await getConnection()
    .getRepository(Cities)
    .findOne({ where: { id: _user.cities_id } })
  const department = await getConnection()
    .getRepository(Departments)
    .findOne({ where: { code: city.department_code } })
  const region = await getConnection()
    .getRepository(Regions)
    .findOne({ where: { code: department.region_code } })
  return res.status(httpStatus.OK).send({
    success: true,
    message: 'success',
    data: {
      id: _user.id,
      email: _user.email,
      name: _user.name,
      firstname: _user.firstname,
      username: _user.username,
      avatar: _user.avatar,
      phoneNumber: _user.phoneNumber,
      description: _user.description_fr,
      address1: _user.address1,
      address2: _user.address2,
      postcode: _user.postcode,
      cities_id: _user.cities_id,
      city: city,
      department: department,
      region: region,
    },
  })
}
