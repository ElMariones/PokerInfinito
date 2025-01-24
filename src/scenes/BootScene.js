import Phaser from 'phaser';
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import rug from '../../assets/images/rug.png';

import selectSound from '../../assets/audio/select.mp3';
import deselectSound from '../../assets/audio/deselect.mp3';
import shuffleSound from '../../assets/audio/shuffle.mp3';
import submitSound from '../../assets/audio/submit.mp3';

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

    // Load audio files
    this.load.audio('select', selectSound);
    this.load.audio('deselect', deselectSound);
    this.load.audio('shuffle', shuffleSound);
    this.load.audio('submit', submitSound);
  }

  create() {
    // Start the IntroScene after preloading assets
    this.scene.start('IntroScene');
  }
}
