import Phaser from 'phaser'

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    // Always on top
    this.scene.bringToTop();
    // Reference to GameScene
    this.gameScene = this.scene.get('GameScene');

    // Score & Round text (unchanged)
    this.scoreText = this.add.text(20, 20, 'Puntos: 0', {
      fontSize: '24px',
      color: '#ffffff',
    });
    this.roundText = this.add.text(20, 60, 'Ronda: 1', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // SUBMIT Button (image)
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
    // Click effect
    this.submitButton.on('pointerdown', () => {
      // Pressed state
      this.submitButton.setTint(0x333333);
      // Play submit sound
      //this.gameScene.sound.play('submit');
      // Call GameScene's method
      this.gameScene.onSubmitHand();
    });

    // SHUFFLE Button (image)
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
      // Pressed state
      this.shuffleButton.setTint(0x333333);
      // Shuffle sound
      //this.gameScene.sound.play('shuffle');
      // Shuffle the player's current 10 cards with penalty
      this.gameScene.score -= 10;
      this.gameScene.shuffleAnimation(); // We'll define below
    });
  }

  update() {
    // Continuously update scoreboard from GameScene
    this.scoreText.setText(`Score: ${this.gameScene.score}`);
    this.roundText.setText(`Round: ${this.gameScene.roundNumber}`);
  }
}
