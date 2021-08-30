import { any } from '@hapi/joi'
import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Favorite } from '~/packages/database/models/favorite'

export const addProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id_users, id_product, isActive } = req.body
  let result
  try {
    const favorite = await getConnection().getRepository(Favorite).findOne({ where: { id_users, id_product } })
    if (favorite) {
      result = await getConnection()
        .getRepository(Favorite)
        .save({ id: favorite.id, id_users: id_users, id_product: id_product, active: isActive })
    } else {
      result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Favorite)
        .values([
          {
            id_users: id_users,
            id_product: id_product,
            active: isActive,
          },
        ])
        .execute()
    }
    const favoriteProduct = await getConnection()
      .getRepository(Favorite)
      .find({ where: { id_product, active: true } })

    return res.status(httpStatus.OK).send({ success: true, message: 'success', favorites: favoriteProduct })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.OK).send({ success: false, message: 'failed adding product' })
  }
}

export const getFavoriteProduct = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, productId } = req.body
  const favorite = await getConnection()
    .getRepository(Favorite)
    .findOne({
      where: {
        id_users: userId,
        id_product: productId,
        active: true,
      },
    })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: favorite !== undefined })
}
