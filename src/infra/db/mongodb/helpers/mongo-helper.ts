import { Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  static client: MongoClient

  static async connect (uri: string): Promise<void> {
    if (!MongoHelper.client) {
      MongoHelper.client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
  }

  static getCollection <T = any>(name: string): Collection<T> {
    return MongoHelper.client.db().collection<T>(name)
  }

  static async disconnect (): Promise<void> {
    await MongoHelper.client.close()
  }
}
