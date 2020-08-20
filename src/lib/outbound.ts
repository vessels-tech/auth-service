


/*
  outbound - utils for formatting outbound calls etc...
*/

/**
 * Generate outgoing PATCH consent/{id}/revoke request body
 */
export function generatePatchRevokedConsentRequest(
  consent: Consent
): SDKStandardComponents.PatchConsentsRequest {
  if (consent.status !== 'REVOKED')
    throw new Error('Attempting to generate request for non-revoked consent!')

  const requestBody: SDKStandardComponents.PatchConsentsRequest = {
    status: 'REVOKED',
    revokedAt: consent.revokedAt as string
  }
  return requestBody
}


export async function buildConsentRequestBody(
  consent: Consent,
  signature: string,
  publicKey: string): Promise<PutConsentsRequest> {
  /* Retrieve the scopes pertinent to this consentId
   and populate the scopes accordingly. */
  const scopes: Scope[] = await scopeDB.retrieveAll(consent.id)
  const externalScopes: ExternalScope[] = convertScopesToExternal(scopes)

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
