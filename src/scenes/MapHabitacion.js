import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';
import NPCManager from '../utils/NPCManager.js';

export default class MapHabitacion extends Phaser.Scene {
  constructor() {
    super('MapHabitacion');
  }

  create(data) {
    this.registry.set('currentMap', this.scene.key);

    // 1) Read optional spawn data (in case we're coming from another scene)
    const startX = data?.spawnX ?? 200;
    const startY = data?.spawnY ?? 500;

    // 2) Load your Tilemap and Tilesets
    const map = this.make.tilemap({ key: 'habitacionMap' });
                                    //              tiledset    boot
    const texturasBookShelf = map.addTilesetImage('bookShelf', 'bookShelf');
    const texturasDrawerShelf = map.addTilesetImage('drawerShelf', 'drawerShelf');
    const texturasHabitacionInside1 = map.addTilesetImage('habitacionInside1', 'habitacionInside1');
    const texturasSuelos = map.addTilesetImage('suelos', 'suelos');
    const texturasParedes = map.addTilesetImage('paredes', 'paredes');
    const texturasHabitacionInside2 = map.addTilesetImage('habitacionInside2', 'habitacionInside2');
    const texturasTV = map.addTilesetImage('TV', 'TV');
    const texturasWindows = map.addTilesetImage('windows', 'windows');
    const texturasTVBig = map.addTilesetImage('TVBig', 'TVBig');

    // 3) Create layers
// 3) Crear capas

const todosLosTilesets = [
  texturasBookShelf,
  texturasDrawerShelf,
  texturasHabitacionInside1,
  texturasSuelos,
  texturasParedes,
  texturasHabitacionInside2,
  texturasTV,
  texturasWindows,
  texturasTVBig
];

const layerSuelo = map.createLayer('suelo', todosLosTilesets, 0, 0);
const layerPared = map.createLayer('wall', todosLosTilesets, 0, 0);
const layerDecoracionPared = map.createLayer('walldecoration', todosLosTilesets, 0, 0);
const layerVentanas = map.createLayer('windows', todosLosTilesets, 0, 0);
const layerMobiliario = map.createLayer('furniture', todosLosTilesets, 0, 0);
const layerEncimaMobiliario = map.createLayer('onTopOfFurniture', todosLosTilesets, 0, 0);
// 4) Set collisions
layerPared.setCollisionByExclusion([-1]);
layerMobiliario.setCollisionByExclusion([-1]);
layerEncimaMobiliario.setCollisionByExclusion([-1]);


    // 5) Player logic
    Player.createPlayerAnimations(this);
    // Create player at the specified (or default) position
    this.player = new Player(this, startX, startY, 'playerIdle');

// 4b) Add physics collisions
this.physics.add.collider(this.player, layerPared);
this.physics.add.collider(this.player, layerMobiliario);
this.physics.add.collider(this.player, layerEncimaMobiliario);

    // Camera settings
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(4);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);

    // Music
    if (this.scene.sound) {
      this.scene.sound.stopAll();
    }
     this.music = this.sound.add('asadorMusic', { volume: 0.5, loop: true });
     this.music.play();

     this.doorManager = new DoorManager(this, [
        {
          x: 150, // misma x del spawn
          y: 240, // misma y del spawn
          toScene: 'MapCocinaDante',
          spawnX: 726,
          spawnY: 260
        }
      ], this.music);
      

    //this.npcManager = new NPCManager(this, [layerPared, layerMobiliario], this.player)
    //this.npcManager.createAnimations()

    //this.npcArray = this.npcManager.getAllNPCs()

    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract()
    });
  }

  update() {
    this.player.update();
    //this.npcManager.updateNPCs();
    this.doorManager.update(this.player);
  }

  tryInteract() {
    if (this.doorManager.nearestDoor) {
      this.doorManager.tryInteract(); // Delegamos la interacción con puertas
      return; // Si hay una puerta, no se verifica lo de los NPCs
    }
    
    //this.npcManager.tryInteract();
  }
}
