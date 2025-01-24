import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
    constructor() {
      super('BootScene');
    }
  
    preload() {
      const baseURL = './PokerInfinito/assets/'; // Adjust the base URL for GitHub Pages
    
      // 1) Card images
      const suits = ['clubs','diamonds','hearts','spades'];
      const ranks = ['2','3','4','5','6','7','8','9','10','jack','queen','king','ace'];
      for (const suit of suits) {
        for (const rank of ranks) {
          this.load.image(`${rank}_of_${suit}`, `${baseURL}cards/${rank}_of_${suit}.png`);
        }
      }
    
      // 2) Play button
      this.load.image('playButton', `${baseURL}images/play.png`);
      this.load.image('submitBtn', `${baseURL}images/submit.png`);
      this.load.image('shuffleBtn', `${baseURL}images/shuffle.png`);
    
      // 3) Audio files
      this.load.audio('select', `${baseURL}audio/select.wav`);
      this.load.audio('deselect', `${baseURL}audio/deselect.wav`);
      this.load.audio('shuffle', `${baseURL}audio/shuffle.wav`);
      this.load.audio('submit', `${baseURL}audio/submit.wav`);
    }
    
  
    create() {
      // Start intro
      this.scene.start('IntroScene');
    }
  }
  