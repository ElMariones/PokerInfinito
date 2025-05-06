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
    // Launch the UI overlay on top of this scene if it's not already launched
    if (!this.scene.isActive('UIOverlay')) {
      this.scene.launch('UIOverlay');
    }

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

    this.npcArray = this.npcManager.getAllNPCs();
    this.eIcon = this.add.image(566, 90, 'interactKey').setInteractive();
    this.eIcon.setScale(0.07);
    this.eIcon.setDepth(9999); // Ensure it's on top
    // Índice para rastrear la imagen actual
    this.currentTutorialImageIndex = -1;
    this.tutorial = false;

    this.input.keyboard.on('keydown-E', () => {
      if (!this.tutorial && this.isPlayerNearEIcon()) {
        this.tutorial = true;
        this.startTutorial();
      }
      else if (this.tutorial) {
        this.exitTutorial();
      }
      this.tryInteract()
    });

    // Lógica para navegar por las imágenes del tutorial
    this.input.keyboard.on('keydown-T', () => {
      if (this.tutorial) {
        this.currentTutorialImageIndex++;
        this.showTutorialImage();
      }
    });

    this.input.keyboard.on('keydown-R', () => {
      if (this.tutorial) {
        this.currentTutorialImageIndex = Math.max(0, this.currentTutorialImageIndex - 1);
        this.showTutorialImage();
      }
    });
    

    // Obtener el tamaño de la escena
    const sceneWidth = this.cameras.main.width;
    const sceneHeight = this.cameras.main.height;
    const imageWidth = sceneWidth * 0.35;
    const imageHeight = sceneHeight * 0.35;
    
    this.tutorialImages = [
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial1').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial2').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial3').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial4').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial5').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial6').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial7').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial8').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial9').setScrollFactor(0).setVisible(false),
      this.add.image(sceneWidth / 2, sceneHeight / 2, 'tutorial10').setScrollFactor(0).setVisible(false)
    ];
    
    this.tutorialImages.forEach(image => {
      image.setDisplaySize(imageWidth, imageHeight);
      image.setDepth(9999);
    });

    const buttonY = sceneHeight / 2 + imageHeight / 2 + 20;
    this.tutorialButtons = {
      prev: this.add.text(sceneWidth / 2 - 150, buttonY, '← R: Anterior', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 }
      }).setScrollFactor(0).setOrigin(0.5).setDepth(10000).setVisible(false),

      exit: this.add.text(sceneWidth / 2, buttonY, 'E: Salir', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 }
      }).setScrollFactor(0).setOrigin(0.5).setDepth(10000).setVisible(false),

      next: this.add.text(sceneWidth / 2 + 150, buttonY, 'T: Siguiente →', {
        fontSize: '20px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 5, y: 5 }
      }).setScrollFactor(0).setOrigin(0.5).setDepth(10000).setVisible(false)
    };

  }

  isPlayerNearEIcon() {
    const distance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.eIcon.x,
      this.eIcon.y
    );
    return distance < 50; // Umbral de proximidad (ajusta según sea necesario)
  }

  startTutorial() {
    this.currentTutorialImageIndex = 0;
    this.showTutorialImage();
    Object.values(this.tutorialButtons).forEach(btn => btn.setVisible(true));
  }

  showTutorialImage() {
    // Pausar el jugador mientras se muestra el tutorial
    this.player.body.moves = false;
  
    if (this.currentTutorialImageIndex >= 0 && this.currentTutorialImageIndex < this.tutorialImages.length) {
      // Ocultar todas las imágenes
      this.tutorialImages.forEach(image => image.setVisible(false));
  
      // Mostrar solo la imagen actual
      this.tutorialImages[this.currentTutorialImageIndex].setVisible(true);
    } else {
      // Si se llega al final del tutorial, salir
      this.exitTutorial();
    }
  }
  
  exitTutorial() {
    // Ocultar la última imagen
    this.tutorialImages.forEach(image => image.setVisible(false));
  
    // Reiniciar el índice del tutorial
    this.currentTutorialImageIndex = -1;
  
    // Reactivar el movimiento del jugador
    this.player.body.moves = true;
  
    // Desactivar el modo tutorial
    this.tutorial = false;
    Object.values(this.tutorialButtons).forEach(btn => btn.setVisible(false));
    if (this.registry.get('tutorialStep') === 0) {
      this.registry.set('tutorialStep', 1); // Actualiza el paso del tutorial
    }
  }

  update() {
    if (this.isPlayerNearEIcon())
      this.eIcon.setVisible(true);
    else
      this.eIcon.setVisible(false);
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
