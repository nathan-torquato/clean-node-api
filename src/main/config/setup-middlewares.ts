import { Express } from 'express'
import { bodyParser } from '../middlewares'

export function setupMiddlewares (app: Express): void {
  app.use(bodyParser)
}
