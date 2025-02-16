import DialogText from '../DialogText.js'; // Ajusta la ruta si es necesario

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

    this.dialogBox = new DialogText(this, { dialogSpeed: 4 });
    this.dialogBox.setText("Bienvenido a Ciudad Trébol.", "Dante", "asador_fondo");
    this.dialogBox.setVisible(false); // Oculto por defecto

    // Shared style for text
    const textStyle = {
      fontFamily: 'MarioKart',
      fontSize: '24px',
      color: '#ffffff',
    };

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

    // Submit Button - initially disabled (low opacity)
    this.submitButton = this.add.image(this.cameras.main.width - 150, 60, 'submitBtn')
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
    this.shuffleButton = this.add.image(this.cameras.main.width - 150, 140, 'shuffleBtn')
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
    this.sortButton = this.add.image(this.cameras.main.width - 170, this.cameras.main.height - 280, 'sortColor')
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
      if (selectedCount === 0) {
        this.shuffleButton.disableInteractive();
        this.shuffleButton.setAlpha(0.5);
      } else {
        this.shuffleButton.setInteractive();
        this.shuffleButton.setAlpha(1);
      }
      // For the submit button - enabled only if exactly 5 cards are selected.
      if (selectedCount !== 5) {
        this.submitButton.disableInteractive();
        this.submitButton.setAlpha(0.5);
      } else {
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
    this.scoreText.setText(`puntos: ${this.gameScene.score}`);
    this.roundText.setText(`ronda: ${this.gameScene.roundNumber}`);

    const pointsNeeded = this.gameScene.pointsNeeded || 0;
    const maxRounds = this.gameScene.maxRounds || 0;
    this.npcGoalText.setText(`objetivo: ${pointsNeeded} puntos`);
    this.npcRoundsText.setText(`max rondas: ${maxRounds}`);

    this.cardsLeftText.setText(`cartas restantes: ${this.gameScene.deck.length}`);
  }

  showDialog(text, character, background) {
    this.dialogBox.setText(text, character, background);
    this.dialogBox.setVisible(true);
  }

}
