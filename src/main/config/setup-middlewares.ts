import { Express } from 'express'
import { bodyParser, cors } from '../middlewares'

export function setupMiddlewares (app: Express): void {
  app.use(bodyParser)
  app.use(cors)
}
