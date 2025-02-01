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
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Background
    this.add.tileSprite(0, 0, gameWidth, gameHeight, 'rug').setOrigin(0, 0);

    // --- Create & shuffle deck (48 cards total) ---
    let fullDeck = createDeck();      // This is normally 52 cards
    this.deck = fullDeck.slice(0,48); // Keep only first 48
    shuffle(this.deck);

    // Deal initial hand of 10
    this.dealNewHand();

    // --- LAUNCH UI SCENE ---
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    }
    this.scene.bringToTop('UIScene');
  }

  // Called by the UI scene’s "Shuffle" button
  shuffleAnimation() {
    // If no cards selected, do nothing (extra safety check)
    if (this.selectedCards.length === 0) return;

    const duration = 500;

    // Animate only the selected card sprites
    const selectedSprites = this.cardSprites.filter(sprite => 
      this.selectedCards.some(card => card.key === sprite.texture.key)
    );

    selectedSprites.forEach(sprite => {
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

    // After the scatter-yoyo animation, replace the selected cards
    this.time.delayedCall(duration * 2, () => {
      this.replaceSelectedCards();
    });
  }

  /**
   * Removes the selected cards from the player's hand and draws the same number
   * (or fewer if deck doesn't have enough) from the deck to replace them.
   */
  replaceSelectedCards() {
    // 1) Remove selected cards from player's hand
    this.playerHand = this.playerHand.filter(card => !this.selectedCards.includes(card));

    // 2) Figure out how many to draw
    const toDraw = Math.min(this.selectedCards.length, this.deck.length);

    // 3) Draw that many from the deck
    const newCards = drawCards(this.deck, toDraw);

    // 4) Add new cards to player's hand
    this.playerHand.push(...newCards);

    // Clear selected cards
    this.selectedCards = [];

    // Re-display the hand
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];
    this.displayHand();

    // Check if deck is empty and we haven't reached points -> lose
    if (this.deck.length === 0 && this.score < this.pointsNeeded) {
      this.showResultMessage("No hay más cartas en el mazo. ¡Has perdido!");
      // Option: stop UI scene and go to IntroScene
      this.scene.stop('UIScene');
      this.scene.start('IntroScene');
    }
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
    const newScale = 0.8;
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
            this.replaceUsedCards();
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

      // Optional shadow effect
      const shadow = this.add.image(sprite.x, sprite.y, card.key)
        .setScale(sprite.scale * 1.05)
        .setTint(0xffffff)
        .setAlpha(0.5);
      shadow.depth = sprite.depth - 1;
    });
  }

  dealNewHand() {
    // If the deck doesn't have 10 cards left, and we haven't reached points, it's a loss:
    if (this.deck.length < 10 && this.score < this.pointsNeeded) {
      this.showResultMessage("No hay suficientes cartas para otra ronda. ¡Has perdido!");
      this.scene.stop('UIScene');
      this.scene.start('IntroScene');
      return;
    }

    this.selectedCards = [];
    
    // Destroy old card sprites
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];

    // Draw new 10 cards
    this.playerHand = drawCards(this.deck, 10);

    // Show them on the table
    this.displayHand();

    // Since no card is selected initially, notify the UI
    this.events.emit('cards-changed', 0);
  }

  replaceUsedCards() {
    // 1) Remove selected from hand
    this.playerHand = this.playerHand.filter(c => !this.selectedCards.includes(c));
    this.selectedCards = [];

    // 2) Draw up to 5 new from deck
    const toDraw = Math.min(5, this.deck.length);
    const newCards = drawCards(this.deck, toDraw);
    this.playerHand.push(...newCards);

    // Re-display the updated hand
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];
    this.displayHand();

    // Next round
    this.roundNumber++;

    // If no cards left in deck and not enough points => lose
    if (this.deck.length === 0 && this.score < this.pointsNeeded) {
      this.showResultMessage("No hay más cartas. ¡Has perdido!");
      this.time.delayedCall(2000, () => {
        this.scene.stop('UIScene');
        this.scene.start('IntroScene');
      });
      return;
    }

    // If we've reached or exceeded total rounds
    if (this.roundNumber > this.maxRounds) {
      // Check if we won or lost
      if (this.score >= this.pointsNeeded) {
        // Win
        this.scene.stop('UIScene');
        this.scene.start('MapScene');
      } else {
        // Lose
        this.scene.stop('UIScene');
        this.scene.start('IntroScene');
      }
    }
  }

  displayHand() {
    const cardScale = 0.9;
    const cardSpacing = 95;
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

    // Emit that 0 are selected initially (fresh display)
    this.events.emit('cards-changed', 0);
  }

  toggleCardSelection(card, sprite) {
    const maxSelectable = 5; // Up to 5 cards to submit or shuffle

    if (this.selectedCards.includes(card)) {
      // Unselect
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      sprite.setScale(0.9);
      sprite.clearTint();
    } else {
      // Select if fewer than the max allowed
      if (this.selectedCards.length < maxSelectable) {
        this.selectedCards.push(card);
        sprite.setScale(0.8);
        sprite.setTint(0x808080);
      }
    }

    // Emit event so UIScene can enable/disable shuffle button
    this.events.emit('cards-changed', this.selectedCards.length);
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
