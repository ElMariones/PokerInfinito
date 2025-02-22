import Phaser from 'phaser';
import Player from '../utils/Player.js';

export default class MapRincon extends Phaser.Scene {
  constructor() {
    super('MapRincon');
  }

  create() {
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

    const layerDecoracion = map.createLayer('auxiliar', [texturasDecoracion, texturasInterior], 0, 0);
    
  }

  update() {
    // Actualizar lógica del jugador
    this.player.update();
  }

  tryInteract() {
    // Lógica de interacción (si es necesaria)
    console.log("Intentando interactuar...");
  }
}