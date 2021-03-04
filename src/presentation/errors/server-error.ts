export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server error. Contact administration.')
    this.name = 'ServerError'
    this.stack = stack
  }
}
