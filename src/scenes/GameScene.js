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

    // Game settings (set in init())
    this.pointsNeeded = 0;
    this.maxRounds = 0;

    // NEW: Sorting method; default is by number
    this.sortMethod = 'number';
  }

  /**
   * Called when we do: this.scene.start('GameScene', { pointsNeeded, rounds })
   */
  init(data) {
    this.pointsNeeded = data.pointsNeeded || 300;
    this.maxRounds = data.rounds || 5;
    this.score = 0;
    this.roundNumber = 1;
    this.gameScene = data.scene;
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Background
    this.add.tileSprite(0, 0, gameWidth, gameHeight, 'rug').setOrigin(0, 0);

    // --- Reset game state ---
    this.deck = [];
    this.playerHand = [];
    this.selectedCards = [];
    this.score = 0;
    this.roundNumber = 1;
    this.cardSprites = [];

    // --- Create & shuffle deck (48 cards total) ---
    let fullDeck = createDeck();      // Normally 52 cards
    this.deck = fullDeck.slice(0, 48);  // Keep only first 48
    shuffle(this.deck);

    // Deal initial hand of 10 cards
    this.dealNewHand();

    // --- LAUNCH UI SCENE ---
    if (this.scene.isActive('UIScene')) {
      this.scene.stop('UIScene');
    }
    this.scene.launch('UIScene');
    this.scene.bringToTop('UIScene');
  }

  // Called by the UI scene’s "Shuffle" button
  shuffleAnimation() {
    if (this.selectedCards.length === 0) return;

    const duration = 500;
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

    this.time.delayedCall(duration * 2, () => {
      this.replaceSelectedCards();
    });
  }

  /**
   * Removes the selected cards from the player's hand and draws the same number
   * (or fewer if deck doesn't have enough) from the deck to replace them.
   */
  replaceSelectedCards() {
    // Remove selected cards from hand
    this.playerHand = this.playerHand.filter(card => !this.selectedCards.includes(card));
    const toDraw = Math.min(this.selectedCards.length, this.deck.length);
    const newCards = drawCards(this.deck, toDraw);
    this.playerHand.push(...newCards);

    // Clear selection and rebuild card sprites
    this.selectedCards = [];
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];
    this.displayHand();

    if (this.deck.length === 0 && this.score < this.pointsNeeded) {
      this.showResultMessage("No hay más cartas en el mazo. ¡Has perdido!");
      this.scene.stop('UIScene');
      this.scene.stop();
      this.scene.start('IntroScene');
    }
  }

  // Called by the UI scene’s "Submit" button
  onSubmitHand() {
    if (this.selectedCards.length !== 5) {
      this.showResultMessage('Selecciona 5 cartas para jugar');
      return;
    }

    const result = evaluateHand(this.selectedCards);
    this.score += result.score;
    this.animateSelectedCards(result);
  }

  animateSelectedCards(result) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.events.emit('toggle-sort-button', false);

    this.cardSprites.forEach(sprite => {
        const isSelected = this.selectedCards.some(card => card.key === sprite.texture.key);
        if (!isSelected) sprite.setVisible(false);
    });

    const newScale = 1.0;
    const spacing = 180;
    const totalWidth = (this.selectedCards.length - 1) * spacing;
    const startX = centerX - totalWidth / 2;

    // ⚡ Flash antes de la selección
    //this.cameras.main.flash(200);

    this.selectedCards.forEach((card, index) => {
        const sprite = this.cardSprites.find(s => s.texture.key === card.key);
        if (!sprite) return;

        sprite.clearTint();
        sprite.disableInteractive();

        this.time.delayedCall(index * 100, () => {
            if (!sprite.active) return; // Verifica que aún existe

            this.tweens.add({
                targets: sprite,
                scale: 1.4, 
                angle: Math.random() * 10 - 5,
                duration: 200,
                ease: 'Back.easeOut',
                yoyo: true,
                onComplete: () => {
                    if (!sprite.active) return;

                    this.tweens.add({
                        targets: sprite,
                        x: startX + index * spacing,
                        y: centerY,
                        scale: newScale,
                        duration: 600,
                        ease: 'Back.easeOut',
                    });
                }
            });
        });
    });

    // ⏳ Espera y luego ejecuta el ataque
    this.time.delayedCall(1200 + this.selectedCards.length * 100, () => {
        this.highlightWinningCards(result);

        this.time.delayedCall(600, () => {
          this.showResultMessage(`${result.handType} (+${result.score} puntos)`);

            this.time.delayedCall(1200, () => {
                const opponentX = this.cameras.main.width / 2;
                const opponentY = 100;

        
                this.selectedCards.forEach((card, index) => {
                    const sprite = this.cardSprites.find(s => s.texture.key === card.key);
                    if (!sprite) return;

                    this.time.delayedCall(index * 100, () => {
                        this.tweens.add({
                            targets: sprite,
                            x: opponentX,
                            y: opponentY,
                            scale: 0.3,
                            angle: Math.random() * 40 - 20,
                            duration: 700,
                            ease: 'Cubic.easeIn',
                            onStart: () => {
                                sprite.setDepth(10);
                            },
                            onComplete: () => {
                                sprite.setVisible(false);

                                // **Flash para impacto**
                                const flash = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0xffffff);
                                flash.setAlpha(0);
                                this.tweens.add({
                                    targets: flash,
                                    alpha: { from: 0.7, to: 0 },
                                    duration: 200,
                                    onComplete: () => flash.destroy(),
                                });

                                // **Oscurecimiento rápido para efecto más fuerte**
                                const darken = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000);
                                darken.setAlpha(0);
                                this.tweens.add({
                                    targets: darken,
                                    alpha: { from: 0.5, to: 0 },
                                    duration: 600,
                                    onComplete: () => darken.destroy(),
                                });

                                // **Pantalla vibra sin mostrar fondo**
                                this.cameras.main.shake(500, 0.03);
                            }
                        });
                    });
                });

                this.time.delayedCall(1300, () => {
                    this.roundNumber++;
                    if (this.roundNumber <= this.maxRounds) {
                        this.replaceUsedCards();
                    } else {
                        if (this.score >= this.pointsNeeded) {
                            this.scene.stop('UIScene');
                            this.scene.stop();
                        } else {
                            this.scene.stop('UIScene');
                            this.scene.start('IntroScene');
                        }
                    }
                });
            });
        });
    });
}









  highlightWinningCards(result) {
    const winners = result.winningCards || [];
    winners.forEach(card => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (!sprite) return;
      sprite.setTint(0xffd700);
      const shadow = this.add.image(sprite.x, sprite.y, card.key)
        .setScale(sprite.scale * 1.05)
        .setTint(0xffffff)
        .setAlpha(0.5);
      shadow.depth = sprite.depth - 1;
    });
  }

  dealNewHand() {
    if (this.deck.length < 10 && this.score < this.pointsNeeded) {
      this.showResultMessage("No hay suficientes cartas para otra ronda. ¡Has perdido!");
      this.scene.stop('UIScene');
      this.scene.start('IntroScene');
      return;
    }

    this.selectedCards = [];
    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];

    // Draw 10 cards and then display them
    this.playerHand = drawCards(this.deck, 10);
    this.displayHand();
    this.events.emit('cards-changed', 0);
  }

  replaceUsedCards() {
    this.playerHand = this.playerHand.filter(c => !this.selectedCards.includes(c));
    this.selectedCards = [];
    const toDraw = Math.min(5, this.deck.length);
    const newCards = drawCards(this.deck, toDraw);
    this.playerHand.push(...newCards);

    this.cardSprites.forEach(s => s.destroy());
    this.cardSprites = [];
    this.displayHand();

    this.roundNumber++;

    // Show the sort button again.
    this.events.emit('toggle-sort-button', true);

    if (this.deck.length === 0 && this.score < this.pointsNeeded) {
      this.showResultMessage("No hay más cartas. ¡Has perdido!");
      this.time.delayedCall(2000, () => {
        this.scene.stop('UIScene');
        this.scene.start('IntroScene');
      });
      return;
    }

    if (this.roundNumber > this.maxRounds) {
      if (this.score >= this.pointsNeeded) {
        this.scene.stop('UIScene');
        this.scene.stop();
      } else {
        this.scene.stop('UIScene');
        this.scene.stop();
        this.scene.start('IntroScene');
      }
    }
  }

  // --- NEW: Sorting helper methods ---

  // Sort the playerHand array in place based on the current sort method.
  sortHand() {
    if (this.sortMethod === 'number') {
      // Sort by rank order (using getRankOrder)
      this.playerHand.sort((a, b) => {
        return this.getRankOrder(a.rank) - this.getRankOrder(b.rank);
      });
    } else {
      // Sort by suit in the following order: hearts, diamonds, spades, clubs.
      const suitOrder = {
        'hearts': 0,
        'diamonds': 1,
        'spades': 2,
        'clubs': 3
      };
  
      this.playerHand.sort((a, b) => {
        if (suitOrder[a.suit] !== suitOrder[b.suit]) {
          return suitOrder[a.suit] - suitOrder[b.suit];
        }
        // If suits are the same, sort by rank.
        return this.getRankOrder(a.rank) - this.getRankOrder(b.rank);
      });
    }
  }
  

  // Returns a numeric value for the rank so that cards can be sorted by number.
  getRankOrder(rank) {
    const order = {
      'ace': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'queen': 11,
      'king': 12
    };
    return order[rank] || 0;
  }

  // Rearranges the positions of the card sprites to match the sorted order.
  updateCardPositions() {
    const cardSpacing = 95;
    const totalWidth = (this.playerHand.length - 1) * cardSpacing;
    const startX = (this.cameras.main.width / 2) - (totalWidth / 2);
    const posY = this.cameras.main.height - 150;

    // For each card in the sorted array, find its sprite and tween it to the new position.
    this.playerHand.forEach((card, index) => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (sprite) {
        this.tweens.add({
          targets: sprite,
          x: startX + index * cardSpacing,
          y: posY,
          duration: 300,
          ease: 'Power2'
        });
      }
    });
  }

  // Called when the sort button is pressed. Toggles the sort method,
  // sorts the hand, and updates the card positions.
  toggleSortMethod() {
    this.sortMethod = (this.sortMethod === 'number') ? 'color' : 'number';
    this.sortHand();
    this.updateCardPositions();
  }

  // --- End NEW sorting methods ---

  displayHand() {
    // Sort the hand before displaying it.
    this.sortHand();

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

    this.events.emit('cards-changed', 0);
  }

  toggleCardSelection(card, sprite) {
    const maxSelectable = 5;
    if (this.selectedCards.includes(card)) {
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      sprite.setScale(0.9);
      sprite.clearTint();
    } else {
      if (this.selectedCards.length < maxSelectable) {
        this.selectedCards.push(card);
        sprite.setScale(0.8);
        sprite.setTint(0x808080);
      }
    }
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

    this.time.delayedCall(2000, () => {
      text.destroy();
    });
  }
}

