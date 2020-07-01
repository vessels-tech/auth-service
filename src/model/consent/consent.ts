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

/*
 * Interface for Consent resource type
 */
export interface ConsentModel {
  id: string;
  initiatorId: string;
  participantId: string;
  credentialId?: number;
  credentialType?: string;
  credentialStatus?: string;
  credentialPayload?: string;
  credentialChallenge?: string;
  timeStamp?: string;
}

/*
 * Model Function for adding initial Consent parameters
 */
export async function registerConsent (consent: ConsentModel, Db: Knex): Promise<ConsentModel[]> {
  return Db<ConsentModel>('Consent')
    .insert(consent)
}

/*
 * Model Function for updating Consent credentials
 */
export async function updateCredentialsByConsentId (consent: ConsentModel, Db: Knex): Promise<ConsentModel[]> {
  // Ensure that only credential information is updated
  return Db<ConsentModel>('Consent')
    .where({ id: consent.id })
    .update({
      credentialId: consent.credentialId,
      credentialType: consent.credentialType,
      credentialStatus: consent.credentialStatus,
      credentialChallenge: consent.credentialChallenge,
      credentialPayload: consent.credentialPayload
    })
}

/*
 * Model Function for retrieving Consent resourse
 */
export async function getConsentById (id: string, Db: Knex): Promise<ConsentModel[]> {
  return Db<ConsentModel>('Consent')
    .select('*')
    .where({ id: id })
}

/*
 * Model Function for deleting Consent resourse
 * Deleting Consent automatically deletes associates scopes
 */
export async function deleteConsentById (id: string, Db: Knex): Promise<ConsentModel[]> {
  return Db<ConsentModel>('consent')
    .where({ id: id })
    .del()
}
