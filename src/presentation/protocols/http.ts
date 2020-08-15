export interface IHttpRequest<T = any> {
  body?: T
}

export interface IHttpResponse<T = any> {
  statusCode: number
  body: T
}
