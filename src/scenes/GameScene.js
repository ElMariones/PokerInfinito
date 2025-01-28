import Phaser from 'phaser'; 
import { createDeck, shuffle } from '../utils/Deck.js';
import { drawCards } from '../utils/HandManager.js';
import { evaluateHand } from '../utils/PokerScoring.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.deck = [];
    this.playerHand = [];
    this.selectedCards = [];
    this.score = 0;
    this.roundNumber = 1;
    this.cardSprites = [];
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Background
    const background = this.add.image(centerX, centerY, 'rug');
    background.setDisplaySize(gameWidth, gameHeight);

    // Create & shuffle deck
    this.deck = createDeck();
    shuffle(this.deck);

    // Deal initial hand
    this.dealNewHand();

    // Launch the UI Scene (only once)
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    }
  }

  // Called by UIScene's Shuffle button
  shuffleAnimation() {
    const duration = 500;

    // Animate cards scattering randomly
    this.cardSprites.forEach(sprite => {
      const randX = this.cameras.main.width / 2 + (Math.random() * 200 - 100);
      const randY = this.cameras.main.height / 2 + (Math.random() * 200 - 100);

      this.tweens.add({
        targets: sprite,
        x: randX,
        y: randY,
        duration: duration,
        ease: 'Sine.easeInOut',
        yoyo: true,
      });
    });

    // After animation, replace with new cards
    this.time.delayedCall(duration * 2, () => {
      this.dealNewHand();
    });
  }

  // Called by UIScene's Submit button
  onSubmitHand() {
    // Must have exactly 5 selected cards
    if (this.selectedCards.length !== 5) {
      // Show a short message telling the player to select 5 cards
      this.showResultMessage('You must select 5 cards to play');
      return;
    }

    const result = evaluateHand(this.selectedCards);
    this.score += result.score;

    // Animate the selected cards to the center & highlight winners
    this.animateSelectedCards(result);
  }

  animateSelectedCards(result) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Hide all *unselected* cards from view
    this.cardSprites.forEach(sprite => {
      // If this sprite's card is not in selectedCards, hide it
      const isSelected = this.selectedCards.some(card => card.key === sprite.texture.key);
      if (!isSelected) {
        sprite.setVisible(false);
      }
    });

    // Animate the 5 selected cards to the center
    // We'll put them in a row in the center, smaller scale so they're fully visible
    const newScale = 0.27;
    const spacing = 170; // space between cards in the center
    const totalWidth = (this.selectedCards.length - 1) * spacing;
    const startX = centerX - totalWidth / 2;

    // Before tweening them to the center, clear any "selected" tint
    this.selectedCards.forEach((card, index) => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);

      // Remove the gray selection tint and set them to the new scale right away
      sprite.clearTint();
      sprite.setScale(newScale);

      // Disable input on the sprite so it can't be clicked in the center
      sprite.disableInteractive();

      // Tween them into their final position in the center
      this.tweens.add({
        targets: sprite,
        x: startX + index * spacing,
        y: centerY,
        duration: 500,
        ease: 'Sine.easeInOut',
      });
    });

    // After the tween finishes, highlight winning cards and then show the result message
    this.time.delayedCall(500, () => {
      this.highlightWinningCards(result);

      // Wait 2 seconds to show the result and deal a new hand
      this.time.delayedCall(1000, () => {
        this.showResultMessage(`${result.handType} (+${result.score} puntos)`);
        
        // We can wait a bit more before dealing a new hand so the player can see the message:
        this.time.delayedCall(1000, () => {
          this.roundNumber++;
          this.dealNewHand();
        });
      });
    });
  }

  /**
   * Highlights the “winning” cards in gold with a simple white shadow behind them.
   */
  highlightWinningCards(result) {
    // Array of card objects that form the best combo
    const winners = result.winningCards || [];

    winners.forEach(card => {
      // Find the sprite that matches this card
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (!sprite) return;

      // Gold tint on the main sprite
      sprite.setTint(0xffd700);

      // Optional: create a white "shadow" sprite behind it
      const shadow = this.add.image(sprite.x, sprite.y, card.key)
        .setScale(sprite.scale * 1.05)   // slightly bigger
        .setTint(0xffffff)              // white
        .setAlpha(0.5);                 // translucent

      // Put shadow behind
      shadow.depth = sprite.depth - 1;
    });
  }

  dealNewHand() {
    // If deck is nearly empty, recreate & shuffle
    if (this.deck.length < 10) {
      this.deck = createDeck();
      shuffle(this.deck);
    }

    this.selectedCards = [];

    // Destroy old sprites
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];

    // Draw new 10 cards
    this.playerHand = drawCards(this.deck, 10);
    this.displayHand();
  }

  displayHand() {
    const cardScale = 0.5;
    const cardSpacing = 80;
    const totalWidth = (this.playerHand.length - 1) * cardSpacing;
    const startX = (this.cameras.main.width / 2) - (totalWidth / 2);
    const posY = this.cameras.main.height - 150;

    this.playerHand.forEach((card, index) => {
      const xPos = startX + index * cardSpacing;
      const sprite = this.add.image(xPos, posY, card.key)
        .setInteractive()
        .setScale(cardScale);

      sprite.on('pointerover', () => {
        if (!this.selectedCards.includes(card)) {
          sprite.setScale(cardScale * 1.05);
        }
      });

      sprite.on('pointerout', () => {
        if (!this.selectedCards.includes(card)) {
          sprite.setScale(cardScale);
          sprite.clearTint();
        }
      });

      sprite.on('pointerdown', () => {
        this.toggleCardSelection(card, sprite);
      });

      this.cardSprites.push(sprite);
    });
  }

  toggleCardSelection(card, sprite) {
    // If card is already in selectedCards, unselect it
    if (this.selectedCards.includes(card)) {
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      sprite.setScale(0.5);
      sprite.clearTint();
    } else {
      // Select if fewer than 5 selected
      if (this.selectedCards.length < 5) {
        this.selectedCards.push(card);
        sprite.setScale(0.6);
        sprite.setTint(0x808080);
      }
    }
  }

  showResultMessage(msg) {
    const text = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 200,
      msg,
      {
        fontSize: '36px',
        color: '#ffff00',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      }
    ).setOrigin(0.5);

    // Destroy the text after 2 seconds
    this.time.delayedCall(2000, () => {
      text.destroy();
    });
  }
}
