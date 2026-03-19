export const NATIONS = {
  ussr: {
    id: 'ussr', name: 'Soviet Union', side: 'allies',
    color: '#cc2222', capital: 'russia', turnOrder: 1, startingIPC: 24,
    flag: '🇷🇺', textColor: '#ffffff'
  },
  germany: {
    id: 'germany', name: 'Germany', side: 'axis',
    color: '#666666', capital: 'germany', turnOrder: 2, startingIPC: 40,
    flag: '🇩🇪', textColor: '#ffffff'
  },
  uk: {
    id: 'uk', name: 'United Kingdom', side: 'allies',
    color: '#c8860a', capital: 'united_kingdom', turnOrder: 4, startingIPC: 29,
    flag: '🇬🇧', textColor: '#ffffff'
  },
  japan: {
    id: 'japan', name: 'Japan', side: 'axis',
    color: '#e8c020', capital: 'japan', turnOrder: 3, startingIPC: 30,
    flag: '🇯🇵', textColor: '#000000'
  },
  usa: {
    id: 'usa', name: 'United States', side: 'allies',
    color: '#4a7c3f', capital: 'eastern_us', turnOrder: 5, startingIPC: 42,
    flag: '🇺🇸', textColor: '#ffffff'
  },
  australia: {
    id: 'australia', name: 'Australia', side: 'allies',
    color: '#2a9a68', capital: 'australia', turnOrder: 6, startingIPC: 10,
    flag: '🇦🇺', textColor: '#ffffff'
  },
  // China — Allied faction controlled by USA, distinct green color matching reference
  china: {
    id: 'china', name: 'China', side: 'allies',
    color: '#6a9040', capital: null, turnOrder: null, startingIPC: 0,
    flag: '🇨🇳', textColor: '#ffffff'
  },
  // Neutral — not a player nation, but territories can be owned by 'neutral'
  neutral: {
    id: 'neutral', name: 'Neutral', side: 'neutral',
    color: '#8a8a6e', capital: null, turnOrder: null, startingIPC: 0,
    flag: '🏳️', textColor: '#ffffff'
  }
};

export const TURN_ORDER = ['ussr', 'germany', 'japan', 'uk', 'usa', 'australia'];
export const ALLIES = ['ussr', 'uk', 'usa', 'australia'];
export const AXIS = ['germany', 'japan'];

/** Return the side ('allies'|'axis'|'neutral') for a given nation id */
export function getSide(nationId) {
  return NATIONS[nationId]?.side ?? 'neutral';
}

/** Are two nations enemies? */
export function areEnemies(a, b) {
  if (!a || !b || a === b) return false;
  const sideA = getSide(a);
  const sideB = getSide(b);
  if (sideA === 'neutral' || sideB === 'neutral') return true; // neutrals can be attacked by anyone
  return sideA !== sideB;
}
