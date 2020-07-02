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
export interface Consent {
  id: string;
  initiatorId: string;
  participantId: string;
  credentialId?: number;
  credentialType?: string;
  credentialStatus?: string;
  credentialPayload?: string;
  credentialChallenge?: string;
  createdAt?: string;
}

/*
 * Class to abstract Consent DB operations
 */
export class ConsentDB {
  // Knex instance
  private Db: Knex
  // Nullable fields which don't allow for explicit null upsert
  private nullProtectedProps: string[]

  public constructor (dbInstance: Knex) {
    this.Db = dbInstance
    this.nullProtectedProps = [
      'credentialId',
      'credentialType',
      'credentialStatus',
      'credentialPayload',
      'credentialChallenge',
      'createdAt']
  }

  // Add initial Consent parameters
  public register (consent: Consent): Promise<Consent[]> {
    return this.Db<Consent>('Consent')
      .insert(consent)
  }

  // Update Consent credential
  // Only non-null Consent fields are updated
  public updateCredentials (consent: Consent): Promise<Consent[]> {
    const validatedConsent = {}

    for (const key of Object.keys(consent)) {
      // Only allow nullProtectedFields with non-null values for update
      if (this.nullProtectedProps.indexOf(key) !== -1 && Object(consent)[key]) {
        Object(validatedConsent)[key] = Object(consent)[key]
      }
    }

    return this.Db<Consent>('Consent')
      .where({ id: consent.id })
      .update(validatedConsent)
  }

  // Retrieve Consent by ID
  public retrieve (id: string): Promise<Consent[]> {
    return this.Db<Consent>('Consent')
      .select('*')
      .where({ id: id })
  }

  // Delete Consent by ID
  // Deleting Consent automatically deletes associates scopes
  public delete (id: string): Promise<Consent[]> {
    return this.Db<Consent>('consent')
      .where({ id: id })
      .del()
  }
}
