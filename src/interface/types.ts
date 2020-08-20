export interface ExternalScope {
  accountId: string;
  actions: string[];
}

export interface ExternalPostConsentPayload {
  id: string;
  initiatorId: string;
  participantId: string;
  scopes: ExternalScope[];
  credential: null;
}
