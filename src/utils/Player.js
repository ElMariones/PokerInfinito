import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene - The scene that this player belongs to
   * @param {number} x - Initial X position
   * @param {number} y - Initial Y position
   * @param {string} textureKey - The texture key (e.g. 'playerIdle') loaded in preload()
   */
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    // 1) Add the player to the scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 3) Adjust the hitbox if needed
    this.body.setSize(20, 28);
    this.body.setOffset(22, 36);

    // 4) Keep track of last direction so we know which idle animation to show
    this.lastDirection = 'down';

    // 5) Setup default animation
    this.play('idle-down');

    // 6) Create the input keys for movement (W, A, S, D)
    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  /**
   * Static method to define all player animations.
   * Call this once in your scene (e.g., in create()) before creating the Player.
   */
  static createPlayerAnimations(scene) {
    // Idle animations
    if (!scene.anims.exists('idle-up')) {
      scene.anims.create({
        key: 'idle-up',
        frames: [{ key: 'playerIdle', frame: 0 }],
        frameRate: 1,
        repeat: -1
      });
    }

    if (!scene.anims.exists('idle-left')) {
      scene.anims.create({
        key: 'idle-left',
        frames: [{ key: 'playerIdle', frame: 1 }],
        frameRate: 1,
        repeat: -1
      });
    }

    if (!scene.anims.exists('idle-down')) {
      scene.anims.create({
        key: 'idle-down',
        frames: [{ key: 'playerIdle', frame: 2 }],
        frameRate: 1,
        repeat: -1
      });
    }

    if (!scene.anims.exists('idle-right')) {
      scene.anims.create({
        key: 'idle-right',
        frames: [{ key: 'playerIdle', frame: 3 }],
        frameRate: 1,
        repeat: -1
      });
    }

    // Walk animations (based on your Walk.png sprite, 8 frames per direction)
    if (!scene.anims.exists('walk-up')) {
      scene.anims.create({
        key: 'walk-up',
        frames: scene.anims.generateFrameNumbers('playerWalk', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!scene.anims.exists('walk-left')) {
      scene.anims.create({
        key: 'walk-left',
        frames: scene.anims.generateFrameNumbers('playerWalk', { start: 8, end: 15 }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!scene.anims.exists('walk-down')) {
      scene.anims.create({
        key: 'walk-down',
        frames: scene.anims.generateFrameNumbers('playerWalk', { start: 16, end: 23 }),
        frameRate: 8,
        repeat: -1
      });
    }

    if (!scene.anims.exists('walk-right')) {
      scene.anims.create({
        key: 'walk-right',
        frames: scene.anims.generateFrameNumbers('playerWalk', { start: 24, end: 31 }),
        frameRate: 8,
        repeat: -1
      });
    }
  }

  /**
   * Called every frame from the Scene’s update().
   * Handles movement logic & plays correct animations.
   */
  update() {
    const speed = 450;
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;

    // Determine the last direction pressed
    if (up) {
      this.lastDirection = 'up';
    } else if (down) {
      this.lastDirection = 'down';
    } else if (left) {
      this.lastDirection = 'left';
    } else if (right) {
      this.lastDirection = 'right';
    }

    // If zero directions are pressed, go idle
    if (!up && !down && !left && !right) {
      this.setVelocity(0);
      this.play(`idle-${this.lastDirection}`, true);
      return;
    }

    // Move in the lastDirection we have stored
    switch (this.lastDirection) {
      case 'up':
        this.setVelocity(0, -speed);
        this.play('walk-up', true);
        break;
      case 'down':
        this.setVelocity(0, speed);
        this.play('walk-down', true);
        break;
      case 'left':
        this.setVelocity(-speed, 0);
        this.play('walk-left', true);
        break;
      case 'right':
        this.setVelocity(speed, 0);
        this.play('walk-right', true);
        break;
    }
  }
}
