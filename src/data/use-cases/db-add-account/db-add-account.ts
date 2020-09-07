import { AddAccount, AddAccountModel, AccountModel } from '../../../domain'
import { Encrypter } from '../../protocols'

export class DbAddAccount implements AddAccount {

  constructor (private readonly encrypter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return null
  }
}
