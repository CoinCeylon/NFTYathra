'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, X, Info, LogOut } from 'lucide-react';
import { useWallet, useWalletList } from '@meshsdk/react';
import toast from 'react-hot-toast';
import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';

export default function WalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { connect, disconnect, connected, wallet } = useWallet();
  const walletList = useWalletList();

  // State for connected address
  const [connectedAddress, setConnectedAddress] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      if (connected && wallet) {
        try {
          const addresses = await wallet.getUsedAddresses();
          if (addresses && addresses.length > 0) {
            setConnectedAddress(addresses[0]);
          } else {
            setConnectedAddress('');
          }
        } catch {
          setConnectedAddress('');
        }
      } else {
        setConnectedAddress('');
      }
    };
    fetchAddress();
  }, [connected, wallet]);

  // Reorder wallets: Lace, Eternl, then others
  const orderedWalletList = useMemo(() => {
    const lace = walletList.find(w => w.name.toLowerCase().includes('lace'));
    const eternl = walletList.find(w => w.name.toLowerCase().includes('eternl'));
    const okx = walletList.find(w => w.name.toLowerCase().includes('okx'));
    const others = walletList.filter(w => 
      !w.name.toLowerCase().includes('lace') && 
      !w.name.toLowerCase().includes('eternl') && 
      !w.name.toLowerCase().includes('okx')
    );
    
    return [lace, eternl, okx, ...others].filter(Boolean);
  }, [walletList]);

  // Function to format wallet display name
  const getWalletDisplayName = (walletName: string) => {
    const name = walletName.toLowerCase();
    if (name.includes('eternl')) return 'Eternl';
    if (name.includes('lace')) return 'Lace';
    if (name.includes('okx')) return 'OKX';
    return walletName;
  };

  // Disconnect handler
  const handleDisconnect = async () => {
    await disconnect();
    toast.success('Wallet disconnected');
    onClose();
  };

  // Get connected wallet name
  const { name: connectedWalletName } = useWallet();
  const connectedWallet = useMemo(() => {
    if (!connected || !connectedWalletName) return null;
    const found = walletList.find(w => w.name === connectedWalletName);
    return found ? found.name : connectedWalletName;
  }, [connected, connectedWalletName, walletList]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md mx-auto rounded-3xl bg-white/30 backdrop-blur-md border border-white/20 shadow-xl p-8 flex flex-col items-center"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Gradient Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 mb-4 shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-700 mb-6 text-center">Select a Cardano wallet to connect</p>
            
            {/* If connected, show wallet info and disconnect */}
            {connected && connectedWallet ? (
              <div className="w-full space-y-4 mb-4">
                <div className="bg-white/30 rounded-xl p-4 flex flex-col gap-2 border border-white/40 text-gray-700">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-purple-500" />
                    <span className="text-lg font-semibold">{getWalletDisplayName(connectedWallet)} Wallet Connected</span>
                  </div>
                  {/* Show address with copy button */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-xs break-all">{connectedAddress}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(connectedAddress);
                        toast.success('Address copied!');
                      }}
                      className="px-2 py-1 rounded bg-white/40 hover:bg-white/60 text-xs text-gray-700 border border-white/30"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-red-600 hover:to-pink-600 transition-colors duration-200 mb-1"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="w-full space-y-3 mb-4">
                {orderedWalletList.length === 0 ? (
                  <div className="bg-white/30 rounded-xl p-4 flex items-center gap-3 border border-white/40 text-center text-gray-700">
                    <Info className="w-5 h-5 text-purple-500" />
                    <span>No Cardano wallets found. Please install a supported wallet extension.</span>
                  </div>
                ) : (
                  orderedWalletList.map((w) => {
                    if (!w) return null;
                    const displayName = getWalletDisplayName(w.name);
                    return (
                      <button
                        key={w.name}
                        onClick={() => connect(w.name)}
                        className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-400 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-colors duration-200 disabled:opacity-50 mb-1"
                      >
                        <Image src={w.icon} alt="Wallet logo" className="w-7 h-7 rounded-full bg-white/20" width={28} height={28} />
                        <span className="text-lg">Connect {displayName} Wallet</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
            
            <div className="w-full bg-white/30 rounded-xl p-4 flex items-center gap-3 mb-4 border border-white/40">
              <Info className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-gray-700">
                <b>Note:</b> Make sure your wallet is set to the Cardano pre-prod testnet and has test ADA tokens.
              </span>
            </div>
            
            <button
              onClick={onClose}
              className="w-full py-2 rounded-full font-medium text-gray-700 bg-black/10 hover:bg-black/20 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 