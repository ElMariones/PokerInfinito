import Phaser from 'phaser'; 
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import rug from '../../assets/images/rug.png';

//import tilesets
import adobeBrickRoof from '../../assets/maps/images/Adobe Brick Roof.png';
import barrel from '../../assets/maps/images/Barrel.png';
import barn from '../../assets/maps/images/barn.png';
import baseOutAtlas from '../../assets/maps/images/base_out_atlas.png';
import blacksmithSmelter from '../../assets/maps/images/blacksmith-smelter.png';
import brickWallBlockEdging from '../../assets/maps/images/Brick Wall Block Edging.png';
import buildAtlas from '../../assets/maps/images/build_atlas.png';
import cartelines from '../../assets/maps/images/cartelines.png';
import castleExtras from '../../assets/maps/images/castle-extras.png';
import castle8dark from '../../assets/maps/images/castle8dark.png';
import christmasWallDecor from '../../assets/maps/images/Christmas Wall Decor.png';
import conifers from '../../assets/maps/images/conifers.png';
import crops from '../../assets/maps/images/crops.png';
import exteriortiles from '../../assets/maps/images/Exterior Tiles.png';
import farmingFishing from '../../assets/maps/images/farming_fishing.png';
import flowers from '../../assets/maps/images/flowers.png';
import flowers2 from '../../assets/maps/images/Flowers2.png';
import grindstone from '../../assets/maps/images/grindstone.png';
import interior from '../../assets/maps/images/Interior.png';
import insideB from '../../assets/maps/images/Inside_B.png';
import ladder from '../../assets/maps/images/Ladder.png';
import lightingOutdoors from '../../assets/maps/images/Lighting, Outdoors.png';
import mushrooms from '../../assets/maps/images/mushrooms.png';
import Lumber from '../../assets/maps/images/Lumber.png';
import objMiskAtlas from '../../assets/maps/images/obj_misk_atlas.png';
import olvido3 from '../../assets/maps/images/olvido3.png';
import olvidoooo from '../../assets/maps/images/olvidoooo.png';
import orangetrees from '../../assets/maps/images/orangetrees.png';
import outsideObjects from '../../assets/maps/images/Outside Objects.png';
import outsideB from '../../assets/maps/images/Outside_B.png';
import plantsWinter from '../../assets/maps/images/plants_winter.png';
import Sawhorse from '../../assets/maps/images/Sawhorse.png';
import shelf from '../../assets/maps/images/Shelf.png';
import signpostOutside from '../../assets/maps/images/signpost-outsidestuff.png';
import skeletons from '../../assets/maps/images/Skeletons A.png';
import street_misc from '../../assets/maps/images/street_misc.png';
import street from '../../assets/maps/images/street.png';
import tavernCooking from '../../assets/maps/images/tavern-cooking.png';
import terrainOutside from '../../assets/maps/images/Terrain and Outside.png';
import terrainAtlas from '../../assets/maps/images/terrain_atlas.png';
import townBuildings from '../../assets/maps/images/town_buildings.png';
import treesAutumn from '../../assets/maps/images/trees_autumn.png';
import victorianHouse from '../../assets/maps/images/victorian house.png'; 

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

// Load the font
import fontUrl from '../../assets/fonts/MarioKart.ttf';

//importar mapas
import mapaCiudad from '../../assets/maps/ciudad.json';

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

    // Inject custom font into the page
    this.loadFont('Mleitod', fontUrl);

    // 2) Load each image used by your Tiled map
    //    The second argument is the actual path to the PNG in your project.
    this.load.image('adobeBrickRoof', adobeBrickRoof);
    this.load.image('barrel', barrel);
    this.load.image('barn', barn);
    this.load.image('baseOutAtlas', baseOutAtlas);
    this.load.image('blacksmithSmelter', blacksmithSmelter);
    this.load.image('brickWallBlockEdging', brickWallBlockEdging);
    this.load.image('buildAtlas', buildAtlas);
    this.load.image('cartelines', cartelines);
    this.load.image('castleExtras', castleExtras);
    this.load.image('castle8dark', castle8dark);
    this.load.image('christmasWallDecor', christmasWallDecor);
    this.load.image('conifers', conifers);
    this.load.image('crops', crops);
    this.load.image('exteriortiles', exteriortiles);
    this.load.image('farmingFishing', farmingFishing);
    this.load.image('flowers', flowers);
    this.load.image('flowers2', flowers2);
    this.load.image('grindstone', grindstone);
    this.load.image('interior', interior);
    this.load.image('insideB', insideB);
    this.load.image('ladder', ladder);
    this.load.image('lightingOutdoors', lightingOutdoors);
    this.load.image('mushrooms', mushrooms);
    this.load.image('Lumber', Lumber);
    this.load.image('obj_misk_atlas', objMiskAtlas);
    this.load.image('olvido3', olvido3);
    this.load.image('olvidoooo', olvidoooo);
    this.load.image('orangetrees', orangetrees);
    this.load.image('outsideObjects', outsideObjects);
    this.load.image('outsideB', outsideB);
    this.load.image('plantsWinter', plantsWinter);
    this.load.image('Sawhorse', Sawhorse);
    this.load.image('shelf', shelf);
    this.load.image('signpostOutside', signpostOutside);
    this.load.image('skeletons', skeletons);
    this.load.image('street_misc', street_misc);
    this.load.image('street', street);
    this.load.image('tavernCooking', tavernCooking);
    this.load.image('terrainOutside', terrainOutside);
    this.load.image('terrainAtlas', terrainAtlas);
    this.load.image('townBuildings', townBuildings);
    this.load.image('treesAutumn', treesAutumn);
    this.load.image('victorianHouse', victorianHouse);

    //Json Mapas
    this.load.tilemapTiledJSON('ciudadMap', mapaCiudad);

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
