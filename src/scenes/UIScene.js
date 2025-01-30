import Phaser from 'phaser';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    // Ensure this scene stays on top
    this.scene.bringToTop();
    // Reference to GameScene
    this.gameScene = this.scene.get('GameScene');

    // --- SCORE & ROUND TEXT ---
    this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.roundText = this.add.text(20, 60, 'Ronda: 1', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // --- NPC DEMANDS TEXT (pointsNeeded, maxRounds) ---
    // We'll place them below Score & Round.
    this.npcGoalText = this.add.text(20, 100, '', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.npcRoundsText = this.add.text(20, 140, '', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // --- SUBMIT BUTTON ---
    this.submitButton = this.add.image(
      this.cameras.main.width - 150, // x
      60,                            // y
      'submitBtn'                    // key from BootScene
    )
      .setOrigin(0.5)
      .setScale(0.40)
      .setInteractive();

    // Hover effect
    this.submitButton.on('pointerover', () => {
      this.submitButton.setTint(0xaaaaaa);
      this.submitButton.setScale(0.45);
    });
    this.submitButton.on('pointerout', () => {
      this.submitButton.clearTint();
      this.submitButton.setScale(0.40);
    });

    // Click: call GameScene's onSubmitHand
    this.submitButton.on('pointerdown', () => {
      this.submitButton.setTint(0x333333);
      this.gameScene.onSubmitHand();
    });

    // --- SHUFFLE BUTTON ---
    this.shuffleButton = this.add.image(
      this.cameras.main.width - 150, // x
      140,                           // y
      'shuffleBtn'
    )
      .setOrigin(0.5)
      .setScale(0.40)
      .setInteractive();

    this.shuffleButton.on('pointerover', () => {
      this.shuffleButton.setTint(0xaaaaaa);
      this.shuffleButton.setScale(0.45);
    });
    this.shuffleButton.on('pointerout', () => {
      this.shuffleButton.clearTint();
      this.shuffleButton.setScale(0.40);
    });
    this.shuffleButton.on('pointerdown', () => {
      this.shuffleButton.setTint(0x333333);
      // Shuffle penalty
      this.gameScene.score -= 10;
      this.gameScene.shuffleAnimation();
    });
  }

  update() {
    // Continuously update scoreboard from GameScene
    this.scoreText.setText(`Score: ${this.gameScene.score}`);
    this.roundText.setText(`Round: ${this.gameScene.roundNumber}`);

    // If the scene hasn't started a game yet, these might be undefined; add checks
    const pointsNeeded = this.gameScene.pointsNeeded || 0;
    const maxRounds = this.gameScene.maxRounds || 0;

    // Show NPC demands
    this.npcGoalText.setText(`Objetivo: ${pointsNeeded} Puntos`);
    this.npcRoundsText.setText(`Rondas Pedidas: ${maxRounds}`);
  }
}
