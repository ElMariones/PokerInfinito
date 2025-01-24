import Phaser from 'phaser';
import cards from '../utils/cards.js';
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import rug from '../../assets/images/rug.png';

// 3) Import audio
import selectSound from '../../assets/audio/select.wav';
import deselectSound from '../../assets/audio/deselect.wav';
import shuffleSound from '../../assets/audio/shuffle.wav';
import submitSound from '../../assets/audio/submit.wav';

export default class BootScene extends Phaser.Scene {
  preload() {
    // Load all card images in a loop
    Object.entries(cards).forEach(([key, path]) => {
      this.load.image(key, path);
    });

    // 2) Other images
    this.load.image('playButton', playButton);
    this.load.image('submitBtn', submitBtn);
    this.load.image('shuffleBtn', shuffleBtn);
    this.load.image('rug', rug);

    // 3) Audio files
    this.load.audio('select', selectSound);
    this.load.audio('deselect', deselectSound);
    this.load.audio('shuffle', shuffleSound);
    this.load.audio('submit', submitSound);
  }

  create() {
    this.scene.start('IntroScene');
  }
}
