import express from 'express'
import { setupMiddlewares } from './setup-middlewares'

export const app = express()
setupMiddlewares(app)
