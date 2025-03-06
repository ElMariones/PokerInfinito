import Phaser from 'phaser'
import NPCManager from '../utils/NPCManager.js'
import Player from '../utils/Player.js'
import DoorManager from '../utils/DoorManager.js'

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene')
  }

  // Accept optional data with spawnX/spawnY
  create(data) {

    this.scene.launch('UIOverlay');  // start the UI overlay on top of this scene

    // 1) Read spawn coordinates from data, or use defaults
    const startX = data?.spawnX ?? 256
    const startY = data?.spawnY ?? 500

    // 2) Create the tilemap
    const map = this.make.tilemap({ key: 'ciudadMap' })

    // tilesets
    const texturasCiudad = map.addTilesetImage('texturas_ciudad', 'texturas_ciudad')

    const layerCalle = map.createLayer('suelo', [texturasCiudad], 0, 0)
    const layerAgua = map.createLayer('agua (solido)', [texturasCiudad], 0, 0)
    const layerAguaWalkable = map.createLayer('agua (walkable)', [texturasCiudad], 0, 0)
    const layerHierba = map.createLayer('hierba', [texturasCiudad], 0, 0)
    const layerDecoracionSuelo = map.createLayer('decoracion suelo (walkable)', [texturasCiudad], 0, 0)
    const layerEdificios1 = map.createLayer('edificios (solido)', [texturasCiudad], 0, 0)
    const layerEdificios2 = map.createLayer('decoracion paredes (solido)', [texturasCiudad], 0, 0)

    // Enable collisions
    layerAgua.setCollisionByExclusion([-1])
    layerEdificios1.setCollisionByExclusion([-1])
    layerEdificios2.setCollisionByExclusion([-1])

    // 3) Doors array
    this.doors = [
      {
        x: 255,
        y: 365,
        toScene: 'MapAsador',
        spawnX: 320,
        spawnY: 584
      },
      {
        x: 1005,
        y: 412,
        toScene: 'MapOlvido',
        spawnX: 320,
        spawnY: 614
      },
      {
        x: 195,
        y: 956,
        toScene: 'MapPuerto',
        spawnX: 478,
        spawnY: 608
      },
      {
        x: 1843,
        y: 956,
        toScene: 'MapRincon',
        spawnX: 956,
        spawnY: 928
      }
    ];
    this.doorManager = new DoorManager(this, this.doors);

    // 4) Player logic
    Player.createPlayerAnimations(this)
    // Create the player at the chosen spawn coords
    this.player = new Player(this, startX, startY, 'playerIdle')

    // Collisions
    this.physics.add.collider(this.player, layerAgua)
    this.physics.add.collider(this.player, layerEdificios1)
    this.physics.add.collider(this.player, layerEdificios2)

    // Camera
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setZoom(2)
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
    this.player.setCollideWorldBounds(true)

    // 5) NPC Manager
    this.npcManager = new NPCManager(this, [layerAgua, layerEdificios1, layerEdificios2], this.player)
    this.npcManager.createAnimations()

    // Add NPCs
    const samuel = this.npcManager.addNPC('samuel', 256, 426, 'idle-down', false)
    const oveja = this.npcManager.addNPC('oveja', 500, 630, 'idle-down', false)
    const helena = this.npcManager.addNPC('helena', 993, 434, 'idle-down', false)
    const pescador = this.npcManager.addNPC('pescador', 206, 1025, 'idle-down', true)
    const padre = this.npcManager.addNPC('padre', 1037, 787, 'idle-down', false)
    const gemelos = this.npcManager.addNPC('gemelos', 1824, 966, 'idle-down', true)

    // Example paths
    this.npcManager.setNPCPath(samuel, [
      { x: 256, y: 426 },
      { x: 400, y: 426 }
    ], 40, true)

    this.npcManager.setNPCPath(oveja, [
      { x: 500, y: 630 },
      { x: 350, y: 630 },
      { x: 350, y: 710 },
      { x: 500, y: 710 }
    ], 60, true)

    this.npcArray = this.npcManager.getAllNPCs()

    const layerTejados1 = map.createLayer('tejados (walkable)', [texturasCiudad], 0, 0)
    const layerTejados2 = map.createLayer('decoracion tejado (walkable)', [texturasCiudad], 0, 0)

    // 6) Input for interaction
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract()
    })

    this.doorInteractUI = null;
    this.interactUI = null;
  }

  update() {
    this.player.update();
    this.npcManager.updateNPCs();
    this.doorManager.update(this.player);

    const interactDistance = 50;
    let nearestDoor = null;
    let nearestNpc = null;
    let minDist = Infinity;

    this.npcArray.forEach(npc => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        nearestNpc = npc;
      }
    });

    // 4) Show/hide the NPC "E" icon
    if (nearestNpc) {
      if (!this.interactUI) {
        this.interactUI = this.add.image(nearestNpc.x, nearestNpc.y - 30, 'interactKey');
        this.interactUI.setScale(0.07);
        this.interactUI.setDepth(9999);
      } else {
        this.interactUI.setPosition(nearestNpc.x, nearestNpc.y - 30);
        this.interactUI.setVisible(true);
        this.interactUI.setDepth(9999);
      }
    }
    else {
        if (this.interactUI) {
          this.interactUI.setVisible(false);
        }
    }
  }

  tryInteract() {
    const interactDistance = 50;
    if (this.doorManager.nearestDoor) {
      this.doorManager.tryInteract(); // Delegamos la interacción con puertas
      return; // Si hay una puerta, no se verifica lo de los NPCs
    }

    // 3) Check NPCs if no door in range
    this.npcArray.forEach(npc => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < interactDistance) {
        const name = npc.getData('npcName');
        // Launch dialog logic
        if (name === 'samuel') {
          this.scene.launch('Dialogos', { npc: 'samuel' });
        } else if (name === 'helena') {
          this.scene.launch('Dialogos', { npc: 'helena' });
        } else if (name === 'gemelos') {
          this.scene.launch('Dialogos', { npc: 'gemelos' });
        } else if (name === 'padre') {
          this.scene.launch('Dialogos', { npc: 'padre' });
        } else if (name === 'pescador') {
          this.scene.launch('Dialogos', { npc: 'pescador' });
        } else if (name === 'oveja') {
          this.scene.launch('Dialogos', { npc: 'oveja' });
        }
        this.scene.bringToTop('Dialogos');
      }
    });
  }
}
