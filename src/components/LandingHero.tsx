'use client';

import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { mockCollections } from '../lib/mockData';
import { Wallet, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingHeroProps {
  onEnter: () => void;
}

export default function LandingHero({ onEnter }: LandingHeroProps) {
  const { connectWallet } = useStore();
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Duplicate collections for an infinite scrolling marquee ribbon
  const marqueeItems = [...mockCollections, ...mockCollections, ...mockCollections];

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col justify-between overflow-hidden relative select-none">
      
      {/* 1. Terminal Matrix Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.06),transparent_65%)] pointer-events-none"></div>
      
      {/* Scanning terminal lines grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40"></div>

      {/* Decorative vertical neon lines */}
      <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/10 to-transparent"></div>
      <div className="absolute right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-orange-500/10 to-transparent"></div>

      {/* Top logo block */}
      <div className="pt-8 px-8 flex items-center justify-between z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-tr from-orange-600 to-amber-400 font-mono text-sm font-black text-black">
            E
          </div>
          <span className="font-bold tracking-widest text-[11px] bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            ELYSIUM AGGREGATOR
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping"></span>
          <span className="font-bold text-orange-400 uppercase tracking-widest">PRO ENGINE v1.0.0</span>
        </div>
      </div>

      {/* 2. CENTRAL HERO SECTION (Blur.io Iconic style) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto z-10">
        
        {/* Core Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-orange-500/20 bg-orange-950/20 px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-orange-400 mb-6 flex items-center gap-1.5"
        >
          <Flame className="h-3 w-3 text-orange-500 fill-orange-500/10" />
          6 BLOCKCHAINS FULLY INTEGRATED
        </motion.div>

        {/* Big Block Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl font-black tracking-tighter leading-none text-white select-none relative mb-4 font-mono"
        >
          <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            ELYSIUM
          </span>
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-orange-500/10 blur-[3px] select-none text-5xl sm:text-7xl font-black">
            ELYSIUM
          </span>
        </motion.h1>

        {/* Core Title subheader */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm font-bold tracking-widest text-orange-500 uppercase mb-5"
        >
          THE CROSS-CHAIN NFT MARKETPLACE FOR PRO TRADERS
        </motion.p>

        {/* Paragraph Details */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] sm:text-xs text-zinc-500 font-sans leading-5 max-w-lg mb-8"
        >
          Aggregating global liquidity, real-time activity metrics, and depth data across Ethereum, Solana, Sui, Polygon, Base, and Arbitrum in one high-performance terminal layout.
        </motion.p>

        {/* Actions Button Deck */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center"
        >
          <button
            onClick={() => setShowWalletModal(true)}
            className="w-full sm:w-56 bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-black text-xs px-6 py-3 rounded shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <Wallet className="h-4 w-4 text-black" />
            CONNECT WALLET TO ENTER
          </button>
          
          <button
            onClick={onEnter}
            className="w-full sm:w-56 bg-zinc-950 hover:bg-zinc-900 border border-[#222] hover:border-zinc-700 active:scale-95 text-zinc-300 hover:text-white font-bold text-xs px-6 py-3 rounded transition-all flex items-center justify-center gap-1.5"
          >
            ENTER READ-ONLY MODE
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>

      {/* 3. INFINITE HORIZONTAL TICKER MARQUEE (Identical to Blur scrolling ribbon) */}
      <div className="z-10 bg-[#070707] border-t border-b border-[#1c1c1c] py-3.5 relative overflow-hidden select-none w-full">
        {/* Shadow Overlays for smooth screen edges fade */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        {/* Infinite Scrolling Track */}
        <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full">
          {marqueeItems.map((col, idx) => {
            const currency = col.chain === 'solana' ? 'SOL' : col.chain === 'sui' ? 'SUI' : 'ETH';
            return (
              <div
                key={`${col.id}-${idx}`}
                className="inline-flex items-center gap-2 bg-[#0c0c0c] border border-[#1b1b1b] rounded px-3 py-1.5 min-w-[200px]"
              >
                <img src={col.logo} alt="" className="w-5 h-5 rounded-full object-cover border border-[#222]" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white leading-none">
                    <span>{col.name}</span>
                    <ShieldCheck className="h-2.5 w-2.5 text-orange-500" />
                  </div>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-500 mt-1 leading-none">
                    <span className="uppercase font-bold">{col.chain}</span>
                    <span className="font-bold text-zinc-300">
                      FLOOR: {col.floorPrice} {currency}
                    </span>
                    <span className={col.volumeChange24h >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {col.volumeChange24h >= 0 ? '+' : ''}{col.volumeChange24h.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WALLET SELECTOR MODAL */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-[#262626] rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
            <div className="p-4 border-b border-[#1c1c1c] flex items-center justify-between">
              <span className="font-bold text-white text-xs uppercase tracking-widest">CONNECT ACCOUNT</span>
              <button
                onClick={() => setShowWalletModal(false)}
                className="text-zinc-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 flex flex-col gap-2">
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
                    setShowWalletModal(false);
                    onEnter();
                  }}
                  className="flex w-full items-center justify-between p-3 rounded border border-[#222] bg-[#111] hover:border-orange-500 hover:bg-[#161616] text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <div className="font-bold text-white text-xs">{wallet.name}</div>
                      <div className="text-[10px] text-zinc-500">{wallet.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 bg-[#1c1c1c] px-2 py-0.5 rounded font-bold border border-[#262626]">
                    {wallet.chain.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Styled marquee animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
