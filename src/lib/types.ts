export type Trait = {
  type: string;
  value: string;
  count?: number;
  floor?: number;
  percentage?: number;
};

export type NFT = {
  id: string;
  chain: 'ethereum' | 'solana' | 'sui' | 'polygon' | 'arbitrum' | 'base';
  collectionId: string;
  collectionName: string;
  contract: string;
  tokenId: string;
  owner: string;
  creator: string;
  image: string;
  name: string;
  description?: string;
  traits: Trait[];
  price?: number; // In native currency (ETH/SOL/SUI)
  currency: string;
  verified: boolean;
  floorPrice?: number;
  lastSale?: number;
  rarityRank?: number;
};

export type Collection = {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  floorPrice: number;
  volume24h: number;
  volumeTotal: number;
  volumeChange24h: number; // percentage change
  owners: number;
  items: number;
  listedCount: number;
  chain: 'ethereum' | 'solana' | 'sui' | 'polygon' | 'arbitrum' | 'base';
  verified: boolean;
  socials: {
    twitter?: string;
    discord?: string;
    website?: string;
  };
};

export type ActivityItem = {
  id: string;
  type: 'sale' | 'list' | 'transfer' | 'offer';
  nftId: string;
  nftName: string;
  nftImage: string;
  collectionName: string;
  price?: number;
  currency: string;
  from: string;
  to?: string;
  timestamp: Date | string;
  chain: string;
};

export type Wallet = {
  address: string;
  name: string; // e.g., "MetaMask", "Phantom"
  type: 'evm' | 'solana' | 'sui';
  balance: number;
  connected: boolean;
};
