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

 - Raman Mangla <ramanmangla@google.com>
 --------------
 ******/

import Knex from 'knex'
import Config from '../../../config/knexfile'
import ConsentModel, { Consent } from '../../../src/model/consent'

/*
 * Mock Consent Resources
 */
const partialConsent: Consent = {
  id: '1234',
  initiatorId: 'pisp-2342-2233',
  participantId: 'dfsp-3333-2123'
}

const completeConsent: Consent = {
  id: '1234',
  initiatorId: 'pisp-2342-2233',
  participantId: 'dfsp-3333-2123',
  credentialId: 123,
  credentialType: 'FIDO',
  credentialStatus: 'PENDING',
  credentialChallenge: 'xyhdushsoa82w92mzs',
  credentialPayload: 'dwuduwd&e2idjoj0w'
}

/*
 * Consent Resource Model Unit Tests
 */
describe('consent', (): void => {
  let Db: Knex
  let consentModel: ConsentModel

  beforeAll(async (): Promise<void> => {
    Db = Knex(Config.test)
    await Db.migrate.latest()

    consentModel = new ConsentModel(Db)
  })

  afterAll(async (): Promise<void> => {
    Db.destroy()
  })

  describe('registerConsent', (): void => {
    // Reset table for new test
    beforeEach(async (): Promise<void> => {
      await Db<Consent>('Consent').del()
    })

    it('adds consent with partial info to the database', async (): Promise<void> => {
      // Action
      await consentModel.registerConsent(partialConsent)

      // Assertion
      const consents: Consent[] = await Db<Consent>('Consent')
        .select('*')
        .where({
          id: partialConsent.id
        })

      delete consents[0].timeStamp

      expect(consents[0]).toEqual({
        id: '1234',
        initiatorId: 'pisp-2342-2233',
        participantId: 'dfsp-3333-2123',
        credentialId: null,
        credentialType: null,
        credentialStatus: null,
        credentialPayload: null,
        credentialChallenge: null
      })
    })

    it('returns an error on adding a consent with existing consentId', async (): Promise<void> => {
      // Action
      await consentModel.registerConsent(partialConsent)

      // Assertion
      const consents: Consent[] = await Db<Consent>('Consent')
        .select('*')
        .where({
          id: partialConsent.id
        })

      delete consents[0].timeStamp

      // Consent has been added
      expect(consents[0]).toEqual({
        id: '1234',
        initiatorId: 'pisp-2342-2233',
        participantId: 'dfsp-3333-2123',
        credentialId: null,
        credentialType: null,
        credentialStatus: null,
        credentialPayload: null,
        credentialChallenge: null
      })

      // Fail primary key constraint
      await expect(consentModel.registerConsent(partialConsent)).rejects.toMatchObject({
        code: 'SQLITE_CONSTRAINT',
        errno: 19
      })
    })
  })

  describe('updateCredentialsByConsentId', (): void => {
    // Reset table for new test
    beforeEach(async (): Promise<void> => {
      await Db<Consent>('Consent').del()
      // Inserting record to update
      await Db<Consent>('Consent')
        .insert(partialConsent)
    })

    it('updates credentials for existing consent', async (): Promise<void> => {
      // Action
      await consentModel.updateCredentialsByConsentId(completeConsent)

      // Assertion
      const consents: Consent[] = await Db<Consent>('Consent')
        .select('*')
        .where({
          id: completeConsent.id
        })

      delete consents[0].timeStamp

      expect(consents[0]).toEqual(completeConsent)
    })
  })

  describe('getConsentById', (): void => {
    // Reset table for new test
    beforeEach(async (): Promise<void> => {
      await Db<Consent>('Consent').del()
      await Db<Consent>('Consent')
        .insert(completeConsent)
    })

    it('retrieves an existing consent', async (): Promise<void> => {
      // Action
      const consents: Consent[] = await consentModel.getConsentById(completeConsent.id)

      delete consents[0].timeStamp

      // Assertion
      expect(consents[0]).toEqual(completeConsent)
    })
  })

  describe('deleteConsentById', (): void => {
    // Reset table for new test
    beforeEach(async (): Promise<void> => {
      await Db<Consent>('Consent').del()
      await Db<Consent>('Consent')
        .insert(completeConsent)
    })

    it('deletes an existing consent', async (): Promise<void> => {
      // Pre action Assertion
      let consents: Consent[] = await Db<Consent>('Consent')
        .select('*')
        .where({
          id: completeConsent.id
        })

      expect(consents.length).toEqual(1)

      // Action
      await consentModel.deleteConsentById(completeConsent.id)

      // Assertion
      consents = await Db<Consent>('Consent')
        .select('*')
        .where({
          id: completeConsent.id
        })

      expect(consents.length).toEqual(0)
    })
  })
})
