import { create } from 'zustand';
import { NFT, ActivityItem, Wallet } from './types';
import { mockNFTs, generateInitialActivity } from './mockData';

interface ElysiumState {
  // Wallet
  connectedWallet: Wallet | null;
  connectWallet: (walletType: string, chain: 'evm' | 'solana' | 'sui') => void;
  disconnectWallet: () => void;
  
  // Navigation & Views
  activeView: 'rankings' | 'collection' | 'portfolio' | 'activity';
  setView: (view: 'rankings' | 'collection' | 'portfolio' | 'activity') => void;
  selectedCollectionId: string | null;
  setSelectedCollectionId: (id: string | null) => void;
  selectedNft: NFT | null;
  setSelectedNft: (nft: NFT | null) => void;
  
  // Filter & Search
  selectedChain: string | null; // 'ethereum' | 'solana' | 'sui' | 'polygon' | 'arbitrum' | 'base' | null
  setSelectedChain: (chain: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Custom View Mode: Blur specific Pro vs Collector
  viewMode: 'trader' | 'collector';
  toggleViewMode: () => void;
  
  // Watchlist & Favorites
  watchlist: string[]; // collectionIds
  toggleWatchlist: (collectionId: string) => void;
  favorites: string[]; // nftIds
  toggleFavorite: (nftId: string) => void;
  
  // Cart & Sweep
  cart: NFT[];
  addToCart: (nft: NFT) => void;
  removeFromCart: (nftId: string) => void;
  clearCart: () => void;
  sweepFloor: (collectionId: string, count: number) => void;
  
  // Activity Feed
  activities: ActivityItem[];
  addActivity: (activity: ActivityItem) => void;
  
  // Execution Simulation
  purchaseSuccess: boolean;
  setPurchaseSuccess: (success: boolean) => void;
  isPurchasing: boolean;
  buyCartNfts: () => Promise<void>;
}

export const useStore = create<ElysiumState>((set, get) => {
  // Try to load initial localStorage state on client side if window is defined
  const getInitialList = (key: string): string[] => {
    if (typeof window !== 'undefined') {
      try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  return {
    connectedWallet: null,
    connectWallet: (walletType: string, chain: 'evm' | 'solana' | 'sui') => {
      let address = '';
      let balance = 0;
      if (chain === 'evm') {
        address = '0x71C765...D4F8a';
        balance = 12.84; // ETH
      } else if (chain === 'solana') {
        address = 'HN7cAB...98kLm';
        balance = 45.20; // SOL
      } else {
        address = '0x3ef89d...12a9c';
        balance = 1250.0; // SUI
      }
      set({
        connectedWallet: {
          address,
          name: walletType,
          type: chain,
          balance,
          connected: true
        }
      });
    },
    disconnectWallet: () => set({ connectedWallet: null }),
    
    activeView: 'rankings',
    setView: (view) => set({ activeView: view }),
    selectedCollectionId: null,
    setSelectedCollectionId: (id) => {
      if (id) {
        set({ selectedCollectionId: id, activeView: 'collection' });
      } else {
        set({ selectedCollectionId: null });
      }
    },
    selectedNft: null,
    setSelectedNft: (nft) => set({ selectedNft: nft }),
    
    selectedChain: null,
    setSelectedChain: (chain) => set({ selectedChain: chain }),
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    
    viewMode: 'trader',
    toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === 'trader' ? 'collector' : 'trader' })),
    
    watchlist: getInitialList('elysium_watchlist'),
    toggleWatchlist: (collectionId) => {
      set((state) => {
        const newWatchlist = state.watchlist.includes(collectionId)
          ? state.watchlist.filter(id => id !== collectionId)
          : [...state.watchlist, collectionId];
        if (typeof window !== 'undefined') {
          localStorage.setItem('elysium_watchlist', JSON.stringify(newWatchlist));
        }
        return { watchlist: newWatchlist };
      });
    },
    
    favorites: getInitialList('elysium_favorites'),
    toggleFavorite: (nftId) => {
      set((state) => {
        const newFavorites = state.favorites.includes(nftId)
          ? state.favorites.filter(id => id !== nftId)
          : [...state.favorites, nftId];
        if (typeof window !== 'undefined') {
          localStorage.setItem('elysium_favorites', JSON.stringify(newFavorites));
        }
        return { favorites: newFavorites };
      });
    },
    
    cart: [],
    addToCart: (nft) => {
      set((state) => {
        if (state.cart.some(item => item.id === nft.id)) return {}; // already in cart
        return { cart: [...state.cart, nft] };
      });
    },
    removeFromCart: (nftId) => {
      set((state) => ({
        cart: state.cart.filter(item => item.id !== nftId)
      }));
    },
    clearCart: () => set({ cart: [] }),
    
    sweepFloor: (collectionId, count) => {
      // Find the cheapest listed NFTs in the collection
      const collectionNfts = mockNFTs
        .filter(n => n.collectionId === collectionId && n.price !== undefined)
        .sort((a, b) => a.price! - b.price!);
      
      const toAdd = collectionNfts.slice(0, count);
      
      set((state) => {
        const existingCartIds = new Set(state.cart.map(item => item.id));
        const filteredToAdd = toAdd.filter(nft => !existingCartIds.has(nft.id));
        return {
          cart: [...state.cart, ...filteredToAdd]
        };
      });
    },
    
    activities: generateInitialActivity(),
    addActivity: (activity) => {
      set((state) => ({
        activities: [activity, ...state.activities.slice(0, 99)]
      }));
    },
    
    purchaseSuccess: false,
    setPurchaseSuccess: (success) => set({ purchaseSuccess: success }),
    isPurchasing: false,
    buyCartNfts: async () => {
      const { cart } = get();
      if (cart.length === 0) return;
      
      set({ isPurchasing: true, purchaseSuccess: false });
      
      // Simulate chain RPC delay & signature check
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Execute simulated purchase (remove purchased NFTs from listing price to simulate they were bought)
      set((state) => {
        // Mark these NFTs as sold (remove price and change owner)
        cart.forEach(cartItem => {
          const matchedNft = mockNFTs.find(n => n.id === cartItem.id);
          if (matchedNft) {
            matchedNft.owner = state.connectedWallet?.address || '0xelysium_user_address';
            matchedNft.price = undefined;
          }
        });
        
        return {
          cart: [],
          isPurchasing: false,
          purchaseSuccess: true
        };
      });
    }
  };
});
