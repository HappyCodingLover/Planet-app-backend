import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import * as path from 'path'
import { exec } from 'child_process'


export const mondialRelay = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const {countryCode, postcode} = req.body
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