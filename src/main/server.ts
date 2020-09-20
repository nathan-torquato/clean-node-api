import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import { app } from './config/app'
import { config } from './config/env'

MongoHelper.connect(config.mongoUrl)
  .then(() => {
    app.listen(config.port, () => console.log('uhu'))
  })
  .catch(console.log)
  .finally(() => console.log('finally'))
