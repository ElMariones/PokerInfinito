import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';
import NPCManager from '../utils/NPCManager.js';

export default class MapPuerto extends Phaser.Scene {
  constructor() {
    super('MapPuerto');
  }

  create(data) {
    this.registry.set('currentMap', this.scene.key);

    const startX = data?.spawnX ?? 317;
    const startY = data?.spawnY ?? 586;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Mapa
    const map = this.make.tilemap({ key: 'puertoAzulMap' });

    // Tilesets
    const texturasSuelosParedes = map.addTilesetImage('floors', 'floors');
    const texturasMobiliario = map.addTilesetImage('dark-wood', 'darkWood');
    const texturasDecoracion = map.addTilesetImage('tavern-deco', 'tavernDeco');

    // Capas del mapa
    const layerSuelos = map.createLayer('suelo', texturasSuelosParedes, 0, 0);
    const layerPisable = map.createLayer('pisable', [texturasSuelosParedes, texturasDecoracion, texturasMobiliario], 0, 0);
    const layerPared = map.createLayer('pared', texturasSuelosParedes, 0, 0);
    const layerMobiliario = map.createLayer('mobiliario', [texturasMobiliario, texturasDecoracion, texturasSuelosParedes], 0, 0);

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

    // La capa 'auxiliar' debe crearse antes del DoorManager
    const layerDecoracion = map.createLayer('auxiliar', [texturasMobiliario, texturasDecoracion], 0, 0);

    // -------------------------------------
    // Interacción con tecla E
    // -------------------------------------
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });

    // NPCs
    this.npcManager = new NPCManager(this, [layerPared, layerMobiliario], this.player);
    this.npcManager.createAnimations();
    const pescador = this.npcManager.addNPC('pescador', 370, 291, 'idle-down', true);
    this.npcArray = this.npcManager.getAllNPCs();

    //Music
    this.songs = [];
    if (this.registry.get('musicEnabled') === true) {
      this.rainAudio = this.sound.add('ocean', { volume: 0.2, loop: true });
      this.songs.push(this.rainAudio);
      this.rainAudio.play();
      this.music = this.sound.add('puertoMusic', { volume: 0.6, loop: true });
      this.songs.push(this.music);
      this.music.play();
    }

    // Inicializar el DoorManager después de todas las capas
    this.doorManager = new DoorManager(this, [
      { x: 478, y: 608, toScene: 'MapScene', spawnX: 1920, spawnY: 444 },
      // Agrega más puertas según sea necesario
    ], this.songs);
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
