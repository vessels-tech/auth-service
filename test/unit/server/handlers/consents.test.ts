import { Request } from "@hapi/hapi"
import { mockResponseToolkit } from 'test/unit/__mocks__/responseToolkit'

import { post } from '~/server/handlers/consents'


describe('consents', () => {
  beforeAll((): void => {
    // mockIsPostRequestValid.mockReturnValue(true)
    // mockStoreConsent.mockResolvedValue()
    // mockLoggerError.mockReturnValue(null)
    // mockLoggerPush.mockReturnValue(null)
    jest.useFakeTimers()
  })

  beforeEach((): void => {
    jest.clearAllTimers()
    jest.clearAllMocks()
  })

  describe('post', () => {
    it('fails if the participantId is not the same as the fspiop source header', async () => {
      // Arrange
      const request: Request = {
        headers: {
          'FSPIOP-Source': 'pisp-2342-2233',
          'FSPIOP-Destination': 'dfsp-3333-2123'
        },
        params: {
          id: '1234'
        },
        payload: {
          id: '1234',
          requestId: '475234',
          initiatorId: 'pispa',
          participantId: 'sfsfdf23',
          scopes: [
            {
              accountId: '3423',
              actions: ['acc.getMoney', 'acc.sendMoney']
            },
            {
              accountId: '232345',
              actions: ['acc.accessSaving']
            }
          ],
          credential: null
        }
      } as unknown as Request

      // Act
      const response = post(request, mockResponseToolkit)

      // Assert
      expect(response.statusCode).toBe(202)
    })

    it.todo('returns a 202 response synchonously')
    it.todo('calls createAndStoreConsent asynchonously')
  })
})
