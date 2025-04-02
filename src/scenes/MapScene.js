import Phaser from 'phaser'
import NPCManager from '../utils/NPCManager.js'
import Player from '../utils/Player.js'
import DoorManager from '../utils/DoorManager.js'
import Weather from '../utils/Weather.js';



export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene')
  }

  // Accept optional data with spawnX/spawnY
  create(data) {
    // Register this map as the current active map
    this.registry.set('currentMap', this.scene.key);
    // Launch the UI overlay on top of this scene if it's not already launched
    if (!this.scene.isActive('UIOverlay')) {
      this.scene.launch('UIOverlay');
    }

    // --- Get current game stage ---
    const currentStage = this.registry.get('stage') ?? 0;

    // 1) Read spawn coordinates from data, or use defaults
    const startX = data?.spawnX ?? 184
    const startY = data?.spawnY ?? 2530

    // 2) Create the tilemap
    const map = this.make.tilemap({ key: 'ciudadMap' })

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
    this.player.setDepth(10);

    const layerTejados1 = map.createLayer('tejado (walkable)', [texturasCiudad], 0, 0)
    const layerTejados2 = map.createLayer('tejado 2 (walkable)', [texturasCiudad], 0, 0)
    layerTejados1.setDepth(20);
    layerTejados2.setDepth(20);

    // Enable collisions for solid layers
    layerAgua.setCollisionByExclusion([-1])
    layerDecoracionSuelo.setCollisionByExclusion([-1])
    layerEdificios1.setCollisionByExclusion([-1])
    layerEdificios2.setCollisionByExclusion([-1])

    // 2.1) Enable the Lights plugin for dynamic lighting
    this.lights.enable().setAmbientColor(0x444444); // Darker ambient color
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

    // Music
    this.songs = [];
    if (this.registry.get('musicEnabled') === true) {
      this.rainAudio = this.sound.add('rain', { volume: 0.2, loop: true });
      this.songs.push(this.rainAudio);
      this.rainAudio.play();
      this.music = this.sound.add('mapSceneMusic', { volume: 0.6, loop: true });
      this.songs.push(this.music);
      this.music.play();
    }

    // 3) Doors array
    this.doors = [
      {
        x: 862,
        y: 2397,
        toScene: 'MapAsador',
        spawnX: 320,
        spawnY: 584
      },
      {
        x: 720,
        y: 1735,
        toScene: 'MapOlvido',
        spawnX: 320,
        spawnY: 614
      },
      {
        x: 1920,
        y: 408,
        toScene: 'MapPuerto',
        spawnX: 478,
        spawnY: 608
      },
      {
        x: 1199,
        y: 37,
        toScene: 'MapExtCasino',
        spawnX: 1199,
        spawnY: 2510
      },
      {
        x: 831,
        y: 406,
        toScene: 'MapRincon',
        spawnX: 956,
        spawnY: 928
      }
    ];
    this.doorManager = new DoorManager(this, this.doors, this.songs);

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

    //efectos
    // Create the Weather object
    this.weather = new Weather(this.game);
    
    // Add or remove weather effects as needed:
    this.weather.addRain();
    // this.weather.removeRain();
    //this.weather.addFog();
    // this.weather.removeFog();

    // 5) NPC Manager
    this.npcManager = new NPCManager(this, [layerAgua, layerEdificios1, layerEdificios2, layerDecoracionSuelo], this.player);
    this.npcManager.createAnimations();
    // Set pipeline for NPCs

    // Add NPCs
    const oveja = this.npcManager.addNPC('oveja', 154, 872, 'idle-down', false);
    
    this.npcManager.getAllNPCs().forEach(npc => {
      npc.setPipeline('Light2D');
    });
    // Example path for an NPC
    this.npcManager.setNPCPath(oveja, [
      { x: 154, y: 872 },
      { x: 224, y: 872 },
      { x: 224, y: 967 },
      { x: 154, y: 967 },
    ], 60, true);

            // --- NEW: Add Barriers based on Stage ---
            this.barriers = []; // Clear previous barriers if scene restarts

            // Barrier 1: Broken Car (Blocks until stage 1)
            if (currentStage <= 0) {
                // Use 'barrier_car' as the unique name for dialogue lookup
                // Use 'broken_car' as the texture key (assuming 'broken_car.png' was loaded with this key)
                const barrier1 = this.npcManager.addNPC('barrier_car', 1210, 2247, 'broken_car', false);
                 if (barrier1) { // Check if NPC was created successfully
                     barrier1.setPipeline('Light2D');
                     this.barriers.push(barrier1);
                     console.log("Barrier 1 (Car) created.");
                }
            }
    
            // Barrier 2: Lost Cow (Blocks until stage 2)
            if (currentStage <= 1) {
                const barrier2 = this.npcManager.addNPC('barrier_cow', 1200, 1500, 'cow', false);
                 if (barrier2) {
                     barrier2.setPipeline('Light2D');
                     this.barriers.push(barrier2);
                     console.log("Barrier 2 (Cow) created.");
                }
                const barrier2_2 = this.npcManager.addNPC('barrier_cow', 240, 1500, 'cow', false);
                if (barrier2_2) {
                    barrier2_2.setPipeline('Light2D');
                    this.barriers.push(barrier2_2);
                    console.log("Barrier 2_2 (Cow) created.");
               }
            }
    
            // Barrier 3: Guard (Blocks until stage 3)
            // Note: This blocks door at 831, 406. Place guard slightly in front.
            if (currentStage <= 2) {
                const barrier3 = this.npcManager.addNPC('barrier_guard', 830, 455, 'guard', false); // Positioned in front of door
                if (barrier3) {
                     barrier3.setPipeline('Light2D');
                     // Optional: Make guard slightly smaller if sprite is large
                     // barrier3.setScale(0.9);
                     this.barriers.push(barrier3);
                     console.log("Barrier 3 (Guard) created.");
                }
            }
    
            // Barrier 4: Sleeping Big Man (Blocks until stage 4)
            if (currentStage <= 3) {
                const barrier4 = this.npcManager.addNPC('barrier_big_man', 1200, 275, 'big_man', false);
                 if (barrier4) {
                     barrier4.setPipeline('Light2D');
                     this.barriers.push(barrier4);
                     console.log("Barrier 4 (Big Man) created.");
                }
            }

            this.barriers.forEach(barrier => {
              barrier.setDepth(9);
          });
             // --- END NEW ---
    
            // Set Light Pipeline for all NPCs (including barriers added via NPCManager)
             this.npcManager.getAllNPCs().forEach(npc => {
                // Check if pipeline exists before setting
                 if (npc && npc.setPipeline) {
                     npc.setPipeline('Light2D');
                }
            });

    this.npcArray = this.npcManager.getAllNPCs();

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
