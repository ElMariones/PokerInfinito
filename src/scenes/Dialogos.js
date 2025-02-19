import Phaser from 'phaser';

export default class Dialogos extends Phaser.Scene {
  constructor() {
    super({ key: 'Dialogos' });
  }

  init(data) {
    this.npc = data.npc;
    this.currentStep = 0; // Track the current step in the cutscene
    this.transitionData = {};
  }

  create() {
    // Bring this scene to the top
    this.scene.bringToTop();
    this.gameScene = this.scene.get('MapScene');
    
    // Set up cutscene sequence based on NPC
    switch (this.npc) {
      case 'samuel':
        this.cutsceneImages = ['Samuel', 'Dante'];
        this.transitionData = { npc: 'samuel', pointsNeeded: 100, rounds: 5 };
        break;
      case 'bruja':
        this.cutsceneImages = ['bruja1', 'bruja2'];
        this.transitionData = { npc: 'bruja', pointsNeeded: 80, rounds: 4 };
        break;
      case 'gemelos':
        this.cutsceneImages = ['gemelos1', 'gemelos2'];
        this.transitionData = { npc: 'gemelos', pointsNeeded: 90, rounds: 3 };
        break;
      case 'padre':
        this.cutsceneImages = ['padre1', 'padre2'];
        this.transitionData = { npc: 'padre', pointsNeeded: 70, rounds: 3 };
        break;
      case 'pescador':
        this.cutsceneImages = ['pescador1', 'pescador2'];
        this.transitionData = { npc: 'pescador', pointsNeeded: 60, rounds: 2 };
        break;
      default:
        this.startBattle();
        return;
    }

    this.cutsceneImage = this.add.image(512, 384, this.cutsceneImages[this.currentStep]);

    this.input.keyboard.on('keydown-E', this.showNextImage, this);
  }

  showNextImage() {
    this.currentStep++;

    if (this.currentStep < this.cutsceneImages.length) {
      this.cutsceneImage.destroy();
      this.cutsceneImage = this.add.image(512, 384, this.cutsceneImages[this.currentStep]);
    } else {
      this.startBattle();
    }
  }

  startBattle() {
    this.scene.start('TransicionBatalla', this.transitionData);
  }
}
