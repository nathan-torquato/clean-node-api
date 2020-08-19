import { IHttpRequest, IHttpResponse } from './http'

export interface IController {
  handle <T>(httpRequest: IHttpRequest<T>): Promise<IHttpResponse>
}
