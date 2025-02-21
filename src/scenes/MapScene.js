import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    //mapa
    const map = this.make.tilemap({ key: 'ciudadMap' }); 

    //tilesets
    // 4) Add each tileset by matching:
    //    map.addTilesetImage(<Tiled tileset name>, <Phaser key>)
    const texturasCiudad = map.addTilesetImage('texturas_ciudad', 'texturas_ciudad');

    const layerCalle = map.createLayer('suelo', [texturasCiudad], 0, 0);
    const layerAgua = map.createLayer('agua (solido)', [texturasCiudad], 0, 0);
    const layerAguaWalkable = map.createLayer('agua (walkable)', [texturasCiudad], 0, 0);
    const layerHierba = map.createLayer('hierba', [texturasCiudad], 0, 0);
    const layerDecoracionSuelo = map.createLayer('decoracion suelo (walkable)', [texturasCiudad], 0, 0);
    const layerEdificios1 = map.createLayer('edificios (solido)', [texturasCiudad], 0, 0);
    const layerEdificios2 = map.createLayer('decoracion paredes (solido)', [texturasCiudad], 0, 0);

    // Enable collisions for the "solido" layers
    layerAgua.setCollisionByExclusion([-1]);
    layerEdificios1.setCollisionByExclusion([-1]);
    layerEdificios2.setCollisionByExclusion([-1]);
    

    // -------------------------------------
    // 2) CREATE PLAYER (PHYSICS SPRITE)
    // -------------------------------------
    // We assume you've loaded the sprite sheets in BootScene as:
    //   this.load.spritesheet('playerIdle', 'assets/Idle.png', { frameWidth: 64, frameHeight: 64 });
    //   this.load.spritesheet('playerWalk', 'assets/Walk.png', { frameWidth: 64, frameHeight: 64 });
    // in your create() or preload() for that scene.

    // Define animations for idle
    this.anims.create({
      key: 'idle-up',
      frames: [{ key: 'playerIdle', frame: 0 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'idle-left',
      frames: [{ key: 'playerIdle', frame: 1 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'idle-down',
      frames: [{ key: 'playerIdle', frame: 2 }],
      frameRate: 1,
      repeat: -1
    });
    this.anims.create({
      key: 'idle-right',
      frames: [{ key: 'playerIdle', frame: 3 }],
      frameRate: 1,
      repeat: -1
    });

    // Define animations for walk
    // Walk.png is 512×256 => 8 columns × 4 rows = 32 frames
    //   Row 1 (frames 0..7): up
    //   Row 2 (frames 8..15): left
    //   Row 3 (frames 16..23): down
    //   Row 4 (frames 24..31): right
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('playerWalk', { start: 0, end: 7 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('playerWalk', { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('playerWalk', { start: 16, end: 23 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('playerWalk', { start: 24, end: 31 }),
      frameRate: 8,
      repeat: -1
    });

    // Create the player as a physics sprite
    this.player = this.physics.add.sprite(200, 500, 'playerIdle');
    this.player.setCollideWorldBounds(true); 
    this.player.play('idle-down'); // default

    // Adjust the hitbox to be just the bottom center of the sprite
    this.player.body.setSize(20, 28); // Set the size of the hitbox
    this.player.body.setOffset(22, 36); // Offset the hitbox to the bottom center

    // Add collision between the player and the "solido" layers
    this.physics.add.collider(this.player, layerAgua);
    this.physics.add.collider(this.player, layerEdificios1);
    this.physics.add.collider(this.player, layerEdificios2);

    // Keep track of last direction so we know which idle animation to show
    this.lastDirection = 'down';

    // -------------------------------------
    // 3) CAMERA FOLLOWS PLAYER
    // -------------------------------------
    // Set world bounds to match the tilemap’s size
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Set the camera zoom level (e.g., 2 for double zoom)
    this.cameras.main.setZoom(2);

    // Make the camera follow the player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // -------------------------------------
    // 4) KEY INPUTS
    // -------------------------------------
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });


    // Define animations for NPCs
    const npcNames = ['samuel', 'bruja', 'pescador', 'padre', 'gemelos'];
    npcNames.forEach(npc => {
      this.anims.create({
      key: `${npc}-idle-up`,
      frames: [{ key: `${npc}Idle`, frame: 0 }],
      frameRate: 1,
      repeat: -1
      });
      this.anims.create({
      key: `${npc}-idle-left`,
      frames: [{ key: `${npc}Idle`, frame: 1 }],
      frameRate: 1,
      repeat: -1
      });
      this.anims.create({
      key: `${npc}-idle-down`,
      frames: [{ key: `${npc}Idle`, frame: 2 }],
      frameRate: 1,
      repeat: -1
      });
      this.anims.create({
      key: `${npc}-idle-right`,
      frames: [{ key: `${npc}Idle`, frame: 3 }],
      frameRate: 1,
      repeat: -1
      });
    });

    // Create NPCs as animated sprites
    this.npc_samuel = this.add.sprite(256, 426, 'samuelIdle');
    this.npc_bruja = this.add.sprite(993, 434, 'brujaIdle');
    this.npc_pescador = this.add.sprite(206, 1025, 'pescadorIdle');
    this.npc_padre = this.add.sprite(1037, 787, 'padreIdle');
    this.npc_gemelos = this.add.sprite(1824, 966, 'gemelosIdle');

    this.npc_samuel.play('samuel-idle-down');
    this.npc_bruja.play('bruja-idle-down');
    this.npc_pescador.play('pescador-idle-down');
    this.npc_padre.play('padre-idle-down');
    this.npc_gemelos.play('gemelos-idle-down');

    this.npcArray = [this.npc_samuel, this.npc_bruja, this.npc_pescador, this.npc_padre, this.npc_gemelos];

    // Interact key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });

    const layerTejados1 = map.createLayer('tejados (walkable)', [
      texturasCiudad
    ], 0, 0);
    
    const layerTejados2 = map.createLayer('decoracion tejado (walkable)', [
      texturasCiudad
    ], 0, 0);
  }

  update() {
    const speed = 100;
    
    // Check which keys are down
    const up = this.cursors.up.isDown;
    const down = this.cursors.down.isDown;
    const left = this.cursors.left.isDown;
    const right = this.cursors.right.isDown;
  
    // Count how many directions are pressed
    const pressedCount = [up, down, left, right].filter(Boolean).length;
  
    // If exactly one direction is pressed, update our lastSingleDirection
    if (pressedCount === 1) {
      if (up) {
        this.lastSingleDirection = 'up';
      } else if (down) {
        this.lastSingleDirection = 'down';
      } else if (left) {
        this.lastSingleDirection = 'left';
      } else if (right) {
        this.lastSingleDirection = 'right';
      }
    } 
    // If zero are pressed, idle
    else if (pressedCount === 0) {
      this.player.setVelocity(0);
      // Use whichever idle animation corresponds to the lastSingleDirection
      this.player.play('idle-' + this.lastSingleDirection, true);
      return; // Stop here, so we don't set velocity again below
    }
  
    // If we get here, pressedCount >= 1
    // Move in the lastSingleDirection we have stored
    switch (this.lastSingleDirection) {
      case 'up':
        this.player.setVelocity(0, -speed);
        this.player.play('walk-up', true);
        break;
      case 'down':
        this.player.setVelocity(0, speed);
        this.player.play('walk-down', true);
        break;
      case 'left':
        this.player.setVelocity(-speed, 0);
        this.player.play('walk-left', true);
        break;
      case 'right':
        this.player.setVelocity(speed, 0);
        this.player.play('walk-right', true);
        break;
    }

        // Update NPCs to face the player
        this.npcArray.forEach(npc => {
          const angle = Phaser.Math.Angle.Between(npc.x, npc.y, this.player.x, this.player.y);
          if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
            npc.play(`${npc.texture.key.split('Idle')[0]}-idle-right`, true);
          } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
            npc.play(`${npc.texture.key.split('Idle')[0]}-idle-down`, true);
          } else if (angle >= -3 * Math.PI / 4 && angle < -Math.PI / 4) {
            npc.play(`${npc.texture.key.split('Idle')[0]}-idle-up`, true);
          } else {
            npc.play(`${npc.texture.key.split('Idle')[0]}-idle-left`, true);
          }
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
      // We'll store data in an object
      let transitionData = {};

      if (npc === this.npc_samuel) {
        this.scene.launch('Dialogos', {npc: 'Samuel', });
      } else if (npc === this.npc_bruja) {
        this.scene.launch('Dialogos', {npc: 'bruja', });
      } else if (npc === this.npc_gemelos) {
        this.scene.launch('Dialogos', {npc: 'gemelos', });
      } else if (npc === this.npc_padre) {
        this.scene.launch('Dialogos', {npc: 'padre', });
      } else if (npc === this.npc_pescador) {
        this.scene.launch('Dialogos', {npc: 'pescador', });
      }

      this.scene.bringToTop('Dialogos');    }
    });
  }
}

