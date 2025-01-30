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
    //    No physics, no animation—just an image
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

    // Note: There's no collision or boundary check here;
    // you'd add clamp logic if you want to prevent out-of-bounds movement.
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
        // Identify which NPC we are near, then start GameScene
        if (npc === this.npc1) {
          // NPC1: 300 points in 5 rounds
          this.scene.start('GameScene', { pointsNeeded: 100, rounds: 5 });
        } else if (npc === this.npc2) {
          // NPC2: 400 points in 5 rounds
          this.scene.start('GameScene', { pointsNeeded: 400, rounds: 5 });
        } else if (npc === this.npc3) {
          // NPC3: 400 points in 4 rounds
          this.scene.start('GameScene', { pointsNeeded: 500, rounds: 2 });
        }
      }
    });
  }
}
