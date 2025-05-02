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
    this.hiddenSamuelCards = [];

    // Game settings (set in init())
    this.pointsNeeded = 0;
    this.maxRounds = 0;

    // NEW: Sorting method; default is by number
    this.sortMethod = 'number';
  
    // Contexto del jugador
    this.playerContext = {
      handType: '',
      chips: 0,
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
    this.npc = data.npc || null; // ← Añadimos esto
  }

  create() {
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    this.HelenaCastigo = false; // Variable para el castigo de Helena

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

    this.playerContext.opponent = this.npc;
    console.log('🎯 NPC actual:', this.npc);

    // --- LAUNCH UI SCENE ---
    if (this.scene.isActive('UIScene')) {
      this.scene.stop('UIScene');
    }
    this.scene.start('UIScene');
    this.scene.bringToTop('UIScene');

    this.fishermanTimer = null; // Asegurarse de tener esta propiedad
    this.timerBox = null; // Para manejar la caja del timer
    // Iniciar timer del Pescador
    this.startFishermanTimer();
    if (this.playerContext.opponent === 'gemelos') {
      this.lastPlayedHand = null; // Última mano jugada por el jugador
      this.gemelosCastigo = false; // Variable para activar/desactivar el castigo de los gemelos
      this.gemelosPenaltyText = null; // Texto que muestra el castigo de los gemelos
      this.initializeGemelosCastigo();
    }

    // Inventario del jugador
    this.inventory = new Inventory(this);

    // For testing: Add jokers to inventory
    this.inventory.addFiveJokers();

    // Dificultad adaptativa basada en los jokers
    if (this.inventory) {
        const ownedJokers = this.inventory.getOwnedJokers();
        const jokerCount = ownedJokers.length;

        if (jokerCount > 0) {
            // Calcular el costo total de los jokers
            const totalJokerCost = ownedJokers.reduce((sum, joker) => sum + joker.price, 0);

            // Calcular el multiplicador adaptativo
            const costMultiplier = Math.floor(totalJokerCost / 250); // Cada 250 añade 1 al multiplicador
            const adaptiveMultiplier = jokerCount + costMultiplier;

            // Ajustar los puntos necesarios para pasar de ronda
            this.pointsNeeded *= adaptiveMultiplier;

            console.log(`🎯 Dificultad adaptativa aplicada:`);
            console.log(`- Jokers: ${jokerCount}`);
            console.log(`- Costo total de jokers: ${totalJokerCost}`);
            console.log(`- Multiplicador adaptativo: ${adaptiveMultiplier}`);
            console.log(`- Puntos necesarios ajustados: ${this.pointsNeeded}`);
        } else {
            console.log(`🎯 Sin jokers: Puntos necesarios no ajustados (${this.pointsNeeded}).`);
        }
    } else {
        console.warn('⚠️ Inventario no definido en el registro. Puntos necesarios no ajustados.');
    }

    // Initialize joker manager
    this.jokerManager = new JokerManager(this, this.inventory);
    
    // Display jokers
    this.jokerManager.displayJokers();

    // --- Create & shuffle deck (48 cards total) ---
    let fullDeck = createDeck();      // Normally 52 cards
    this.deck = fullDeck.slice(0, 48);  // Keep only first 48
    shuffle(this.deck);

    // Deal initial hand of 10 cards
    this.dealNewHand();


// Mostrar advertencia permanente si el oponente es Helena
if (this.playerContext.opponent === 'helena') {
  this.helenaWarningText = this.add.text(
    this.cameras.main.width / 2,
    20,
    '💢Las copas no puntúan💢',
    {
      fontFamily: 'RetroFont',
      fontSize: '20px',
      color: '#ffff66', // amarillo claro
      stroke: '#800000',
      strokeThickness: 3,
      align: 'center',
      backgroundColor: '#000000aa', // fondo semitransparente negro
      padding: { x: 12, y: 6 }
    }
  )
  .setOrigin(0.5, 0) // centrado horizontal, parte superior
  .setScrollFactor(0)
  .setDepth(100);
}

  }

  // Called by the UI scene’s "Shuffle" button
  shuffleAnimation() {
    if (this.selectedCards.length === 0) return;
    this.resetFishermanTimer(); // Reiniciar el timer del Pescador al hacer shuffle
    const duration = 500;
    const selectedSprites = this.cardSprites.filter(sprite => 
      this.selectedCards.some(card => card.key === sprite.texture.key)
    );

    selectedSprites.forEach(sprite => {
      const randX = this.cameras.main.width / 2 + (Math.random() * 200 - 100);
      const randY = this.cameras.main.height / 2 + (Math.random() * 200 - 100);

      // Apply multiple effects to make it more dynamic
      this.tweens.add({
        targets: sprite,
        x: randX,
        y: randY,
        scale: { from: 1.1, to: 1.0 },  // Slight scaling to add emphasis
        angle: { from: 0, to: 360 },    // Add rotation
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
    if (this.playerContext.opponent === 'samuel') {
      this.selectedCards = this.selectedCards.filter(card => !this.hiddenSamuelCards.includes(card));
    }
    
    // Eliminar las cartas seleccionadas (excepto las ocultas de Samuel)
    this.playerHand = this.playerHand.filter(card => !this.selectedCards.includes(card));    const toDraw = Math.min(this.selectedCards.length, this.deck.length);
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
      this.showAlertMessage('Selecciona 5 cartas para jugar');
      return;
    }

    // Ocultar la caja del timer antes de evaluar las cartas
    if (this.timerBox) {
      this.timerBox.destroy(); // Destruir la caja del timer
    }
  
    // Pausar el timer del Fisherman antes de iniciar la animación
    if (this.fishermanTimer) {
      this.fishermanTimer.paused = true; // Pausar el timer
    }
  
    const result = evaluateHand(this.selectedCards, this.playerContext, this.inventory);

    // Si estamos contra Samuel, eliminar el filtro de las cartas seleccionadas
if (this.playerContext.opponent === 'samuel') {
  this.selectedCards.forEach(card => {
    const sprite = this.cardSprites.find(s => s.texture.key === card.key);
    if (sprite && sprite.samuelMask) {
      sprite.samuelMask.destroy();
      delete sprite.samuelMask;
    }
  });
}


    // Castigo de Helena: Si hay una copa, el resultado entero es 0
    if (this.playerContext.opponent === 'helena') {
      const hasCopas = this.selectedCards.some(card => card.suit === 'copas');
      if (hasCopas) {
        result.score = 0;
        this.popUpCopas();
      }
    }

    // Verificar el castigo de los gemelos
    if (this.playerContext.opponent === 'gemelos') {
      if (result.handType === this.lastPlayedHand) {
        this.applyGemelosPenalty(result);
        return; // No continuar con el procesamiento normal de la mano
      }
      // Actualizar la última mano jugada
      this.lastPlayedHand = result.handType;
      // Actualizar el texto del castigo
      this.createGemelosPenaltyText(this.lastPlayedHand);
    }
  
    this.score += result.score;
  
    // Animar las cartas seleccionadas con un callback
    this.animateSelectedCards(result, () => {
      // Reiniciar el timer después de que terminen las animaciones
      if (this.fishermanTimer) {
        this.fishermanTimer.paused = false; // Reanudar el timer
      }
      this.resetFishermanTimer(); // Reiniciar el timer
  
      // Mostrar nuevamente la caja del timer
      this.startFishermanTimer(); // Reconstruir la caja del timer
    });
  }

  popUpCopas() {
    const popup = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 180,
      '💔 ¡Las copas no puntúan\ncontra Helena!',
      {
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#ff0033',
        stroke: '#000000',
        strokeThickness: 5,
        fontFamily: 'RetroFont',
        align: 'center'
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: popup,
      y: popup.y - 80,
      alpha: { from: 1, to: 0 },
      scale: { from: 1.2, to: 1 },
      ease: 'Back.easeOut',
      duration: 10000,
      onComplete: () => popup.destroy()
    });
  }

  // Castigo pescador
  // Timer para el castigo del Pescador
  startFishermanTimer() {
    if (this.playerContext.opponent !== 'pescador') return;
  
    // Limpiar timer anterior si existe
    if (this.fishermanTimer) {
      this.fishermanTimer.destroy();
    }
    if (this.timerBox) {
      this.timerBox.destroy();
    }
  
    // Crear contenedor para la caja del timer
    const margin = 20;
    const boxWidth = 140; // Ancho aumentado para acomodar el diseño
    const boxHeight = 80; // Altura aumentada para dos secciones
    const padding = 10;
  
    this.timerBox = this.add.container(
      this.cameras.main.width - boxWidth - margin,
      (this.cameras.main.height / 2) - (boxHeight / 2)
    );
  
    // Fondo de la caja (rojo para el título)
    const titleBackground = this.add.rectangle(
      0, 0, boxWidth, boxHeight / 2, 0xff0000 // Rojo sólido
    ).setOrigin(0);
  
    // Fondo del contador (naranja difuminado)
    const counterBackground = this.add.rectangle(
      0, boxHeight / 2, boxWidth, boxHeight / 2, 0xff4500 // Naranja llamativo
    ).setOrigin(0);
  
    // Línea divisoria entre el título y el contador
    const dividerLine = this.add.rectangle(
      0, boxHeight / 2, boxWidth, 2, 0xffffff // Línea blanca
    ).setOrigin(0);
  
    // Título "Penalidad en..."
    const titleText = this.add.text(
      boxWidth / 2, boxHeight / 4 - 6, 'Penalidad\nen...', { // Ajuste: 6 píxeles más arriba
        fontFamily: 'RetroFont',
        fontSize: '20px', // Tamaño más grande para sobresalir
        color: '#000000', // Negro para el texto
        stroke: '#f0f8ff', // Blanco brillante para el delineado
        strokeThickness: 5, // Grosor del delineado aumentado
        align: 'center',
        wordWrap: { width: boxWidth - padding * 2 } // Ajustar al ancho de la caja
      }
    ).setOrigin(0.5);
  
    // Texto del timer (en la mitad inferior)
    this.timerText = this.add.text(
      boxWidth / 2, boxHeight * 0.75, '10', { // Centrado en la mitad inferior
        fontFamily: 'RetroFont',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 5,
      }
    ).setOrigin(0.5);
  
    // Delineado blanco para la caja completa
    const outline = this.add.rectangle(
      0, 0, boxWidth, boxHeight, 0xffffff // Blanco brillante
    ).setOrigin(0).setStrokeStyle(2, 0xffffff); // Borde blanco
  
    // Añadir elementos al contenedor
    this.timerBox.add(outline); // Agregar el delineado primero
    this.timerBox.add(titleBackground);
    this.timerBox.add(counterBackground);
    this.timerBox.add(dividerLine);
    this.timerBox.add(titleText);
    this.timerBox.add(this.timerText);
  
    // Configurar el timer de 10 segundos
    this.fishermanTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateFishermanTimer,
      callbackScope: this,
      repeat: 9 // 10 iteraciones (de 10 a 1)
    });
  }

  //Mostrar el contador en pantalla
  updateFishermanTimer() {
    const remainingTime = this.fishermanTimer.getRepeatCount(); // +1 para ajustar el desfase
    this.timerText.setText(remainingTime);
  
    if (remainingTime <= 3) {
      this.timerText.setColor('#ff0000'); // Advertencia en rojo
    }
  
    if (remainingTime === 0) {
      this.applyFishermanPenalty();
      this.timerBox.destroy(); // Destruir toda la caja
    }
  }

  // Aplicar el castigo del Pescador
  applyFishermanPenalty() {
    const numCardsToReplace = Math.min(3, this.playerHand.length); // Máximo 3 cartas
    const cardsToReplace = [];
  
    // Seleccionar 3 cartas aleatorias
    while (cardsToReplace.length < numCardsToReplace) {
      const randomIndex = Phaser.Math.Between(0, this.playerHand.length - 1);
      if (!cardsToReplace.includes(randomIndex)) {
        cardsToReplace.push(randomIndex);
      }
    }
  
    // Marcar las cartas seleccionadas para el shuffle
    this.selectedCards = cardsToReplace.map(index => this.playerHand[index]);
  
    // Ejecutar la animación de shuffle para estas cartas
    this.shuffleAnimationForPenalty(() => {
      // Después de la animación, reemplazar las cartas seleccionadas
      this.replaceSelectedCards();
  
      // Mostrar mensaje de penalización
      this.showAlertMessage('¡Se han cambiado 3 cartas\npor tardar demasiado!');
  
      // Reiniciar el timer
      this.resetFishermanTimer();
    });
  }

  shuffleAnimationForPenalty(callback) {
    if (this.selectedCards.length === 0) return;
  
    const duration = 500;
    const selectedSprites = this.cardSprites.filter(sprite =>
      this.selectedCards.some(card => card.key === sprite.texture.key)
    );
  
    selectedSprites.forEach(sprite => {
      const randX = this.cameras.main.width / 2 + (Math.random() * 200 - 100);
      const randY = this.cameras.main.height / 2 + (Math.random() * 200 - 100);
  
      // Aplicar múltiples efectos para hacerlo más dinámico
      this.tweens.add({
        targets: sprite,
        x: randX,
        y: randY,
        scale: { from: 1.1, to: 1.0 }, // Escalado ligero para enfatizar
        angle: { from: 0, to: 360 },   // Añadir rotación
        duration: duration,
        ease: 'Sine.easeInOut',
        yoyo: true,
        onComplete: () => {
          // Al finalizar la animación, ejecutar el callback
          if (callback) callback();
        }
      });
    });
  }

  // Resetear el timer cuando el jugador selecciona cartas
  resetFishermanTimer() {
    if (this.playerContext.opponent === 'pescador') {
      this.startFishermanTimer(); // Reiniciar el timer
    }
  }

  initializeGemelosCastigo() {
    const possibleHands = ['Carta Alta', 'Pareja', 'Doble Pareja', 'Trío', 'Escalera', 'Color', 'Full house', 'Póker', 'Escalera de Color'];
    this.lastPlayedHand = Phaser.Utils.Array.GetRandom(possibleHands); // Seleccionar una mano aleatoria
    console.log(`[GEMELOS] Mano inicial prohibida: ${this.lastPlayedHand}`);
    this.createGemelosPenaltyText(this.lastPlayedHand);
  }

  applyGemelosPenalty(result) {
    result.score = 0; // Anular el puntaje
    this.gemelosCastigo = true;
  
    // Mostrar mensaje de advertencia
    this.showAlertMessage(`💔 ¡No puedes repetir la misma mano\n(${result.handType}) contra los Gemelos!`);
  
    // Animar las cartas sin otorgar puntos
    this.animateSelectedCards(result);
  
    console.log(`[GEMELOS] Castigo aplicado: Repetición de ${result.handType}`);
  }

  createGemelosPenaltyText(handType) {
    // Limpiar el texto anterior si existe
    if (this.gemelosPenaltyText) {
      this.gemelosPenaltyText.destroy();
    }
  
    // Crear el contenedor para el texto y los elementos visuales
    const penaltyContainer = this.add.container(
      this.cameras.main.width - 20,
      this.cameras.main.height / 2
    ).setDepth(10);
  
    // Fondo con gradiente
    const background = this.add.rectangle(0, 0, 200, 100, 0x000000)
      .setOrigin(1, 0.5)
      .setStrokeStyle(2, 0xffffff);
    this.tweens.add({
      targets: background,
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: 'Sine.easeInOut'
    });
  
    // Ícono de advertencia
    const warningIcon = this.add.text(-190, -20, '⚠', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffcc00'
    }).setOrigin(0, 0.5);
  
    // Texto principal
    const penaltyText = this.add.text(-160, 0, `Mano Prohibida:\n${handType}`, {
      fontFamily: 'RetroFont',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      align: 'left',
      wordWrap: { width: 140 }
    }).setOrigin(0, 0.5);
  
    // Efecto de brillo en el borde
    const shineEffect = this.add.rectangle(0, 0, 200, 100, 0xffffff)
      .setOrigin(1, 0.5)
      .setAlpha(0);
    this.tweens.add({
      targets: shineEffect,
      alpha: { from: 1, to: 0 },
      scaleX: { from: 1, to: 0 },
      duration: 1000,
      ease: 'Sine.easeOut',
      repeat: -1
    });
  
    // Añadir elementos al contenedor
    penaltyContainer.add(background);
    penaltyContainer.add(shineEffect);
    penaltyContainer.add(warningIcon);
    penaltyContainer.add(penaltyText);
  
    // Guardar referencia al contenedor
    this.gemelosPenaltyText = penaltyContainer;
  }

  vacioCartasGemelos(onComplete) {
    this.selectedCards.forEach((card, index) => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (!sprite) return;
  
      // Crear líneas diagonales para simular ruptura
      const slash1 = this.add.line(
        sprite.x, sprite.y,
        -sprite.displayWidth / 2, -sprite.displayHeight / 2,
        sprite.displayWidth / 2, sprite.displayHeight / 2,
        0xffffff
      ).setLineWidth(4).setAlpha(0);
  
      const slash2 = this.add.line(
        sprite.x, sprite.y,
        sprite.displayWidth / 2, -sprite.displayHeight / 2,
        -sprite.displayWidth / 2, sprite.displayHeight / 2,
        0xffffff
      ).setLineWidth(4).setAlpha(0);
  
      // Animación de las líneas diagonales
      this.tweens.add({
        targets: [slash1, slash2],
        alpha: { from: 0, to: 1 },
        duration: 200,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          slash1.destroy();
          slash2.destroy();
        }
      });
  
      // Animación de desvanecimiento y contracción de la carta
      this.tweens.add({
        targets: sprite,
        scale: { from: 1, to: 0 }, // La carta se contrae
        alpha: { from: 1, to: 0 }, // La carta se desvanece
        angle: { from: 0, to: Math.random() * 360 - 180 }, // Ligera rotación aleatoria
        duration: 800, // Duración de la animación
        ease: 'Cubic.easeOut',
        delay: index * 50, // Retraso progresivo para cada carta
        onComplete: () => {
          sprite.destroy(); // Eliminar la carta después de la animación
  
          // Si es la última carta, ejecutar el callback
          if (index === this.selectedCards.length - 1 && onComplete) {
            onComplete();
          }
        }
      });
    });
  }

  animateSelectedCards(result, onCompleteCallback) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    this.events.emit('toggle-sort-button', false);
    this.cardSprites.forEach(sprite => {
      const isSelected = this.selectedCards.some(card => card.key === sprite.texture.key);
      if (!isSelected) sprite.setVisible(false);
    });

    // Si estamos contra Samuel, ocultar temporalmente las máscaras de todas las cartas
    if (this.playerContext.opponent === 'samuel' && this.cardSprites) {
      this.cardSprites.forEach(sprite => {
        if (sprite.samuelCover) {
          sprite.samuelCover.setVisible(false);
        }
      });
    }
  
    this.animateCardsToCenter(result);
  
    if (this.playerContext.opponent === 'helena') {
      this.tintarCopas();
    }
    // Verificar si el oponente es los gemelos y si hay un castigo (mano repetida)
    else if (this.playerContext.opponent === 'gemelos' && result.score === 0) {
      this.aplicarGemelosCastigo();
    }
  
    this.time.delayedCall(1200 + this.selectedCards.length * 100, () => {
      if (this.HelenaCastigo) {
        this.time.delayedCall(1000, () => {
          this.handleRoundEnd();
          if (onCompleteCallback) onCompleteCallback(); // Ejecutar callback
        });
        return;
      }
  
      this.highlightWinningCards(result);
      this.showScorePopups2(result.winningCards, result.score);
  
      this.time.delayedCall(600, () => {
        this.showResultMessage(`${result.handType} (+${result.score} puntos)`);
  
        this.time.delayedCall(1200, () => {
          this.executeAttackAnimation(centerX, centerY);
  
          this.time.delayedCall(1300, () => {
            this.handleRoundEnd();
            if (onCompleteCallback) onCompleteCallback(); // Ejecutar callback
          });
        });
      });
    });
  }
  
  tintarCopas() {
    let found = false;
    this.selectedCards.forEach(card => {
      if (card.suit === 'copas') {
        const sprite = this.cardSprites.find(s => s.texture.key === card.key);
        if (sprite) {
          sprite.setTint(0x880000); // rojo oscuro
          found = true;
          // Efecto visual: parpadeo leve para remarcar
          this.tweens.add({
            targets: sprite,
            alpha: { from: 1, to: 0.4 },
            yoyo: true,
            repeat: 2,
            duration: 200,
            ease: 'Sine.easeInOut',
            onComplete: () => {
              sprite.setAlpha(1);
            }
          });
        }
      }
    });
    if (found) {
      console.log("[HELENA] Castigo aplicado: cartas de copas detectadas");
      this.HelenaCastigo = true;
    } else {
      this.HelenaCastigo = false;
    }
  }

  aplicarGemelosCastigo() {
    this.vacioCartasGemelos(() => {
      // Continuar con las animaciones después de la desintegración
      this.time.delayedCall(600, () => {
        this.showResultMessage(`${result.handType} (+${result.score} puntos)`);
        this.time.delayedCall(1300, () => {
          this.handleRoundEnd();
          if (onCompleteCallback) onCompleteCallback();
        });
      });
    });
    return; // Salir temprano para evitar ejecutar el resto del código
  }
  
  animateCardsToCenter(result) {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
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
        if (!sprite.active) return;
  
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
              scale: 1.0,
              duration: 600,
              ease: 'Back.easeOut',
            });
          }
        });
      });
    });
  }
  
  

  executeAttackAnimation(centerX, centerY) {
    const opponentX = centerX;
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
  
            const flash = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0xffffff);
            flash.setAlpha(0);
            this.tweens.add({
              targets: flash,
              alpha: { from: 0.7, to: 0 },
              duration: 200,
              onComplete: () => flash.destroy(),
            });
  
            const darken = this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x000000);
            darken.setAlpha(0);
            this.tweens.add({
              targets: darken,
              alpha: { from: 0.5, to: 0 },
              duration: 600,
              onComplete: () => darken.destroy(),
            });
  
            //this.cameras.main.shake(500, 0.03);
          }
        });
      });
    });
  }
  
//el +punticaion amarilla 
  showScorePopups(winningCards, score) {
    winningCards.forEach(card => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (!sprite) return;
  
      const valueText = this.add.text(sprite.x, sprite.y, `+${score}`, {
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#ffeb3b',
        stroke: '#000',
        strokeThickness: 4,
      }).setOrigin(0.5);
  
      this.tweens.add({
        targets: valueText,
        y: sprite.y - 100,
        scale: { from: 1.5, to: 1 },
        alpha: { from: 1, to: 0 },
        duration: 5000,
        ease: 'Back.easeOut',
        onComplete: () => valueText.destroy()
      });
    });
  }

//diferente animacion a ver si os gusta mas
  showScorePopups2(winningCards, score) {
    winningCards.forEach(card => {
      const sprite = this.cardSprites.find(s => s.texture.key === card.key);
      if (!sprite) return;
  
      const valueText = this.add.text(sprite.x, sprite.y, `+${score}`, {
        fontSize: '36px',
        fontStyle: 'bold',
        color: '#00ffcc',
        stroke: '#003333',
        strokeThickness: 4,
      }).setOrigin(0.5);
  
      // Give it a random horizontal wiggle to feel more dynamic
      const randomOffset = Phaser.Math.Between(-30, 30);
      const finalY = sprite.y - 130;
  
      this.tweens.add({
        targets: valueText,
        y: finalY,
        x: sprite.x + randomOffset,
        scale: { from: 2, to: 1 },
        alpha: { from: 1, to: 0 },
        angle: { from: 0, to: Phaser.Math.Between(-20, 20) },
        duration: 3000,
        ease: 'Cubic.easeOut',
        onComplete: () => valueText.destroy()
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

  handleRoundEnd() {
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
        const currentMap = this.registry.get('currentMap');
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
        const currentMap = this.registry.get('currentMap');
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
        if (sprite.samuelCover) {
          //sprite.samuelCover.setScale(cardScale * 1.05);
        }
      });
      sprite.on('pointerout', () => {
        if (!this.selectedCards.includes(card)) {
          sprite.setScale(cardScale);
          sprite.clearTint();
        }
        if (sprite.samuelCover) {
          //sprite.samuelCover.setScale(cardScale);
        }
      });
      sprite.on('pointerdown', () => {
        this.toggleCardSelection(card, sprite);
      });

      this.cardSprites.push(sprite);
    });

    this.events.emit('cards-changed', 0);

    if (this.playerContext.opponent === 'samuel') {
      this.applySamuelPunishment();
    }
  }


  applySamuelPunishment() {
    // Aplica un filtro visual solo a las primeras 5 cartas
    this.hiddenSamuelCards = [];
  
    for (let i = 0; i < 5 && i < this.cardSprites.length; i++) {
      const sprite = this.cardSprites[i];
  
      // Guardar las cartas ocultas para evitar que se descarten
      this.hiddenSamuelCards.push(this.playerHand[i]);
  
      // Crear un rectángulo negro totalmente opaco encima de la carta
      const mask = this.add.rectangle(
        sprite.x,
        sprite.y,
        sprite.displayWidth,
        sprite.displayHeight,
        0x000000,
        1 // opacidad total
      )
      .setOrigin(0.5)
      .setDepth(sprite.depth + 1); // por encima de la carta
  
      sprite.samuelMask = mask;
    }
  }
  applySamuelPunishment() {
    this.hiddenSamuelCards = [];
  
    for (let i = 0; i < 5 && i < this.cardSprites.length; i++) {
      const sprite = this.cardSprites[i];
      const card = this.playerHand[i];
  
      this.hiddenSamuelCards.push(card);
  
      // Añadir una imagen de carta oculta encima
      const cover = this.add.image(sprite.x, sprite.y, 'backOfCard')
      .setDisplaySize(200, 240) // ajusta según tus cartas
      .setDepth(sprite.depth + 1)
      .setOrigin(0.5);
  
      sprite.samuelCover = cover;
      sprite.isSamuelHidden = true;
    }
  }
  
  

  toggleCardSelection(card, sprite) {
    const maxSelectable = 5;
    if (this.selectedCards.includes(card)) {
      this.selectedCards = this.selectedCards.filter(c => c !== card);
      sprite.setScale(0.9);
      sprite.clearTint();
      if (sprite.samuelCover) {
        sprite.samuelCover.clearTint();
      }
    } else {
      if (this.selectedCards.length < maxSelectable) {
        this.selectedCards.push(card);
        sprite.setScale(0.8);
        if (sprite.samuelCover) {
          sprite.samuelCover.setTint(0x808080); // gris visible en la carta oculta
        } else {
          sprite.setTint(0x808080); // para el resto de cartas
        }      }
    }
    // Si no hay cartas seleccionadas, actualizar el marcador a 0
    if (this.selectedCards.length === 0) {
      this.scene.get('UIScene').updateScoreMarker(0, 0);
      this.scene.get('UIScene').shuffleButton.disable();
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
      this.cameras.main.height / 2 - 220,
      msg,
      {
        fontFamily: 'RetroFont', 
        fontSize: '20px',
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

  showAlertMessage(msg) {
    const text = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 100,
      msg,
      {
        fontFamily: 'RetroFont', 
        fontSize: '20px',
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