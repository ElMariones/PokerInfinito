import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Add the background image and scale it to fit the screen
    const background = this.add.image(centerX, centerY, 'rug');
    background.setDisplaySize(gameWidth, gameHeight);

    // Title
    this.add.text(centerX, centerY - 200, 'Poker Infinito', {
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Play Button
    const playBtn = this.add.image(centerX, centerY, 'playButton').setOrigin(0.5);
    playBtn.setInteractive();

    // Hover effects for Play Button
    playBtn.on('pointerover', () => {
      playBtn.setScale(0.9);
      playBtn.setTint(0x666666);
    });

    playBtn.on('pointerout', () => {
      playBtn.setScale(1);
      playBtn.clearTint();
    });

    // Start the game and resume the audio context on button click
    playBtn.on('pointerdown', () => {
      // Resume the AudioContext (in case it was suspended)
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          console.log('AudioContext resumed successfully');
        });
      }

      // Transition to the AudioLoader scene
      this.scene.start('AudioLoader');
    });
  }
}
