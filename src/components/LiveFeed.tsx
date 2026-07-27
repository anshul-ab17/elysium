'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { mockNFTs, mockCollections } from '../lib/mockData';
import { ActivityItem } from '../lib/types';
import { 
  Flame, 
  TrendingUp, 
  RefreshCw,
  Search
} from 'lucide-react';

export default function LiveFeed() {
  const {
    activities,
    addActivity,
    setSelectedNft,
    setSelectedCollectionId
  } = useStore();

  const [typeFilters, setTypeFilters] = useState<string[]>(['sale', 'list', 'transfer', 'offer']);
  const [searchQuery, setSearchQuery] = useState('');

  // Periodically generate random activities globally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const randomNft = mockNFTs[Math.floor(Math.random() * mockNFTs.length)];
        const types: ActivityItem['type'][] = ['sale', 'list', 'transfer', 'offer'];
        const type = types[Math.floor(Math.random() * types.length)];
        const collection = mockCollections.find(c => c.id === randomNft.collectionId) || mockCollections[0];

        const price = type !== 'transfer' 
          ? Number((collection.floorPrice * (1 + Math.random() * 0.2)).toFixed(3)) 
          : undefined;

        const newActivity: ActivityItem = {
          id: `global-act-${Math.random()}`,
          type,
          nftId: randomNft.id,
          nftName: randomNft.name,
          nftImage: randomNft.image,
          collectionName: randomNft.collectionName,
          price,
          currency: randomNft.currency,
          from: '0x' + Math.floor(Math.random() * 10000).toString(16) + '...333',
          to: type === 'sale' || type === 'transfer' ? '0x' + Math.floor(Math.random() * 10000).toString(16) + '...444' : undefined,
          timestamp: new Date().toISOString(),
          chain: randomNft.chain
        };

        addActivity(newActivity);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [addActivity]);

  // Filter activities
  const filteredActivities = activities
    .filter(act => typeFilters.includes(act.type))
    .filter(act => 
      act.nftName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.collectionName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="flex-1 bg-black text-white p-4 font-mono select-none flex flex-col gap-4">
      
      {/* Metrics Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-[#1c1c1c] pb-4">
        
        <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold block">LIVE FEED EVENTS</span>
            <span className="text-lg font-black text-orange-400 mt-1 block">
              {filteredActivities.length} STREAMING
            </span>
          </div>
          <RefreshCw className="h-5 w-5 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold block">FASTEST LIQUIDITY CHAIN</span>
            <span className="text-lg font-black text-white mt-1 block uppercase">
              Solana Network
            </span>
          </div>
          <Flame className="h-5 w-5 text-emerald-400 fill-emerald-400/10" />
        </div>

        <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-3 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 font-bold block">MARKET MOMENTUM</span>
            <span className="text-lg font-black text-emerald-400 mt-1 block">
              +14.5% BULLISH
            </span>
          </div>
          <TrendingUp className="h-5 w-5 text-emerald-400" />
        </div>

      </div>

      {/* Filters control sheet */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#1c1c1c] bg-[#0c0c0c] p-3 rounded-lg text-xs">
        
        {/* Event toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-zinc-500 font-bold text-[10px]">EVENT CLASSIFICATIONS:</span>
          {['sale', 'list', 'transfer', 'offer'].map(t => {
            const isChecked = typeFilters.includes(t);
            return (
              <label key={t} className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white uppercase font-bold text-[10px]">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    setTypeFilters(prev => 
                      isChecked ? prev.filter(x => x !== t) : [...prev, t]
                    );
                  }}
                  className="accent-orange-500"
                />
                {t}s
              </label>
            );
          })}
        </div>

        {/* Global Search input filter */}
        <div className="flex h-8 items-center bg-[#111] border border-[#222] rounded px-2.5 w-full sm:max-w-xs ml-auto">
          <Search className="h-3.5 w-3.5 text-zinc-500 mr-2" />
          <input
            type="text"
            placeholder="Search feed by collection or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none w-full text-xs text-white placeholder-zinc-600"
          />
        </div>

      </div>

      {/* Main activities tables sheet */}
      <div className="border border-[#1c1c1c] bg-[#0c0c0c] rounded-lg overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#1c1c1c] bg-[#111]/70 text-zinc-500 h-9 font-bold">
              <th className="w-20 text-center">EVENT</th>
              <th className="pl-4">COLLECTIBLE ITEM</th>
              <th className="pl-4">COLLECTION</th>
              <th className="text-right pr-6">VALUE</th>
              <th className="pl-4">FROM SENDER</th>
              <th className="pl-4">TO RECIPIENT</th>
              <th className="text-right pr-4">TIME ACCRUED</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-zinc-500 font-bold">
                  No live activities streamed matching these criteria. Waiting for new events...
                </td>
              </tr>
            ) : (
              filteredActivities.map((act) => {
                const dateStr = new Date(act.timestamp).toLocaleTimeString();
                
                return (
                  <tr key={act.id} className="border-b border-[#161616] hover:bg-[#151515] h-12 transition-colors">
                    
                    {/* Event badge */}
                    <td className="text-center">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block ${
                        act.type === 'sale' ? 'bg-emerald-950 border border-emerald-500/20 text-emerald-400' :
                        act.type === 'list' ? 'bg-orange-950 border border-orange-500/20 text-orange-400' :
                        act.type === 'offer' ? 'bg-blue-950 border border-blue-500/20 text-blue-400' :
                        'bg-zinc-900 border border-zinc-700 text-zinc-400'
                      }`}>
                        {act.type}
                      </span>
                    </td>

                    {/* Collectible item logo + ID */}
                    <td className="pl-4">
                      <div 
                        onClick={() => {
                          const matchedNft = mockNFTs.find(n => n.id === act.nftId);
                          if (matchedNft) setSelectedNft(matchedNft);
                        }}
                        className="flex items-center gap-2 font-bold text-white cursor-pointer group/item"
                      >
                        <img src={act.nftImage} alt="" className="w-7 h-7 rounded object-cover border border-[#222]" />
                        <span className="group-hover/item:text-orange-400 transition-colors">{act.nftName}</span>
                      </div>
                    </td>

                    {/* Collection link */}
                    <td className="pl-4">
                      <span 
                        onClick={() => {
                          const col = mockCollections.find(c => c.name === act.collectionName);
                          if (col) setSelectedCollectionId(col.id);
                        }}
                        className="font-bold text-zinc-400 hover:text-white cursor-pointer"
                      >
                        {act.collectionName}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="text-right pr-6 font-bold text-zinc-200">
                      {act.price ? `${act.price} ${act.currency}` : '--'}
                    </td>

                    {/* From/To details */}
                    <td className="pl-4 text-zinc-500 font-bold">{act.from}</td>
                    <td className="pl-4 text-zinc-500 font-bold">{act.to || '--'}</td>

                    {/* Time */}
                    <td className="text-right pr-4 text-zinc-500 font-bold">{dateStr}</td>

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
