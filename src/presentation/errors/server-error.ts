export class ServerError extends Error {
  constructor () {
    super('Internal server error. Contact administration.')
    this.name = 'ServerError'
  }
}
