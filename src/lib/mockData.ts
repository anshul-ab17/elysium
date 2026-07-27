import { Collection, NFT, ActivityItem } from './types';

export const mockCollections: Collection[] = [
  {
    id: 'bayc',
    name: 'Bored Ape Yacht Club',
    logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    description: 'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain.',
    floorPrice: 22.45,
    volume24h: 342.15,
    volumeTotal: 1245000,
    volumeChange24h: 12.4,
    owners: 5420,
    items: 10000,
    listedCount: 380,
    chain: 'ethereum',
    verified: true,
    socials: { twitter: 'BoredApeYC', website: 'https://boredapeyachtclub.com' }
  },
  {
    id: 'madlads',
    name: 'Mad Lads',
    logo: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005198143-e528346d9a74?w=1200&auto=format&fit=crop&q=80',
    description: 'Mad Lads is the premier NFT collection on Solana, representing the culture, developers, and pioneers of the Coral ecosystem.',
    floorPrice: 78.5,
    volume24h: 1245.8,
    volumeTotal: 450000,
    volumeChange24h: -4.2,
    owners: 6810,
    items: 10000,
    listedCount: 195,
    chain: 'solana',
    verified: true,
    socials: { twitter: 'MadLads', website: 'https://madlads.com' }
  },
  {
    id: 'azuki',
    name: 'Azuki',
    logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1642525041071-0a0dd0f7ee67?w=1200&auto=format&fit=crop&q=80',
    description: 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where art, community, and culture fuse.',
    floorPrice: 5.12,
    volume24h: 184.6,
    volumeTotal: 620000,
    volumeChange24h: 8.7,
    owners: 4890,
    items: 10000,
    listedCount: 450,
    chain: 'ethereum',
    verified: true,
    socials: { twitter: 'AzukiOfficial', website: 'https://azuki.com' }
  },
  {
    id: 'suifrenz',
    name: 'SuiFrenz',
    logo: 'https://images.unsplash.com/photo-1644024541295-ac9f7f45c92c?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
    description: 'SuiFrenz are dynamic, customizable digital companions built natively on the Sui blockchain, showcasing dynamic on-chain metadata capabilities.',
    floorPrice: 420.0,
    volume24h: 15420.0,
    volumeTotal: 3800000,
    volumeChange24h: 22.8,
    owners: 8200,
    items: 8888,
    listedCount: 612,
    chain: 'sui',
    verified: true,
    socials: { twitter: 'SuiNetwork', website: 'https://sui.io' }
  },
  {
    id: 'pudgypenguins',
    name: 'Pudgy Penguins',
    logo: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
    description: 'Located in the freezing coldest regions of the blockchain, Pudgy Penguins are 8,888 cute, chubby penguins sliding around on Ethereum.',
    floorPrice: 8.92,
    volume24h: 245.9,
    volumeTotal: 410000,
    volumeChange24h: 3.5,
    owners: 5120,
    items: 8888,
    listedCount: 210,
    chain: 'ethereum',
    verified: true,
    socials: { twitter: 'pudgypenguins', website: 'https://pudgypenguins.com' }
  },
  {
    id: 'basegod',
    name: 'Based Gods',
    logo: 'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1634973357973-f2ed255753e1?w=1200&auto=format&fit=crop&q=80',
    description: 'A collection of 5,000 uniquely compiled divine entities ruling over the Base blockchain network.',
    floorPrice: 0.18,
    volume24h: 89.2,
    volumeTotal: 12500,
    volumeChange24h: 15.1,
    owners: 2400,
    items: 5000,
    listedCount: 145,
    chain: 'base',
    verified: true,
    socials: { twitter: 'BaseGods', website: 'https://base.org' }
  },
  {
    id: 'tensorians',
    name: 'Tensorians',
    logo: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    description: '10,000 Tensorians. The backbone of Tensor, Solana\'s leading pro-trader NFT aggregator.',
    floorPrice: 32.1,
    volume24h: 420.5,
    volumeTotal: 185000,
    volumeChange24h: -1.8,
    owners: 4230,
    items: 10000,
    listedCount: 220,
    chain: 'solana',
    verified: true,
    socials: { twitter: 'tensor_hq', website: 'https://tensor.trade' }
  },
  {
    id: 'lilpudgys',
    name: 'Lil Pudgys',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
    description: 'Lil Pudgys are a collection of 22,222 randomly generated NFTs on the Ethereum blockchain, representing the little companions to the Pudgy Penguins.',
    floorPrice: 0.89,
    volume24h: 92.4,
    volumeTotal: 98000,
    volumeChange24h: 11.2,
    owners: 7100,
    items: 22222,
    listedCount: 920,
    chain: 'ethereum',
    verified: true,
    socials: { twitter: 'pudgypenguins' }
  }
];

export const mockNFTs: NFT[] = [];

// Helper to generate NFTs for mock collections
const generateMockNFTs = () => {
  const imagePools: Record<string, string[]> = {
    bayc: [
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1644024541295-ac9f7f45c92c?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    ],
    madlads: [
      'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005198143-e528346d9a74?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80',
    ],
    azuki: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80',
    ]
  };

  const genericImages = [
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1644024541295-ac9f7f45c92c?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop&q=80'
  ];

  const traitTypes = ['Background', 'Fur / Clothes', 'Eyes', 'Mouth', 'Hat / Hair'];
  const traitValues = {
    Background: ['Cyber Orange', 'Deep Slate', 'Void Black', 'Plasma Green', 'Neon Pink', 'Neutral Gray'],
    'Fur / Clothes': ['Gold Armor', 'Trench Coat', 'Laser Hoodie', 'Cyberpunk Suit', 'T-Shirt', 'Biker Jacket'],
    Eyes: ['Laser Beams', 'Cyber Visor', 'Dead Eyes', 'VR Goggles', 'Sunglasses', 'Normal'],
    Mouth: ['Smirk', 'Cigar', 'Vape', 'Grin', 'Golden Teeth', 'Frowning'],
    'Hat / Hair': ['Cap Forward', 'Mohawk Neon', 'Crown', 'Cyber Helmet', 'Beanie', 'Sleek Long Hair']
  };

  mockCollections.forEach((col) => {
    const currency = col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH';
    const images = imagePools[col.id] || genericImages;

    // Generate 12 NFTs per collection
    for (let i = 1; i <= 12; i++) {
      const tokenId = (1000 + i * 87).toString();
      const imageIndex = (col.name.length + i) % images.length;
      
      // Traits generation
      const traits = traitTypes.map((t) => {
        const vals = traitValues[t as keyof typeof traitValues];
        const val = vals[(col.name.length * i + t.length) % vals.length];
        // Rarity percentage simulation
        const percentage = Number(((i * 7.7 + t.length * 3.3) % 25 + 1.2).toFixed(1));
        return {
          type: t,
          value: val,
          count: Math.round(col.items * (percentage / 100)),
          floor: Number((col.floorPrice * (1 + (20 - percentage) / 40)).toFixed(2)),
          percentage
        };
      });

      // Price mapping - some listings, some unlisted
      let price: number | undefined = undefined;
      if (i <= 8) {
        // Listed near floor price
        const markup = (i - 1) * 0.05 + Math.random() * 0.04;
        price = Number((col.floorPrice * (1 + markup)).toFixed(3));
      }

      const lastSaleMarkup = Math.random() * 0.2 - 0.1;
      const lastSale = Number((col.floorPrice * (1 + lastSaleMarkup)).toFixed(3));

      mockNFTs.push({
        id: `${col.id}-${tokenId}`,
        chain: col.chain,
        collectionId: col.id,
        collectionName: col.name,
        contract: `0x${col.id}_contract_address_mock`,
        tokenId,
        owner: `0x${(i * 12345).toString(16)}...${(i * 54321).toString(16)}`,
        creator: '0xelysium_creator_deployer',
        image: images[imageIndex],
        name: `${col.name} #${tokenId}`,
        description: `This is a premium aggregated NFT from the collection ${col.name} on the ${col.chain} network. Managed by Elysium Aggregator.`,
        traits,
        price,
        currency,
        verified: col.verified,
        floorPrice: col.floorPrice,
        lastSale,
        rarityRank: i * 83 + 12
      });
    }
  });
};

generateMockNFTs();

// Global Stats for ticker
export const mockGlobalStats = {
  gasEth: 18, // gwei
  ethPrice: 3410.50,
  solPrice: 154.20,
  suiPrice: 2.15,
  vol24hAll: 45890.12, // in USD
  activeChains: 6,
  status: 'All chains fully indexed and operational'
};

// Activity feed simulation
export const generateInitialActivity = (): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  const types: ('sale' | 'list' | 'transfer' | 'offer')[] = ['sale', 'list', 'transfer', 'offer'];
  
  for (let i = 0; i < 20; i++) {
    const nft = mockNFTs[i % mockNFTs.length];
    const type = types[(i * 3 + 1) % types.length];
    const secondsAgo = i * 45 + Math.floor(Math.random() * 30);
    const date = new Date(Date.now() - secondsAgo * 1000);
    
    let price: number | undefined = undefined;
    if (type === 'sale' || type === 'list' || type === 'offer') {
      price = Number((nft.floorPrice! * (1 + Math.random() * 0.15)).toFixed(3));
    }

    activities.push({
      id: `act-${i}-${Math.random().toString(36).substring(4)}`,
      type,
      nftId: nft.id,
      nftName: nft.name,
      nftImage: nft.image,
      collectionName: nft.collectionName,
      price,
      currency: nft.currency,
      from: `0x${(i * 3333).toString(16)}...${(i * 7777).toString(16)}`,
      to: type === 'sale' || type === 'transfer' ? `0x${(i * 9999).toString(16)}...${(i * 1111).toString(16)}` : undefined,
      timestamp: date.toISOString(),
      chain: nft.chain
    });
  }

  return activities;
};
