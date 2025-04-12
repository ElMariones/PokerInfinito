import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(20, 28);
    this.body.setOffset(22, 36);

    this.lastDirection = 'down';
    this.play('idle-down');

    this.cursors = scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.speed = 180; // Velocidad constante
  }

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

    // Walk animations
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

  update() {
    const { up, down, left, right } = this.cursors;
    const velocity = new Phaser.Math.Vector2(0, 0);

    if (up.isDown) {
      velocity.y = -1;
      this.lastDirection = 'up';
    } else if (down.isDown) {
      velocity.y = 1;
      this.lastDirection = 'down';
    }

    if (left.isDown) {
      velocity.x = -1;
      this.lastDirection = 'left';
    } else if (right.isDown) {
      velocity.x = 1;
      this.lastDirection = 'right';
    }

    velocity.normalize().scale(this.speed);
    this.setVelocity(velocity.x, velocity.y);

    // Elegir animación según movimiento
    if (velocity.length() === 0) {
      this.play(`idle-${this.lastDirection}`, true);
    } else {
      const animKey = `walk-${this.lastDirection}`;
      if (this.anims.currentAnim?.key !== animKey) {
        this.play(animKey, true);
      }
    }
  }
}
