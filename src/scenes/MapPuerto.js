import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';

export default class MapPuerto extends Phaser.Scene {
  constructor() {
    super('MapPuerto');
  }

  create() {
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
     // La capa 'auxiliar' debe crearse antes del DoorManager
     const layerDecoracion = map.createLayer('auxiliar', [texturasMobiliario, texturasDecoracion], 0, 0);

    // -------------------------------------
    // Lógica del Jugador
    // -------------------------------------
    // 1) Crear animaciones del jugador
    Player.createPlayerAnimations(this);

    // 2) Crear el jugador
    this.player = new Player(this, 200, 500, 'playerIdle');

    // 3) Colisiones con las capas del mapa
    this.physics.add.collider(this.player, layerPared);
    this.physics.add.collider(this.player, layerMobiliario);

    // 4) Cámara sigue al jugador
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2); // Zoom in a bit
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // La cámara no puede salir de los límites
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // El jugador no puede salir de los límites
    this.player.setCollideWorldBounds(true); // El jugador no puede salir de los límites

    // -------------------------------------
    // Interacción con tecla E
    // -------------------------------------
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });

   

    // Inicializar el DoorManager después de todas las capas
    this.doorManager = new DoorManager(this, [
      { x: 478, y: 608, toScene: 'MapScene', spawnX: 195, spawnY: 956 },
      // Agrega más puertas según sea necesario
    ]);
  }

  update() {
    this.player.update();
    this.doorManager.update(this.player);
  }

  tryInteract() {
    // Lógica de interacción (si es necesaria)
    console.log("Intentando interactuar...");
  }
}
