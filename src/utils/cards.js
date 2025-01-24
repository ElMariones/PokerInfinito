// Get the base URL dynamically
const isGitHubPages = window.location.hostname.includes('github.io');
const baseURL = isGitHubPages ? '/PokerInfinito/assets/cards/' : '/assets/cards/';

// Define suits and ranks
const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];

// Generate a dictionary of card image paths
const cards = {};

suits.forEach(suit => {
  ranks.forEach(rank => {
    cards[`${rank}_of_${suit}`] = `${baseURL}${rank}_of_${suit}.png`;
  });
});

// Export the cards object
export default cards;
