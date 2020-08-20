
export interface PostConsentPayload {
  id: string;
  initiatorId: string;
  participantId: string;
  scopes: Scope[];
  credential: null;
}

export interface Scope {
  id?: number;
  consentId: string;
  action: string;
  accountId: string;
}

export enum ConsentStatus {
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED'
}


export interface Consent {
  id: string;
  initiatorId: string;
  participantId: string;
  status: string;
  // TODO: can we make these less undefined!!!!
  credentialId?: string;
  credentialType?: string;
  credentialStatus?: string;
  credentialPayload?: string;
  credentialChallenge?: string;
  createdAt?: Date;
  revokedAt?: string;
}

export enum CredentialStatusEnum {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
}

export interface ConsentCredential {
  credentialId?: string;
  credentialType: 'FIDO';
  credentialStatus: CredentialStatusEnum;
  credentialPayload: string | null;
  credentialChallenge: string;
}



