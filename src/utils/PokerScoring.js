import Phaser from 'phaser';

/**
 * Evaluate a 5-card hand and return:
 * {
 *   handType: string,
 *   score: number,
 *   winningCards: array of card objects that form the winning combo
 * }
 */
export function evaluateHand(cards) {
  if (cards.length !== 5) {
    return { handType: 'Invalid', score: 0, winningCards: [] };
  }
  
  // Order to compare ranks
  const ranksOrder = [
    'ace','2','3','4','5','6','7','8','9','10','queen','king'
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
  let score = 10;  // default if none of the combos below
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
    score = 100;
    winningCards = allFive;
  } else if (counts[0] === 4) {
    handType = 'Póker';
    score = 90;
    winningCards = getCardsForCount(4);
    // plus the 5th leftover card is often not “winning,”
    // so we highlight only the 4-of-kind
  } else if (counts[0] === 3 && counts[1] === 2) {
    handType = 'Full House';
    score = 80;
    // highlight all 5 as a typical approach
    winningCards = allFive;
  } else if (isFlush) {
    handType = 'Color';
    score = 70;
    winningCards = allFive;
  } else if (isStraight) {
    handType = 'Escalera';
    score = 60;
    winningCards = allFive;
  } else if (counts[0] === 3) {
    handType = 'Trío';
    score = 50;
    winningCards = getCardsForCount(3);
  } else if (counts[0] === 2 && counts[1] === 2) {
    handType = 'Doble Pareja';
    score = 40;
    // Find both pairs
    winningCards = [];
    for (let rank in rankCounts) {
      if (rankCounts[rank] === 2) {
        winningCards = winningCards.concat(rankToCardsMap[rank]);
      }
    }
  } else if (counts[0] === 2) {
    handType = 'Pareja';
    score = 30;
    winningCards = getCardsForCount(2);
  } 
  // else => 'Carta Alta' with score=10 => highlight none or all?
  // We'll highlight none for high card. (winningCards = [])

  return { handType, score, winningCards };
}
