import Phaser from 'phaser';

export default class TransicionBatalla extends Phaser.Scene {
  constructor() {
    super({ key: 'TransicionBatalla' });
  }

  init(data) {
    // 'data' will contain npc, pointsNeeded, rounds
    this.npc = data.npc;
    this.pointsNeeded = data.pointsNeeded;
    this.rounds = data.rounds;
  }

  preload() {
    // Load any assets needed for your transition animations
    // For example, if you have separate spritesheets or images:
    // this.load.spritesheet('transition_samuel', 'assets/transition_samuel.png', { frameWidth: 128, frameHeight: 128 });
    // ... do this for each NPC, or load them all in your main preload if you prefer.
  }

  create() {
    // Decide which animation to play based on the NPC
    switch (this.npc) {
      case 'Samuel':
        this.playSamuelAnimation();
        break;
      case 'Helena':
        this.playBrujaAnimation();
        break;
      case 'gemelos':
        this.playGemelosAnimation();
        break;
      case 'padre':
        this.playPadreAnimation();
        break;
      case 'pescador':
        this.playPescadorAnimation();
        break;
      default:
        // If no NPC is recognized, skip or do a default transition
        this.playDefaultAnimation();
        break;
    }
  }

  update() {
    // If your animation is purely time-based or event-based, you can check 
    // if it’s done in here, or in the animation's "complete" callback.
  }

  // Example animation functions:
  playSamuelAnimation() {
    // For demonstration, let's just do a fade in/out effect, then start GameScene
    // You could also do something more elaborate, e.g. using sprite animations or tweens.
    this.cameras.main.fadeIn(500, 0, 0, 0); // fade in from black

    // After fade in completes, do a short delay, then fade out
    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
    });

    // When fade out completes, start the battle scene
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene', {
        pointsNeeded: this.pointsNeeded,
        rounds: this.rounds
      });
    });
  }

  playBrujaAnimation() {
    // Another example, maybe a quick "flash" effect
    this.cameras.main.flash(1000); // 1-second flash

    // Wait for a bit, then start the battle
    this.time.delayedCall(1200, () => {
      this.scene.start('GameScene', {
        pointsNeeded: this.pointsNeeded,
        rounds: this.rounds
      });
    });
  }

  playGemelosAnimation() {
    // Could be a tween or sprite-based animation
    // For example, place an image in the center, tween scale or alpha, etc.
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const gemelosSprite = this.add.sprite(centerX, centerY, 'transition_gemelos');
    gemelosSprite.setScale(0);

    // Tween scale from 0 to 1
    this.tweens.add({
      targets: gemelosSprite,
      scale: 1,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        // Then go to the battle scene
        this.scene.start('GameScene', {
          pointsNeeded: this.pointsNeeded,
          rounds: this.rounds
        });
      }
    });
  }

  playPadreAnimation() {
    // ...
    // Similar approach, then start GameScene
  }

  playPescadorAnimation() {
    // ...
    // Similar approach, then start GameScene
  }

  playDefaultAnimation() {
    // ...
    // Then start GameScene
  }
}
