/*****
 License
 --------------
 Copyright © 2020 Mojaloop Foundation
 The Mojaloop files are made available by the Mojaloop Foundation under the
 Apache License, Version 2.0 (the 'License') and you may not use these files
 except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop
 files are distributed onan 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 ANY KIND, either express or implied. See the License for the specific language
 governing permissions and limitations under the License.
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

 - Abhimanyu Kapur <abhi.kapur09@gmail.com>
 - Lewis Daly <lewisd@crosslaketech.com>
 --------------
 ******/

import { consentDB, scopeDB } from '../lib/db'
import Logger from '@mojaloop/central-services-logger'
import { ConsentStatus, PostConsentPayload, Consent, ConsentCredential } from './types'
import { IncorrectConsentStatusError, IncorrectChallengeError } from './errors'


/**
 * Builds internal Consent and Scope objects from request payload
 * Stores the objects in the database
 * @param request request received from switch
 */
// TODO: this shouldn't know anything about the raw request!
export async function createAndStoreConsent(createConsentRequest: PostConsentPayload): Promise<void> {
  const consent: Consent = {
    id: createConsentRequest.id,
    initiatorId: createConsentRequest.initiatorId,
    participantId: createConsentRequest.participantId,
    status: ConsentStatus.ACTIVE
  }

  const scopes = createConsentRequest.scopes

  try {
    await consentDB.insert(consent)
    await scopeDB.insert(scopes)
  } catch (error) {
    Logger.push(error)
    Logger.error('Error: Unable to store consent and scopes')
    throw error
  }
}

export async function retrieveConsent(consentId: string): Promise<Consent> {
  const consentDAO = await consentDB.retrieve(consentId)

  //TODO: map to the Consent object!


  return {
    ...consentDAO
  }
}

/**
 * @function checkStatusAndChallenge
 * @description Checks the status of
 * @param consent
 * @param requestChallenge
 * @throws {IncorrectConsentStatusError} if the consent has been revoked
 * @throws {IncorrectChallengeError} if the challenge doesn't match the requestChallenge
 */
export function checkStatusAndChallenge(consent: Consent, requestChallenge: string): void {
  if (consent.status === ConsentStatus.REVOKED) {
    throw new IncorrectConsentStatusError(consent.id)
  }
  if (consent.credentialChallenge !== requestChallenge) {
    throw new IncorrectChallengeError(consent.id)
  }
}

/*
 * Updates the consent resource in the database with incoming request's
 * credential attributes.
 */
export async function updateConsentCredential(
  consent: Consent,
  credential: ConsentCredential): Promise<number> {
  if (!credential.credentialPayload || credential.credentialPayload === '') {
    throw new Error('Payload not given')
  }
  consent.credentialId = credential.credentialId
  consent.credentialStatus = credential.credentialStatus
  consent.credentialPayload = credential.credentialPayload as string
  return consentDB.update(consent)
}


// wtf? why is there 2 of these?
// export async function updateConsentCredential(
//   consent: Consent,
//   credential: ConsentCredential): Promise<Consent> {
//   // Update consent credentials
//   consent.credentialType = credential.credentialType
//   consent.credentialStatus = credential.credentialStatus
//   consent.credentialChallenge = credential.credentialChallenge
//   if (credential.credentialPayload) { // if Payload is non-null
//     consent.credentialPayload = credential.credentialPayload as string
//   }

//   // Update in database,
//   // relying on database validation for any null or relational aspects.
//   await consentDB.update(consent)
//   return consent
// }


/**
 * Revoke status of consent object, update in the database
 * and return consent
 */
export async function revokeConsent(
  consent: Consent): Promise<Consent> {
  if (consent.status === 'REVOKED') {
    Logger.push('Previously revoked consent was asked to be revoked')
    return consent
  }
  consent.status = 'REVOKED'
  consent.revokedAt = (new Date()).toISOString()
  await consentDB.update(consent)
  return consent
}
