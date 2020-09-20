import express from 'express'
import { setupMiddlewares } from './setup-middlewares'
import { setupRoutes } from './setup-routes'

export const app = express()
setupMiddlewares(app)
setupRoutes(app)
