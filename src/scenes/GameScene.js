import Phaser from 'phaser'

import { createDeck, shuffle } from '../utils/Deck.js';
import { drawCards } from '../utils/HandManager.js';
import { evaluateHand } from '../utils/PokerScoring.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    // We’ll store public data so UIScene can access
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

    const background = this.add.image(centerX, centerY, 'rug');
    background.setDisplaySize(gameWidth, gameHeight);

    // Create & shuffle deck
    this.deck = createDeck();
    shuffle(this.deck);

    // Deal initial 10
    this.dealNewHand();

    // Launch the UI Scene (only once)
    // (If you re-launch repeatedly, you might spawn multiple UI scenes)
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene'); 
    }
  }

  // Called by the UIScene or internally if needed
  onSubmitHand() {
    if (this.selectedCards.length !== 5) {
      // Could show a warning or do nothing
      return;
    }
    // Evaluate
    const result = evaluateHand(this.selectedCards);
    this.score += result.score;

    // Show a quick message
    this.showResultMessage(`${result.handType} (+${result.score} puntos)`);

    // Next round
    this.roundNumber++;
    this.dealNewHand();
  }

    // Instead of directly shuffling the 10 cards, we add an animation first
    shuffleAnimation() {
        // Animate each card for 500ms, then yoyo back for 500ms = 1s total
        const duration = 500;
    
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
    
        // After 1 second, do the actual shuffle & re-display
        this.time.delayedCall(duration * 2, () => {
          this._fisherYatesShuffle(this.playerHand);
          this.displayHand();
        });
      }
    
      _fisherYatesShuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }

  // Re-deal or re-display the next round's 10 cards
  dealNewHand() {
    // If we don’t have enough cards, re-create deck
    if (this.deck.length < 10) {
      this.deck = createDeck();
      shuffle(this.deck);
    }
    // Clear selected
    this.selectedCards = [];

    // Destroy old sprites if any
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];

    // Draw new 10
    this.playerHand = drawCards(this.deck, 10);
    // Show them
    this.displayHand();
  }

  displayHand() {
    // Bottom-center layout
    const cardScale = 0.5;     // base scale
    const cardSpacing = 80;    // spacing between cards
    const totalWidth = (this.playerHand.length - 1) * cardSpacing;
    const startX = (this.cameras.main.width / 2) - (totalWidth / 2);
    const posY = this.cameras.main.height - 150;

    this.playerHand.forEach((card, index) => {
      const xPos = startX + index * cardSpacing;
      const sprite = this.add.image(xPos, posY, card.key)
        .setInteractive()
        .setScale(cardScale);

      // Mouse events
      sprite.on('pointerover', () => {
        // If not selected, grow 5%
        if (!this.selectedCards.includes(card)) {
          sprite.setScale(cardScale * 1.05); // 0.525
        }
      });
      sprite.on('pointerout', () => {
        // If not selected, revert
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
    // If already selected, deselect
    if (this.selectedCards.includes(card)) {
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      sprite.setScale(0.5);
      sprite.clearTint();
      //this.sound.play('deselect');
    } else {
      // Allow up to 5
      if (this.selectedCards.length < 5) {
        this.selectedCards.push(card);
        // 20% bigger => scale(0.6) from base(0.5)
        sprite.setScale(0.6);
        // grayscale tint
        sprite.setTint(0x808080);
        // Play the "select" sound
        //this.sound.play('select');
      }
    }
  }

  showResultMessage(msg) {
    const txt = this.add.text(
      this.cameras.main.width / 2,
      150,
      msg,
      {
        fontSize: '32px',
        color: '#ffff00',
        backgroundColor: '#000000',
        padding: { x: 10, y: 5 },
      }
    ).setOrigin(0.5);

    // Fade out
    this.time.delayedCall(2000, () => {
      txt.destroy();
    });
  }
}
