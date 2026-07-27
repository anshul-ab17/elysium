'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { mockNFTs, mockCollections } from '../lib/mockData';
import { 
  Wallet, 
  Heart, 
  Star, 
  Compass, 
  ChevronRight
} from 'lucide-react';

export default function Portfolio() {
  const {
    connectedWallet,
    watchlist,
    favorites,
    setSelectedNft,
    setSelectedCollectionId,
    setView
  } = useStore();

  const [activeTab, setActiveTab] = useState<'items' | 'watchlist' | 'favorites'>('items');

  // Find NFTs owned by the user
  const ownedNfts = useMemo(() => {
    if (!connectedWallet) return [];
    return mockNFTs.filter(n => n.owner === connectedWallet.address);
  }, [connectedWallet]);

  // Find collections in the watchlist
  const watchlistedCollections = useMemo(() => {
    return mockCollections.filter(c => watchlist.includes(c.id));
  }, [watchlist]);

  // Find favorited NFTs
  const favoritedNfts = useMemo(() => {
    return mockNFTs.filter(n => favorites.includes(n.id));
  }, [favorites]);

  if (!connectedWallet) {
    return (
      <div className="flex-1 bg-black text-white p-8 font-mono select-none flex flex-col items-center justify-center text-center">
        <div className="max-w-md border border-[#222] bg-[#0c0c0c] p-8 rounded-xl flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-orange-600/20 border border-orange-500/50 flex items-center justify-center text-orange-500 text-xl font-bold animate-pulse">
            <Wallet className="h-6 w-6" />
          </div>
          <h2 className="text-md font-bold text-white uppercase tracking-wider">Wallet Disconnected</h2>
          <p className="text-zinc-500 text-xs leading-5">
            Connect your MetaMask, Phantom, Sui Wallet or Coinbase wallet using the button at the top header to view your cross-chain assets, watchlists, and transaction histories.
          </p>
          <button
            onClick={() => {
              // Click the top connect button by dispatching or simple instructions
              alert('Click the "CONNECT WALLET" button on the top right header to connect!');
            }}
            className="bg-orange-500 hover:bg-orange-600 text-black font-black text-xs px-5 py-2.5 rounded transition-transform active:scale-95"
          >
            HOW TO CONNECT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black text-white p-4 font-mono select-none flex flex-col gap-4">
      
      {/* 1. WALLET PORTFOLIO METRICS CARD */}
      <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-[#161616] border border-[#262626] flex items-center justify-center text-orange-500">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">Connected Wallet Address</div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span>{connectedWallet.address}</span>
              <span className="bg-zinc-800 text-zinc-400 border border-[#333] px-1.5 py-0.5 rounded text-[8px] uppercase font-semibold">
                {connectedWallet.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">WALLET BALANCE</div>
            <div className="text-sm font-black text-orange-400 mt-0.5">
              {connectedWallet.balance.toFixed(3)} {connectedWallet.type === 'evm' ? 'ETH' : connectedWallet.type === 'solana' ? 'SOL' : 'SUI'}
            </div>
          </div>
          <div className="h-8 w-px bg-[#222] self-center"></div>
          <div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase">OWNED ASSETS</div>
            <div className="text-sm font-black text-white mt-0.5">
              {ownedNfts.length} Items
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB TOGGLES */}
      <div className="flex items-center justify-between border-b border-[#1c1c1c]">
        <div className="flex gap-2 text-xs font-bold text-zinc-400">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 border-b-2 border-transparent transition-colors ${
              activeTab === 'items' ? 'border-orange-500 text-orange-500 font-black' : 'hover:text-white'
            }`}
          >
            MY COLLECTIBLES ({ownedNfts.length})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 border-b-2 border-transparent transition-colors ${
              activeTab === 'watchlist' ? 'border-orange-500 text-orange-500 font-black' : 'hover:text-white'
            }`}
          >
            WATCHED COLLECTIONS ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 border-b-2 border-transparent transition-colors ${
              activeTab === 'favorites' ? 'border-orange-500 text-orange-500 font-black' : 'hover:text-white'
            }`}
          >
            FAVORITED NFTS ({favorites.length})
          </button>
        </div>
      </div>

      {/* 3. DYNAMIC CONTENT VIEWER */}
      <div className="flex-1">
        
        {/* TAB 1: OWNED ITEMS */}
        {activeTab === 'items' && (
          <div>
            {ownedNfts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 border border-dashed border-[#222] rounded-lg">
                <Compass className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="font-bold">No aggregated items found in this wallet.</p>
                <p className="text-[10px] text-zinc-600 max-w-xs mt-1">
                  Browse marketplace collections, select listed NFTs, check out or sweep to see them appearing here.
                </p>
                <button
                  onClick={() => setView('rankings')}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs px-4 py-2 rounded transition-colors"
                >
                  EXPLORE MARKETPLACE
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {ownedNfts.map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => setSelectedNft(nft)}
                    className="group border border-[#222] bg-[#0c0c0c] rounded-lg overflow-hidden cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <div className="aspect-square bg-zinc-900 overflow-hidden relative">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] text-zinc-400 font-bold border border-[#222]">
                        #{nft.rarityRank}
                      </div>
                      <span className="absolute top-2 right-2 bg-zinc-950/80 px-1 py-0.5 rounded text-[7px] text-zinc-400 uppercase font-black">
                        {nft.chain}
                      </span>
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-white truncate">{nft.name}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{nft.collectionName}</div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#161616]">
                        <span className="text-[8px] text-emerald-400 font-black">OWNED BY YOU</span>
                        <span className="text-[9px] text-zinc-500 font-bold">Acquired</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WATCHLIST COLLECTIONS */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlistedCollections.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 border border-dashed border-[#222] rounded-lg">
                <Star className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="font-bold">Your collection watchlist is empty.</p>
                <p className="text-[10px] text-zinc-600 max-w-xs mt-1">
                  Click the star icon in the Rankings sheet to save collections for quick monitoring.
                </p>
                <button
                  onClick={() => setView('rankings')}
                  className="mt-4 bg-orange-500 hover:bg-orange-600 text-black font-black text-xs px-4 py-2 rounded transition-colors"
                >
                  GO TO RANKINGS
                </button>
              </div>
            ) : (
              <div className="border border-[#1c1c1c] bg-[#0c0c0c] rounded-lg overflow-hidden">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#1c1c1c] bg-[#111]/70 text-zinc-500 h-9 font-bold">
                      <th className="pl-4">COLLECTION</th>
                      <th className="text-right pr-6">FLOOR PRICE</th>
                      <th className="text-right pr-6">24H VOLUME</th>
                      <th className="text-right pr-6">TOTAL VOLUME</th>
                      <th className="text-right pr-4">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlistedCollections.map((col) => {
                      const currency = col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH';
                      return (
                        <tr
                          key={col.id}
                          className="border-b border-[#161616] hover:bg-[#151515] h-12 cursor-pointer group"
                        >
                          <td 
                            onClick={() => setSelectedCollectionId(col.id)}
                            className="pl-4 font-bold text-white"
                          >
                            <div className="flex items-center gap-2">
                              <img src={col.logo} alt="" className="w-7 h-7 rounded object-cover" />
                              <div>
                                <span className="group-hover:text-orange-400 text-xs">{col.name}</span>
                                <span className="text-[8px] text-zinc-500 block uppercase">{col.chain}</span>
                              </div>
                            </div>
                          </td>
                          <td 
                            onClick={() => setSelectedCollectionId(col.id)}
                            className="text-right pr-6 font-bold text-white"
                          >
                            {col.floorPrice} {currency}
                          </td>
                          <td 
                            onClick={() => setSelectedCollectionId(col.id)}
                            className="text-right pr-6 text-zinc-300"
                          >
                            {col.volume24h.toLocaleString()} {currency}
                          </td>
                          <td 
                            onClick={() => setSelectedCollectionId(col.id)}
                            className="text-right pr-6 text-zinc-400"
                          >
                            {col.volumeTotal.toLocaleString()} {currency}
                          </td>
                          <td className="pl-4">
                            <button
                              onClick={() => setSelectedCollectionId(col.id)}
                              className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-0.5"
                            >
                              TRADE <ChevronRight className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAVORITED NFTS */}
        {activeTab === 'favorites' && (
          <div>
            {favoritedNfts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 border border-dashed border-[#222] rounded-lg">
                <Heart className="h-8 w-8 text-zinc-600 mb-2" />
                <p className="font-bold">Your favorited NFTs list is empty.</p>
                <p className="text-[10px] text-zinc-600 max-w-xs mt-1">
                  Open any NFT details window and click the heart icon to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {favoritedNfts.map((nft) => (
                  <div
                    key={nft.id}
                    onClick={() => setSelectedNft(nft)}
                    className="group border border-[#222] bg-[#0c0c0c] rounded-lg overflow-hidden cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <div className="aspect-square bg-zinc-900 overflow-hidden relative">
                      <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] text-zinc-400 font-bold border border-[#222]">
                        #{nft.rarityRank}
                      </div>
                      <span className="absolute top-2 right-2 bg-zinc-950/80 px-1 py-0.5 rounded text-[7px] text-zinc-400 uppercase font-black">
                        {nft.chain}
                      </span>
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-white truncate">{nft.name}</div>
                      <div className="text-[9px] text-zinc-500 mt-0.5 truncate">{nft.collectionName}</div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#161616]">
                        <span className="text-[9px] text-orange-400 font-black">
                          {nft.price !== undefined ? `${nft.price} ${nft.currency}` : 'UNLISTED'}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-bold">VIEW DETAILS</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
