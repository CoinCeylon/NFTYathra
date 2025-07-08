'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@meshsdk/react';
import Image from 'next/image';

// Define minimal Asset type for wallet.getAssets()
// Remove Asset type definition if not used

type AssetLike = {
  unit: string;
  quantity: string;
  assetName?: string;
  policyId?: string;
  metadata: {
    name?: string;
    image?: string | string[];
    [key: string]: unknown;
  };
};

function isAssetLike(a: unknown): a is AssetLike {
  return (
    typeof a === 'object' &&
    a !== null &&
    'unit' in a &&
    'quantity' in a &&
    'metadata' in a &&
    typeof (a as { unit: unknown }).unit === 'string' &&
    typeof (a as { quantity: unknown }).quantity === 'string' &&
    typeof (a as { metadata: unknown }).metadata === 'object' &&
    (a as { metadata: unknown }).metadata !== null &&
    'image' in (a as { metadata: { image?: unknown } }).metadata
  );
}

export default function MyNFTs() {
  const { connected, wallet } = useWallet();
  const [userNFTs, setUserNFTs] = useState<AssetLike[]>([]);
  const [loading, setLoading] = useState(false);

  // Memoize expensive calculations
  const stats = useMemo(() => ({
    total: userNFTs.length,
  }), [userNFTs]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (connected && wallet) {
        setLoading(true);
        try {
          const assets = (await wallet.getAssets()) as unknown[];
          // Filter for NFTs (quantity === '1' and has metadata with image)
          const nfts = assets
            .filter(isAssetLike)
            .filter((a) => a.quantity === '1' && a.metadata && a.metadata.image)
            .map((a) => ({
              unit: a.unit,
              quantity: a.quantity,
              assetName: a.assetName,
              policyId: a.policyId,
              metadata: a.metadata,
            }));
          setUserNFTs(nfts);
        } catch {
          setUserNFTs([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUserNFTs([]);
      }
    };
    fetchNFTs();
  }, [connected, wallet]);

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">🖼️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your POV NFTs</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">🖼️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Loading your NFTs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">My Collection</h1>
        <div className="mb-8 flex gap-6">
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center w-32">
            <span className="text-2xl font-bold text-white">{stats.total}</span>
            <span className="text-gray-400 text-sm">Total NFTs</span>
          </div>
        </div>
        {userNFTs.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">🖼️</div>
            <div>No NFTs found in your wallet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {userNFTs.map((nft: AssetLike) => {
              let imageUrl = '';
              if (nft.metadata.image) {
                const img = Array.isArray(nft.metadata.image) ? nft.metadata.image.join('') : nft.metadata.image;
                imageUrl = img.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${img.replace('ipfs://', '')}` : img;
              }
              return (
                <div key={nft.unit} className="bg-white/10 rounded-2xl p-4 border border-white/20 shadow-lg flex flex-col items-center">
                  <Image
                    src={imageUrl}
                    alt={nft.metadata.name || 'NFT image'}
                    className="rounded-xl w-full h-48 object-cover mb-3 border border-white/30 shadow-md"
                  />
                  <div className="text-lg font-bold text-white mb-1">{nft.metadata.name || nft.assetName || nft.unit}</div>
                  <div className="text-xs text-gray-400 break-all mb-2">{nft.unit}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 