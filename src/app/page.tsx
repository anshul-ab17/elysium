'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import Header from '../components/Header';
import Rankings from '../components/Rankings';
import CollectionDetail from '../components/CollectionDetail';
import Portfolio from '../components/Portfolio';
import LiveFeed from '../components/LiveFeed';
import NFTModal from '../components/NFTModal';
import Cart from '../components/Cart';

export default function Home() {
  const { activeView } = useStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-black text-white font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
          <span className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Initializing Elysium Aggregator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-orange-500 selection:text-black">
      
      {/* Sleek Ticker & Navbar Header */}
      <Header />

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto pb-20">
        {activeView === 'rankings' && <Rankings />}
        {activeView === 'collection' && <CollectionDetail />}
        {activeView === 'portfolio' && <Portfolio />}
        {activeView === 'activity' && <LiveFeed />}
      </main>

      {/* Dynamic Popups, Overlays and Cart */}
      <NFTModal />
      <Cart />
    </div>
  );
}
