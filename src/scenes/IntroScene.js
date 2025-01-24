import Phaser from 'phaser'

export default class IntroScene extends Phaser.Scene {
    constructor() {
      super('IntroScene');
    }
  
    create() {
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;
  
      // Title
      this.add.text(centerX, centerY - 200, 'Poker Infinto', {
        fontSize: '42px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);
  
      // Play Button
      const playBtn = this.add.image(centerX, centerY, 'playButton').setOrigin(0.5);
      playBtn.setInteractive();
  
      playBtn.on('pointerover', () => {
        playBtn.setScale(0.9);
        playBtn.setTint(0x666666);
      });
      playBtn.on('pointerout', () => {
        playBtn.setScale(1);
        playBtn.clearTint();
      });
      playBtn.on('pointerdown', () => {
        this.scene.start('GameScene');
        // Play the "select" sound
        this.sound.play('select');
      });
    }
  }
  