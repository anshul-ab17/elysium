'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '../lib/store';
import { mockCollections } from '../lib/mockData';
import { Star, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Rankings() {
  const {
    watchlist,
    toggleWatchlist,
    setSelectedCollectionId,
    selectedChain,
    setSelectedChain
  } = useStore();

  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const [filterWatchlist, setFilterWatchlist] = useState<boolean>(false);

  // Chains configuration
  const chains = [
    { id: null, name: 'ALL CHAINS' },
    { id: 'ethereum', name: 'ETHEREUM', symbol: 'ETH', color: 'bg-indigo-600' },
    { id: 'solana', name: 'SOLANA', symbol: 'SOL', color: 'bg-emerald-600' },
    { id: 'sui', name: 'SUI', symbol: 'SUI', color: 'bg-sky-500' },
    { id: 'base', name: 'BASE', symbol: 'ETH', color: 'bg-blue-600' },
    { id: 'polygon', name: 'POLYGON', symbol: 'POL', color: 'bg-purple-600' },
    { id: 'arbitrum', name: 'ARBITRUM', symbol: 'ETH', color: 'bg-cyan-600' }
  ];

  // Filtering collections based on store selected chain and watchlist filter
  const filteredCollections = useMemo(() => {
    let list = mockCollections;
    
    if (selectedChain) {
      list = list.filter(c => c.chain === selectedChain);
    }
    
    if (filterWatchlist) {
      list = list.filter(c => watchlist.includes(c.id));
    }
    
    // Sort by 24h Volume descending
    return [...list].sort((a, b) => b.volume24h - a.volume24h);
  }, [selectedChain, filterWatchlist, watchlist]);

  const featuredCollections = useMemo(() => {
    // Get top 3 collections based on total volume
    return [...mockCollections].sort((a, b) => b.volumeTotal - a.volumeTotal).slice(0, 3);
  }, []);

  return (
    <div className="flex-1 bg-black text-white p-4 font-mono select-none">
      
      {/* 1. HERO SPOTLIGHT BANNER (Kokonut UI Inspired Bento Grid/Slide cards) */}
      {!filterWatchlist && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredCollections.map((col, idx) => (
            <motion.div
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              whileHover={{ scale: 1.01, y: -2 }}
              className="relative h-36 rounded-lg border border-[#222] bg-zinc-950 p-4 flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              {/* Decorative Glow Background */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl group-hover:bg-orange-600/20 transition-all duration-500"></div>
              
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <img src={col.logo} alt={col.name} className="w-10 h-10 rounded object-cover border border-[#333]" />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs group-hover:text-orange-400 transition-colors">{col.name}</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase">{col.chain}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#151515] border border-[#222] px-2 py-0.5 rounded text-[10px] text-zinc-400">
                  <Award className="h-3 w-3 text-amber-500" />
                  <span>#{idx + 1} SPOTLIGHT</span>
                </div>
              </div>

              <div className="flex items-end justify-between mt-4 z-10">
                <div>
                  <div className="text-[10px] text-zinc-500">FLOOR PRICE</div>
                  <div className="text-sm font-bold text-white">
                    {col.floorPrice} {col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500">24H VOLUME</div>
                  <div className="text-sm font-bold text-emerald-400">
                    +{col.volume24h.toLocaleString()} {col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* 2. CONTROLS BAR (Chains filter + Watchlist + Timeframes) */}
      <div className="flex flex-col gap-3 border border-[#1c1c1c] bg-[#0c0c0c] p-3 rounded-lg mb-4">
        
        {/* Chain Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-[#1c1c1c]">
          {chains.map((c) => (
            <button
              key={c.id || 'all'}
              onClick={() => setSelectedChain(c.id)}
              className={`px-3 py-1 rounded text-[10px] font-bold border transition-colors ${
                selectedChain === c.id
                  ? 'bg-orange-500 text-black border-orange-500'
                  : 'bg-[#111] hover:bg-zinc-900 border-[#222] text-zinc-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Watchlist & Timeframe filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Watchlist Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterWatchlist(false)}
              className={`px-3 py-1.5 rounded font-bold border transition-all ${
                !filterWatchlist
                  ? 'bg-[#161616] text-white border-orange-500/50'
                  : 'bg-transparent border-[#222] text-zinc-500 hover:text-zinc-300'
              }`}
            >
              TRENDING COLLECTIONS
            </button>
            <button
              onClick={() => setFilterWatchlist(true)}
              className={`px-3 py-1.5 rounded font-bold border flex items-center gap-1.5 transition-all ${
                filterWatchlist
                  ? 'bg-[#161616] text-white border-orange-500/50'
                  : 'bg-transparent border-[#222] text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              WATCHLIST ({watchlist.length})
            </button>
          </div>

          {/* Timeframes */}
          <div className="flex items-center bg-[#111] border border-[#222] rounded p-0.5 text-[10px]">
            {[
              { id: '24h', name: '1D' },
              { id: '7d', name: '7D' },
              { id: '30d', name: '30D' },
              { id: 'all', name: 'ALL' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id as '24h' | '7d' | '30d' | 'all')}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  timeframe === t.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. RANKINGS DATA TABLE (High Density, Terminal Style) */}
      <div className="border border-[#1c1c1c] bg-[#0c0c0c] rounded-lg overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#1c1c1c] bg-[#111]/70 text-zinc-500 h-9 font-bold">
              <th className="w-10 text-center">#</th>
              <th className="pl-4">COLLECTION</th>
              <th className="text-right pr-6">FLOOR PRICE</th>
              <th className="text-right pr-6">24H CHANGE</th>
              <th className="text-right pr-6">24H VOLUME</th>
              <th className="text-right pr-6">TOTAL VOLUME</th>
              <th className="text-right pr-6">OWNERS</th>
              <th className="text-right pr-4">LISTED / TOTAL</th>
              <th className="w-12 text-center">WATCH</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollections.length === 0 ? (
              <tr className="h-32 border-b border-[#161616]">
                <td colSpan={9} className="text-center text-zinc-500 py-10 font-bold">
                  {filterWatchlist ? 'Your watchlist is empty. Click the star icon on any collection to add it.' : 'No collections match current filters.'}
                </td>
              </tr>
            ) : (
              filteredCollections.map((col, idx) => {
                const isWatchlisted = watchlist.includes(col.id);
                const currency = col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH';
                const volumeChangePositive = col.volumeChange24h >= 0;

                return (
                  <tr
                    key={col.id}
                    className="border-b border-[#161616] hover:bg-[#151515] h-12 cursor-pointer group transition-colors"
                  >
                    {/* Rank */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="text-center font-bold text-zinc-400 group-hover:text-orange-500"
                    >
                      {idx + 1}
                    </td>

                    {/* Collection Details */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="pl-4 font-bold text-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={col.logo}
                          alt={col.name}
                          className="w-8 h-8 rounded object-cover border border-[#222]"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="group-hover:text-orange-400 transition-colors text-xs">{col.name}</span>
                            <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                          </div>
                          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">{col.chain}</span>
                        </div>
                      </div>
                    </td>

                    {/* Floor Price */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="text-right pr-6 font-bold text-white"
                    >
                      {col.floorPrice.toLocaleString()} {currency}
                    </td>

                    {/* 24h Change */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className={`text-right pr-6 font-bold ${
                        volumeChangePositive ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {volumeChangePositive ? '+' : ''}
                      {col.volumeChange24h.toFixed(1)}%
                    </td>

                    {/* 24h Volume */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="text-right pr-6 font-bold text-zinc-300"
                    >
                      {col.volume24h.toLocaleString()} {currency}
                    </td>

                    {/* Total Volume */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="text-right pr-6 text-zinc-400"
                    >
                      {col.volumeTotal.toLocaleString()} {currency}
                    </td>

                    {/* Owners */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="text-right pr-6 text-zinc-400"
                    >
                      {col.owners.toLocaleString()}
                    </td>

                    {/* Listed / Total */}
                    <td 
                      onClick={() => setSelectedCollectionId(col.id)}
                      className="text-right pr-4 text-zinc-400"
                    >
                      {col.listedCount} <span className="text-zinc-600">/</span> {col.items}
                      <span className="text-[10px] text-zinc-500 block">
                        {((col.listedCount / col.items) * 100).toFixed(1)}% Listed
                      </span>
                    </td>

                    {/* Watchlist Toggle */}
                    <td className="text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(col.id);
                        }}
                        className="p-2 hover:bg-zinc-800 rounded transition-colors text-zinc-600 hover:text-amber-400"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isWatchlisted ? 'text-amber-500 fill-amber-500' : ''
                          }`}
                        />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
