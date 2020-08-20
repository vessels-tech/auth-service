


/*
  outbound - utils for formatting outbound calls etc...
*/

import { Consent, ConsentStatus } from '~/domain/types'
import { ExternalScope } from './scopes'
import SDKStandardComponents from '@mojaloop/sdk-standard-components'


/**
 * Generate outgoing PATCH consent/{id}/revoke request body
 *
 */
// TODO: can we extend the types to make sure that Consent.status is actually revoked?
export function generatePatchRevokedConsentRequest(status: ConsentStatus.REVOKED, revokedAt: string): SDKStandardComponents.PatchConsentsRequest {
  const requestBody: SDKStandardComponents.PatchConsentsRequest = {
    status,
    revokedAt
  }
  return requestBody
}


// export async function buildConsentRequestBody(
//   consent: Consent,
//   signature: string,
//   publicKey: string): Promise<PutConsentsRequest> {
//   /* Retrieve the scopes pertinent to this consentId
//    and populate the scopes accordingly. */
//   const scopes: Scope[] = await scopeDB.retrieveAll(consent.id)
//   const externalScopes: ExternalScope[] = convertScopesToExternal(scopes)


export function buildConsentRequestBody(consent: Consent, signature: string, externalScopes: ExternalScope[]): SDKStandardComponents.PutConsentsRequest
  const consentBody: PutConsentsRequest = {
    requestId: consent.id,
    scopes: externalScopes,
    initiatorId: consent.initiatorId as string,
    participantId: consent.participantId as string,
    credential: {
      id: consent.credentialId as string,
      credentialType: 'FIDO',
      status: CredentialStatusEnum.VERIFIED,
      challenge: {
        payload: consent.credentialChallenge as string,
        signature: signature
      },
      payload: publicKey
    }
  }
  return consentBody
}


/**
 * Builds body of outgoing request and makes PUT consents/{ID} call to server
 * @param consent Consent object with credential challenge, type and status
 * @param headers headers from PISP generate challenge request
 */
export function generatePutConsentsRequest(consent: Consent, scopes: ExternalScope[]):SDKStandardComponents.PutConsentsRequest {
  // Construct body of outgoing request
  const body: SDKStandardComponents.PutConsentsRequest = {
    requestId: consent.id,
    initiatorId: consent.initiatorId as string,
    participantId: consent.participantId as string,
    scopes,
    credential: {
      id: null,
      credentialType: consent.credentialType as 'FIDO',
      status: consent.credentialStatus as 'PENDING',
      challenge: {
        payload: consent.credentialChallenge as string,
        signature: null
      },
      payload: consent.credentialPayload || null
    }
  }
  return body
}
