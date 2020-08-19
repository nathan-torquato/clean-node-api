import { AccountModel } from '../models'

export interface AddAccount {
  add (accountInput: AddAccountModel): Promise<AccountModel>
}

export interface AddAccountModel {
  name: string
  email: string
  password: string
}
