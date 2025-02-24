import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';

export default class MapAsador extends Phaser.Scene {
  constructor() {
    super('MapAsador');
  }

  create(data) {
    // 1) Read optional spawn data (in case we're coming from another scene)
    const startX = data?.spawnX ?? 200;
    const startY = data?.spawnY ?? 500;

    // 2) Load your Tilemap and Tilesets
    const map = this.make.tilemap({ key: 'asadorReyMap' });
    const texturasSuelosParedes = map.addTilesetImage('floors', 'floors');
    const texturasMobiliario = map.addTilesetImage('dark-wood', 'darkWood');
    const texturasDecoracion = map.addTilesetImage('tavern-deco', 'tavernDeco');
    const texturasCocina = map.addTilesetImage('tavern-cooking', 'tavernCooking');

    // 3) Create layers
    const layerSuelos = map.createLayer('suelo', texturasSuelosParedes, 0, 0);
    const layerPisable = map.createLayer('pisable', [texturasSuelosParedes, texturasDecoracion, texturasMobiliario], 0, 0);
    const layerPared = map.createLayer('pared', texturasSuelosParedes, 0, 0);
    const layerMobiliario = map.createLayer('mobiliario', [texturasMobiliario, texturasDecoracion, texturasCocina, texturasSuelosParedes], 0, 0);
    const layerDecoracion = map.createLayer('auxiliar', [texturasMobiliario, texturasDecoracion, texturasCocina], 0, 0);

    // 4) Set collisions
    layerPared.setCollisionByExclusion([-1]);
    layerMobiliario.setCollisionByExclusion([-1]);

    // 5) Player logic
    Player.createPlayerAnimations(this);
    // Create player at the specified (or default) position
    this.player = new Player(this, startX, startY, 'playerIdle');

    // Collisions with the solid layers
    this.physics.add.collider(this.player, layerPared);
    this.physics.add.collider(this.player, layerMobiliario);

    // Camera settings
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);

    this.doorManager = new DoorManager(this, [
      { x: 320, y: 614, toScene: 'MapScene', spawnX: 255, spawnY: 365 },
      // Agrega más puertas según sea necesario
    ]);
  }

  update() {
    this.player.update();
    this.doorManager.update(this.player);
  }
}
