'use client';

import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    clearCart,
    buyCartNfts,
    isPurchasing,
    purchaseSuccess,
    setPurchaseSuccess,
    connectedWallet
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);

  // Group items by chain to show gas/networks
  const totalCost = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  
  const executeCheckout = async () => {
    if (!connectedWallet) {
      alert('Please connect your wallet first to execute purchases!');
      return;
    }
    if (connectedWallet.balance < totalCost) {
      alert('Insufficient wallet balance for this purchase!');
      return;
    }
    await buyCartNfts();
  };

  if (cart.length === 0 && !purchaseSuccess && !isPurchasing) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 font-mono">
      <AnimatePresence>
        
        {/* CART MAIN PANEL DRAWER */}
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-80 bg-[#0a0a0a] border border-[#222] rounded-xl overflow-hidden shadow-2xl mb-2.5 text-xs text-white"
          >
            {/* Header */}
            <div className="bg-[#0f0f0f] border-b border-[#222] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-orange-500 fill-orange-500/10" />
                <span className="font-bold uppercase tracking-wider text-[11px]">SHOPPING SWEEP CART</span>
              </div>
              <button
                onClick={() => clearCart()}
                className="text-[10px] text-zinc-500 hover:text-red-400 font-bold"
              >
                Clear all
              </button>
            </div>

            {/* Content Lists */}
            <div className="p-3 max-h-60 overflow-y-auto flex flex-col gap-2">
              {isPurchasing ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />
                  <span className="font-bold text-[10px] text-orange-400 uppercase tracking-widest animate-pulse">
                    Awaiting Wallet Signature...
                  </span>
                  <span className="text-[9px] text-zinc-500 max-w-[200px] text-center">
                    Processing transaction aggregation across contract provider layer...
                  </span>
                </div>
              ) : purchaseSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 fill-emerald-500/10" />
                  <div>
                    <span className="font-bold text-emerald-400 text-xs uppercase block">PURCHASE COMPLETE!</span>
                    <span className="text-[9px] text-zinc-500 mt-1 block">
                      Collectibles are now added to your wallet portfolio tab.
                    </span>
                  </div>
                  <button
                    onClick={() => setPurchaseSuccess(false)}
                    className="mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-1.5 rounded text-[10px]"
                  >
                    CONTINUE TRADING
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-[#1b1b1b] bg-[#111]/40 p-2 rounded hover:border-[#333]"
                  >
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt="" className="w-8 h-8 rounded object-cover" />
                      <div>
                        <div className="font-bold text-white max-w-[120px] truncate">{item.name}</div>
                        <div className="text-[8px] text-zinc-500 uppercase">{item.chain}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-300">{item.price} {item.currency}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total price calculation */}
            {!purchaseSuccess && !isPurchasing && (
              <div className="bg-[#0f0f0f] border-t border-[#222] p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-zinc-500">AGGREGATED TOTAL:</span>
                  <span className="text-orange-400 text-sm font-black">
                    {totalCost.toFixed(3)} VALUE
                  </span>
                </div>

                <button
                  onClick={executeCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-black font-black py-2.5 rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CreditCard className="h-4 w-4" />
                  EXECUTE ORDER SWEEP
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION TOGGLE BUTTON */}
      {!purchaseSuccess && !isPurchasing && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-11 items-center gap-2 rounded-full border border-orange-500/30 bg-[#0e0e0e]/95 text-white shadow-xl hover:border-orange-500 transition-all font-bold text-xs pl-4 pr-3.5 py-2.5 ml-auto"
        >
          <div className="relative">
            <ShoppingCart className="h-4 w-4 text-orange-500" />
            <span className="absolute -top-2 -right-2 bg-orange-500 text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          </div>
          <span className="uppercase tracking-widest text-[10px]">SWEEP CART</span>
          {isOpen ? <ChevronDown className="h-4 w-4 text-zinc-500" /> : <ChevronUp className="h-4 w-4 text-zinc-500" />}
        </button>
      )}
    </div>
  );
}
