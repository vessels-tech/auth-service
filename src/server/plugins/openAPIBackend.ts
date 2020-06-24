/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the 'License') and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Crosslake
 - Lewis Daly <lewisd@crosslaketech.com>

 --------------
 ******/

import Path from 'path'
import Shared from '@mojaloop/central-services-shared'
import handlers from '../handlers'
import { Request, ResponseToolkit } from '@hapi/hapi'

const makeOpenApiBackend = async () => {
  const pathToSwagger = Path.resolve(__dirname, '../../interface/swagger.json')
  const openapi = await Shared.Util.OpenapiBackend.initialise(pathToSwagger, handlers)
  return {
    plugin: {
      name: 'openapi',
      version: '1.0.0',
      multiple: true,
      //TODO: fix
      register: (server: any, options: any) => {
        // TODO: unfortunately openapi-backend uses a catchall router
        // so we don't get nice printing of routes
        // Refer to ticket #351
        // https://app.zenhub.com/workspaces/pisp-5e8457b05580fb04a7fd4878/issues/mojaloop/mojaloop/351
        server.route({
          method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
          path: '/{path*}',
          handler: (req: Request, h: ResponseToolkit) =>
            openapi.handleRequest(
              req,
              h,
            ),
        });

        server.expose('openapi', options.openapi)
      }
    },
    options: { 
      openapi
    }
  }
}

export default makeOpenApiBackend

