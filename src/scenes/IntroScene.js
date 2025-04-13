import Phaser from 'phaser';
import UIButton from '../utils/Button';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;
    
    // Initialize music state if not exists
    if (!this.registry.has('musicEnabled')) {
      this.registry.set('musicEnabled', true);
    }

    // Background with parallax effect
    const background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'rug')
      .setOrigin(0, 0)
      .setAlpha(0.8);

    // List of all available jokers
    const jokers = [
      'joker1', 'gilitoJoker', 'juanJoker', 'espadachinJoker', 'tragaldabasJoker',
      'locoJoker', 'chifladoJoker', 'piradoJoker', 'bufonJoker', 'zorroJoker',
      'astutoJoker', 'listoJoker', 'tramposoJoker', 'maranosoJoker', 'sombraJoker',
      'banderinJoker', 'cimaJoker', 'abstractoJoker', 'eruditoJoker', 'caminanteJoker'
    ];

    // Create animated jokers
    for (let i = 0; i < 14; i++) {
      const jokerKey = jokers[Phaser.Math.Between(0, jokers.length - 1)];
      const joker = this.add.image(
        Phaser.Math.Between(0, gameWidth),
        Phaser.Math.Between(0, gameHeight),
        jokerKey
      )
      .setScale(0.3)
      .setAlpha(0.6);

      // Random movement animation
      const duration = Phaser.Math.Between(3000, 6000);
      const delay = Phaser.Math.Between(0, 2000);
      
      this.tweens.add({
        targets: joker,
        x: Phaser.Math.Between(0, gameWidth),
        y: Phaser.Math.Between(0, gameHeight),
        duration: duration,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: delay
      });

      // Fade in/out animation
      this.tweens.add({
        targets: joker,
        alpha: 0.9,
        duration: 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: delay
      });

      // Rotation animation
      this.tweens.add({
        targets: joker,
        angle: 360,
        duration: duration * 2,
        ease: 'Linear',
        repeat: -1,
        delay: delay
      });

      // Scale animation
      this.tweens.add({
        targets: joker,
        scale: 0.4,
        duration: 1500,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: delay
      });
    }

    // Title with retro style
    const titleText = this.add.text(centerX, centerY - 200, 'All in', {
      fontFamily: 'RetroFont',
      fontSize: '94px',
      color: '#FFD700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: '#000000',
        blur: 4
      }
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 120, 'La última mano', {
      fontFamily: 'RetroFont',
      fontSize: '52px',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Animate title
    this.tweens.add({
      targets: titleText,
      scale: 1.1,
      duration: 1500,
      yoyo: true,
      repeat: -1
    });

    // Create Play Button using UIButton
    const playButton = new UIButton(
      this,
      centerX,
      centerY + 50,
      'Jugar',
      'green',
      () => {
        console.log("🎮 Botón 'Jugar' presionado. Iniciando MapScene...");
        
        if (this.sound.context.state === 'suspended') {
          this.sound.context.resume();
        }

        this.sound.stopAll();
        this.scene.start('MapHabitacion');
      }
    );

    // Scale up the play button
    playButton.setScale(2.5);

    // Create Sound Button using UIButton
    const soundButton = new UIButton(
      this,
      centerX,
      centerY + 150, // Positioned below the play button
      '',
      'sound',
      (toggled) => {
        const musicEnabled = !toggled;
        this.registry.set('musicEnabled', musicEnabled);
        
        if (musicEnabled) {
          this.playMusic();
        } else {
          this.sound.stopAll();
        }
      }
    );

    // Scale up the sound button
    soundButton.setScale(1.5);

    // Handle music
    if (this.registry.get('musicEnabled')) {
      this.playMusic();
    }
  }

  playMusic() {
    if (this.music) {
      this.music.stop();
    }
    
    this.music = this.sound.add('mainMenuMusic', { 
      volume: 0.5, 
      loop: true 
    });
    
    this.music.play();
    console.log('🎵 Música del menú reproducida.');
  }
}
