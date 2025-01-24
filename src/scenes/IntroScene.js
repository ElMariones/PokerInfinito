import Phaser from 'phaser';

// Import audio files
import selectSound from '../../assets/audio/select.mp3';
import deselectSound from '../../assets/audio/deselect.mp3';
import shuffleSound from '../../assets/audio/shuffle.mp3';
import submitSound from '../../assets/audio/submit.mp3';

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
      // Resume the AudioContext if needed
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          console.log('AudioContext resumed successfully');
        });
      }
      // Load audio files dynamically
      this.load.audio('select', selectSound);
      this.load.audio('deselect', deselectSound);
      this.load.audio('shuffle', shuffleSound);
      this.load.audio('submit', submitSound);

      // Wait until all audio is loaded
      this.load.once('complete', () => {
        // Play the "select" sound and move to GameScene
        this.sound.play('select');
        this.scene.start('GameScene');
      });

      // Start loading audio
      this.load.start();
    });
  }
}
