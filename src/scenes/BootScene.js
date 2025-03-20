import Phaser from 'phaser'; 
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import interactKey from '../../assets/images/interact.png';
import rug from '../../assets/images/rug.png';
import button_default from '../../assets/images/button_default.png';


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

import helenaIdle from '../../assets/images/sprites/helena/Idle.png';
import helenaWalk from '../../assets/images/sprites/helena/Walk.png';

import pescadorIdle from '../../assets/images/sprites/pescador/Idle.png';
import pescadorWalk from '../../assets/images/sprites/pescador/Walk.png';

import padreIdle from '../../assets/images/sprites/padre/Idle.png';
import padreWalk from '../../assets/images/sprites/padre/Walk.png';

import gemelosIdle from '../../assets/images/sprites/gemelos/Idle.png';
import gemelosWalk from '../../assets/images/sprites/gemelos/Walk.png';

import ovejaIdle from '../../assets/images/sprites/oveja/Idle.png';
import ovejaWalk from '../../assets/images/sprites/oveja/Walk.png';

//import pictures dialogos

import samuel from '../../assets/images/samuel.png';
import dante from '../../assets/images/dante.png';
import helena from '../../assets/images/helena.png';
import oveja from '../../assets/images/oveja.png';
import padre from '../../assets/images/padre.png';
import gemelos from '../../assets/images/gemelos.png';
import pescador from '../../assets/images/pescador.png';


// Load the font
import fontUrl from '../../assets/fonts/MarioKart.ttf';

//importar mapas
import mapaCiudad from '../../assets/maps/ciudad3.json';
import mapaAsadorRey from '../../assets/maps/interior_asadorRey.json';
import mapaCasino from '../../assets/maps/interior_casino.json';
import mapacavernaOlvido from '../../assets/maps/interior_cavernaOlvido.json';
import mapapuertoAzul from '../../assets/maps/interior_puertoAzul.json';
import maparinconBandido from '../../assets/maps/interior_rinconBandido.json';
import mapaextCasino from '../../assets/maps/exterior_casino.json';

//importar jokers
import joker1 from '../../assets/images/joker1.png';
import joker2 from '../../assets/images/joker2.png';
import joker3 from '../../assets/images/joker3.png';
import joker4 from '../../assets/images/joker4.png'; 
import joker5 from '../../assets/images/joker5.png';

//import music
import rain from '../../assets/audio/Dark_Rainy_Night(ambience).ogg';
import mapSceneMusic from '../../assets/audio/Space_Atmosphere.mp3';
import olvidoMusic from '../../assets/audio/Night_of_the_Streets.mp3';
import creditsMusic from '../../assets/audio/main_menu_music.ogg';
import mainMenuMusic from '../../assets/audio/ambient_menu.mp3';
import asadorMusic from '../../assets/audio/life_in_corrupted_binary.flac';

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
    this.load.image('interactKey', interactKey);
    this.load.spritesheet('button_default', button_default, {
      frameWidth: 142,  // width of each frame
      frameHeight: 28   // height of each frame (112 / 4)
    });
    // NEW: Load sort button images
    this.load.image('sortNum', sortNum);
    this.load.image('sortColor', sortColor);

    //load sprites
    this.load.spritesheet('playerIdle', playerIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerWalk', playerWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('samuelIdle', samuelIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('samuelWalk', samuelWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('helenaIdle', helenaIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('helenaWalk', helenaWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('pescadorIdle', pescadorIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pescadorWalk', pescadorWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('padreIdle', padreIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('padreWalk', padreWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('gemelosIdle', gemelosIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('gemelosWalk', gemelosWalk, { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('ovejaIdle', ovejaIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ovejaWalk', ovejaWalk, { frameWidth: 64, frameHeight: 64 });

    // Load the dialog pictures
    this.load.image('samuel', samuel);
    this.load.image('dante', dante);
    this.load.image('helena', helena);
    this.load.image('oveja', oveja);
    this.load.image('padre', padre);
    this.load.image('gemelos', gemelos);
    this.load.image('pescador', pescador);

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
    this.load.tilemapTiledJSON('extCasinoMap', mapaextCasino);

    //Imágnes para los jokers
    this.load.image('joker1', joker1);
    this.load.image('joker2', joker2);
    this.load.image('joker3', joker3);
    this.load.image('joker4', joker4);
    this.load.image('joker5', joker5);

    // Load the rain sound
    this.load.audio('rain', rain);
    this.load.audio('mapSceneMusic', mapSceneMusic);
    this.load.audio('olvidoMusic', olvidoMusic);
    this.load.audio('mainMenuMusic', mainMenuMusic);
    this.load.audio('creditsMusic', creditsMusic);
    this.load.audio('asadorMusic', asadorMusic);
  }

  create() {
    // Start the IntroScene after preloading assets
    // In a BootScene or before starting game scenes
    this.registry.set('coins', 200);  // start with 0 or loaded value
    this.registry.set('jokers', []);  // start with empty array or loaded value
    this.registry.set('stage', 0);
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
