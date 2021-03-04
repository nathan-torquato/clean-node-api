import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log'

describe('LogError Mongo Repository', () => {
  let logErrorsCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    logErrorsCollection = await MongoHelper.getCollection('errors')
    await logErrorsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  function makeSut (): LogErrorMongoRepository {
    return new LogErrorMongoRepository()
  }

  test('Should create an error log', async () => {
    const sut = makeSut()
    await sut.logError('any_error')
    const errorsCount = await logErrorsCollection.countDocuments()
    expect(errorsCount).toBe(1)
  })
})
