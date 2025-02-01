import Phaser from 'phaser' 

/**
 * Generate a standard deck of playing cards.
 *
 * @param {boolean} includeJokers - if true, add 2 jokers
 * @returns {Array} An array of card objects of shape:
 *    { rank: string, suit: string, key: string }
 */
export function createDeck(includeJokers = false) {
    const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    const ranks = ['2','3','4','5','6','7','8','9','10','queen','king','ace'];
  
    const deck = [];
  
    // Build standard 52-card deck
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          rank,
          suit,
          key: getCardKey(rank, suit),
        });
      }
    }
  
    if (includeJokers) {
      deck.push({ rank: 'black_joker', suit: 'joker', key: 'black_joker' });
      deck.push({ rank: 'red_joker',   suit: 'joker', key: 'red_joker' });
    }
  
    return deck;
}
  
function getCardKey(rank, suit) {
  return `${rank}_of_${suit}`;
}
  
/**
 * Shuffle an array in-place using Fisher-Yates.
 * 
 * @param {Array} deck - an array of cards
 */
export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}