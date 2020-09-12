import { AccountModel, AddAccountModel, AddAccountRepository } from '../../../../data'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountInput: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountInput)
    return MongoHelper.normaliseId<AccountModel>(result.ops[0])
  }
}
