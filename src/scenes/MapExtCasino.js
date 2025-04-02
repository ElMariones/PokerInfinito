import Phaser from 'phaser'
import NPCManager from '../utils/NPCManager.js'
import Player from '../utils/Player.js'
import DoorManager from '../utils/DoorManager.js'

export default class MapExtCasino extends Phaser.Scene {
  constructor() {
    super('MapExtCasino')
  }

  // Accept optional data with spawnX/spawnY
  create(data) {
    // Register this map as the current active map
    this.registry.set('currentMap', this.scene.key);
    // Launch the UI overlay on top of this scene
    this.scene.launch('UIOverlay');

    // 1) Read spawn coordinates from data, or use defaults
    const startX = data?.spawnX ?? 1199
    const startY = data?.spawnY ?? 2530

    // 2) Create the tilemap
    const map = this.make.tilemap({ key: 'extCasinoMap' })

    // tilesets
    const texturasCiudad = map.addTilesetImage('texturas_ciudad', 'texturas_ciudad')

    // Create layers
    const layerCalle = map.createLayer('suelo', [texturasCiudad], 0, 0)
    const layerAgua = map.createLayer('agua (solido)', [texturasCiudad], 0, 0)
    const layerAguaWalkable = map.createLayer('agua (walk)', [texturasCiudad], 0, 0)
    const layerHierba = map.createLayer('decoracion (walk)', [texturasCiudad], 0, 0)
    const layerDecoracionSuelo = map.createLayer('edificio (solido)', [texturasCiudad], 0, 0)
    const layerEdificios1 = map.createLayer('farola (solido)', [texturasCiudad], 0, 0)
    const layerEdificios2 = map.createLayer('edificio decoracion (solido)', [texturasCiudad], 0, 0)

    // 4) Player logic
    Player.createPlayerAnimations(this);
    // Create the player at the chosen spawn coords
    this.player = new Player(this, startX, startY, 'playerIdle');

    const layerTejados1 = map.createLayer('tejado (walkable)', [texturasCiudad], 0, 0)
    const layerTejados2 = map.createLayer('tejado 2 (walkable)', [texturasCiudad], 0, 0)

    // Enable collisions for solid layers
    layerAgua.setCollisionByExclusion([-1])
    layerDecoracionSuelo.setCollisionByExclusion([-1])
    layerEdificios1.setCollisionByExclusion([-1])
    layerEdificios2.setCollisionByExclusion([-1])

    // 2.1) Enable the Lights plugin for dynamic lighting
    this.lights.enable().setAmbientColor(0x888888); // Brighter ambient color
    layerCalle.setPipeline('Light2D');
    layerAgua.setPipeline('Light2D');
    layerAguaWalkable.setPipeline('Light2D');
    layerHierba.setPipeline('Light2D');
    layerDecoracionSuelo.setPipeline('Light2D');
    layerEdificios1.setPipeline('Light2D');
    layerEdificios2.setPipeline('Light2D');
    layerTejados1.setPipeline('Light2D');
    layerTejados2.setPipeline('Light2D');
    this.player.setPipeline('Light2D');

    // 2.2) Add lights based on the "luz" object layer from Tiled
    const luzLayer = map.getObjectLayer('luz');
    // Ensure the layer is visible (for debugging if needed)
    luzLayer.visible = true;
    
    // Create an array to hold references for flickering
    this.flickerLights = [];
    
    if (luzLayer && luzLayer.objects) {
      luzLayer.objects.forEach(lightObj => {
        // Use the center of the object if width/height are provided
        const lightX = lightObj.width ? lightObj.x + lightObj.width / 2 : lightObj.x;
        const lightY = lightObj.height ? lightObj.y + lightObj.height / 2 : lightObj.y;
        // Add a light at this position with a radius of 300, a warm color, and a lower intensity
        const newLight = this.lights.addLight(lightX, lightY, 300, 0xffee88, 0.2);
        this.flickerLights.push(newLight);
      });
    }

    // New section for neon blue ("azul") lights:
const azulLayer = map.getObjectLayer('azul');
if (azulLayer && azulLayer.objects) {
  // Optionally, create an array to hold these lights
  this.neonAzulLights = [];
  azulLayer.objects.forEach(lightObj => {
    const lightX = lightObj.width ? lightObj.x + lightObj.width / 2 : lightObj.x;
    const lightY = lightObj.height ? lightObj.y + lightObj.height / 2 : lightObj.y;
    // Using a pure blue color (0x0000ff) with a higher intensity for a neon effect.
    const newLight = this.lights.addLight(lightX, lightY, 300, 0x0000ff, 1);
    this.neonAzulLights.push(newLight);
  });
}

// New section for neon red ("rojo") lights:
const rojoLayer = map.getObjectLayer('rojo');
if (rojoLayer && rojoLayer.objects) {
  // Optionally, create an array to hold these lights
  this.neonRojoLights = [];
  rojoLayer.objects.forEach(lightObj => {
    const lightX = lightObj.width ? lightObj.x + lightObj.width / 2 : lightObj.x;
    const lightY = lightObj.height ? lightObj.y + lightObj.height / 2 : lightObj.y;
    // Using a pure red color (0xff0000) with a higher intensity for a neon effect.
    const newLight = this.lights.addLight(lightX, lightY, 300, 0xff0000, 1);
    this.neonRojoLights.push(newLight);
  });
}

  this.songs = null;

   this.doorManager = new DoorManager(this, [
      { x: 1199, y: 1577, toScene: 'MapScene', spawnX: 1200, spawnY: 74 },
      { x: 943, y: 524, toScene: 'MapCasino', spawnX: 637, spawnY: 1208 },
      // Agrega más puertas según sea necesario
    ], this.songs);

    // Collisions
    this.physics.add.collider(this.player, layerAgua);
    this.physics.add.collider(this.player, layerEdificios1);
    this.physics.add.collider(this.player, layerEdificios2);
    this.physics.add.collider(this.player, layerDecoracionSuelo);

    // Camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(2);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.player.setCollideWorldBounds(true);

    // 5) NPC Manager
    this.npcManager = new NPCManager(this, [layerAgua, layerEdificios1, layerEdificios2, layerDecoracionSuelo], this.player);
    this.npcManager.createAnimations();
    // Set pipeline for NPCs

    // 6) Input for interaction
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });
  }

  update() {
    this.player.update();
    this.npcManager.updateNPCs();
    this.doorManager.update(this.player);

    // Flicker effect: vary intensity around a base value (0.5) by a small random amount
    this.flickerLights.forEach(light => {
      light.intensity = 0.5 + (Math.random() - 0.5) * 0.05; // Intensity fluctuates roughly between 0.4 and 0.6
    });
  }

  tryInteract() {
    if (this.doorManager.nearestDoor) {
      this.doorManager.tryInteract(); // Delegate door interaction
      return; // If there is a door, don’t check NPC interaction
    }
    this.npcManager.tryInteract();
  }
}
