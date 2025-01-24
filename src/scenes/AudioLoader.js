import Phaser from 'phaser';

// Import audio files
import selectSound from '../../assets/audio/select.mp3';
import deselectSound from '../../assets/audio/deselect.mp3';
import shuffleSound from '../../assets/audio/shuffle.mp3';
import submitSound from '../../assets/audio/submit.mp3';

export default class AudioLoader extends Phaser.Scene {
  constructor() {
    super('AudioLoader');
  }

  preload() {
    // Display loading text
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.add.text(centerX, centerY, 'Cargando...', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Preload audio files
    this.load.audio('select', selectSound);
    this.load.audio('deselect', deselectSound);
    this.load.audio('shuffle', shuffleSound);
    this.load.audio('submit', submitSound);
  }

  create() {
    // Transition to the GameScene once audio is loaded
    this.scene.start('GameScene');
  }
}
