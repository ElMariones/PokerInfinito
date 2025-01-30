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

    // We'll store these after init()
    this.pointsNeeded = 0;
    this.maxRounds = 0;
  }

  /**
   * Called when we do: this.scene.start('GameScene', { pointsNeeded, rounds })
   */
  init(data) {
    // Read the data from the MapScene
    this.pointsNeeded = data.pointsNeeded || 300;
    this.maxRounds = data.rounds || 5;
    this.score = 0;
    this.roundNumber = 1;
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

    // --- LAUNCH UI SCENE ---
    // If it's not already active, launch it. The UI scene shows Submit/Shuffle buttons.
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    }
    // Bring it on top in case it's behind
    this.scene.bringToTop('UIScene');
  }

  // Called by the UI scene’s "Shuffle" button
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

  // Called by the UI scene’s "Submit" button
  onSubmitHand() {
    // Must have exactly 5 selected cards
    if (this.selectedCards.length !== 5) {
      this.showResultMessage('Selecciona 5 cartas para jugar');
      return;
    }

    // Evaluate
    const result = evaluateHand(this.selectedCards);
    this.score += result.score;

    // Animate the selected cards to the center & highlight winners
    this.animateSelectedCards(result);
  }

  animateSelectedCards(result) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    // Hide unselected cards
    this.cardSprites.forEach(sprite => {
      const isSelected = this.selectedCards.some(card => card.key === sprite.texture.key);
      if (!isSelected) {
        sprite.setVisible(false);
      }
    });

    // Animate the 5 selected cards to the center
    const newScale = 0.27;
    const spacing = 170;
    const totalWidth = (this.selectedCards.length - 1) * spacing;
    const startX = centerX - totalWidth / 2;

    this.selectedCards.forEach((card, index) => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      sprite.clearTint();
      sprite.setScale(newScale);
      sprite.disableInteractive();

      this.tweens.add({
        targets: sprite,
        x: startX + index * spacing,
        y: centerY,
        duration: 500,
        ease: 'Sine.easeInOut',
      });
    });

    // After tween finishes, highlight winning cards and show the result
    this.time.delayedCall(500, () => {
      this.highlightWinningCards(result);

      // Wait 1 second to show the result and deal a new hand or end
      this.time.delayedCall(1000, () => {
        this.showResultMessage(`${result.handType} (+${result.score} puntos)`);

        this.time.delayedCall(1000, () => {
          this.roundNumber++;

          // Check if we still have rounds left
          if (this.roundNumber <= this.maxRounds) {
            // Next round
            this.dealNewHand();
          } else {
            // All rounds done, check if we reached or exceeded the target
            if (this.score >= this.pointsNeeded) {
              // Win → go back to MapScene
              this.scene.stop('UIScene');
              this.scene.start('MapScene');
            } else {
              // Lose → back to IntroScene
              this.scene.stop('UIScene');
              this.scene.start('IntroScene');
            }
          }
        });
      });
    });
  }

  highlightWinningCards(result) {
    const winners = result.winningCards || [];
    winners.forEach(card => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (!sprite) return;

      // Gold tint
      sprite.setTint(0xffd700);

      // Optional shadow
      const shadow = this.add.image(sprite.x, sprite.y, card.key)
        .setScale(sprite.scale * 1.05)
        .setTint(0xffffff)
        .setAlpha(0.5);
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
    if (this.selectedCards.includes(card)) {
      // Unselect
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      sprite.setScale(0.5);
      sprite.clearTint();
    } else {
      // Select if fewer than 5
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
