const generateRandomName = () => {
  const names = [
    'Moonlit Mirage',
    'Obsidian Wraith',
    'Shadowed Echo',
    'Ebon Veil',
    'Crimson Paradox',
    'Lunar Tempest',
    'Celestial Requiem',
    'Violet Specter',
    'Sable Rapture',
    'Eclipse Fang',
    'Wandering Revenant',
    'Gilded Serpent',
    'Frostbound Phantom',
    'Aurora’s Shard',
    'Ashen Sentinel',
    'Dusk’s Embrace',
    'Iron Zephyr',
    'Velvet Eclipse',
    'Twilight Widow',
    'Ember Ghost'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomCode = () => Math.random().toString(36).substr(2, 6).toUpperCase();

const generateProbability = () => Math.floor(Math.random() * 100) + 1;

module.exports = { generateRandomName, generateRandomCode, generateProbability };
  