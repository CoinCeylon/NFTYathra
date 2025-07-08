export const meshConfig = {
  network: process.env.NEXT_PUBLIC_NETWORK || 'preprod',
  blockfrost: {
    projectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || 'preprodl2B3AGVw6OrW3EbyXa6boCgPM8wzA9Cq',
  },
};

export const touristLocations = [
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    description: 'Ancient palace and fortress complex',
    imageUrl: 'ipfs://bafybeif6yw4a6hnrvwujp4ku34dsreqj4fyivswgujebck2kj5quz5yzoa',
    rarity: 'Epic',
  },
  {
    id: 'kandy',
    name: 'Temple of the Sacred Tooth Relic',
    description: 'Sacred Buddhist temple',
    imageUrl: 'ipfs://bafybeihbdfet2q6yuhipcakjuo5lzahiub4jft7nejfto75jolqiduefpy',
    rarity: 'Rare',
  },
  {
    id: 'galle',
    name: 'Galle Fort',
    description: 'Historic coastal fortress',
    imageUrl: 'ipfs://bafkreibxsbzpjqp7kufdyohqaj7c5qgymfxmkrw4rewp57g6zgvc6k6x3i',
    rarity: 'Common',
  },
]; 