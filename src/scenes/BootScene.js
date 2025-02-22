import Phaser from 'phaser'; 
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import rug from '../../assets/images/rug.png';


//import tilesets
import texturas_ciudad from '../../assets/maps/images/texturas_ciudad.png';
import boil from '../../assets/maps/images/boil.png';
import castleStairs from '../../assets/maps/images/castleStairs.png';
import castle from '../../assets/maps/images/castle.png';
import darkWood from '../../assets/maps/images/dark-wood.png';
import dungeon from '../../assets/maps/images/dungeonex.png';
import floors from '../../assets/maps/images/floors.png';
import interior from '../../assets/maps/images/Interior.png';
import rpg from '../../assets/maps/images/rpg.png';
import tavernCooking from '../../assets/maps/images/tavern-cooking.png';
import taverDeco from '../../assets/maps/images/tavern-deco.png';

// NEW: Sort button skins
import sortNum from '../../assets/images/sortnum.png';
import sortColor from '../../assets/images/sortcolor.png';

//import sprites
import playerIdle from '../../assets/images/sprites/dante/Idle.png';
import playerWalk from '../../assets/images/sprites/dante/Walk.png';

import samuelIdle from '../../assets/images/sprites/samuel/Idle.png';
import samuelWalk from '../../assets/images/sprites/samuel/Walk.png';

import brujaIdle from '../../assets/images/sprites/bruja/Idle.png';
import brujaWalk from '../../assets/images/sprites/bruja/Walk.png';

import pescadorIdle from '../../assets/images/sprites/pescador/Idle.png';
import pescadorWalk from '../../assets/images/sprites/pescador/Walk.png';

import padreIdle from '../../assets/images/sprites/padre/Idle.png';
import padreWalk from '../../assets/images/sprites/padre/Walk.png';

import gemelosIdle from '../../assets/images/sprites/gemelos/Idle.png';
import gemelosWalk from '../../assets/images/sprites/gemelos/Walk.png';

import ovejaIdle from '../../assets/images/sprites/oveja/Idle.png';
import ovejaWalk from '../../assets/images/sprites/oveja/Walk.png';

//import pictures dialogos
import Samuel from '../../assets/images/samuel.png';
import Dante from '../../assets/images/dante.png';
import Helena from '../../assets/images/bruja.png';

// Load the font
import fontUrl from '../../assets/fonts/MarioKart.ttf';

//importar mapas
import mapaCiudad from '../../assets/maps/ciudad2.json';
import mapaAsadorRey from '../../assets/maps/interior_asadorRey.json';
import mapaCasino from '../../assets/maps/interior_casino.json';
import mapacavernaOlvido from '../../assets/maps/interior_cavernaOlvido.json';
import mapapuertoAzul from '../../assets/maps/interior_puertoAzul.json';
import maparinconBandido from '../../assets/maps/interior_rinconBandido.json';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load all card images dynamically
    Object.entries(cards).forEach(([key, path]) => {
      this.load.image(key, path);
    });

    //effects fx
    this.load.plugin('rexhorrifipipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexhorrifipipelineplugin.min.js', true); 
    this.load.plugin('rexdissolvepipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdissolvepipelineplugin.min.js', true);

    
    // Load other images
    this.load.image('playButton', playButton);
    this.load.image('submitBtn', submitBtn);
    this.load.image('shuffleBtn', shuffleBtn);
    this.load.image('rug', rug);

    // NEW: Load sort button images
    this.load.image('sortNum', sortNum);
    this.load.image('sortColor', sortColor);

    //load sprites
    this.load.spritesheet('playerIdle', playerIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerWalk', playerWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('samuelIdle', samuelIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('samuelWalk', samuelWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('brujaIdle', brujaIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('brujaWalk', brujaWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('pescadorIdle', pescadorIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pescadorWalk', pescadorWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('padreIdle', padreIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('padreWalk', padreWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('gemelosIdle', gemelosIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('gemelosWalk', gemelosWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('ovejaIdle', ovejaIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ovejaWalk', ovejaWalk, { frameWidth: 64, frameHeight: 64 });

    // Load the dialog pictures
    this.load.image('Samuel', Samuel);
    this.load.image('Dante', Dante);
    this.load.image('Helena', Helena);

    // Inject custom font into the page
    this.loadFont('Mleitod', fontUrl);

    // 2) Load each image used by your Tiled map
    //    The second argument is the actual path to the PNG in your project.
    this.load.image('texturas_ciudad', texturas_ciudad);
    this.load.image('boil', boil);
    this.load.image('castleStairs', castleStairs);
    this.load.image('castle', castle);
    this.load.image('darkWood', darkWood);
    this.load.image('dungeon', dungeon);
    this.load.image('floors', floors);
    this.load.image('interior', interior);
    this.load.image('rpg', rpg);
    this.load.image('tavernCooking', tavernCooking);
    this.load.image('tavernDeco', taverDeco);


    //Json Mapas
    this.load.tilemapTiledJSON('ciudadMap', mapaCiudad);
    this.load.tilemapTiledJSON('asadorReyMap', mapaAsadorRey);
    this.load.tilemapTiledJSON('casinoMap', mapaCasino);
    this.load.tilemapTiledJSON('cavernaOlvidoMap', mapacavernaOlvido);
    this.load.tilemapTiledJSON('puertoAzulMap', mapapuertoAzul);
    this.load.tilemapTiledJSON('rinconBandidoMap', maparinconBandido);

  }

  create() {
    // Start the IntroScene after preloading assets
    this.scene.start('IntroScene');
  }

  // Function to inject the font into the document
  loadFont(name, url) {
    const newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(`
      @font-face {
        font-family: '${name}';
        src: url('${url}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      body {
        font-family: '${name}', sans-serif;
      }
    `));
    document.head.appendChild(newStyle);
  }
}
