import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { User } from '~/packages/database/models/user'
import { Orders } from '~/packages/database/models/order'
import { OrderItems } from '~/packages/database/models/orderItems'
import { OrderStatus } from '~/packages/database/models/orders_status'
import { Products } from '~/packages/database/models/products'
import * as path from 'path'
import { exec } from 'child_process'

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, items, parcelShopId, merchant } = req.body

  const phpFilePath = path.resolve(__dirname, '../../../../../mondial-relay-web-api/sample-shipment-creation-v1.php')
  exec(
    `php ${phpFilePath} ${parcelShopId} ${merchant.address1} ${merchant.address2} ${merchant.address3} ${merchant.address4} ${merchant.city} ${merchant.countryCode}`,
    async (err, stdout, stderr) => {
      const xxx = stdout.substring(2)
      const data1 = JSON.parse(xxx)
      const data = {
        user_id: userId,
        status: 0,
        delivery_type: 0,
        shipmentNumber: data1.ShipmentNumber,
        tracking: data1.TrackingLink,
        labelLink: data1.LabelLink,
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
    },
  )
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
          if (_product) {
            const user = await getConnection()
              .getRepository(User)
              .findOne({ where: { id: _product.user_id } })
            return { quantity: item.quantity, product: _product, user: user.username }
          }
        }),
      )
      let totalAmount = 0
      orderItems.forEach((item) => {
        totalAmount += item.product_price * item.quantity
      })
      return {
        id: order.id,
        shipmentNumber: order.shipmentNumber,
        status: order.status,
        totalAmount: totalAmount,
        trackingLink: order.tracking,
        labelLink: order.labelLink,
        items: products,
      }
    }),
  )
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: arr })
}
