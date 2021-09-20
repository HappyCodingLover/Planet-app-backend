import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { Cities } from '~/packages/database/models/city'
import { Regions } from '~/packages/database/models/regions'
import { Departments } from '~/packages/database/models/department'

export const cities = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { id } = req.body
  const department = await getConnection()
    .getRepository(Departments)
    .findOne({ where: { id: id } })
  const cities = await getConnection().getRepository(Cities).find({ department_code: department.code })
  return res.status(httpStatus.OK).send({ success: true, message: 'success', data: cities })
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
