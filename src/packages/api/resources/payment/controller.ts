import { NextFunction, Request, Response } from 'express'
import * as httpStatus from 'http-status'
import { getConnection } from 'typeorm'
import { User } from '~/packages/database/models/user'
import * as bcrypt from 'bcrypt'
import config from '~/config'
import * as jwt from 'jsonwebtoken'
import { Stripe } from 'stripe'

const publishablekey =
  'pk_test_51JQ3jtLamWI1rysgU4DjncE6xPZB6I5wAdmLULL3IAERP91dmLTz94zXCJeV6W5KAKN7NxVmsGVcspBdq4wF8LNx00zDhykceo'

const secretKey =
  'sk_test_51JQ3jtLamWI1rysgQNhND8agX5QZIU9MVvMGIqZlZjDj3gMD0d7awp0gSNOF2nrHgIkaXlYB0fdpePq2UbsmUpEr00LCaNhY8n'

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { amount, currency, payment_method_types } = req.body
  const stripe = new Stripe(secretKey, { apiVersion: '2020-08-27', typescript: true })
  const customer = await stripe.customers.create()
  const ephemeralKey = await stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: '2020-08-27' })
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: currency,
    payment_method_types: payment_method_types,
  })

  return res.status(httpStatus.OK).send({
    success: true,
    message: 'success',
    data: { paymentIntent: paymentIntent.client_secret, ephemeralKey: ephemeralKey.secret, customer: customer.id },
  })
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const user = req.body
  const foundUser = await getConnection()
    .getRepository(User)
    .createQueryBuilder('users')
    .where('users.email = :email', user)
    .getOne()
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
    },
    config.AUTH.TOKEN_SECRET,
    {
      expiresIn: config.AUTH.TOKEN_EXPIRATION_TIME,
    },
  )
  res.status(httpStatus.OK).json({ success: true, token: token })
}
