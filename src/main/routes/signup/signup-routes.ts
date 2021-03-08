import { Router } from 'express'
import { expressRouteAdapter } from '../../adapters/express-route-adapter'
import { makeSignupController } from '../../factories/signup/signup'

export const signUpRoutes = (router: Router): void => {
  router.post('/signup', expressRouteAdapter(makeSignupController()))
}
