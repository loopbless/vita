import uWebSockets from 'uWebSockets.js'
import type { AnyRouter } from '@trpc/server'
import { createTRpcContext } from './context.js'
import { createUWebSocketsHandler } from 'trpc-uwebsockets'
import utils from 'trpc-uwebsockets/dist/utils.js'

const originEAWHReq = utils.extractAndWrapHttpRequest;
utils.extractAndWrapHttpRequest = (prefix, req) => {
  const nReq = originEAWHReq(prefix, req)
  return {...nReq, url: nReq.url.replace(/\//g, '.')}
}

export class Server {
  private _app: uWebSockets.TemplatedApp

  constructor() {
    this._app = uWebSockets.App({})
  }

  trpc(router: AnyRouter) {
    createUWebSocketsHandler(this._app, '', {
      router,
      createContext: createTRpcContext,
      responseMeta(opts) {
        return {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      },
    })
    this._app.any('/*', (res) => {
      res.writeStatus('404 NOT FOUND')
      res.end()
    })
  }

  listen(port: number): Promise<void>
  listen(host: uWebSockets.RecognizedString, port: number): Promise<void>
  listen(port: number, options: uWebSockets.ListenOptions): Promise<void>
  listen(...args: any) {
    return new Promise((resolve, reject) => {
      this._app.listen.apply(
        this._app,
        args.concat((listenSocket: any) => {
          listenSocket ? resolve(listenSocket) : reject(listenSocket)
        })
      )
    })
  }
}
