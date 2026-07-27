'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { mockGlobalStats, mockCollections } from '../lib/mockData';
import { 
  Flame, 
  Search, 
  Wallet, 
  TrendingUp, 
  Layers, 
  Activity, 
  User, 
  ChevronDown, 
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const {
    connectedWallet,
    connectWallet,
    disconnectWallet,
    activeView,
    setView,
    searchQuery,
    setSearchQuery,
    setSelectedCollectionId,
    viewMode,
    toggleViewMode
  } = useStore();

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentGas, setCurrentGas] = useState(mockGlobalStats.gasEth);

  // Simulate gas fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGas(prev => Math.max(8, Math.min(45, prev + Math.floor(Math.random() * 5) - 2)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Filter collections based on search query
  const searchResults = searchQuery
    ? mockCollections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-black text-white select-none">
      {/* 1. TOP TICKER BAR (Data Dense, Pro-Trader Style) */}
      <div className="flex h-7 items-center justify-between border-b border-[#1c1c1c] bg-[#050505] px-4 font-mono text-[11px] text-zinc-400">
        <div className="flex items-center gap-6 overflow-hidden">
          <div className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500/20" />
            <span className="text-zinc-500">GAS:</span>
            <span className="font-bold text-orange-400">{currentGas} Gwei</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">ETH:</span>
            <span className="text-zinc-300 font-bold">${mockGlobalStats.ethPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">SOL:</span>
            <span className="text-zinc-300 font-bold">${mockGlobalStats.solPrice.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">SUI:</span>
            <span className="text-zinc-300 font-bold">${mockGlobalStats.suiPrice.toLocaleString()}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="text-zinc-500">24H VOL:</span>
            <span className="text-emerald-400 font-bold">${mockGlobalStats.vol24hAll.toLocaleString()}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>SYSTEM: {mockGlobalStats.status}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="flex h-14 items-center justify-between px-4 bg-[#0a0a0a]">
        
        {/* LOGO */}
        <div 
          onClick={() => { setView('rankings'); setSelectedCollectionId(null); }}
          className="flex cursor-pointer items-center gap-2 pr-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-tr from-orange-600 to-amber-400 font-mono text-lg font-black text-black">
            E
          </div>
          <span className="font-mono text-lg font-black tracking-widest bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 bg-clip-text text-transparent">
            ELYSIUM
          </span>
        </div>

        {/* INTERACTIVE NAVIGATION TABS */}
        <div className="hidden lg:flex items-center gap-1 h-full font-mono text-xs font-bold text-zinc-400">
          <button
            onClick={() => { setView('rankings'); setSelectedCollectionId(null); }}
            className={`flex items-center gap-1.5 px-4 h-full border-t-2 border-transparent transition-all ${
              activeView === 'rankings' || activeView === 'collection'
                ? 'border-orange-500 bg-zinc-900/50 text-orange-500'
                : 'hover:text-white hover:bg-zinc-900/30'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            MARKETPLACE
          </button>
          
          <button
            onClick={() => setView('portfolio')}
            className={`flex items-center gap-1.5 px-4 h-full border-t-2 border-transparent transition-all ${
              activeView === 'portfolio'
                ? 'border-orange-500 bg-zinc-900/50 text-orange-500'
                : 'hover:text-white hover:bg-zinc-900/30'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            PORTFOLIO
          </button>

          <button
            onClick={() => setView('activity')}
            className={`flex items-center gap-1.5 px-4 h-full border-t-2 border-transparent transition-all ${
              activeView === 'activity'
                ? 'border-orange-500 bg-zinc-900/50 text-orange-500'
                : 'hover:text-white hover:bg-zinc-900/30'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            LIVE FEED
          </button>
        </div>

        {/* GLOBAL SEARCH INPUT (Terminal Style overlay) */}
        <div className="relative flex-1 max-w-sm mx-4">
          <div className={`flex h-9 items-center rounded border px-3 transition-colors ${
            searchFocused ? 'border-orange-500 bg-black/60 shadow-[0_0_10px_rgba(249,115,22,0.15)]' : 'border-[#262626] bg-[#121212]'
          }`}>
            <Search className="mr-2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search collections, creators, or tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full bg-transparent font-mono text-xs text-white placeholder-zinc-500 outline-none"
            />
          </div>

          {/* Search Dropdown Panel */}
          <AnimatePresence>
            {searchFocused && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-1 border border-[#262626] bg-[#0c0c0c] p-2 shadow-xl rounded z-50 font-mono text-xs max-h-64 overflow-y-auto"
              >
                <div className="px-2 py-1 text-zinc-500 border-b border-[#1c1c1c] mb-1 font-bold">
                  MATCHING COLLECTIONS
                </div>
                {searchResults.length === 0 ? (
                  <div className="px-2 py-3 text-zinc-600 text-center">No collections found.</div>
                ) : (
                  searchResults.map((col) => (
                    <div
                      key={col.id}
                      onClick={() => {
                        setSelectedCollectionId(col.id);
                        setSearchQuery('');
                      }}
                      className="flex cursor-pointer items-center justify-between p-2 hover:bg-zinc-900 rounded transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <img src={col.logo} alt={col.name} className="h-6 w-6 rounded object-cover" />
                        <span className="font-bold text-white group-hover:text-orange-400">{col.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <span className="text-[10px] uppercase font-semibold bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
                          {col.chain}
                        </span>
                        <span>{col.floorPrice} {col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH'}</span>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTROLS (TRADER MODE TOGGLE + WALLET) */}
        <div className="flex items-center gap-4">
          
          {/* TRADER vs COLLECTOR MODE TOGGLE (Blur specialty) */}
          <div className="hidden sm:flex items-center gap-2 bg-[#121212] border border-[#222] rounded p-0.5 font-mono text-[10px]">
            <button
              onClick={() => { if (viewMode !== 'trader') toggleViewMode(); }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                viewMode === 'trader'
                  ? 'bg-orange-500 text-black shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              TRADER
            </button>
            <button
              onClick={() => { if (viewMode !== 'collector') toggleViewMode(); }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                viewMode === 'collector'
                  ? 'bg-orange-500 text-black shadow-md'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              COLLECTOR
            </button>
          </div>

          {/* WALLET BUTTON */}
          <div className="relative">
            {connectedWallet ? (
              <div className="flex items-center gap-1.5 bg-[#121212] border border-[#222] hover:border-orange-500 rounded p-1 font-mono text-xs">
                <button
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-1 py-1 text-zinc-300 hover:text-white"
                >
                  <Wallet className="h-3.5 w-3.5 text-orange-500" />
                  <span className="font-bold text-[11px]">{connectedWallet.address}</span>
                  <ChevronDown className="h-3 w-3 text-zinc-500" />
                </button>
                <div className="h-4 w-px bg-zinc-800"></div>
                <div className="px-2 font-bold text-orange-400">
                  {connectedWallet.balance.toFixed(2)} {connectedWallet.type === 'evm' ? 'ETH' : connectedWallet.type === 'solana' ? 'SOL' : 'SUI'}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowConnectModal(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-bold font-mono text-xs px-4 py-2.5 rounded shadow-lg transition-all"
              >
                <Wallet className="h-3.5 w-3.5 text-black" />
                CONNECT WALLET
              </button>
            )}

            {/* Wallet Dropdown Actions */}
            <AnimatePresence>
              {walletDropdownOpen && connectedWallet && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 border border-[#262626] bg-[#0c0c0c] rounded shadow-xl z-50 font-mono text-xs"
                >
                  <div className="p-3 border-b border-[#1c1c1c]">
                    <div className="text-[10px] text-zinc-500 uppercase font-semibold">Wallet Type</div>
                    <div className="text-white font-bold">{connectedWallet.name}</div>
                  </div>
                  <button
                    onClick={() => {
                      setView('portfolio');
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full text-left p-3 hover:bg-zinc-900 text-zinc-300 hover:text-white flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-orange-400" />
                    My Portfolio
                  </button>
                  <button
                    onClick={() => {
                      disconnectWallet();
                      setWalletDropdownOpen(false);
                    }}
                    className="w-full text-left p-3 hover:bg-zinc-900 border-t border-[#1c1c1c] text-red-400 hover:text-red-300 flex items-center gap-2"
                  >
                    <Power className="h-4 w-4" />
                    Disconnect
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. MOBILE VIEW MENU (Simple bar showing tabs for small screens) */}
      <div className="flex lg:hidden h-9 items-center justify-around border-t border-[#1c1c1c] bg-[#050505] font-mono text-xs font-bold text-zinc-400">
        <button 
          onClick={() => { setView('rankings'); setSelectedCollectionId(null); }}
          className={`flex items-center gap-1.5 ${activeView === 'rankings' || activeView === 'collection' ? 'text-orange-500' : ''}`}
        >
          <Layers className="h-3 w-3" /> MARKET
        </button>
        <button 
          onClick={() => setView('portfolio')}
          className={`flex items-center gap-1.5 ${activeView === 'portfolio' ? 'text-orange-500' : ''}`}
        >
          <User className="h-3 w-3" /> PORTFOLIO
        </button>
        <button 
          onClick={() => setView('activity')}
          className={`flex items-center gap-1.5 ${activeView === 'activity' ? 'text-orange-500' : ''}`}
        >
          <Activity className="h-3 w-3" /> LIVE
        </button>
      </div>

      {/* WALLET CONNECT DIALOG */}
      <AnimatePresence>
        {showConnectModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-[#262626] rounded-xl overflow-hidden shadow-2xl font-mono text-sm"
            >
              <div className="p-4 border-b border-[#1c1c1c] flex items-center justify-between">
                <span className="font-bold text-white text-md">CONNECT A WALLET</span>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="text-zinc-500 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 flex flex-col gap-2.5">
                <p className="text-zinc-400 text-xs mb-2">
                  Select a wallet provider to trade across Ethereum, Solana, Sui, Polygon, Base, and Arbitrum chains.
                </p>

                {[
                  { name: 'MetaMask', desc: 'Ethereum & EVM Chains', icon: '🦊', chain: 'evm' as const },
                  { name: 'Phantom', desc: 'Solana & Multi-chain', icon: '👻', chain: 'solana' as const },
                  { name: 'Sui Wallet', desc: 'Sui Network Ecosystem', icon: '💧', chain: 'sui' as const },
                  { name: 'Coinbase Wallet', desc: 'EVM & Base network', icon: '🛡️', chain: 'evm' as const }
                ].map((wallet) => (
                  <button
                    key={wallet.name}
                    onClick={() => {
                      connectWallet(wallet.name, wallet.chain);
                      setShowConnectModal(false);
                    }}
                    className="flex w-full items-center justify-between p-3.5 rounded border border-[#222] bg-[#111] hover:border-orange-500 hover:bg-[#161616] text-left transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <div className="font-bold text-white text-xs">{wallet.name}</div>
                        <div className="text-[10px] text-zinc-500">{wallet.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-[#1c1c1c] px-2 py-1 rounded font-bold border border-[#262626]">
                      {wallet.chain.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
