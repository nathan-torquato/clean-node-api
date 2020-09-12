import { AccountModel, AddAccountModel, AddAccountRepository } from '../../../../data'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountInput: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountInput)
    const account = result.ops[0]
    const { _id, ...accountWithoutId } = account
    return {
      id: _id,
      ...accountWithoutId,
    }
  }
}
