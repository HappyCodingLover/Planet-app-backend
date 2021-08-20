import * as passport from 'passport'

module.exports = (app) => {
  app.use(passport.initialize())
}
