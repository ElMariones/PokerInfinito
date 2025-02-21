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
    
    

    // Background
    const background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'rug')
    .setOrigin(0, 0);

    // Title with custom font
    this.add.text(centerX, centerY - 200, 'all in: la ultima mano', {
      fontFamily: 'MarioKart',  // Apply the custom font
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

    // Start the MAP scene (instead of GameScene) on button click
    playBtn.on('pointerdown', () => {
      // Resume the AudioContext (in case it was suspended)
      console.log("🎮 Botón 'Jugar' presionado. Intentando iniciar MapScene...");

      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume().then(() => {
          console.log('AudioContext resumed successfully');
        });
      }

      // Transition to the MapScene
      this.scene.start('MapScene');
    });
  }
}
