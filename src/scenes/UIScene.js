import UIButton from '../utils/Button.js';

export default class UIScene extends Phaser.Scene {  
  constructor() {
    super({ key: 'UIScene', active: false });
    this.helpPopupVisible = false;
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

    this.barajarPuntos = 10;

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

    // Submit Button
    this.submitButton = new UIButton(this, this.cameras.main.width / 2 - buttonSpacing, buttonY, 'Enviar', 'green', () => {
      this.gameScene.onSubmitHand();
    });
    this.submitButton.disable();
    this.submitButton.setScale(2);

    // Shuffle Button
    this.shuffleButton = new UIButton(this, this.cameras.main.width / 2 + buttonSpacing, buttonY, 'Cambiar', 'red', () => {
      const hasHiddenpadre = this.gameScene.selectedCards.some(card =>
        this.gameScene.hiddenpadreCards.includes(card)
      );
    
      if (hasHiddenpadre) {
        this.showTemporaryWarning('❌ No puedes cambiar cartas ocultas.');
      
        // 🔧 SOLUCIÓN: Restaurar la visibilidad de los covers (por si se ocultaron antes)
        this.gameScene.cardSprites.forEach(sprite => {
          if (sprite.padreCover) {
            sprite.padreCover.setVisible(true);
          }
        });
      
        return;
      }
    
      if (!this.shuffleButton.disabled) {
        this.gameScene.score -= this.barajarPuntos;
        this.barajarPuntos *= 2;
        this.shuffleButton.disable();
        this.gameScene.shuffleAnimation();
      }
    });
    
    this.shuffleButton.disable();
    this.shuffleButton.setScale(2);

    // Sort Button
    this.sortButton = new UIButton(this, this.cameras.main.width / 2, buttonY, 'Palo', 'yellow', () => {
      this.gameScene.toggleSortMethod();
      // Update the button text based on the new sort method
      this.sortButton.label.setText(this.gameScene.sortMethod === 'number' ? 'Palo' : 'Número');
    });

    // Store a reference to the "Ordenar por:" text
    const ordenarPorText = this.add.text(
      this.cameras.main.width / 2,
      buttonY - 30,
      'Ordenar por:',
      {
        font: '11px RetroFont',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5);

    // Listen for card selection changes to enable/disable buttons.
    this.gameScene.events.on('cards-changed', (selectedCount) => {
      if (selectedCount === 0) {
        this.shuffleButton.disable();
        this.submitButton.disable();
        return;
      }
    
      if (selectedCount === 'no-shuffle') {
        this.shuffleButton.disable();
        this.submitButton.setVisible(true); // Asegurar que el botón está visible
        // Permitimos enviar si hay 5 cartas seleccionadas aunque no se pueda barajar
        if (this.gameScene.selectedCards.length === 5) {
          this.submitButton.enable();
        } else {
          this.submitButton.disable();
        }
        return;
      }
    
      // Caso normal
      if (selectedCount !== 5) {
        this.submitButton.disable();
      } else {
        this.submitButton.enable();
      }
    
      this.shuffleButton.enable();
    });
    

    // Listen for shuffle animation completion to re-enable shuffle button
    this.gameScene.events.on('shuffle-complete', () => {
      this.shuffleButton.enable();
    });

    // Listen for the toggle event to hide/show the sort button, text, and all buttons during animations
    this.gameScene.events.on('toggle-sort-button', (visible) => {
      this.sortButton.setVisible(visible);
      ordenarPorText.setVisible(visible);

      // Toggle visibility and enable state for all buttons
      [this.submitButton, this.shuffleButton, this.sortButton, ayudaButton].forEach(button => {
        button.setVisible(visible);
      });
    });
 
    const ayudaButton = new UIButton(this, 820, buttonY, 'Ayuda', 'green', () => {
      if (this.helpPopupVisible) {
        this.closeAyuda();
      } else {
        this.showAyuda();
      }
    });
  }

  showTemporaryWarning(message) {
    const warning = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 120,
      message,
      {
        fontFamily: 'RetroFont',
        fontSize: '20px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    ).setOrigin(0.5);
  
    this.tweens.add({
      targets: warning,
      y: warning.y - 40,
      alpha: { from: 1, to: 0 },
      duration: 2000,
      ease: 'Power2',
      onComplete: () => warning.destroy()
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
    if (this.helpPopupVisible) return;
    
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
    this.helpPopupContainer = this.add.container(0, 0, [popupBg, helpDisplay, closeHint]);
    this.helpPopupVisible = true;
  
    // Allow clicking on the background to close the popup
    popupBg.setInteractive().on('pointerdown', () => this.closeAyuda());
  }
  
  closeAyuda() {
    if (this.helpPopupContainer) {
      this.helpPopupContainer.destroy();
      this.helpPopupContainer = null;
      this.helpPopupVisible = false;
    }
  }
}
