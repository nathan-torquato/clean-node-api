import { Collection, MongoClient } from 'mongodb'

export class MongoHelper {
  private static uri: string
  private static client: MongoClient

  static async connect (uri: string): Promise<void> {
    this.uri = uri

    if (!MongoHelper.client) {
      MongoHelper.client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    }
  }

  static async getCollection <T = any>(name: string): Promise<Collection<T>> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }

    return MongoHelper.client.db().collection<T>(name)
  }

  static async disconnect (): Promise<void> {
    await MongoHelper.client.close()
    this.client = null
  }

  static normaliseId<T> (entity: any): T {
    const { _id, ...entityWithoutId } = entity
    return {
      id: _id,
      ...entityWithoutId,
    }
  }

}
