'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../lib/store';
import { mockNFTs, mockCollections, generateInitialActivity } from '../lib/mockData';
import { 
  ShieldCheck, 
  Globe, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  ShoppingCart, 
  TrendingUp, 
  ArrowLeft,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { ActivityItem } from '../lib/types';
import { motion } from 'framer-motion';

export default function CollectionDetail() {
  const {
    selectedCollectionId,
    setSelectedCollectionId,
    addToCart,
    cart,
    sweepFloor,
    setSelectedNft
  } = useStore();

  const collection = useMemo(() => {
    return mockCollections.find(c => c.id === selectedCollectionId) || mockCollections[0];
  }, [selectedCollectionId]);

  // Tab state
  const [activeTab, setActiveTab] = useState<'items' | 'activity' | 'analytics'>('items');
  
  // Filter states
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string[]>>({});
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [buyNowOnly, setBuyNowOnly] = useState(true);
  const [showFilters] = useState(true);

  // Sweep states
  const [sweepValue, setSweepValue] = useState<number>(1);

  // Activity list & live simulator
  const [activityList, setActivityList] = useState<ActivityItem[]>([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState<string[]>(['sale', 'list', 'transfer']);

  // UI Grid view density
  const [gridDensity, setGridDensity] = useState<'dense' | 'normal'>('dense');

  // Load and simulate activities
  useEffect(() => {
    const timer = setTimeout(() => {
      setActivityList(generateInitialActivity().filter(act => act.collectionName === collection.name));
    }, 0);
    
    // Simulate real-time listings and sales
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const matchingNfts = mockNFTs.filter(n => n.collectionId === collection.id);
        const randomNft = matchingNfts[Math.floor(Math.random() * matchingNfts.length)];
        const types: ActivityItem['type'][] = ['sale', 'list', 'transfer'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        const price = type === 'sale' || type === 'list' 
          ? Number((collection.floorPrice * (1 + Math.random() * 0.1)).toFixed(3)) 
          : undefined;

        const newActivity: ActivityItem = {
          id: `live-act-${Math.random()}`,
          type,
          nftId: randomNft.id,
          nftName: randomNft.name,
          nftImage: randomNft.image,
          collectionName: collection.name,
          price,
          currency: randomNft.currency,
          from: '0x' + Math.floor(Math.random() * 10000).toString(16) + '...f8a',
          to: type === 'sale' || type === 'transfer' ? '0x' + Math.floor(Math.random() * 10000).toString(16) + '...111' : undefined,
          timestamp: new Date().toISOString(),
          chain: collection.chain
        };

        setActivityList(prev => [newActivity, ...prev.slice(0, 49)]);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [collection]);

  // Aggregate all unique traits and counts for the sidebar filter
  const collectionTraits = useMemo(() => {
    const traitsMap: Record<string, Record<string, { count: number; floor: number }>> = {};
    const nfts = mockNFTs.filter(n => n.collectionId === collection.id);

    nfts.forEach(nft => {
      nft.traits.forEach(t => {
        if (!traitsMap[t.type]) {
          traitsMap[t.type] = {};
        }
        if (!traitsMap[t.type][t.value]) {
          traitsMap[t.type][t.value] = { count: 0, floor: nft.price || collection.floorPrice };
        }
        traitsMap[t.type][t.value].count += 1;
        if (nft.price && nft.price < traitsMap[t.type][t.value].floor) {
          traitsMap[t.type][t.value].floor = nft.price;
        }
      });
    });

    return traitsMap;
  }, [collection]);

  // Collapsible sections for trait types
  const [collapsedTraits, setCollapsedTraits] = useState<Record<string, boolean>>({});
  const toggleTraitCollapse = (type: string) => {
    setCollapsedTraits(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleTraitCheckbox = (type: string, value: string) => {
    setSelectedTraits(prev => {
      const current = prev[type] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      
      const copy = { ...prev };
      if (updated.length === 0) {
        delete copy[type];
      } else {
        copy[type] = updated;
      }
      return copy;
    });
  };

  // Filtered NFTs list
  const filteredNFTs = useMemo(() => {
    let list = mockNFTs.filter(n => n.collectionId === collection.id);

    // Filter by Buy Now status
    if (buyNowOnly) {
      list = list.filter(n => n.price !== undefined);
    }

    // Filter by search name
    if (filterSearch) {
      list = list.filter(n => n.name.toLowerCase().includes(filterSearch.toLowerCase()) || n.tokenId.includes(filterSearch));
    }

    // Filter by price range
    if (priceMin) {
      const min = parseFloat(priceMin);
      if (!isNaN(min)) list = list.filter(n => n.price !== undefined && n.price >= min);
    }
    if (priceMax) {
      const max = parseFloat(priceMax);
      if (!isNaN(max)) list = list.filter(n => n.price !== undefined && n.price <= max);
    }

    // Filter by selected traits sidebar
    Object.entries(selectedTraits).forEach(([traitType, values]) => {
      if (values.length > 0) {
        list = list.filter(nft => 
          nft.traits.some(t => t.type === traitType && values.includes(t.value))
        );
      }
    });

    // Sort by price ascending (cheapest floor first)
    return list.sort((a, b) => {
      if (a.price === undefined) return 1;
      if (b.price === undefined) return -1;
      return a.price - b.price;
    });
  }, [collection, buyNowOnly, filterSearch, priceMin, priceMax, selectedTraits]);

  // Sweep Action Execution
  const handleSweep = () => {
    if (sweepValue > 0) {
      sweepFloor(collection.id, sweepValue);
      setSweepValue(1);
    }
  };

  const activeCurrency = collection.chain === 'solana' ? 'SOL' : collection.chain === 'sui' ? 'SUI' : 'ETH';

  return (
    <div className="flex-1 bg-black text-white font-mono select-none flex flex-col">
      
      {/* 1. COLLECTION HEADER & BANNER */}
      <div className="relative h-44 w-full bg-cover bg-center border-b border-[#262626]" style={{ backgroundImage: `url(${collection.banner})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => setSelectedCollectionId(null)}
          className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-black/60 hover:bg-black border border-[#333] px-2.5 py-1.5 rounded text-[10px] font-bold text-zinc-300 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> BACK TO MARKET
        </button>

        {/* Collection details on top of banner */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={collection.logo} 
              alt={collection.name} 
              className="w-16 h-16 rounded-lg object-cover border-2 border-orange-500 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl font-black text-white">{collection.name}</h1>
                <ShieldCheck className="h-5 w-5 text-orange-500 fill-orange-500/10" />
              </div>
              <p className="text-[10px] text-zinc-400 max-w-xl line-clamp-1 mt-1 font-sans">{collection.description}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {collection.socials.twitter && (
              <a 
                href={`https://twitter.com/${collection.socials.twitter}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-zinc-900/80 hover:bg-zinc-800 border border-[#333] p-2 rounded text-zinc-400 hover:text-orange-400"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {collection.socials.website && (
              <a 
                href={collection.socials.website} 
                target="_blank" 
                rel="noreferrer"
                className="bg-zinc-900/80 hover:bg-zinc-800 border border-[#333] p-2 rounded text-zinc-400 hover:text-orange-400"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. LIVE COLLECTION STATISTICS BAR (Blur Dashboard Theme) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-[#1c1c1c] bg-[#0c0c0c] text-center font-mono text-[11px] divide-x divide-[#1c1c1c] py-2.5">
        <div>
          <div className="text-zinc-500 font-bold">FLOOR PRICE</div>
          <div className="text-sm font-black text-orange-400 mt-0.5">
            {collection.floorPrice} {activeCurrency}
          </div>
        </div>
        <div>
          <div className="text-zinc-500 font-bold">24H VOLUME</div>
          <div className={`text-sm font-black mt-0.5 ${collection.volumeChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {collection.volume24h.toLocaleString()} {activeCurrency}
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="text-zinc-500 font-bold">OWNERS (HOLDERS)</div>
          <div className="text-sm font-black text-white mt-0.5">
            {collection.owners} <span className="text-[9px] text-zinc-500">({((collection.owners / collection.items) * 100).toFixed(0)}%)</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <div className="text-zinc-500 font-bold">LISTED</div>
          <div className="text-sm font-black text-zinc-300 mt-0.5">
            {collection.listedCount} <span className="text-[9px] text-zinc-500">({((collection.listedCount / collection.items) * 100).toFixed(1)}%)</span>
          </div>
        </div>
        <div>
          <div className="text-zinc-500 font-bold">TOTAL VOLUME</div>
          <div className="text-sm font-black text-zinc-300 mt-0.5">
            {collection.volumeTotal.toLocaleString()} {activeCurrency}
          </div>
        </div>
      </div>

      {/* 3. TABS HEADER */}
      <div className="flex items-center justify-between border-b border-[#1c1c1c] bg-[#0a0a0a] px-4 h-10">
        <div className="flex gap-2 h-full text-xs font-bold text-zinc-400">
          {[
            { id: 'items', name: 'ITEMS' },
            { id: 'activity', name: 'ACTIVITY FEED' },
            { id: 'analytics', name: 'ANALYTICS' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as 'items' | 'activity' | 'analytics')}
              className={`px-4 h-full border-b-2 border-transparent transition-colors ${
                activeTab === t.id 
                  ? 'border-orange-500 text-orange-500 font-black' 
                  : 'hover:text-white hover:bg-zinc-900/30'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* View adjustments for Items tab */}
        {activeTab === 'items' && (
          <div className="flex items-center gap-3">
            {/* Grid density selector */}
            <div className="flex items-center bg-[#111] border border-[#222] rounded p-0.5 text-[9px] font-bold">
              <button
                onClick={() => setGridDensity('dense')}
                className={`p-1.5 rounded transition-all ${
                  gridDensity === 'dense' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                DENSE
              </button>
              <button
                onClick={() => setGridDensity('normal')}
                className={`p-1.5 rounded transition-all ${
                  gridDensity === 'normal' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                RELAXED
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN SPLIT SECTION */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR FILTERS (Trader View specific) */}
        {activeTab === 'items' && showFilters && (
          <div className="w-64 border-r border-[#1c1c1c] bg-[#050505] p-3 flex flex-col gap-4 overflow-y-auto hidden md:flex shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 border-b border-[#1c1c1c] pb-2">
              <span className="flex items-center gap-1.5"><Filter className="h-3.5 w-3.5 text-orange-500" /> FILTERS</span>
              <button 
                onClick={() => setSelectedTraits({})}
                className="text-[10px] text-zinc-500 hover:text-orange-500 underline"
              >
                Clear all
              </button>
            </div>

            {/* Toggle buy now only */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Buy Now Only</span>
              <input
                type="checkbox"
                checked={buyNowOnly}
                onChange={() => setBuyNowOnly(!buyNowOnly)}
                className="accent-orange-500 cursor-pointer h-4 w-4 bg-[#111] border border-[#333] rounded"
              />
            </div>

            {/* Price Filter Input */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-bold">PRICE RANGE ({activeCurrency})</span>
              <div className="flex items-center gap-1.5 text-xs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] rounded p-1.5 text-white placeholder-zinc-600 font-bold text-xs"
                />
                <span className="text-zinc-600">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] rounded p-1.5 text-white placeholder-zinc-600 font-bold text-xs"
                />
              </div>
            </div>

            {/* Collapsible Traits Sections */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-500 font-bold">ATTRIBUTES & TRAITS</span>
              
              {Object.entries(collectionTraits).map(([traitType, valuesObj]) => {
                const isCollapsed = collapsedTraits[traitType];
                return (
                  <div key={traitType} className="border border-[#1a1a1a] rounded overflow-hidden">
                    <button
                      onClick={() => toggleTraitCollapse(traitType)}
                      className="w-full bg-[#0c0c0c] flex items-center justify-between p-2 text-left font-bold text-[10px] text-zinc-300 hover:text-white"
                    >
                      <span>{traitType.toUpperCase()} ({Object.keys(valuesObj).length})</span>
                      {isCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                    </button>

                    {!isCollapsed && (
                      <div className="bg-black/60 p-2 flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                        {Object.entries(valuesObj).map(([valueName, data]) => {
                          const isChecked = selectedTraits[traitType]?.includes(valueName) || false;
                          return (
                            <label
                              key={valueName}
                              className="flex items-center justify-between text-[10px] text-zinc-400 hover:text-zinc-200 cursor-pointer"
                            >
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleTraitCheckbox(traitType, valueName)}
                                  className="accent-orange-500 h-3.5 w-3.5"
                                />
                                <span className="line-clamp-1">{valueName}</span>
                              </div>
                              <span className="text-zinc-600">{data.count} ({data.floor.toFixed(1)} F)</span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CONTENT REGION */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4">
          
          {/* TAB 1: ITEMS DETAIL */}
          {activeTab === 'items' && (
            <div className="flex-1 flex flex-col gap-4">
              
              {/* SWEEPING CONTROL SHEET & SEARCH FILTER (Trader Pro Style) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-[#1c1c1c] bg-[#0c0c0c] p-3 rounded-lg">
                
                {/* Search query field within collection */}
                <div className="flex h-8 items-center bg-[#111] border border-[#222] rounded px-2.5 w-full sm:max-w-xs">
                  <Search className="h-3.5 w-3.5 text-zinc-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search by ID or property..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="bg-transparent outline-none w-full text-xs text-white placeholder-zinc-600"
                  />
                </div>

                {/* Sweep Multi-buy Slider (Unique feature of Blur) */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-[10px] text-zinc-400 font-bold whitespace-nowrap">
                    SWEEP FLOOR:
                  </span>
                  
                  {/* Slider */}
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={sweepValue}
                    onChange={(e) => setSweepValue(parseInt(e.target.value))}
                    className="accent-orange-500 cursor-pointer w-24 sm:w-32"
                  />
                  
                  {/* Sweep Counter Tag */}
                  <div className="flex items-center gap-2 bg-[#161616] border border-[#262626] rounded px-2 py-1 font-bold text-xs">
                    <span className="text-orange-400">{sweepValue}</span>
                    <span className="text-zinc-500 text-[10px]">ITEMS</span>
                  </div>

                  <button
                    onClick={handleSweep}
                    className="bg-orange-500 hover:bg-orange-600 text-black font-black text-xs px-4 py-1.5 rounded transition-transform active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 text-black fill-black" />
                    SWEEP NOW
                  </button>
                </div>
              </div>

              {/* DYNAMIC NFT GRID LISTING */}
              <div className="text-[10px] text-zinc-500 font-bold flex items-center justify-between border-b border-[#111] pb-1">
                <span>SHOWING {filteredNFTs.length} LISTINGS</span>
                <span className="text-zinc-600 font-semibold text-[9px] uppercase">{collection.chain} aggregation layer</span>
              </div>

              {filteredNFTs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-zinc-500 border border-dashed border-[#222] rounded-lg">
                  <p className="font-bold">No NFTs matching your active search/filter options.</p>
                  <button 
                    onClick={() => {
                      setFilterSearch('');
                      setSelectedTraits({});
                      setPriceMin('');
                      setPriceMax('');
                      setBuyNowOnly(false);
                    }}
                    className="mt-3 text-orange-500 hover:text-orange-400 underline font-semibold text-xs"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-3 ${
                  gridDensity === 'dense'
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                }`}>
                  {filteredNFTs.map((nft) => {
                    const isInCart = cart.some(item => item.id === nft.id);
                    
                    return (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedNft(nft)}
                        className="group relative flex flex-col rounded-lg border border-[#222] bg-[#090909] overflow-hidden cursor-pointer hover:border-orange-500 transition-all duration-300"
                      >
                        {/* NFT Thumbnail */}
                        <div className="relative aspect-square overflow-hidden bg-zinc-900">
                          <img
                            src={nft.image}
                            alt={nft.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          
                          {/* Rarity Rank Tag */}
                          <div className="absolute top-2 left-2 bg-black/70 border border-[#222] px-1.5 py-0.5 rounded text-[8px] font-bold text-orange-400 z-10 flex items-center gap-0.5">
                            <Sparkles className="h-2 w-2 text-orange-500" />
                            <span>#{nft.rarityRank}</span>
                          </div>
                          
                          {/* Chain Badge */}
                          <span className="absolute top-2 right-2 bg-zinc-950/80 border border-[#222] px-1 py-0.5 rounded text-[7px] text-zinc-400 z-10 uppercase font-black tracking-wider">
                            {nft.chain}
                          </span>
                        </div>

                        {/* Text Metadata Details */}
                        <div className="p-2 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-300 font-bold truncate">{nft.name}</span>
                          </div>
                          
                          {/* Pricing Data */}
                          <div className="flex items-end justify-between mt-1">
                            <div>
                              <div className="text-[8px] text-zinc-500 uppercase font-bold">PRICE</div>
                              <div className="text-xs font-black text-white">
                                {nft.price !== undefined ? `${nft.price} ${nft.currency}` : 'UNLISTED'}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-[8px] text-zinc-500 uppercase font-bold">LAST SALE</div>
                              <div className="text-[10px] text-zinc-400">
                                {nft.lastSale} {nft.currency}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover buy drawer sheet */}
                        {nft.price !== undefined && (
                          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/90 border-t border-[#222] translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex gap-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isInCart) return;
                                addToCart(nft);
                              }}
                              className={`flex-1 font-black text-[9px] py-1.5 rounded transition-colors ${
                                isInCart 
                                  ? 'bg-[#181818] border border-[#333] text-zinc-500 cursor-not-allowed'
                                  : 'bg-[#161616] hover:bg-zinc-800 text-orange-500 border border-orange-500/20'
                              }`}
                            >
                              {isInCart ? 'IN CART' : '+ ADD CART'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(nft);
                                // Open cart details
                              }}
                              className="bg-orange-500 hover:bg-orange-600 text-black font-black text-[9px] px-2.5 py-1.5 rounded"
                            >
                              BUY NOW
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE ACTIVITY TRACKER */}
          {activeTab === 'activity' && (
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Filters bar */}
              <div className="flex items-center justify-between border border-[#1c1c1c] bg-[#0c0c0c] p-2.5 rounded-lg text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-bold text-[10px]">EVENT TYPES:</span>
                  {['sale', 'list', 'transfer'].map(t => {
                    const isChecked = activityTypeFilter.includes(t);
                    return (
                      <label key={t} className="flex items-center gap-1.5 cursor-pointer text-zinc-400 hover:text-white uppercase font-bold text-[10px]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setActivityTypeFilter(prev => 
                              isChecked ? prev.filter(x => x !== t) : [...prev, t]
                            );
                          }}
                          className="accent-orange-500"
                        />
                        {t}
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
                  <Clock className="h-3 w-3" />
                  <span>Real-time feeds synced</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-[#1c1c1c] bg-[#0c0c0c] rounded-lg overflow-hidden flex-1">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#1c1c1c] bg-[#111]/70 text-zinc-500 h-8 font-bold">
                      <th className="pl-4">EVENT</th>
                      <th className="pl-4">NFT ITEM</th>
                      <th className="text-right pr-6">PRICE</th>
                      <th className="pl-4">FROM</th>
                      <th className="pl-4">TO</th>
                      <th className="text-right pr-4">TIME</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityList
                      .filter(act => activityTypeFilter.includes(act.type))
                      .length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-zinc-500 font-bold">
                            No recent activity matches the current event filters.
                          </td>
                        </tr>
                      ) : (
                        activityList
                          .filter(act => activityTypeFilter.includes(act.type))
                          .map((act) => {
                            const dateStr = new Date(act.timestamp).toLocaleTimeString();
                            return (
                              <tr key={act.id} className="border-b border-[#161616] hover:bg-[#151515] h-10 transition-colors">
                                
                                {/* Event Tag */}
                                <td className="pl-4">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                    act.type === 'sale' ? 'bg-emerald-950 border border-emerald-500/20 text-emerald-400' :
                                    act.type === 'list' ? 'bg-orange-950 border border-orange-500/20 text-orange-400' :
                                    'bg-zinc-900 border border-zinc-700 text-zinc-400'
                                  }`}>
                                    {act.type}
                                  </span>
                                </td>

                                {/* NFT link */}
                                <td className="pl-4">
                                  <div className="flex items-center gap-2 font-bold text-white">
                                    <img src={act.nftImage} alt="" className="w-6 h-6 rounded object-cover" />
                                    <span className="hover:text-orange-400 cursor-pointer">{act.nftName}</span>
                                  </div>
                                </td>

                                {/* Price */}
                                <td className="text-right pr-6 font-bold text-zinc-300">
                                  {act.price ? `${act.price} ${act.currency}` : '--'}
                                </td>

                                {/* Addresses */}
                                <td className="pl-4 text-zinc-500">{act.from}</td>
                                <td className="pl-4 text-zinc-500">{act.to || '--'}</td>

                                {/* Date */}
                                <td className="text-right pr-4 text-zinc-500 font-bold">{dateStr}</td>
                              </tr>
                            );
                          })
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex-1 flex flex-col gap-6">
              
              {/* Floor depth stats details (Liquid Glass inspired) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-4 rounded-lg flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>FLOOR STABILITY INDEX</span>
                    <Info className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-400">HIGH</div>
                    <div className="text-[10px] text-zinc-500 mt-1">98.4% listings are above floor price</div>
                  </div>
                </div>

                <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-4 rounded-lg flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>BUYING DEPTH (WALLS)</span>
                    <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">45.2 ETH</div>
                    <div className="text-[10px] text-zinc-500 mt-1">Accumulated bids within 10% of floor price</div>
                  </div>
                </div>

                <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-4 rounded-lg flex flex-col justify-between h-28">
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>LIQUIDITY RATING</span>
                    <Flame className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-orange-400">A+ EXCELLENT</div>
                    <div className="text-[10px] text-zinc-500 mt-1">12 listings bought in the last hour</div>
                  </div>
                </div>

              </div>

              {/* Mock Depth Graph Visual (Cyberpunk style SVG) */}
              <div className="border border-[#1c1c1c] bg-[#0c0c0c] p-4 rounded-lg flex-1 min-h-64 flex flex-col gap-4">
                <span className="text-[11px] font-bold text-zinc-500">FLOOR PRICE DEPTH / LISTINGS DISTRIBUTION</span>
                
                <div className="flex-1 w-full bg-black/60 rounded border border-[#161616] p-4 flex flex-col justify-end relative overflow-hidden">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 opacity-5">
                    {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
                  </div>

                  {/* SVG Chart */}
                  <svg className="w-full h-full min-h-48 z-10" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Path */}
                    <path
                      d="M 0 180 Q 50 160 100 120 T 200 80 T 300 110 T 400 50 T 500 20 L 500 200 L 0 200 Z"
                      fill="url(#chart-grad)"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />
                    {/* Floor bar */}
                    <line x1="100" y1="0" x2="100" y2="200" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                  </svg>
                  
                  <div className="absolute top-6 left-28 bg-[#161616]/90 border border-yellow-500/30 px-2 py-1 rounded text-[8px] text-yellow-400 font-bold z-20">
                    CURRENT FLOOR LEVEL
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-zinc-500 px-2">
                  <span>FLOOR ({collection.floorPrice} {activeCurrency})</span>
                  <span>+10% Markup</span>
                  <span>+20% Markup</span>
                  <span>+50% Markup</span>
                  <span>+100% Markup</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
