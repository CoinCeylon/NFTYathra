'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@meshsdk/react';
import { motion } from 'framer-motion';
import { Wallet, Home, Image, Trophy, ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletModal from './WalletModal';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'My Collection', href: '/my-nfts', icon: Image },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
];

function shortenAddress(addr: string) {
  if (!addr) return '';
  return addr.slice(0, 10) + '...' + addr.slice(-4);
}

export default function Header() {
  const { connected, wallet } = useWallet();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [bech32Address, setBech32Address] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      if (connected && wallet) {
        try {
          const addresses = await wallet.getUsedAddresses();
          if (addresses && addresses.length > 0) {
            setBech32Address(addresses[0]);
          } else {
            setBech32Address('');
          }
        } catch {
          setBech32Address('');
        }
      } else {
        setBech32Address('');
      }
    };
    fetchAddress();
  }, [connected, wallet, walletModalOpen]);

  // Open modal on click if connected, else connect
  const handleWalletButton = useCallback(() => {
    setWalletModalOpen(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="w-full mt-0 mb-2 shadow-lg bg-white/20 backdrop-blur-md border border-white/20 px-6 py-2 flex items-center justify-between" style={{minHeight: 64}}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 bg-clip-text text-transparent">NFT Yathra</span>
        </Link>

        {/* Desktop Navigation - centered and smaller */}
        <nav className="hidden md:flex items-center justify-center gap-4 flex-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm border border-white/20 ${
                  isActive
                    ? 'bg-white/30 text-gray-900 border-white/30'
                    : 'bg-white/15 text-gray-700 hover:text-gray-900 hover:bg-white/25'
                }`}
                style={{
                  minWidth: 100,
                }}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Wallet Connect Button or Address */}
        <div className="flex items-center gap-3 relative shrink-0">
          {/* Simplified rotating glow - less expensive */}
          {!connected && (
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-0 pointer-events-none">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="w-[110%] h-[160%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ pointerEvents: 'none' }}
              >
                <div className="w-full h-full rounded-full border-2 border-transparent" style={{
                  background: 'conic-gradient(from 0deg, #a78bfa, #f472b6, #60a5fa, #a78bfa)',
                  WebkitMaskImage: 'radial-gradient(circle, white 70%, transparent 100%)',
                  maskImage: 'radial-gradient(circle, white 70%, transparent 100%)',
                  filter: 'blur(2px)',
                  opacity: 0.3,
                }} />
              </motion.div>
            </div>
          )}
          
          {/* Wallet Button */}
          <button
            onClick={handleWalletButton}
            className="relative z-10 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white px-6 py-2 rounded-full font-semibold shadow-lg border border-white/30 hover:from-purple-600 hover:to-blue-600 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2 cursor-pointer select-none"
            style={{ minWidth: 160 }}
          >
            <Wallet className="w-4 h-4" />
            {connected && bech32Address ? (
              <span className="font-mono text-sm">{shortenAddress(bech32Address)}</span>
            ) : (
              'Connect Wallet'
            )}
          </button>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors z-10"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-purple-500" />
            ) : (
              <Menu className="w-5 h-5 text-purple-500" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden w-full shadow-lg bg-white/20 backdrop-blur-md border border-white/20 px-4 py-4 mt-2"
        >
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2 text-sm shadow-sm border border-white/20 ${
                    isActive
                      ? 'bg-white/30 text-gray-900 border-white/30'
                      : 'bg-white/15 text-gray-700 hover:text-gray-900 hover:bg-white/25'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      )}
      
      {/* Wallet Modal */}
      <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </header>
  );
} 