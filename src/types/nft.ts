export interface CertificateMetadata {
  name: string;
  description: string;
  issuer: string;
  issuanceDate: string;
  expiryDate?: string;
}

export type DeliveryMethod = 'wallet' | 'email';

export interface MintingDetails {
  deliveryMethod: DeliveryMethod;
  email?: string;
  walletAddress?: string;
}

export interface NFTDetails {
  mintingId: string;
  status: string;
  onChain: {
    contractAddress?: string;
    tokenId?: string;
  };
  transactionHash?: string;
}