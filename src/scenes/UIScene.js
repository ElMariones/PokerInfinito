export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    this.scene.bringToTop();
    this.gameScene = this.scene.get('GameScene');

    // Shared style with custom font
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

    // Shuffle Button
    this.shuffleButton = this.add.image(this.cameras.main.width - 150, 140, 'shuffleBtn')
      .setOrigin(0.5)
      .setScale(0.35)
      .setInteractive();
      
    this.shuffleButton.on('pointerover', () => {
      this.shuffleButton.setTint(0xaaaaaa);
      this.shuffleButton.setScale(0.40);
    });
    this.shuffleButton.on('pointerout', () => {
      this.shuffleButton.clearTint();
      this.shuffleButton.setScale(0.35);
    });
    this.shuffleButton.on('pointerdown', () => {
      this.shuffleButton.setTint(0x333333);
      this.gameScene.score -= 10;
      this.gameScene.shuffleAnimation();
    });
  }

  update() {
    this.scoreText.setText(`puntos: ${this.gameScene.score}`);
    this.roundText.setText(`ronda: ${this.gameScene.roundNumber}`);

    const pointsNeeded = this.gameScene.pointsNeeded || 0;
    const maxRounds = this.gameScene.maxRounds || 0;

    this.npcGoalText.setText(`objetivo: ${pointsNeeded} puntos`);
    this.npcRoundsText.setText(`max rondas: ${maxRounds}`);
  }
}
