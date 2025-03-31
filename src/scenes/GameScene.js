import Phaser from 'phaser'; 
import { createDeck, shuffle } from '../utils/Deck.js';
import { drawCards } from '../utils/HandManager.js';
import { evaluateHand } from '../utils/PokerScoring.js';
import Inventory from '../utils/Inventory.js';
import JokerManager from '../utils/JokerManager.js';
import { estimateHand } from '../utils/PokerScoring.js';

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
  
    // Contexto del jugador
    this.playerContext = {
      handType: '',
      baseScore: 0,
      winningCards: [],
      multiplier: 1,
      emptyJokerSlots: 0,
      remainingDiscards: 0,
      jokerCount: 0,
      isFinalHand: false,
      firstFigurePlayed: false,
      jokerDestroyed: false,
      handSize: 5
    };
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
    // Definir el shader directamente en el archivo
    const fragmentShader = `
    precision mediump float;

    uniform float time;
    uniform vec2 resolution;

    #define PIXEL_SIZE_FAC 700.0
    #define BLACK 0.6 * vec4(79.0 / 255.0, 99.0 / 255.0, 103.0 / 255.0, 1.0 / 0.6)

    vec4 easing(vec4 t, float power) {
        return vec4(pow(t.x, power), pow(t.y, power), pow(t.z, power), pow(t.w, power));
    }

    vec4 effect(vec3 screen_coords, float scale) {
        vec2 uv = screen_coords.xy;
        uv = floor(uv * (PIXEL_SIZE_FAC / 2.0)) / (PIXEL_SIZE_FAC / 2.0);
        uv /= scale;
        float uv_len = length(uv);

        float speed = time * 1.0;
        float new_pixel_angle = atan(uv.y, uv.x) + (2.2 + 0.4 * min(6.0, speed)) * uv_len - 1.0 - speed * 0.05 - min(6.0, speed) * speed * 0.02;
        vec2 mid = (resolution.xy / length(resolution.xy)) / 2.0;
        vec2 sv = vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid;

        sv *= 30.0;
        speed = time * (6.0) + 5.0;
        vec2 uv2 = vec2(sv.x + sv.y);

        for (int i = 0; i < 5; i++) {
            uv2 += sin(max(sv.x, sv.y)) + sv;
            sv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
            sv -= 1.0 * cos(sv.x + sv.y) - 1.0 * sin(sv.x * 0.711 - sv.y);
        }

        float smoke_res = min(2.0, max(-2.0, 1.5 + length(sv) * 0.12 - 0.17 * (min(10.0, time * 1.2 - 0.0))));
        if (smoke_res < 0.2) {
            smoke_res = (smoke_res - 0.2) * 0.6 + 0.2;
        }

        float c1p = max(0.0, 1.0 - 2.0 * abs(1.0 - smoke_res));
        float c2p = max(0.0, 1.0 - 2.0 * (smoke_res));
        float cb = 1.0 - min(1.0, c1p + c2p);

        vec4 ret_col = vec4(0.996, 0.372, 0.333, 1.0) * c1p + vec4(0.0, 0.615, 1.0, 1.0) * c2p + vec4(cb * BLACK.rgb, cb * 1.0);
        float mod_flash = max(0.0 * 0.8, max(c1p, c2p) * 5.0 - 4.4) + 0.0 * max(c1p, c2p);

        return easing(ret_col * (1.0 - mod_flash) + mod_flash * vec4(1.0, 1.0, 1.0, 1.0), 1.5);
    }

    void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec3 uv = vec3(fragCoord.xy / resolution.xy, 0.0);
        uv -= 0.5;
        uv.x *= resolution.x / resolution.y;

        fragColor = effect(uv * vec3(1.0, 1.0, 0.0), 2.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
    `;

    // Crear el shader como un BaseShader
    const baseShader = new Phaser.Display.BaseShader('fondoBatalla', fragmentShader);

    // Añadir el shader como fondo
    this.add.shader(baseShader, gameWidth / 2, gameHeight / 2, gameWidth, gameHeight).setOrigin(0.5);

    // --- Reset game state ---
    this.deck = [];
    this.playerHand = [];
    this.selectedCards = [];
    this.score = 0;
    this.roundNumber = 1;
    this.cardSprites = [];

    // Inventario del jugador
    this.inventory = new Inventory(this);

    // Initialize joker manager
    this.jokerManager = new JokerManager(this, this.inventory);
  
    // For testing: Add the first 5 jokers to inventory
    this.inventory.addJoker();
    
    // Display jokers
    this.jokerManager.displayJokers();

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

    const result = evaluateHand(this.selectedCards, this.playerContext, this.inventory);
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
    const offsetX = 85;
    const startX = centerX - totalWidth / 2 + offsetX;

    this.selectedCards.forEach((card, index) => {
        const sprite = this.cardSprites.find(s => s.texture.key === card.key);
        if (!sprite) return;

        sprite.clearTint();
        sprite.disableInteractive();

        this.time.delayedCall(index * 100, () => {
            if (!sprite.active) return; // Ensure sprite is active

            // Step 1: Animate card movement and scaling
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
                     
                        ease: 'Back.easeOut',
                        onComplete: () => {
                            // After the card reaches the center, now show the number pop-out

                            const valueText = this.add.text(sprite.x, sprite.y, `+${result.score}`, {
                                fontSize: '32px',
                                fontStyle: 'bold',
                                color: '#ffeb3b',
                                stroke: '#000',
                                strokeThickness: 4,
                            }).setOrigin(0.5);

                            // Animation to make the number pop out
                            this.tweens.add({
                                targets: valueText,
                                y: sprite.y - 100, // Move the number up from the card's center
                                scale: { from: 1.5, to: 1 }, // Shrink the number
                                alpha: { from: 1, to: 0 }, // Fade out the number
                                duration: 5000,
                                ease: 'Back.easeOut',
                                onComplete: () => valueText.destroy() // Destroy the text after animation
                            });
                        }
                    });
                }
            });
        });
    });


// After waiting for animations to complete, execute attack

    //Espera y luego ejecuta el ataque
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
              if (this.roundNumber <= this.maxRounds && this.score < this.pointsNeeded) {
                  this.replaceUsedCards();
              } else {
                if (this.score >= this.pointsNeeded) {
                  // Player won the battle:
                  this.scene.stop('UIScene');
                  this.scene.stop('GameScene');

                  // Calcular las monedas ganadas
                  const coinsWon = this.score - this.pointsNeeded;

                  // Actualizar las monedas en el registry
                  const currentCoins = this.registry.get('coins') || 0;
                  this.registry.set('coins', currentCoins + coinsWon);

                  this.scene.wake('UIOverlay');
                  const currentMap = this.registry.get('currentMap')
                  this.scene.resume(currentMap);
                
                  // Launch or get the Dialogos scene, so it can show the post-battle dialog.
                  // If Dialogos is not already active, launch it with required data.
                  if (!this.scene.isActive('Dialogos')) {
                    this.scene.launch('Dialogos', { scene: this.scene.get(currentMap) });
                  }
                  // Call the afterBattle function (passing the npc name).
                  this.scene.get('Dialogos').afterBattle(true);
                } else {
                  // Player lost the battle:
                  this.scene.stop('UIScene');
                  this.scene.stop('GameScene');
                  this.scene.wake('UIOverlay');
                  const currentMap = this.registry.get('currentMap')
                  this.scene.resume(currentMap);
                
                  // Launch or get the Dialogos scene, so it can show the post-battle dialog.
                  // If Dialogos is not already active, launch it with required data.
                  if (!this.scene.isActive('Dialogos')) {
                    this.scene.launch('Dialogos', { scene: this.scene.get(currentMap) });
                  }
                  // Call the afterBattle function (passing the npc name).
                  this.scene.get('Dialogos').afterBattle(false);
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

    //this.roundNumber++; **Así ya no se incrementa de 2 en 2, en algún momento lo pusimos**

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
        // Player won the battle:
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');
        this.scene.wake('UIOverlay');

        // Calcular las monedas ganadas
        const coinsWon = this.score - this.pointsNeeded;

        // Actualizar las monedas en el registry
        const currentCoins = this.registry.get('coins') || 0;
        this.registry.set('coins', currentCoins + coinsWon);

        // Mostrar el mensaje en el centro de la pantalla
        const message = this.add.text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2,
          `¡Has ganado la partida!\nMonedas obtenidas: ${coinsWon}`,
          {
            fontSize: '36px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 10 },
            align: 'center'
          }
        ).setOrigin(0.5);

        // Destruir el mensaje después de unos segundos
        this.time.delayedCall(3000, () => {
          message.destroy();

          // Reanudar la escena principal o ir a la siguiente
          const currentMap = this.registry.get('currentMap');
          this.scene.resume(currentMap);
        });

        // Añadir la animación de partículas
        //this.addWinningEffect();

        const currentMap = this.registry.get('currentMap')
        this.scene.resume(currentMap);
      
        // Launch or get the Dialogos scene, so it can show the post-battle dialog.
        // If Dialogos is not already active, launch it with required data.
        if (!this.scene.isActive('Dialogos')) {
          this.scene.launch('Dialogos', { scene: this.scene.get(currentMap) });
        }
        // Call the afterBattle function (passing the npc name).
        this.scene.get('Dialogos').afterBattle(true);
      } else {
        // Player lost the battle:
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');
        this.scene.wake('UIOverlay');
        const currentMap = this.registry.get('currentMap')
        this.scene.resume(currentMap);
      
        // Launch or get the Dialogos scene, so it can show the post-battle dialog.
        // If Dialogos is not already active, launch it with required data.
        if (!this.scene.isActive('Dialogos')) {
          this.scene.launch('Dialogos', { scene: this.scene.get(currentMap) });
        }
        // Call the afterBattle function (passing the npc name).
        this.scene.get('Dialogos').afterBattle(false);
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
        'copas': 0,
        'oros': 1,
        'espadas': 2,
        'bastos': 3
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
      'sota': 10,
      'caballo': 11,
      'rey': 12
    };
    return order[rank] || 0;
  }

  // Rearranges the positions of the card sprites to match the sorted order.
  updateCardPositions() {
    const cardSpacing = 95;
    const totalWidth = (this.playerHand.length - 1) * cardSpacing;
    const startX = (this.cameras.main.width / 2) - (totalWidth / 2);
    const posY = this.cameras.main.height - 200;

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
    const posY = this.cameras.main.height - 200;

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
    // Si no hay cartas seleccionadas, actualizar el marcador a 0
    if (this.selectedCards.length === 0) {
      this.scene.get('UIScene').updateScoreMarker(0, 0);
      return;
    } 

    // Estimar la mano seleccionada
    const result = estimateHand(this.selectedCards);

    // Actualizar el marcador en UIScene
    const chips = result.baseScore || 0;
    const multiplier = result.multiplier || 1;
    this.scene.get('UIScene').updateScoreMarker(chips, multiplier);

    this.events.emit('cards-changed', this.selectedCards.length);
  }

  showResultMessage(msg) {
    const text = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 200,
      msg,
      {
        fontFamily: 'MarioKart', 
        fontSize: '40px',
        color: '#ffffff', 
        stroke: '#000000', 
        strokeThickness: 5,
        align: 'center',
        padding: { x: 10, y: 5 },
      }
    ).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      text.destroy();
    });
  }

  addWinningEffect() {
    const emitter = this.add.particles(this.cameras.main.width / 2, this.cameras.main.height / 2, 'star', {
      angle: { min: 240, max: 300 },
      speed: { min: 200, max: 300 },
      lifespan: 4000,
      gravityY: 180,
      quantity: 2,
      bounce: 0.4,
      bounds: new Phaser.Geom.Rectangle(-100, -200, this.cameras.main.width + 200, this.cameras.main.height + 200)
    });
  
    emitter.particleBringToTop = false;
  
    emitter.postFX.addBokeh(0.5, 10, 0.2);
  }

  // Helper para obtener el valor de la carta
  getCardValue(card) {
    const ranksOrder = {
      'ace': 14,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      'sota': 10,
      'caballo': 11,
      'rey': 12,
    };
    return ranksOrder[card.rank] || 0;
  }
}

