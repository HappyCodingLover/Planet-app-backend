import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { User } from '~/packages/database/models/user'
import { Cities } from '~/packages/database/models/city'
import { Regions } from '~/packages/database/models/regions'
import { Departments } from '~/packages/database/models/department'
import * as bcrypt from 'bcrypt'
import config from '~/config'
import * as jwt from 'jsonwebtoken'

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const data = req.body
    data.password = bcrypt.hashSync(data.password, 10)
    const exists = await getConnection()
      .getRepository(User)
      .createQueryBuilder('users')
      .where('users.email = :email', data)
      .getCount()
    if (exists) {
      return res.status(httpStatus.OK).send({ success: false, message: 'email already exist' })
    }

    const result = await getConnection().createQueryBuilder().insert().into(User).values([data]).execute()

    const token = jwt.sign({ email: req.body.email }, config.AUTH.TOKEN_SECRET, {
      expiresIn: config.AUTH.TOKEN_EXPIRATION_TIME,
    })

    const user = await getConnection()
      .getRepository(User)
      .findOne({ where: { email: data.email } })

    return res.status(httpStatus.OK).send({ success: true, token: token, data: user })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const user = req.body
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder('users')
    .where('users.email = :email', user)
    .getOne()
  const city = await getConnection()
    .getRepository(Cities)
    .findOne({ where: { id: foundUser.cities_id } })
  const department = await getConnection()
    .getRepository(Departments)
    .findOne({ where: { code: city.department_code } })
  const region = await getConnection()
    .getRepository(Regions)
    .findOne({ where: { code: department.region_code } })
  if (!foundUser) {
    return res.status(httpStatus.OK).send({ success: false, message: 'email not exists' })
  }
  const isPasswordCorrect = await bcrypt.compare(user.password, foundUser.password)
  if (!isPasswordCorrect) {
    return res.status(httpStatus.OK).send({ success: false, message: 'password mismatch' })
  }

  const token = jwt.sign(
    {
      email: foundUser.email,
      id: foundUser.id,
      name: foundUser.name,
      firstname: foundUser.firstname,
      username: foundUser.username,
      avatar: foundUser.avatar,
      cities_id: foundUser.cities_id,
      city: city,
      department: department,
      region: region,
    },
    config.AUTH.TOKEN_SECRET,
    {
      expiresIn: config.AUTH.TOKEN_EXPIRATION_TIME,
    },
  )
  res.status(httpStatus.OK).json({ success: true, token: token })
}
