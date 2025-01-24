import Phaser from 'phaser'

/**
 * Draw a specified number of cards from the top of the deck.
 * @param {Array} deck - array of card objects
 * @param {number} numberOfCards - how many to draw
 * @returns {Array} an array of card objects drawn
 */
export function drawCards(deck, numberOfCards) {
    // Remove `numberOfCards` from the FRONT of deck
    // (i.e., 'top' of the array if we treat deck[0] as top)
    return deck.splice(0, numberOfCards);
  }
  