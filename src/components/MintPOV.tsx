'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWallet } from '@meshsdk/react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Navigation, CheckCircle, XCircle, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { touristLocations } from '@/lib/mesh';
import { 
  Coordinates, 
  calculateDistance, 
  isLocationVerified, 
  getCurrentLocation, 
  getMockLocation,
  touristLocationData 
} from '@/lib/location';
import { Transaction, ForgeScript } from '@meshsdk/core';
import Image from 'next/image';

export default function MintPOV() {
  const { connected, wallet } = useWallet();
  const [selectedLocation, setSelectedLocation] = useState(touristLocations[0]);
  const [minting, setMinting] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [verifyingLocation, setVerifyingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationMode, setLocationMode] = useState('mock');

  // Memoize location data to avoid recalculation
  const locationData = useMemo(() => 
    touristLocationData[selectedLocation.id], 
    [selectedLocation.id]
  );

  // Memoize distance calculation
  const distance = useMemo(() => {
    if (!userLocation || !locationData) return null;
    return calculateDistance(userLocation, locationData.coordinates);
  }, [userLocation, locationData]);

  // Always use mock location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (locationMode === 'real') {
          const loc = await getCurrentLocation();
          setUserLocation(loc);
        } else {
          const loc = getMockLocation(selectedLocation.id);
          setUserLocation(loc);
        }
      } catch {
        setUserLocation(null);
      }
    };
    fetchLocation();
  }, [selectedLocation.id, locationMode]);

  const verifyLocation = useCallback(async () => {
    if (!userLocation) {
      toast.error('Unable to get your location');
      return;
    }

    setVerifyingLocation(true);
    
    // Simulate location verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (locationData) {
      const isNearby = isLocationVerified(userLocation, selectedLocation.id);
      
      setLocationVerified(isNearby);
      
      if (isNearby && distance) {
        toast.success(`Location verified! You're ${distance.toFixed(1)}km from ${selectedLocation.name}`);
      } else if (distance) {
        toast.error(`Too far from ${selectedLocation.name}. You're ${distance.toFixed(1)}km away (need to be within ${locationData.radius}km).`);
      }
    }
    
    setVerifyingLocation(false);
  }, [userLocation, locationData, selectedLocation.id, selectedLocation.name, distance]);

  const handleMint = useCallback(async () => {
    if (!connected || !wallet) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!locationVerified) {
      toast.error('Please verify your location first');
      return;
    }

    setMinting(true);
    try {
      // Prepare NFT metadata
      const nftName = `POV - ${selectedLocation.name}`;
      const assetName = `POV_${selectedLocation.id}_${Date.now()}`;
      const imageUri = selectedLocation.imageUrl;
      const imageField = imageUri.length > 64
        ? [imageUri.slice(0, 64), imageUri.slice(64)]
        : imageUri;
      const metadata = {
        name: nftName,
        description: `Proof of Visit to ${selectedLocation.name}`,
        location: selectedLocation.name,
        timestamp: new Date().toISOString(),
        rarity: selectedLocation.rarity,
        image: imageField,
      };

      // Get used address for minting policy
      const usedAddresses = await wallet.getUsedAddresses();
      const mintAddress = usedAddresses[0];

      // Create a simple ForgeScript (one signature)
      const forgingScript = ForgeScript.withOneSignature(mintAddress);

      // Build the transaction
      const tx = new Transaction({ initiator: wallet });
      const asset = {
        assetName,
        assetQuantity: '1',
        metadata,
        label: '721' as `${number}`,
        recipient: mintAddress,
      };
      tx.mintAsset(forgingScript, asset);
      // Add payment of 1.5 ADA to self to satisfy minimum UTxO
      tx.sendLovelace(mintAddress, '1500000'); // 1.5 ADA in lovelace

      // Build, sign, and submit
      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      await wallet.submitTx(signedTx);

      toast.success(`Successfully minted POV NFT for ${selectedLocation.name}!`);
      setLocationVerified(false); // Reset for next mint
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint NFT');
    } finally {
      setMinting(false);
    }
  }, [connected, wallet, locationVerified, selectedLocation]);

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-lg max-w-xl mx-auto"
      >
        <div className="text-center text-gray-400">
          <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Connect your wallet to mint POV NFTs</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-lg max-w-xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Mint POV NFT</h2>
      </div>

      <div className="space-y-6">
        {/* Location mode toggle */}
        <div className="mb-4 flex gap-4 items-center">
          <label className="text-sm font-medium text-gray-300">Location Mode:</label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="locationMode"
              value="real"
              checked={locationMode === 'real'}
              onChange={() => setLocationMode('real')}
              className="accent-blue-500"
            />
            <span className="text-gray-200">Real Location</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="locationMode"
              value="mock"
              checked={locationMode === 'mock'}
              onChange={() => setLocationMode('mock')}
              className="accent-purple-500"
            />
            <span className="text-gray-200">Mock Location</span>
          </label>
          {locationMode === 'mock' && (
            <span className="ml-4 px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs font-semibold border border-purple-400/30 animate-pulse">
              Demo Mode: Mock Location Active
            </span>
          )}
        </div>

        {/* Location info (mock only) */}
        <div className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">Location (Mock)</span>
          </div>
          {userLocation && (
            <p className="text-gray-400 text-sm">
              Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* NFT Preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-4 flex flex-col items-center w-full max-w-xs">
            <Image
              src={selectedLocation.imageUrl.startsWith('ipfs://')
                ? selectedLocation.imageUrl.replace('ipfs://', 'https://ipfs.io/ipfs/')
                : selectedLocation.imageUrl}
              alt={selectedLocation.name}
              className="rounded-xl w-full h-48 object-cover mb-3 border border-white/30 shadow-md"
              width={200}
              height={200}
            />
            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1">{selectedLocation.name}</div>
              <div className="text-sm text-gray-300 mb-1">{selectedLocation.name}</div>
              <div className="text-xs text-gray-400">Rarity: {selectedLocation.rarity}</div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Select Location
          </label>
          <select
            value={selectedLocation.id}
            onChange={(e) => {
              const location = touristLocations.find(loc => loc.id === e.target.value);
              if (location) {
                setSelectedLocation(location);
                setLocationVerified(false); // Reset verification when location changes
              }
            }}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {touristLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} ({location.rarity})
              </option>
            ))}
          </select>
        </div>

        {/* Location Info */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">{selectedLocation.name}</span>
          </div>
          <p className="text-gray-400 text-sm mb-3">{selectedLocation.description}</p>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Rarity: {selectedLocation.rarity}</span>
          </div>
        </div>

        {/* Location Verification */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Location Verification</span>
            </div>
            {locationVerified ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          
          {userLocation && (
            <div className="space-y-2 mb-3">
              <p className="text-gray-400 text-sm">
                Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
              {locationData && (
                <p className="text-gray-400 text-sm">
                  Target: {locationData.coordinates.lat.toFixed(4)}, {locationData.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}
          
          <button
            onClick={verifyLocation}
            disabled={verifyingLocation}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {verifyingLocation ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Location...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5" />
                Verify Location
              </>
            )}
          </button>
        </div>

        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={minting || !locationVerified}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {minting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Minting...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Mint POV NFT
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
} 