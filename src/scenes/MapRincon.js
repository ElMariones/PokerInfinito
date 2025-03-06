import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';

export default class MapRincon extends Phaser.Scene {
  constructor() {
    super('MapRincon');
  }

  create(data) {
    this.registry.set('currentMap', this.scene.key);

    const startX = data?.spawnX ?? 317;
    const startY = data?.spawnY ?? 586;
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Mapa
    const map = this.make.tilemap({ key: 'rinconBandidoMap' });

    // Tilesets
    const texturasSuelosParedes = map.addTilesetImage('floors', 'floors');
    const texturasDecoracion = map.addTilesetImage('tavern-deco', 'tavernDeco');
    const texturasInterior = map.addTilesetImage('Interior', 'interior');
    const texturasRpg = map.addTilesetImage('rpg', 'rpg');

    // Capas del mapa
    const layerSuelos = map.createLayer('suelo', texturasSuelosParedes, 0, 0);
    const layerPared = map.createLayer('pared', texturasSuelosParedes, 0, 0);
    const layerMobiliario = map.createLayer('mobiliario', [texturasDecoracion, texturasSuelosParedes, texturasRpg, texturasInterior], 0, 0);
  

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

    const layerDecoracion = map.createLayer('auxiliar', [texturasDecoracion, texturasInterior], 0, 0);

    // -------------------------------------
    // Interacción con tecla E
    // -------------------------------------
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });

    
    this.doorManager = new DoorManager(this, [
      { x: 956, y: 928, toScene: 'MapScene', spawnX: 1843, spawnY: 956 },
      // Agrega más puertas según sea necesario
    ]);
  }

  update() {
    console.log(`Jugador en X: ${this.player.x}, Y: ${this.player.y}`);
    this.player.update();
    this.doorManager.update(this.player);
  }

  tryInteract() {
    // Lógica de interacción (si es necesaria)
    console.log("Intentando interactuar...");
  }
}