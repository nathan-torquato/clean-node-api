import { AddAccountModel, AccountModel } from '../../domain'

export interface AddAccountRepository {
  add (accountInput: AddAccountModel): Promise<AccountModel>
}
