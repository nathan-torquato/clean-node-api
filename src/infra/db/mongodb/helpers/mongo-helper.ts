import { MongoClient } from 'mongodb'

export class MongoHelper {
  static client: MongoClient

  async connect (uri: string): Promise<void> {
    if (!MongoHelper.client) {
      MongoHelper.client = await MongoClient.connect(uri || process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
  }

  async disconnect (): Promise<void> {
    await MongoHelper.client.close()
  }
}
