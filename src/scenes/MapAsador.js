import Phaser from 'phaser';
import Player from '../utils/Player.js';

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

    // 6) Doors array: define the spots where you can exit/enter other maps
    this.doors = [
      {
        x: 320,      // X position of door in Asador
        y: 614,      // Y position of door in Asador
        toScene: 'MapScene',  // Scene to go to
        spawnX: 255, // Where the player appears in the next scene
        spawnY: 365
      }
      // Add more doors if needed
    ];

    // We'll store the "E" icon here if the player is near a door
    this.doorInteractUI = null;

    // 7) Listen for "E" key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });
  }

  update() {
    // Update player movement
    this.player.update();

    // Check if the player is near any door
    const interactDistance = 50;
    let nearestDoor = null;
    let minDist = Infinity;

    this.doors.forEach(door => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        door.x, door.y
      );
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        nearestDoor = door;
      }
    });

    // Show/hide the "E" icon if there's a door in range
    if (nearestDoor) {
      if (!this.doorInteractUI) {
        // Create the sprite above the door
        this.doorInteractUI = this.add.image(nearestDoor.x, nearestDoor.y - 20, 'interactKey');
        this.doorInteractUI.setScale(0.07);
        this.doorInteractUI.setDepth(9999);
      } else {
        this.doorInteractUI.setPosition(nearestDoor.x, nearestDoor.y - 20);
        this.doorInteractUI.setVisible(true);
        this.doorInteractUI.setDepth(9999);
      }
    } else {
      if (this.doorInteractUI) {
        this.doorInteractUI.setVisible(false);
      }
    }
  }

  tryInteract() {
    // When pressing E, check if we are close enough to any door
    const interactDistance = 50;
    let doorToUse = null;
    let minDist = Infinity;

    this.doors.forEach(door => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        door.x, door.y
      );
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        doorToUse = door;
      }
    });

    // If we found a door in range, switch scenes
    if (doorToUse) {
      this.scene.start(doorToUse.toScene, {
        // Pass where we want to spawn in the next scene
        spawnX: doorToUse.spawnX,
        spawnY: doorToUse.spawnY,
        // Optional: store from which scene we came
        fromScene: 'MapAsador'
      });
      return;
    }

    // If there's no door in range, do other interactions if needed
    console.log("Nada para interactuar en este momento.");
  }
}
