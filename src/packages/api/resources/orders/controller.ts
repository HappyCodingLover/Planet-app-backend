import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { User } from '~/packages/database/models/user'
import { Orders } from '~/packages/database/models/order'
import { OrderItems } from '~/packages/database/models/orderItems'
import { OrderStatus } from '~/packages/database/models/orders_status'
import * as bcrypt from 'bcrypt'
import config from '~/config'
import * as jwt from 'jsonwebtoken'
import { Products } from '~/packages/database/models/products'

// export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//   const user = req.body
//   const foundUser = await getConnection()
//     .getRepository(User)
//     .createQueryBuilder('users')
//     .where('users.email = :email', user)
//     .getOne()
//   if (!foundUser) {
//     return res.status(httpStatus.OK).send({ success: false, message: 'email not exists' })
//   }
//   const isPasswordCorrect = await bcrypt.compare(user.password, foundUser.password)
//   if (!isPasswordCorrect) {
//     return res.status(httpStatus.OK).send({ success: false, message: 'password mismatch' })
//   }

//   const token = jwt.sign(
//     {
//       email: foundUser.email,
//       id: foundUser.id,
//       name: foundUser.name,
//       firstname: foundUser.firstname,
//       username: foundUser.username,
//     },
//     config.AUTH.TOKEN_SECRET,
//     {
//       expiresIn: config.AUTH.TOKEN_EXPIRATION_TIME,
//     },
//   )
//   res.status(httpStatus.OK).json({ success: true, token: token })
// }

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, items } = req.body
  const data = {
    user_id: userId,
    status: 0,
    delivery_type: 0,
  }
  const result = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Orders)
    .values([data])
    .returning('id')
    .execute()
  const arr = await Promise.all(
    items.map(async (product: any) => {
      return { ...product, order_id: result.identifiers[0].id }
    }),
  )
  const result2 = await getConnection().createQueryBuilder().insert().into(OrderItems).values(arr).execute()
  return res.status(httpStatus.OK).send({ success: true, message: 'success' })
}

export const myTotalTransactionAmount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { user_id } = req.body
  const orders = await getConnection().getRepository(Orders).find({ where: { user_id } })
  const arr = await Promise.all(
    orders.map(async (order: any) => {
      const sum = await getConnection()
        .createQueryBuilder(OrderItems, 'orderItems')
        .where('orderItems.order_id = :id', { id: order.id })
        .select('SUM(orderItems.product_price)', 'sum')
        .getRawOne()
      return sum
    }),
  )
  let val = 0
  arr.forEach((sum) => {
    if (sum.sum) val = val + parseInt(sum.sum)
  })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: val })
}

export const transactionHistory = async (req: Request, res: Response): Promise<any> => {
  const { user_id } = req.body
  const orders = await getConnection().getRepository(Orders).find({ where: { user_id } })
  const arr = await Promise.all(
    orders.map(async (order: any) => {
      const orderItems = await getConnection()
        .getRepository(OrderItems)
        .find({ where: { order_id: order.id } })
      const products = await Promise.all(
        orderItems.map(async (item: any) => {
          const _product = await getConnection()
            .getRepository(Products)
            .findOne({ where: { id: item.product_id } })
          const user = await getConnection()
            .getRepository(User)
            .findOne({ where: { id: _product.user_id } })
          return { quantity: item.quantity, product: _product, user: user.username }
        }),
      )
      return { id: order.id, items: products }
    }),
  )
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: arr })
}
