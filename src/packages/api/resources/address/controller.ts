import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Cities } from '~/packages/database/models/city'
import { Regions } from '~/packages/database/models/regions'
import { Departments } from '~/packages/database/models/department'
import * as path from 'path'
import { exec } from 'child_process'

export const cities = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.body
  const department = await getConnection()
    .getRepository(Departments)
    .findOne({ where: { id: id } })
  const cities = await getConnection().getRepository(Cities).find({ department_code: department.code })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: cities })
}

export const getCityByPostcode = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { postcode } = req.body
  const city = await getConnection()
    .getRepository(Cities)
    .findOne({ where: { zip_code: postcode } })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: city })
}

export const getPointRelaysByCity = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const {countryCode, city} = req.body
  const _city = await getConnection()
  .getRepository(Cities).findOne({where: {slug: city.toLowerCase() }})
  const postcode = _city.zip_code
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

export const regions = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const regions = await getConnection().getRepository(Regions).find()
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: regions })
}

export const departments = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.body
  const region = await getConnection().getRepository(Regions).findOne({ id: id })
  const departments = await getConnection().getRepository(Departments).find({ region_code: region.code })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: departments })
}
