import { EmailValidator } from './email-validator-protocols'

export class EmailValidatorAdapter implements EmailValidator {

  isValid (email: string): boolean {
    return false
  }

}
