import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';
import NPCManager from '../utils/NPCManager.js';

export default class MapOlvido extends Phaser.Scene {
  constructor() {
    super('MapOlvido');
  }

  create(data) {
    this.registry.set('currentMap', this.scene.key);

    const startX = data?.spawnX ?? 317;
    const startY = data?.spawnY ?? 586;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Mapa
    const map = this.make.tilemap({ key: 'cavernaOlvidoMap' });

    // Tilesets
    const texturasBoil = map.addTilesetImage('boil', 'boil');
    const texturasSuelosParedes = map.addTilesetImage('floors', 'floors');
    const texturasMobiliario = map.addTilesetImage('dark-wood', 'darkWood');
    const texturasDecoracion = map.addTilesetImage('tavern-deco', 'tavernDeco');
    const texturasDungeon = map.addTilesetImage('dungeonex', 'dungeon');

    // Capas del mapa
    const layerSuelos = map.createLayer('suelo', texturasDungeon, 0, 0);
    const layerPisable = map.createLayer('pisable', [texturasSuelosParedes, texturasDungeon], 0, 0);
    const layerPared = map.createLayer('pared', texturasSuelosParedes, 0, 0);
    const layerMobiliario = map.createLayer('moviliario', [texturasDecoracion, texturasSuelosParedes, texturasDungeon], 0, 0);
  

    // Habilitar colisiones en las capas sólidas
    layerPared.setCollisionByExclusion([-1]);
    layerMobiliario.setCollisionByExclusion([-1]);

    // -------------------------------------
    // Lógica del Jugador
    // -------------------------------------
    // 1) Crear animaciones del jugador
    Player.createPlayerAnimations(this);

    // 2) Crear el jugador
    this.player = new Player(this, startX, startY, 'playerIdle');

    // 3) Colisiones con las capas del mapa
    this.physics.add.collider(this.player, layerPared);
    this.physics.add.collider(this.player, layerMobiliario);

    // 4) Cámara sigue al jugador
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2); // Zoom in a bit
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // La cámara no puede salir de los límites
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // El jugador no puede salir de los límites
    this.player.setCollideWorldBounds(true); // El jugador no puede salir de los límites

    const layerDecoracion = map.createLayer('auxiliar', [texturasMobiliario, texturasDecoracion, texturasBoil], 0, 0);

    // -------------------------------------
    // Interacción con tecla E
    // -------------------------------------
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });

    // NPCs
    this.npcManager = new NPCManager(this, [layerPared, layerMobiliario], this.player);
    this.npcManager.createAnimations();
    const helena = this.npcManager.addNPC('helena', 177, 120, 'idle-down', false);
    const pelirrojo = this.npcManager.addNPC('pelirrojo', 401, 380, 'idle-down', true);
    this.npcArray = this.npcManager.getAllNPCs();

    this.songs = [];
    if (this.registry.get('musicEnabled') === true) {
      this.music = this.sound.add('olvidoMusic', { volume: 0.6, loop: true });
      this.songs.push(this.music);
      this.music.play();
    }

    this.doorManager = new DoorManager(this, [
      { x: 320, y: 614, toScene: 'MapScene', spawnX: 720, spawnY: 1756 },
      // Agrega más puertas según sea necesario
    ], this.music);
}

  update() {
    this.player.update();
    this.npcManager.updateNPCs();
    this.doorManager.update(this.player);
  }

  tryInteract() {
    if (this.doorManager.nearestDoor) {
      this.doorManager.tryInteract(); // Delegate door interaction
      return; // If there is a door, don’t check NPC interaction
    }
    this.npcManager.tryInteract();
  }
}