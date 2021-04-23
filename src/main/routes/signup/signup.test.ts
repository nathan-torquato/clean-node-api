import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper'
import { app } from '../../config/app'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async (done) => {
    const signupDTO = {
      name: 'Nathan Torquato',
      email: 'nathan@torquato.io',
      password: 'strong_password',
      passwordConfirmation: 'strong_password',
    }

    const response = await request(app)
      .post('/api/signup')
      .send(signupDTO)

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body.name).toBe(signupDTO.name)
    expect(response.body.email).toBe(signupDTO.email)
    expect(response.body.password).not.toBe(signupDTO.password)
    expect(response.body.password).toBeDefined()

    done()
  })
})
