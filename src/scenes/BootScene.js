import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
  
    preload() {
      // 1) Card images (as before)
      const suits = ['clubs','diamonds','hearts','spades'];
      const ranks = ['2','3','4','5','6','7','8','9','10','jack','queen','king','ace'];
      for (const suit of suits) {
        for (const rank of ranks) {
          this.load.image(`${rank}_of_${suit}`, `assets/cards/${rank}_of_${suit}.png`);
        }
      }
      // Optional jokers
      // this.load.image('black_joker', 'assets/cards/black_joker.png');
      // this.load.image('red_joker',   'assets/cards/red_joker.png');
  
      // 2) Play button
      this.load.image('playButton', 'assets/images/play.png');
      this.load.image('submitBtn', 'assets/images/submit.png');
      this.load.image('shuffleBtn', 'assets/images/shuffle.png');
  
      // 3) Audio files
      this.load.audio('select', 'assets/audio/select.wav');
      this.load.audio('deselect', 'assets/audio/deselect.wav');
      this.load.audio('shuffle', 'assets/audio/shuffle.wav');
      this.load.audio('submit', 'assets/audio/submit.wav');
    }
  
    create() {
      // Start intro
      this.scene.start('IntroScene');
    }
  }
  