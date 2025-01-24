import Phaser from 'phaser'

/**
 * Evaluate a 5-card hand and return a scoring object.
 *
 * @param {Array} cards - array of 5 card objects: {rank, suit, key}
 * @returns {{handType: string, score: number}}
 */
export function evaluateHand(cards) {
    if (cards.length !== 5) {
      return { handType: 'Invalid', score: 0 };
    }
  
    const ranksOrder = ['2','3','4','5','6','7','8','9','10','jack','queen','king','ace'];
    
    // 1) Tally ranks & suits
    const rankCounts = {};
    const suitCounts = {};
    
    for (const card of cards) {
      // Count rank
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  
      // Count suit
      suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    }
  
    // 2) Sort the cards by rank index so we can check for straights
    const sortedCards = [...cards].sort((a, b) => {
      return ranksOrder.indexOf(a.rank) - ranksOrder.indexOf(b.rank);
    });
  
    // 3) Identify if we have a flush (all suits the same)
    const isFlush = Object.values(suitCounts).some(count => count === 5);
  
    // 4) Identify if we have a straight
    //    e.g. ranks [5,6,7,8,9] or [10, jack, queen, king, ace]
    let isStraight = true;
    for (let i = 0; i < 4; i++) {
      const currentIndex = ranksOrder.indexOf(sortedCards[i].rank);
      const nextIndex = ranksOrder.indexOf(sortedCards[i + 1].rank);
      if (nextIndex - currentIndex !== 1) {
        isStraight = false;
        break;
      }
    }
  
    // 5) Count combos like pairs, three-of-a-kind, etc.
    //    e.g. if we have rankCounts= { '5':2, 'king':3} => full house
    const counts = Object.values(rankCounts).sort((a, b) => b - a); 
    // Example combos:
    //   [4,1] = Four of a Kind
    //   [3,2] = Full House
    //   [3,1,1] = Three of a Kind
    //   [2,2,1] = Two Pairs
    //   [2,1,1,1] = One Pair
    //   [1,1,1,1,1] = All distinct
  
    // 6) Determine final hand type + score
    if (isStraight && isFlush) {
        return { handType: 'Escalera de Color', score: 100 };
      } else if (counts[0] === 4) {
        return { handType: 'Póker', score: 90 };
      } else if (counts[0] === 3 && counts[1] === 2) {
        return { handType: 'Full House', score: 80 };
      } else if (isFlush) {
        return { handType: 'Color', score: 70 };
      } else if (isStraight) {
        return { handType: 'Escalera', score: 60 };
      } else if (counts[0] === 3) {
        return { handType: 'Trío', score: 50 };
      } else if (counts[0] === 2 && counts[1] === 2) {
        return { handType: 'Doble Pareja', score: 40 };
      } else if (counts[0] === 2) {
        return { handType: 'Pareja', score: 30 };
      } else {
        return { handType: 'Carta Alta', score: 10 };
      }      
  }
  