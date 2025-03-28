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
      fontFamily: 'MarioKart',
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    };

    this.createScoreMarker(textStyle);

    // Score & Round Text
    this.scoreText = this.add.text(20, 20, 'puntos: 0', textStyle);
    this.roundText = this.add.text(20, 60, 'ronda: 1', textStyle);

    // NPC Goal & Rounds Text
    this.npcGoalText = this.add.text(20, 100, '', textStyle);
    this.npcRoundsText = this.add.text(20, 140, '', textStyle);

    // Deck Count Text
    this.cardsLeftText = this.add.text(20, 180, 'cartas restantes: 0', textStyle);

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
    this.submitButton.disableInteractive();

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
        this.submitButton.disableInteractive();
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
  }

  update() {
    const gameScene = this.scene.get('GameScene');
    if (!gameScene) return; // Optionally, skip if GameScene isn't available.
    
    this.scoreText.setText(`puntos: ${gameScene.score}`);
    this.roundText.setText(`ronda: ${gameScene.roundNumber}`);
  
    const pointsNeeded = gameScene.pointsNeeded || 0;
    const maxRounds = gameScene.maxRounds || 0;
    this.npcGoalText.setText(`objetivo: ${pointsNeeded} puntos`);
    this.npcRoundsText.setText(`max rondas: ${maxRounds}`);
    
    this.cardsLeftText.setText(`cartas restantes: ${gameScene.deck.length}`);
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
      'chips',
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
      'multi',
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

}
