import bcrypt from 'bcrypt'
import { Encrypter } from '../../data/protocols'

export class BcryptAdapter implements Encrypter {

  constructor (private readonly salt = 12) {}

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
