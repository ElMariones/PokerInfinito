import Phaser from 'phaser';
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import rug from '../../assets/images/rug.png';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load all card images dynamically
    Object.entries(cards).forEach(([key, path]) => {
      this.load.image(key, path);
    });
    

    // Load other images
    this.load.image('playButton', playButton);
    this.load.image('submitBtn', submitBtn);
    this.load.image('shuffleBtn', shuffleBtn);
    this.load.image('rug', rug);
  }

  create() {
    // Start the IntroScene after preloading assets
    this.scene.start('IntroScene');
  }
}
