import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import * as path from 'path'
import { exec } from 'child_process'
import { Orders } from '~/packages/database/models/order'
import { getConnection } from 'typeorm'

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

export const createShipment = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { userId, parcelShopId, merchant } = req.body
  const phpFilePath = path.resolve(__dirname, '../../../../../mondial-relay-web-api/sample-shipment-creation-v1.php')
  exec(
    `php ${phpFilePath} ${parcelShopId} ${merchant.address1} ${merchant.address2} ${merchant.address3} ${merchant.address4} ${merchant.city} ${merchant.countryCode}`,
    async (err, stdout, stderr) => {
      if (err) {
        console.error('err in mondial relay', err.message)
        return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
      } else if (stderr) {
        console.error('err in mondial relay', stderr)
        return res.status(httpStatus.OK).send({ success: false, message: 'failed to call mondial relay' })
      } else {
        // console.log(stdout)
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
        return res.status(httpStatus.OK).send({ success: true, message: 'success', data: JSON.parse(xxx) })
        // return res.status(httpStatus.OK).send({ success: true, message: 'success' })
      }
    },
  )
}
