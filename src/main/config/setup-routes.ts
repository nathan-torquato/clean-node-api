import { Express, Router } from 'express'
import { signUpRoutes } from '../routes/signup/signup-routes'

export function setupRoutes (app: Express): void {
  const router = Router()
  app.use('/api', router)
  signUpRoutes(router)
}
