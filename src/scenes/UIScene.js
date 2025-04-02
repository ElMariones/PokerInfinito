import UIButton from '../utils/Button.js';

export default class UIScene extends Phaser.Scene {  
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    // -------------------------
    // POST-PROCESSING EFFECTS
    // -------------------------
    // Get the plugin from the plugin manager.

    // -------------------------
    // END POST-PROCESSING EFFECTS
    // -------------------------
    this.scene.bringToTop();
    this.gameScene = this.scene.get('GameScene');

    // Shared style for text
    const textStyle = {
      fontFamily: 'RetroFont',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    };

    this.createScoreMarker(textStyle);

    // Score & Round Text
    this.scoreText = this.add.text(20, 20, 'Puntos: 0', textStyle);
    this.roundText = this.add.text(20, 60, 'Ronda: 1', textStyle);

    // NPC Goal & Rounds Text
    this.npcGoalText = this.add.text(20, 100, '', textStyle);
    this.npcRoundsText = this.add.text(20, 140, '', textStyle);

    // Deck Count Text
    this.cardsLeftText = this.add.text(20, 180, 'Cartas restantes: 0', textStyle);

    // -------------------------
    // UI BUTTONS
    // -------------------------

    const buttonSpacing = 150;
    const buttonY = this.cameras.main.height - 200 + 150;

    // Submit Button - initially disabled (low opacity)
    this.submitButton = this.add.image(this.cameras.main.width / 2 - buttonSpacing, buttonY, 'submitBtn')
      .setOrigin(0.5)
      .setScale(0.35)
      .setInteractive()
      .setAlpha(0.5);

    this.submitButton.on('pointerover', () => {
      this.submitButton.setTint(0xaaaaaa);
      this.submitButton.setScale(0.40);
    });
    this.submitButton.on('pointerout', () => {
      this.submitButton.clearTint();
      this.submitButton.setScale(0.35);
    });
    this.submitButton.on('pointerdown', () => {
      this.submitButton.setTint(0x333333);
      this.gameScene.onSubmitHand();
    });

    // Shuffle Button - initially disabled (low opacity)
    this.shuffleButton = this.add.image(this.cameras.main.width / 2 + buttonSpacing, buttonY, 'shuffleBtn')
      .setOrigin(0.5)
      .setScale(0.35)
      .setInteractive()
      .setAlpha(0.5);
    this.shuffleButton.disableInteractive();

    this.shuffleButton.on('pointerover', () => {
      if (this.shuffleButton.input.enabled) {
        this.shuffleButton.setTint(0xaaaaaa);
        this.shuffleButton.setScale(0.40);
      }
    });
    this.shuffleButton.on('pointerout', () => {
      this.shuffleButton.clearTint();
      this.shuffleButton.setScale(0.35);
    });
    this.shuffleButton.on('pointerdown', () => {
      if (this.shuffleButton.input.enabled) {
        this.gameScene.score -= 10;
        this.gameScene.shuffleAnimation();
      }
    });

    // Sort Button - positioned as before
    this.sortButton = this.add.image(this.cameras.main.width / 2, buttonY, 'sortColor')
      .setOrigin(0.5)
      .setScale(0.2)
      .setInteractive();

    this.sortButton.on('pointerover', () => {
      this.sortButton.setTint(0xaaaaaa);
      this.sortButton.setScale(0.25);
    });
    this.sortButton.on('pointerout', () => {
      this.sortButton.clearTint();
      this.sortButton.setScale(0.2);
    });
    this.sortButton.on('pointerdown', () => {
      this.sortButton.setTint(0x333333);
      // Toggle the sort method in GameScene.
      this.gameScene.toggleSortMethod();
      // Update the button texture to reflect the new sort method.
      if (this.gameScene.sortMethod === 'number') {
        this.sortButton.setTexture('sortColor');
      } else {
        this.sortButton.setTexture('sortNum');
      }
    });

    // Listen for card selection changes to enable/disable buttons.
    this.gameScene.events.on('cards-changed', (selectedCount) => {
      // For the shuffle button
      if (selectedCount === 0 && this.shuffleButton.active) {
        this.shuffleButton.disableInteractive();
        this.shuffleButton.setAlpha(0.5);
      } else if (this.shuffleButton.active) {
        this.shuffleButton.setInteractive();
        this.shuffleButton.setAlpha(1);
      }
      // For the submit button - enabled only if exactly 5 cards are selected.
      if (selectedCount !== 5 && this.submitButton.active) {
        this.submitButton.setAlpha(0.5);
      } else if (this.submitButton.active) {
        this.submitButton.setInteractive();
        this.submitButton.setAlpha(1);
      }
    });

    // Listen for the toggle event to hide/show the sort button during animations.
    this.gameScene.events.on('toggle-sort-button', (visible) => {
      this.sortButton.setVisible(visible);
    });
 
    const ayudaButton = new UIButton(this, 820, buttonY, 'Ayuda', 'green', () => {
      this.showAyuda();
    });
  }

  update() {
    const gameScene = this.scene.get('GameScene');
    if (!gameScene) return; // Optionally, skip if GameScene isn't available.
    
    this.scoreText.setText(`Puntos: ${gameScene.score}`);
    this.roundText.setText(`Ronda: ${gameScene.roundNumber}`);
  
    const pointsNeeded = gameScene.pointsNeeded || 0;
    const maxRounds = gameScene.maxRounds || 0;
    this.npcGoalText.setText(`Objetivo: ${pointsNeeded} puntos`);
    this.npcRoundsText.setText(`Max rondas: ${maxRounds}`);
    
    this.cardsLeftText.setText(`Cartas restantes: ${gameScene.deck.length}`);
  }
  

  showDialog(text, character, background) {
    this.dialogBox.setText(text, character, background);
    this.dialogBox.setVisible(true);
  }

  createScoreMarker(textStyle) {
    const markerWidth = 150; // Ancho de los rectángulos
    const markerHeight = 75; // Alto de los rectángulos
    const markerPadding = 10; // Espaciado entre los rectángulos
    const markerX = 20; // Pegado al margen izquierdo
    const markerY = 240; // Posición inicial del primer rectángulo
  
    // Crear un gráfico para los rectángulos con bordes redondeados
    const graphics = this.add.graphics();
  
    // Dibujar el fondo de las chips (azul claro)
    graphics.fillStyle(0x87cefa, 1); // Azul claro
    graphics.fillRoundedRect(
      markerX,
      markerY,
      markerWidth,
      markerHeight,
      10 // Radio de los bordes redondeados
    );
  
    // Dibujar el fondo del multiplicador (rojo claro)
    graphics.fillStyle(0xffa07a, 1); // Rojo claro
    graphics.fillRoundedRect(
      markerX,
      markerY + markerHeight + markerPadding,
      markerWidth,
      markerHeight,
      10 // Radio de los bordes redondeados
    );
  
    // Texto "CHIPS" encima del rectángulo azul
    this.add.text(
      markerX + markerWidth / 2,
      markerY - markerPadding / 2, // Ajustar posición más cerca del rectángulo
      'Chips',
      {
        ...textStyle,
        fontSize: '24px', // Tamaño de fuente
        color: '#ffffff', // Blanco para diferenciar del fondo
      }
    ).setOrigin(0.5);
  
    // Texto "MULTI" encima del rectángulo rojo
    this.add.text(
      markerX + markerWidth / 2,
      markerY + markerHeight + markerPadding - markerPadding / 2, // Ajustar posición más cerca del rectángulo
      'Multi',
      {
        ...textStyle,
        fontSize: '24px', // Tamaño de fuente
        color: '#ffffff', // Blanco para diferenciar del fondo
      }
    ).setOrigin(0.5);
  
    // Chips (texto azul intenso)
    this.chipsText = this.add.text(
      markerX + markerWidth / 2,
      markerY + markerHeight / 2,
      '0', // Valor inicial
      {
        ...textStyle,
        fontSize: '40px', // Tamaño de la fuente
        color: '#0000ff', // Azul intenso
      }
    ).setOrigin(0.5);
  
    // Multiplicador (texto rojo intenso)
    this.multiplierText = this.add.text(
      markerX + markerWidth / 2,
      markerY + markerHeight + markerPadding + markerHeight / 2,
      'x0', // Valor inicial
      {
        ...textStyle,
        fontSize: '40px', // Tamaño de la fuente
        color: '#ff0000', // Rojo intenso
      }
    ).setOrigin(0.5);
  }
  
  updateScoreMarker(chips, multiplier) {
    this.chipsText.setText(chips.toString());
    this.multiplierText.setText(`x${multiplier}`);
  }
  
  showAyuda() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
  
    // Create a semi-transparent background rectangle
    const popupBg = this.add.rectangle(
      width / 2,
      height / 2,
      width * 0.8,
      height * 0.8,
      0x000000,
      0.7
    );
  
    // Help text describing the card game logic
    const helpText =
      "Ayuda del Juego de Cartas:\n\n" +
      "• El juego evalúa una mano de 5 cartas.\n" +
      "• Orden de rangos: AS, 2, 3, 4, 5, 6, 7, 8, 9, Sota, Caballo, Rey.\n\n" +
      "Tipos de mano:\n" +
      "  - Escalera de Color: Cinco cartas consecutivas del mismo palo.\n" +
      "  - Póker: Cuatro cartas del mismo rango.\n" +
      "  - Full House: Tres cartas de un rango y un par de otro.\n" +
      "  - Color: Todas las cartas del mismo palo.\n" +
      "  - Escalera: Cinco cartas consecutivas en rango.\n" +
      "  - Trío: Tres cartas del mismo rango.\n" +
      "  - Doble Pareja: Dos pares de cartas.\n" +
      "  - Pareja: Un par de cartas.\n" +
      "  - Carta Alta: Si no se cumple ninguna combinación.\n\n" +
      "Cada mano tiene un puntaje base y un multiplicador. Además, se suman los valores de las cartas para determinar los chips.";
  
    // Create a text object to display the help information
    const helpDisplay = this.add.text(width / 2, height / 2 - 30, helpText, {
      font: '20px Arial',
      fill: '#fff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: width * 0.75 }
    }).setOrigin(0.5);
  
    // Create a smaller hint text at the bottom center to close the popup
    const closeHint = this.add.text(width / 2, height * 0.75 + 75, '(Haz click para cerrar)', {
      font: '14px RetroFont',
      fill: '#fff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
  
    // Group all popup elements into a container for easier management
    const popupContainer = this.add.container(0, 0, [popupBg, helpDisplay, closeHint]);
  
    // Allow clicking on the background to close the popup
    popupBg.setInteractive().on('pointerdown', () => popupContainer.destroy());
  }
  
}
