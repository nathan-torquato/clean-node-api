import { LogErrorRepository } from '../../../../data'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const collection = await MongoHelper.getCollection('errors')
    await collection.insertOne({
      stack,
      date: new Date()
    })
  }
}
