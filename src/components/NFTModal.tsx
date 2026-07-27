'use client';

import React from 'react';
import { useStore } from '../lib/store';
import { 
  X, 
  Heart, 
  ShoppingCart, 
  ShieldCheck, 
  Code
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function NFTModal() {
  const {
    selectedNft,
    setSelectedNft,
    addToCart,
    cart,
    favorites,
    toggleFavorite,
    setSelectedCollectionId
  } = useStore();

  if (!selectedNft) return null;

  const isFavorited = favorites.includes(selectedNft.id);
  const isInCart = cart.some(item => item.id === selectedNft.id);
  const activeCurrency = selectedNft.currency;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-[#090909] border border-[#222] rounded-xl overflow-hidden shadow-2xl font-mono text-xs text-white max-h-[90vh] flex flex-col md:flex-row"
      >
        
        {/* LEFT COLUMN: NFT IMAGE */}
        <div className="md:w-1/2 bg-[#050505] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1c1c1c]">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-zinc-950 border border-[#222] relative group">
            <img 
              src={selectedNft.image} 
              alt={selectedNft.name} 
              className="w-full h-full object-cover"
            />
            {/* Rarity Rank Tag */}
            <div className="absolute top-3 left-3 bg-black/85 border border-[#222] px-2.5 py-1 rounded text-[10px] font-bold text-orange-400">
              RARITY RANK #{selectedNft.rarityRank}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 text-[10px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5" />
              <span>Token ID: {selectedNft.tokenId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="uppercase">{selectedNft.chain} NETWORK</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: METADATA & ACTIONS */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col gap-5 justify-between">
          
          {/* Header section */}
          <div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedCollectionId(selectedNft.collectionId);
                  setSelectedNft(null);
                }}
                className="text-[10px] text-orange-500 hover:text-orange-400 font-bold hover:underline"
              >
                {selectedNft.collectionName.toUpperCase()}
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(selectedNft.id)}
                  className="p-1.5 rounded border border-[#222] bg-[#111] hover:border-red-500 hover:bg-[#1c1212] transition-colors text-zinc-400 hover:text-red-500"
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? 'text-red-500 fill-red-500' : ''}`} />
                </button>
                <button
                  onClick={() => setSelectedNft(null)}
                  className="p-1.5 rounded border border-[#222] bg-[#111] hover:border-white hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <h2 className="text-lg font-black text-white">{selectedNft.name}</h2>
              <ShieldCheck className="h-4 w-4 text-orange-500" />
            </div>

            {/* Description */}
            <p className="text-[10px] text-zinc-400 font-sans mt-2.5 leading-4">{selectedNft.description}</p>
          </div>

          {/* Owner Details */}
          <div className="grid grid-cols-2 gap-3 border-t border-b border-[#1c1c1c] py-3.5">
            <div>
              <span className="text-[9px] text-zinc-500 uppercase font-bold block">Current Owner</span>
              <span className="text-[11px] text-white font-bold block mt-0.5 truncate">{selectedNft.owner}</span>
            </div>
            <div>
              <span className="text-[9px] text-zinc-500 uppercase font-bold block">Contract Address</span>
              <span className="text-[11px] text-zinc-400 block mt-0.5 truncate">{selectedNft.contract}</span>
            </div>
          </div>

          {/* Attributes Bento Grid style cards (Kokonut UI style) */}
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-bold block mb-2">TRAITS & ATTRIBUTES</span>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {selectedNft.traits.map((t) => (
                <div key={t.type} className="border border-[#1f1f1f] bg-[#0d0d0d] p-2 rounded flex flex-col justify-between h-14">
                  <div className="flex items-center justify-between text-[8px] text-zinc-500 font-bold uppercase">
                    <span>{t.type}</span>
                    <span className="text-orange-400">{t.percentage}% have this</span>
                  </div>
                  <div className="flex items-end justify-between mt-1">
                    <span className="text-[10px] text-white font-bold truncate pr-1">{t.value}</span>
                    <span className="text-[9px] text-zinc-400 whitespace-nowrap">Floor: {t.floor} {activeCurrency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Checkout Actions */}
          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-lg flex flex-col gap-3 mt-auto">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[9px] text-zinc-500 font-bold block uppercase">CURRENT LISTING PRICE</span>
                <span className="text-lg font-black text-white mt-1 block">
                  {selectedNft.price !== undefined ? `${selectedNft.price} ${activeCurrency}` : 'UNLISTED'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-zinc-500 font-bold block uppercase">LAST TRANSFERRED</span>
                <span className="text-xs font-bold text-zinc-400 mt-1 block">
                  {selectedNft.lastSale} {activeCurrency}
                </span>
              </div>
            </div>

            {selectedNft.price !== undefined ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToCart(selectedNft);
                  }}
                  disabled={isInCart}
                  className={`flex-1 font-bold py-2.5 rounded transition-all flex items-center justify-center gap-1.5 ${
                    isInCart 
                      ? 'bg-[#181818] border border-[#333] text-zinc-500 cursor-not-allowed'
                      : 'bg-[#111] hover:bg-zinc-800 text-orange-500 border border-orange-500/20 active:scale-98'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isInCart ? 'IN SHOPPING CART' : 'ADD TO CART'}
                </button>
                <button
                  onClick={() => {
                    if (!isInCart) addToCart(selectedNft);
                    // Open cart
                  }}
                  className="bg-orange-500 hover:bg-orange-600 active:scale-98 text-black font-black px-6 py-2.5 rounded transition-transform"
                >
                  BUY INSTANTLY
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-[#181818] border border-[#222] text-zinc-600 font-bold py-2.5 rounded cursor-not-allowed"
              >
                OFFERS CURRENTLY DISABLED
              </button>
            )}
          </div>

        </div>

      </motion.div>
    </div>
  );
}
