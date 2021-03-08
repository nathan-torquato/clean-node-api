export interface Authentication {
  login (authenticationModel: AuthenticationModel): Promise<string>
}

export interface AuthenticationModel {
  email: string
  password: string
}
