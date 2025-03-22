import Phaser from 'phaser';
import Jokers from './Jokers.js';

/**
 * Evaluate a 5-card hand and return:
 * {
 *   handType: string,
 *   score: number,
 *   winningCards: array of card objects that form the winning combo
 * }
 */
export function evaluateHand(cards, playerContext, inventory) {
  if (cards.length !== 5) {
    return { handType: 'Invalid', score: 0, winningCards: [] };
  }
  
  // Order to compare ranks
  const ranksOrder = [
    'ace','2','3','4','5','6','7','8','9','sota','caballo','rey'
  ];
  
  // Count ranks & suits
  const rankCounts = {};
  const suitCounts = {};
  
  // Also store rank -> array of card objects
  const rankToCardsMap = {};
  
  for (const card of cards) {
    // Count rank
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    
    // Map rank to a list of actual card objects
    if (!rankToCardsMap[card.rank]) {
      rankToCardsMap[card.rank] = [];
    }
    rankToCardsMap[card.rank].push(card);
    
    // Count suit
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
  }
  
  // Sort cards by rank index for straight checks
  const sortedCards = [...cards].sort((a, b) => {
    return ranksOrder.indexOf(a.rank) - ranksOrder.indexOf(b.rank);
  });
  
  // Check for flush (all suits the same)
  const isFlush = Object.values(suitCounts).some(count => count === 5);
  
  // Check for straight (consecutive ranks)
  let isStraight = true;
  for (let i = 0; i < 4; i++) {
    const currentIndex = ranksOrder.indexOf(sortedCards[i].rank);
    const nextIndex = ranksOrder.indexOf(sortedCards[i + 1].rank);
    if (nextIndex - currentIndex !== 1) {
      isStraight = false;
      break;
    }
  }
  
  // Tally combos (pairs, 3-of-kind, etc.)
  // Example combos in descending order:
  //  [4,1] => Four of a Kind
  //  [3,2] => Full House
  //  [3,1,1] => Three of a Kind
  //  [2,2,1] => Two Pairs
  //  [2,1,1,1] => One Pair
  const counts = Object.values(rankCounts).sort((a, b) => b - a);

  // We'll figure out which cards are in the winning set:
  let handType = 'Carta Alta';
  let baseScore = 5;  // default if none of the combos below
  let multiplier = 1;
  let winningCards = [];

  // Helper: gather all cards if flush/straight
  const allFive = [...cards];
  
  function getCardsForCount(n) {
    // e.g. if n=3, return the card objects from rank that has 3 copies
    for (let rank in rankCounts) {
      if (rankCounts[rank] === n) {
        return rankToCardsMap[rank];
      }
    }
    return [];
  }
  
  // Start determining best hand:
  if (isStraight && isFlush) {
    handType = 'Escalera de Color';
    baseScore = 100;
    multiplier = 8;
    winningCards = allFive;
  } else if (counts[0] === 4) {
    handType = 'Póker';
    baseScore = 60;
    multiplier = 7;
    winningCards = getCardsForCount(4);
  } else if (counts[0] === 3 && counts[1] === 2) {
    handType = 'Full House';
    baseScore = 40;
    multiplier = 4;
    winningCards = allFive;
  } else if (isFlush) {
    handType = 'Color';
    baseScore = 35;
    multiplier = 4;
    winningCards = allFive;
  } else if (isStraight) {
    handType = 'Escalera';
    baseScore = 30;
    multiplier = 4;
    winningCards = allFive;
  } else if (counts[0] === 3) {
    handType = 'Trío';
    baseScore = 30;
    multiplier = 3;
    winningCards = getCardsForCount(3);
  } else if (counts[0] === 2 && counts[1] === 2) {
    handType = 'Doble Pareja';
    baseScore = 20;
    multiplier = 2;
    winningCards = [];
    for (let rank in rankCounts) {
      if (rankCounts[rank] === 2) {
        winningCards = winningCards.concat(rankToCardsMap[rank]);
      }
    }
  } else if (counts[0] === 2) {
    handType = 'Pareja';
    baseScore = 10;
    multiplier = 2;
    winningCards = getCardsForCount(2);
  } 

  // Calculate base chips from card values
  let chips = 0;
  cards.forEach(card => {
    let cardValue = ranksOrder.indexOf(card.rank) + 1;
    if (card.rank === 'ace') cardValue = 14; // Ace is high
    chips += cardValue;
  });

  applyJokerEffects(cards, playerContext, inventory);

  // Calculate final score with joker effects applied
  const finalScore = Math.round((baseScore + chips) * (multiplier + playerContext.multiplier));

  console.log(`Final Score: ${finalScore}, Chips: ${chips}, Multiplier: ${multiplier}, playerContext Multiplier: ${playerContext.multiplier}`);

  return { handType, score: finalScore, winningCards };
}

/**
 * Apply joker effects to the hand
 */
function applyJokerEffects(cards, context, inventory) {
  // Get the player's owned jokers from the registry
  const ownedJokers = inventory.getOwnedJokers();
  if (ownedJokers.length === 0) return; // No jokers to apply
  
  // Apply each owned joker's effect
  ownedJokers.forEach(joker => {
    console.log(`Applying joker effect: ${joker.name}`);
    
    try {
      // Create a function from the effect string
      const effectFn = new Function('cards', 'context', joker.effect);
      
      // Apply the effect to the context
      effectFn(cards, context);
    } catch (error) {
      console.error(`Error applying joker effect for ${joker.name}:`, error);
    }
  });
}