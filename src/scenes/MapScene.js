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
    const flowersTileset            = map.addTilesetImage('flowers', 'flowers');
    const mushroomsTileset          = map.addTilesetImage('mushrooms', 'mushrooms');
    const plantsWinterTileset       = map.addTilesetImage('plants_winter', 'plantsWinter');
    const treesAutumnTileset        = map.addTilesetImage('trees_autumn', 'treesAutumn');
    const ladderTileset             = map.addTilesetImage('Ladder', 'ladder');
    const lightingOutdoorsTileset   = map.addTilesetImage('Lighting, Outdoors', 'lightingOutdoors');
    const sawhorseTileset           = map.addTilesetImage('Sawhorse', 'Sawhorse');
    const shelfTileset              = map.addTilesetImage('Shelf', 'shelf');
    const barrelTileset             = map.addTilesetImage('Barrel', 'barrel');
    const grindstoneTileset         = map.addTilesetImage('Grindstone', 'grindstone');
    const flowers2Tileset           = map.addTilesetImage('Flowers', 'flowers2'); // note the capital F
    const lumberTileset             = map.addTilesetImage('Lumber', 'Lumber');
    const skeletonsATileset1        = map.addTilesetImage('Skeletons A', 'skeletons'); 
    // Tiled lists "Skeletons A" more than once, so you may only need to do it once in Phaser:
    const skeletonsATileset2        = map.addTilesetImage('Skeletons A', 'skeletons'); 

    const christmasWallDecorTileset1= map.addTilesetImage('Christmas Wall Decor', 'christmasWallDecor');
    // Another "Christmas Wall Decor" entry in Tiled, but same name:
    const christmasWallDecorTileset2= map.addTilesetImage('Christmas Wall Decor', 'christmasWallDecor');

    const castle8darkTileset        = map.addTilesetImage('castle8dark', 'castle8dark');
    const castleExtrasTileset       = map.addTilesetImage('castle-extras', 'castleExtras');
    const conifersTileset           = map.addTilesetImage('conifers', 'conifers');
    const cropsTileset              = map.addTilesetImage('crops', 'crops');
    const exteriorTilesTileset      = map.addTilesetImage('Exterior Tiles', 'exteriortiles');
    const farmingFishingTileset     = map.addTilesetImage('farming_fishing', 'farmingFishing');
    const insideBTileset            = map.addTilesetImage('Inside_B', 'insideB');
    const interiorTileset           = map.addTilesetImage('Interior', 'interior');
    const objMiskAtlasTileset       = map.addTilesetImage('obj_misk_atlas', 'obj_misk_atlas');
    const orangetreesTileset        = map.addTilesetImage('orangetrees', 'orangetrees');
    const outsideObjectsTileset     = map.addTilesetImage('Outside Objects', 'outsideObjects');
    const outsideBTileset           = map.addTilesetImage('Outside_B', 'outsideB');
    const signpostOutsideTileset    = map.addTilesetImage('signpost-outsidestuff', 'signpostOutside');
    const streetTileset             = map.addTilesetImage('street', 'street');
    const streetMiscTileset         = map.addTilesetImage('street_misc', 'street_misc');
    const tavernCookingTileset      = map.addTilesetImage('tavern-cooking', 'tavernCooking');
    const terrainOutsideTileset     = map.addTilesetImage('Terrain and Outside', 'terrainOutside');
    const terrainAtlasTileset       = map.addTilesetImage('terrain_atlas', 'terrainAtlas');
    const townBuildingsTileset      = map.addTilesetImage('town_buildings', 'townBuildings');
    const victorianHouseTileset     = map.addTilesetImage('victorian house', 'victorianHouse');
    const adobeBrickRoofTileset     = map.addTilesetImage('Adobe Brick Roof', 'adobeBrickRoof');
    const barnTileset               = map.addTilesetImage('barn', 'barn');
    const baseOutAtlasTileset       = map.addTilesetImage('base_out_atlas', 'baseOutAtlas');
    const blacksmithSmelterTileset  = map.addTilesetImage('blacksmith-smelter', 'blacksmithSmelter');
    const brickWallBlockEdgingTileset = map.addTilesetImage('Brick Wall Block Edging', 'brickWallBlockEdging');
    const buildAtlasTileset         = map.addTilesetImage('build_atlas', 'buildAtlas');
    const olvido3Tileset           = map.addTilesetImage('olvido3', 'olvido3');
    const olvidooooTileset         = map.addTilesetImage('olvidoooo', 'olvidoooo');
    const cartelinesTileset         = map.addTilesetImage('cartelines', 'cartelines');


    //layers


// 1) calle (walkable) => uses "street"
const layerCalle = map.createLayer('calle (walkable)', [
  streetTileset
], 0, 0);
// No collision for walkable
// layerCalle.setCollisionByProperty({ isSolid: false }); // optional

// 2) verde (walkable) => uses baseOutAtlas, terrainOutside, castle8dark
const layerVerde = map.createLayer('verde (walkable)', [
  baseOutAtlasTileset,
  terrainOutsideTileset,
  castle8darkTileset
], 0, 0);
// No collision for walkable

// 3) agua (solid) => uses baseOutAtlas
const layerAgua = map.createLayer('agua (solida)', [
  baseOutAtlasTileset
], 0, 0);
//layerAgua.setCollisionByProperty({ isSolid: true });

// 4) conos (solida) => uses street_misc, conifers
const layerConos = map.createLayer('conos (solida)', [
  streetMiscTileset,
  conifersTileset
], 0, 0);
//layerConos.setCollisionByProperty({ isSolid: true });

// 5) cesped (walkable) => uses baseOutAtlas, outsideObjects, flowers, flowers2, crops, mushrooms, terrainOutside, castle8dark
const layerCesped = map.createLayer('cesped (walkable)', [
  baseOutAtlasTileset,
  outsideObjectsTileset,
  flowersTileset,
  flowers2Tileset,
  cropsTileset,
  mushroomsTileset,
  terrainOutsideTileset,
  castle8darkTileset
], 0, 0);
// No collision for walkable

// 6) varios (solid) => uses outsideB, signpostOutside, buildAtlas, farmingFishing, shelf, exteriortiles, brickWallBlockEdging, conifers, blacksmithSmelter, baseOutAtlas, tavernCooking, lightingOutdoors, objMiskAtlas, orangetrees, cartelines
const layerVarios = map.createLayer('varios (solid)', [
  outsideBTileset,
  signpostOutsideTileset,
  buildAtlasTileset,
  farmingFishingTileset,
  shelfTileset,
  exteriorTilesTileset,
  brickWallBlockEdgingTileset,
  conifersTileset,
  blacksmithSmelterTileset,
  baseOutAtlasTileset,
  tavernCookingTileset,
  lightingOutdoorsTileset,
  objMiskAtlasTileset,
  orangetreesTileset,
  cartelinesTileset,
  adobeBrickRoofTileset
], 0, 0);
//layerVarios.setCollisionByProperty({ isSolid: true });

// 7) madera puerto (solid) => uses farmingFishing, outsideB
const layerMaderaPuerto = map.createLayer('madera puerto (walkable)', [
  farmingFishingTileset,
  outsideBTileset
], 0, 0);
//layerMaderaPuerto.setCollisionByProperty({ isSolid: true });

// 8) varios 2 (solid) => uses terrainAtlas, castle8dark, farmingFishing, townBuildings, victorianHouse, treesAutumn, buildAtlas, cartelines, exteriortiles
const layerVarios2 = map.createLayer('varios 2 (solid)', [
  terrainAtlasTileset,
  castle8darkTileset,
  farmingFishingTileset,
  townBuildingsTileset,
  victorianHouseTileset,
  treesAutumnTileset,
  buildAtlasTileset,
  cartelinesTileset,
  exteriorTilesTileset,
  conifersTileset
], 0, 0);
//layerVarios2.setCollisionByProperty({ isSolid: true });

// 9) varios 3 (solid) => uses lightingOutdoors, objMiskAtlas, outsideObjects, insideB, grindstone, blacksmithSmelter, interior, farmingFishing, castle8dark, castleExtras, conifers, baseOutAtlas, buildAtlas, exteriortiles
const layerVarios3 = map.createLayer('varios 3 (solid)', [
  lightingOutdoorsTileset,
  objMiskAtlasTileset,
  outsideObjectsTileset,
  insideBTileset,
  grindstoneTileset,
  blacksmithSmelterTileset,
  interiorTileset,
  farmingFishingTileset,
  castle8darkTileset,
  castleExtrasTileset,
  conifersTileset,
  baseOutAtlasTileset,
  buildAtlasTileset,
  exteriorTilesTileset
], 0, 0);
//layerVarios3.setCollisionByProperty({ isSolid: true });

// 10) varios 4 (solid) => uses barn, barrel, farmingFishing, conifers, ladder, terrainAtlas, objMiskAtlas, Lumber, plantsWinter
const layerVarios4 = map.createLayer('varios 4 (solid)', [
  barnTileset,
  barrelTileset,
  farmingFishingTileset,
  conifersTileset,
  ladderTileset,
  terrainAtlasTileset,
  objMiskAtlasTileset,
  lumberTileset,
  plantsWinterTileset,
  olvido3Tileset
], 0, 0);
//layerVarios4.setCollisionByProperty({ isSolid: true });

// 11) varios 5 (solid) => uses olvidoooo, skeletons, conifers
const layerVarios5 = map.createLayer('varios 5 (solid)', [
  olvidooooTileset,
  skeletonsATileset1,
  conifersTileset
], 0, 0);
//layerVarios5.setCollisionByProperty({ isSolid: true });

// 12) varios 6 (solid) => uses conifers
const layerVarios6 = map.createLayer('varios 6 (solid)', [
  conifersTileset
], 0, 0);
//layerVarios6.setCollisionByProperty({ isSolid: true });

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
      frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 2 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'idle-left',
      frames: this.anims.generateFrameNumbers('playerIdle', { start: 3, end: 5 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'idle-down',
      frames: this.anims.generateFrameNumbers('playerIdle', { start: 6, end: 8 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'idle-right',
      frames: this.anims.generateFrameNumbers('playerIdle', { start: 9, end: 11 }),
      frameRate: 6,
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
    this.player = this.physics.add.sprite(100, 200, 'playerIdle');
    this.player.setCollideWorldBounds(true); 
    this.player.play('idle-down'); // default

    // Keep track of last direction so we know which idle animation to show
    this.lastDirection = 'down';

    // -------------------------------------
    // 3) CAMERA FOLLOWS PLAYER
    // -------------------------------------
    // Set world bounds to match the tilemap’s size
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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

    // 5) Create NPCs as images (optional)
    //    Using static images as in your original code
    this.npc1 = this.add.image(300, 200, 'npc1').setScale(0.1);
    this.npc2 = this.add.image(500, 300, 'npc2').setScale(0.1);
    this.npc3 = this.add.image(700, 200, 'npc3').setScale(0.1);
    this.npcArray = [this.npc1, this.npc2, this.npc3];

    // Interact key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });
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
        // Identify which NPC we are near, then start a scene or do something
        if (npc === this.npc1) {
          this.scene.start('GameScene', { pointsNeeded: 100, rounds: 5 });
        } else if (npc === this.npc2) {
          this.scene.start('GameScene', { pointsNeeded: 400, rounds: 5 });
        } else if (npc === this.npc3) {
          this.scene.start('GameScene', { pointsNeeded: 500, rounds: 2 });
        }
      }
    });
  }
}

