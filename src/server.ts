import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as morgan from 'morgan'
import * as jwt from 'jsonwebtoken'
import * as requestIp from 'request-ip'
import config from '~/config'
import * as fs from 'fs'
import * as path from 'path'
import { handleErrors } from '~/packages/api/middlewares/error'
import router from '~/packages/api/router'

const StatsD = require('node-statsd')
var stats = new StatsD()

stats.socket.on('error', function (error) {
  console.error(error.stack)
})

const logStream = fs.createWriteStream(path.join(__dirname, 'backend.log'), { flags: 'a' })

const app = express()

// app.use(responseTime(function (req, res, time) {
//   var stat = (req.method + req.url).toLowerCase()
//     .replace(/[:.]/g, '')
//     .replace(/\//g, '_')
//   stats.timing(stat, time)
//   console.log('__request', stat)
//   console.log('__time', time)
//   console.log('__stats', stats)
// }))

/// will use on production mode
/* eslint-disable @typescript-eslint/no-var-requires*/
require('./config/passportHandler')(app)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(
  morgan('dev', {
    skip: function (req, res) {
      return res.statusCode < 400
    },
    stream: logStream,
  }),
)

app.use(cors())
app.use(requestIp.mw())
app.use(function (req, res, next) {
  console.log(req.headers)
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'RLTracker') {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, config.AUTH.TOKEN_SECRET, function (err, decode) {
      if (err) {
        console.error('jwt_verify_err', err)
        req.user = err.message
        next()
      }
      req.user = decode
      next()
    })
  } else {
    req.user = undefined
    next()
  }
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use(handleErrors)

export default app
