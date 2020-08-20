import { Request } from '@hapi/hapi'


/**
 * Validates whether request is valid
 * by comparing if source header matches participant ID
 * @param request: request received from switch
 */
export function isPostConsentRequestValid(request: Request): boolean {
  const payload = request.payload as PostConsentPayload
  const fspiopSource = request.headers[Enum.Http.Headers.FSPIOP.SOURCE]
  return (payload.participantId === fspiopSource)
}
