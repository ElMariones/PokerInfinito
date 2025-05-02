import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';
import NPCManager from '../utils/NPCManager.js';

export default class MapCocinaDante extends Phaser.Scene {
  constructor() {
    super('MapCocinaDante');
  }

  create(data) {
    this.registry.set('currentMap', this.scene.key);

    // 1) Read optional spawn data (in case we're coming from another scene)
    const startX = data?.spawnX ?? 200;
    const startY = data?.spawnY ?? 500;

    // 2) Load your Tilemap and Tilesets
    const map = this.make.tilemap({ key: 'cocinaDanteMap' });
    const texturasSuelos = map.addTilesetImage('suelos', 'suelos');
    const texturasParedes = map.addTilesetImage('paredes', 'paredes');
    const texturasParedes2 = map.addTilesetImage('walls', 'paredes2');
    const texturasMobiliario = map.addTilesetImage('Muebles', 'muebles');
    const texturasInterior = map.addTilesetImage('Interior', 'interior2'); //siempre encima de los muebles, no me importa

    // 3) Create layers
    const layerSuelos = map.createLayer('Suelo', [texturasSuelos, texturasInterior], 0, 0);
    const layerPared = map.createLayer('Paredes', [texturasParedes, texturasParedes2], 0, 0);
    const layerMobiliario = map.createLayer('muebles', [texturasMobiliario, texturasInterior], 0, 0);
    const layerAdornos = map.createLayer('Adornos', [texturasInterior, texturasMobiliario], 0, 0);

    // 4) Set collisions
    layerSuelos.setCollisionByProperty({}); // Vacío: ningún tile cumple con ninguna propiedad, así que nada colisiona
    layerAdornos.setCollisionByProperty({});
    layerPared.setCollisionByExclusion([-1]);
    layerMobiliario.setCollisionByExclusion([-1]);

    // 5) Player logic
    Player.createPlayerAnimations(this);
    // Create player at the specified (or default) position
    this.player = new Player(this, startX, startY, 'playerIdle');

    // Collisions with the solid layers
    this.physics.add.collider(this.player, layerPared);
    this.physics.add.collider(this.player, layerMobiliario);

    layerMobiliario.setDepth(1); // o cualquier valor más bajo
    layerAdornos.setDepth(999); // para que esté por encima de Dante
    this.player.setDepth(this.player.y); // para que el jugador quede "entre" los layers correctamente

   
    // Camera settings
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);

    // Music
    this.songs = [];
    if (this.registry.get('musicEnabled') === true) {
      this.music = this.sound.add('cocinaMusic', { volume: 0.6, loop: true });
      this.songs.push(this.music);
      this.music.play();
    }
    this.doorManager = new DoorManager(this, [
      { x: 726, y: 470, toScene: 'MapScene', spawnX: 187, spawnY: 2448 },
      { 
        x: 726, 
        y: 260, 
        toScene: 'MapHabitacion', 
        spawnX: 150,  // Cambiado para que aparezca justo cerca de la puerta
        spawnY: 240 
      }
            // Agrega más puertas según sea necesario
    ], this.music);

    this.npcManager = new NPCManager(this, [layerPared, layerMobiliario], this.player)
    this.npcManager.createAnimations()
    const madre = this.npcManager.addNPC('madre', 400, 408, 'idle-down', true)

    this.npcArray = this.npcManager.getAllNPCs()

    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract()
    });
  }

  update() {
    this.player.update();
    this.npcManager.updateNPCs();
    this.doorManager.update(this.player);
  }

  tryInteract() {
    if (this.doorManager.nearestDoor) {
      this.doorManager.tryInteract(); // Delegamos la interacción con puertas
      return; // Si hay una puerta, no se verifica lo de los NPCs
    }
    this.npcManager.tryInteract();
  }
}
