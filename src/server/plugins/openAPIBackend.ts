import Path from 'path'
import Shared from '@mojaloop/central-services-shared'
import { Lifecycle } from '@hapi/hapi'

const makeOpenApiBackend = async (handlers: { [index: string]: Lifecycle.Method }) => {
  const pathToSwagger = Path.resolve(__dirname, '../../interface/swagger.json')
  const openapi = await Shared.Util.OpenapiBackend.initialise(pathToSwagger, handlers)
  return {
    plugin: {
      name: 'openapi',
      version: '1.0.0',
      multiple: true,
      //TODO: fix
      register: (server: any, options: any) => {
        server.expose('openapi', options.openapi)
      }
    },
    options: { 
      openapi
    }
  }
}

export default makeOpenApiBackend

