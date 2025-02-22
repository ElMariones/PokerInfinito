import Phaser from 'phaser';
import NPCManager from '../utils/NPCManager.js';
import Player from '../utils/Player.js';


export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    //mapa
    const map = this.make.tilemap({ key: 'ciudadMap' }); 

    //tilesets
    // 4) Add each tileset by matching:
    //    map.addTilesetImage(<Tiled tileset name>, <Phaser key>)
    const texturasCiudad = map.addTilesetImage('texturas_ciudad', 'texturas_ciudad');

    const layerCalle = map.createLayer('suelo', [texturasCiudad], 0, 0);
    const layerAgua = map.createLayer('agua (solido)', [texturasCiudad], 0, 0);
    const layerAguaWalkable = map.createLayer('agua (walkable)', [texturasCiudad], 0, 0);
    const layerHierba = map.createLayer('hierba', [texturasCiudad], 0, 0);
    const layerDecoracionSuelo = map.createLayer('decoracion suelo (walkable)', [texturasCiudad], 0, 0);
    const layerEdificios1 = map.createLayer('edificios (solido)', [texturasCiudad], 0, 0);
    const layerEdificios2 = map.createLayer('decoracion paredes (solido)', [texturasCiudad], 0, 0);

    // Enable collisions for the "solido" layers
    layerAgua.setCollisionByExclusion([-1]);
    layerEdificios1.setCollisionByExclusion([-1]);
    layerEdificios2.setCollisionByExclusion([-1]);
    
    //Player logic

      // 2) Create all player animations once
      Player.createPlayerAnimations(this);

      // 3) Create the player
      this.player = new Player(this, 256, 500, 'playerIdle');

      // 4) Collisions with tilemap layers
      this.physics.add.collider(this.player, layerAgua);
      this.physics.add.collider(this.player, layerEdificios1);
      this.physics.add.collider(this.player, layerEdificios2);

      // 5) Camera follows player
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setZoom(2); // Zoom in a bit
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Camera can't go out of bounds
      this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels); // Player can't go out of bounds
      this.player.setCollideWorldBounds(true); // Player can't go out of bounds



    // --------------------------------------------------
    // NPC MANAGER
    // --------------------------------------------------
    this.npcManager = new NPCManager(this, [layerAgua, layerEdificios1, layerEdificios2], this.player);

    // 1) Create all NPC animations
    this.npcManager.createAnimations();

    // 2) Add NPCs
    //    (name, x, y, animation, facesPlayer)
    const samuel = this.npcManager.addNPC('samuel', 256, 426, 'idle-down', true);
    const bruja = this.npcManager.addNPC('bruja', 993, 434, 'idle-down', false);
    const pescador = this.npcManager.addNPC('pescador', 206, 1025, 'idle-down', true);
    const padre = this.npcManager.addNPC('padre', 1037, 787, 'idle-down', false);
    const gemelos = this.npcManager.addNPC('gemelos', 1824, 966, 'idle-down', true);
    

    this.npcArray = this.npcManager.getAllNPCs();

    const layerTejados1 = map.createLayer('tejados (walkable)', [
      texturasCiudad
    ], 0, 0);
    
    const layerTejados2 = map.createLayer('decoracion tejado (walkable)', [
      texturasCiudad
    ], 0, 0);

   
    // Interact key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });


  }

  update() {

    this.player.update();

    this.npcManager.updateNPCs();
    
  }
    
  tryInteract() {
    // Check if player is close enough to an NPC
    const interactDistance = 50;

    this.npcArray.forEach(npc => {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        npc.x, npc.y
      );

      if (dist < interactDistance) {

        const name = npc.getData('npcName');

        if (name === 'samuel') {
          this.scene.launch('Dialogos', {npc: 'Samuel', });
        } else if (name === 'bruja') {
          this.scene.launch('Dialogos', {npc: 'Helena', });
        } else if (name === 'gemelos') {
          this.scene.launch('Dialogos', {npc: 'gemelos', });
        } else if (name === 'padre') {
          this.scene.launch('Dialogos', {npc: 'padre', });
        } else if (name === 'pescador') {
          this.scene.launch('Dialogos', {npc: 'pescador', });
        }
      this.scene.bringToTop('Dialogos');    }
    });
  }
}

