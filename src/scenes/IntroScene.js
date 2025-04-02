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
    
    //Music
    // Asegurar que no hay música previa sonando
    if (this.sound) {
      this.sound.stopAll();
    }

    // Reanudar el AudioContext si está suspendido
    if (this.sound.context.state === 'suspended') {
      this.sound.context.resume().then(() => {
        console.log('🔊 AudioContext reanudado correctamente.');
        this.playMusic(); // Reproducir música una vez reanudado
      });
    } else {
      this.playMusic(); // Si el contexto no está suspendido, reproducir directamente
    }
    // Background
    const background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'portada')
    .setOrigin(0, 0);

    // Title with custom font
    this.add.text(centerX, centerY - 200, 'all in: la ultima mano', {
      fontFamily: 'MarioKart',  // Apply the custom font
      fontSize: '42px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
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
      console.log("🎮 Botón 'Jugar' presionado. Iniciando MapScene...");

      // Reanudar AudioContext si sigue suspendido
      if (this.sound.context.state === 'suspended') {
        this.sound.context.resume();
      }

      this.sound.stopAll(); // Detener la música antes de cambiar de escena
      this.scene.start('MapScene');
      });
    }

    playMusic() {
      this.music = this.sound.add('mainMenuMusic', { volume: 0.5, loop: true });
      this.music.play();
      console.log('🎵 Música del menú reproducida.');
    }  
}
