import Phaser from 'phaser';

function DissolveMainCamera(scene, duration) {
  const postFxPlugin = scene.plugins.get('rexdissolvepipelineplugin');
  const mainCamera = scene.cameras.main;
  const postFxPipeline = postFxPlugin.add(mainCamera, {});
  scene.tweens.add({
    targets: postFxPipeline,
    progress: 1,
    ease: 'Quad',
    duration: duration,
    repeat: 0,
    yoyo: false
  }).on('complete', function () {
    postFxPlugin.remove(mainCamera);
  });
}

export default class TransicionBatalla extends Phaser.Scene {
  constructor() {
    super({ key: 'TransicionBatalla' });
  }

  init(data) {
    // 'data' will contain npc, pointsNeeded, rounds
    this.npc = data.npc;
    this.pointsNeeded = data.pointsNeeded;
    this.rounds = data.rounds;
    this.gameScene = data.scene;
  }

  preload() {
    // Assets are already loaded in boot.js.
  }

  create() {
    // Stop the scene registered in the registry 'currentMap'.
    const currentMap = this.registry.get('currentMap');
    if (currentMap) {
      this.scene.pause(currentMap);
    }

    const gameWidth = this.cameras.main.width;
    const gameHeight = this.cameras.main.height;

    // Background
    this.add.tileSprite(0, 0, gameWidth, gameHeight, 'rug').setOrigin(0, 0);

    // Create a particle texture if it doesn't already exist.
    if (!this.textures.exists('particle')) {
      const gfx = this.add.graphics();
      gfx.fillStyle(0xffffff, 1);
      gfx.fillCircle(4, 4, 4);
      gfx.generateTexture('particle', 8, 8);
      gfx.destroy();
    }

    // Create a particle emitter behind everything for FX using the new syntax.
    const particles = this.add.particles('particle', {
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      speed: { min: -100, max: 100 },
      scale: { start: 1, end: 0 },
      blendMode: 'ADD',
      lifespan: 1000,
      frequency: 200,
      quantity: 2
    });
    particles.setDepth(-1);

    // Choose the correct NPC animation.
    switch (this.npc) {
      case 'madre':
        this.playNpcDirectionalAnimation('madre');
        break;
      case 'samuel':
        this.playNpcDirectionalAnimation('samuel');
        break;
      case 'helena':
        this.playNpcDirectionalAnimation('helena');
        break;
      case 'gemelos':
        this.playNpcDirectionalAnimation('gemelos');
        break;
      case 'padre':
        this.playNpcDirectionalAnimation('padre');
        break;
      case 'pescador':
        this.playNpcDirectionalAnimation('pescador');
        break;
    }
  }

  update() {
    // Optional update logic.
  }

  // This helper function handles the animation for each NPC.
  // It uses the corresponding walk spritesheet (e.g. 'samuelWalk')
  // and creates directional animations (up, left, down, right).
  playNpcDirectionalAnimation(npcKey) {
    // Use the walk spritesheet key (e.g. 'samuelWalk').
    const assetKey = npcKey + 'Walk';
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const sprite = this.add.sprite(centerX, centerY, assetKey);
    sprite.setOrigin(0.5, 0.5);

    // Start the sprite 4x times bigger.
    sprite.setScale(4);

    // Compute final scale so the sprite covers the whole screen.
    // Since the sprite frame is 64px, the final scale is the maximum dimension divided by 64.
    const finalScale = Math.max(this.cameras.main.width, this.cameras.main.height) / 64;

    // Tween the sprite's scale from 4 to finalScale over 4 seconds.
    this.tweens.add({
      targets: sprite,
      scale: finalScale,
      duration: 1000,
      ease: 'Linear'
    });

    // Create directional animations if they don't already exist.
    // Assumes frames arranged in 4 rows of 8 frames each:
    // Row 0: up (frames 0-7), Row 1: left (8-15), Row 2: down (16-23), Row 3: right (24-31).
    if (!this.anims.exists(`${npcKey}-walk-up`)) {
      this.anims.create({
        key: `${npcKey}-walk-up`,
        frames: this.anims.generateFrameNumbers(assetKey, { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: `${npcKey}-walk-left`,
        frames: this.anims.generateFrameNumbers(assetKey, { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: `${npcKey}-walk-down`,
        frames: this.anims.generateFrameNumbers(assetKey, { start: 16, end: 23 }),
        frameRate: 10,
        repeat: -1
      });
      this.anims.create({
        key: `${npcKey}-walk-right`,
        frames: this.anims.generateFrameNumbers(assetKey, { start: 24, end: 31 }),
        frameRate: 10,
        repeat: -1
      });
    }

    // Cycle through the directional animations.
    const directions = ['walk-up', 'walk-left', 'walk-down', 'walk-right'];
    let currentDirectionIndex = 0;
    sprite.anims.play(`${npcKey}-${directions[currentDirectionIndex]}`);
    currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;

    // Change the directional animation every second.
    this.time.addEvent({
      delay: 125,
      callback: () => {
        sprite.anims.play(`${npcKey}-${directions[currentDirectionIndex]}`);
        currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
      },
      repeat: 5
    });


    // At the end of the sequence, add camera shake/flash and then transition with the dissolve effect.
    this.time.delayedCall(1000, () => {
      this.cameras.main.shake(300, 0.02);
      this.cameras.main.flash(300, 255, 255, 255);

      // Use scene.transition with an onStart callback to run the dissolve effect.
      this.scene.transition({
        target: 'GameScene', // Change this key to your desired next scene.
        duration: 1500,
        moveBelow: true,
        onStart: (fromScene, toScene, duration) => {
          DissolveMainCamera(fromScene, duration);
        },
        data: { pointsNeeded: this.pointsNeeded, rounds: this.rounds, scene: this.gameScene, npc: this.npc  }
      });
    });
  }
}
