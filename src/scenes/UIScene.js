export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    this.scene.bringToTop();
    this.gameScene = this.scene.get('GameScene');

    // Shared style
    const textStyle = {
      fontFamily: 'MarioKart',
      fontSize: '24px',
      color: '#ffffff',
    };

    // Score & Round
    this.scoreText = this.add.text(20, 20, 'puntos: 0', textStyle);
    this.roundText = this.add.text(20, 60, 'ronda: 1', textStyle);

    // NPC Goal & Rounds
    this.npcGoalText = this.add.text(20, 100, '', textStyle);
    this.npcRoundsText = this.add.text(20, 140, '', textStyle);

    // NEW: Deck count
    this.cardsLeftText = this.add.text(20, 180, 'cartas restantes: 0', textStyle);

    // Submit Button
    this.submitButton = this.add.image(this.cameras.main.width - 150, 60, 'submitBtn')
      .setOrigin(0.5)
      .setScale(0.35)
      .setInteractive();

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

    // Shuffle Button (if you still use it)
    this.shuffleButton = this.add.image(this.cameras.main.width - 150, 140, 'shuffleBtn')
      .setOrigin(0.5)
      .setScale(0.35)
      .setInteractive()
      .setAlpha(0.5);

    // Hover effects
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
        // Subtract points if you want
        this.gameScene.score -= 10;
        this.gameScene.shuffleAnimation();
      }
    });

    // When card selection changes
    this.gameScene.events.on('cards-changed', (selectedCount) => {
      // If no cards selected, disable shuffle, else enable
      if (selectedCount === 0) {
        this.shuffleButton.disableInteractive();
        this.shuffleButton.setAlpha(0.5);
      } else {
        this.shuffleButton.setInteractive();
        this.shuffleButton.setAlpha(1);
      }
    });
  }

  update() {
    this.scoreText.setText(`puntos: ${this.gameScene.score}`);
    this.roundText.setText(`ronda: ${this.gameScene.roundNumber}`);

    const pointsNeeded = this.gameScene.pointsNeeded || 0;
    const maxRounds = this.gameScene.maxRounds || 0;
    this.npcGoalText.setText(`objetivo: ${pointsNeeded} puntos`);
    this.npcRoundsText.setText(`max rondas: ${maxRounds}`);

    // Show cards remaining
    this.cardsLeftText.setText(`cartas restantes: ${this.gameScene.deck.length}`);
  }
}
