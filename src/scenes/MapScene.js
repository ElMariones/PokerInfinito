export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 1) Background: top-down map
    this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height);

    // 2) Create player as a simple image
    this.player = this.add.image(100, 200, 'player').setScale(0.1);

    // 3) WASD controls (plus E for interact)
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });

    // 4) Create NPCs as images
    this.npc1 = this.add.image(300, 200, 'npc1').setScale(0.1);
    this.npc2 = this.add.image(500, 300, 'npc2').setScale(0.1);
    this.npc3 = this.add.image(700, 200, 'npc3').setScale(0.1);

    // Put NPCs in an array for easy iteration
    this.npcArray = [this.npc1, this.npc2, this.npc3];

    // 5) Interact key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });
  }

  tryInteract() {
    // Check if player is close enough to an NPC
    const interactDistance = 50;
  
    this.npcArray.forEach(npc => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npc.x, npc.y
      );
  
      if (dist < interactDistance) {
        // Placeholder for cutscene trigger
        if (npc === this.npc1) {
          this.startCutscene(
            [
              { image: 'placeholder', text: 'Hello, adventurer!' }
            ], 
            () => {
              this.scene.start('GameScene', { pointsNeeded: 100, rounds: 5 });
            }
          );
        }
      }
    });
  }


startCutscene(cutsceneSteps, callback) {
  this.currentCutsceneStep = 0;

  // Fade out current scene and start the cutscene once fade is complete
  this.cameras.main.fadeOut(500, 0, 0, 0);

  // Wait for the fadeOut to complete before starting the cutscene
  this.cameras.main.once('camerafadeoutcomplete', () => {
    this.showCutsceneStep(cutsceneSteps);
  });

  // Skip key: Press "E" to skip through steps
  this.input.keyboard.on('keydown-E', () => {
    this.nextCutsceneStep(cutsceneSteps, callback);
  });
}

showCutsceneStep(cutsceneSteps) {
  if (this.currentCutsceneStep < cutsceneSteps.length) {
    const { image, text } = cutsceneSteps[this.currentCutsceneStep];
    
    // Show image in fullscreen
    this.cutsceneImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, image)
      .setOrigin(0.5)
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);  // Adjust image size to fit the screen
  
    // Show text after image
    this.cutsceneText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150, text, {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  
    // Fade in image and text
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
}
