import Phaser from 'phaser';

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

  update() {
    // Manual top-down movement
    const speed = 3;

    if (this.cursors.up.isDown) {
      this.player.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.player.y += speed;
    }

    if (this.cursors.left.isDown) {
      this.player.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.player.x += speed;
    }
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
        // NPC1 cutscene example
        if (npc === this.npc1) {
          this.startCutscene(
            [
              { image: 'samuel', text: 'dialogo' },
              { image: 'adventurer', text: 'Dialogo' },
              { image: 'faceoff', text: 'DIALOGO' }
            ], 
            () => {
              this.scene.start('GameScene', { pointsNeeded: 100, rounds: 5 });
            }
          );
        } 
        // NPC2 and NPC3 cutscenes can follow the same pattern
        else if (npc === this.npc2) {
          this.startCutscene(
            [
              { image: 'npc2Image', text: 'Greetings, traveler!' },
              { image: 'npc2Image', text: 'There’s a challenge awaiting you...' },
              { image: 'npc2Image', text: 'Shall we begin?' }
            ], 
            () => {
              this.scene.start('GameScene', { pointsNeeded: 400, rounds: 5 });
            }
          );
        } 
        else if (npc === this.npc3) {
          this.startCutscene(
            [
              { image: 'npc3Image', text: 'Hi there!' },
              { image: 'npc3Image', text: 'I have something exciting for you...' },
              { image: 'npc3Image', text: 'Are you up for the challenge?' }
            ], 
            () => {
              this.scene.start('GameScene', { pointsNeeded: 500, rounds: 2 });
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
  
      // Remove previous images/text
      if (this.cutsceneImage) this.cutsceneImage.destroy();
      if (this.cutsceneText) this.cutsceneText.destroy();
  
      // Position Samuel at the bottom left and scale him down
      if (image === 'samuel') {
        this.cutsceneImage = this.add.image(150, this.cameras.main.height - 100, image)
          .setOrigin(0.5, 0.8)
          .setScale(0.9); // Adjust scale to make him smaller
      } else {
        // Default fullscreen image for others
        this.cutsceneImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, image)
          .setOrigin(0.5)
          .setDisplaySize(this.cameras.main.width, this.cameras.main.height);
      }
  
      // Adjust text placement to avoid overlap
      this.cutsceneText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 150, text, {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5);
  
      // Fade in image and text
      this.cameras.main.fadeIn(500, 0, 0, 0);
    }
  }
  
  nextCutsceneStep(cutsceneSteps, callback) {
    this.currentCutsceneStep++;
  
    // Remove the old image and text
    if (this.cutsceneImage) {
      this.cutsceneImage.destroy();
    }
    if (this.cutsceneText) {
      this.cutsceneText.destroy();
    }
  
    // If we have more steps, show the next one
    if (this.currentCutsceneStep < cutsceneSteps.length) {
      this.showCutsceneStep(cutsceneSteps);
    } else {
      // If no more steps, call the callback to transition to the next scene
      this.time.delayedCall(500, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          callback();
        });
      });
    }
  }
}