import Phaser from 'phaser'; 
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import interactKey from '../../assets/images/interact.png';
import rug from '../../assets/images/rug.png';
import portada from '../../assets/images/AllLUM.png';
//import fondoBatallas from '../../assets/shaders/fondoBatallas.glsl.js';
import botones from '../../assets/images/botones.png';
import star from '../../assets/images/star.png';
import moneda from '../../assets/images/moneda.png';

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

import alienIdle from '../../assets/images/sprites/alien/Idle.png';
import rubioIdle from '../../assets/images/sprites/rubio/Idle.png';
import calvoIdle from '../../assets/images/sprites/calvo/Idle.png';
import hermenegildoIdle from '../../assets/images/sprites/hermenegildo/Idle.png';
import chicaIdle from '../../assets/images/sprites/chica/Idle.png';
import pacoIdle from '../../assets/images/sprites/paco/Idle.png';
import robertoIdle from '../../assets/images/sprites/roberto/Idle.png';
import pelirrojoIdle from '../../assets/images/sprites/pelirrojo/Idle.png';

//import pictures dialogos

import samuel from '../../assets/images/samuel.png';
import dante from '../../assets/images/dante.png';
import helena from '../../assets/images/helena.png';
import oveja from '../../assets/images/oveja.png';
import padre from '../../assets/images/padre.png';
import gemelos from '../../assets/images/gemelos.png';
import pescador from '../../assets/images/pescador.png';
import guardia from '../../assets/images/guardia.png';
import hombre from '../../assets/images/hombre.png';
import vaca from '../../assets/images/vaca.png';
import gordo from '../../assets/images/gordo.png';

import broken_car from '../../assets/images/broken_car.png';
import cow from '../../assets/images/cow.png';
import guard from '../../assets/images/guard.png';
import big_man from '../../assets/images/big_man.png';

import alien from '../../assets/images/alien.png';
import rubio from '../../assets/images/rubio.png';
import calvo from '../../assets/images/calvo.png';
import hermenegildo from '../../assets/images/hermenegildo.png';
import chica from '../../assets/images/chica.png';
import paco from '../../assets/images/paco.png';
import roberto from '../../assets/images/roberto.png';
import pelirrojo from '../../assets/images/pelirrojo.png';

// Load the font
import fontUrl from '../../assets/fonts/MarioKart.ttf';
import retroFontUrl from '../../assets/fonts/PressStart2P-Regular.ttf';

//importar mapas
import mapaCiudad from '../../assets/maps/ciudad3.json';
import mapaAsadorRey from '../../assets/maps/interior_asadorRey.json';
import mapaCasino from '../../assets/maps/interior_casino.json';
import mapacavernaOlvido from '../../assets/maps/interior_cavernaOlvido.json';
import mapapuertoAzul from '../../assets/maps/interior_puertoAzul.json';
import maparinconBandido from '../../assets/maps/interior_rinconBandido.json';
import mapaextCasino from '../../assets/maps/exterior_casino.json';

//importar jokers
import joker1 from '../../assets/images/jokers/joker1.png';
import gilitoJoker from '../../assets/images/jokers/gilitoJoker.png';
import juanJoker from '../../assets/images/jokers/juanJoker.png';
import espadachinJoker from '../../assets/images/jokers/espadachinJoker.png';
import tragaldabasJoker from '../../assets/images/jokers/tragaldabasJoker.png';
import locoJoker from '../../assets/images/jokers/locoJoker.png';
import chifladoJoker from '../../assets/images/jokers/chifladoJoker.png';
import piradoJoker from '../../assets/images/jokers/piradoJoker.png';
import bufonJoker from '../../assets/images/jokers/bufonJoker.png';
import zorroJoker from '../../assets/images/jokers/zorroJoker.png';
import astutoJoker from '../../assets/images/jokers/astutoJoker.png';
import listoJoker from '../../assets/images/jokers/listoJoker.png';
import tramposoJoker from '../../assets/images/jokers/tramposoJoker.png';
import maranosoJoker from '../../assets/images/jokers/maranosoJoker.png';
import sombraJoker from '../../assets/images/jokers/sombraJoker.png';
import banderinJoker from '../../assets/images/jokers/banderinJoker.png';
import cimaJoker from '../../assets/images/jokers/cimaJoker.png';
import abstractoJoker from '../../assets/images/jokers/abstractoJoker.png';
import eruditoJoker from '../../assets/images/jokers/eruditoJoker.png';
import caminanteJoker from '../../assets/images/jokers/caminanteJoker.png';
import nobleJoker from '../../assets/images/jokers/nobleJoker.png';
import baronJoker from '../../assets/images/jokers/baronJoker.png';
import fotografiaJoker from '../../assets/images/jokers/fotografiaJoker.png';
import juglarJoker from '../../assets/images/jokers/juglarJoker.png';
import ahorradorJoker from '../../assets/images/jokers/ahorradorJoker.png';
import caballistaJoker from '../../assets/images/jokers/caballistaJoker.png';
import acrobataJoker from '../../assets/images/jokers/acrobataJoker.png';
import duoJoker from '../../assets/images/jokers/duoJoker.png';
import trioJoker from '../../assets/images/jokers/trioJoker.png';
import familiaJoker from '../../assets/images/jokers/familiaJoker.png';
import ordenJoker from '../../assets/images/jokers/ordenJoker.png';
import tribuJoker from '../../assets/images/jokers/tribuJoker.png';
import flechaJoker from '../../assets/images/jokers/flechaJoker.png';
import gemaJoker from '../../assets/images/jokers/gemaJoker.png';
import manchadoJoker from '../../assets/images/jokers/manchadoJoker.png';
import trapecistaJoker from '../../assets/images/jokers/trapecistaJoker.png';
import billeteJoker from '../../assets/images/jokers/billeteJoker.png';
import cromosJoker from '../../assets/images/jokers/cromosJoker.png';
import doradoJoker from '../../assets/images/jokers/doradoJoker.png';

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
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Set background to black for retro feel
    this.cameras.main.setBackgroundColor('#000000');
    
    // Add retro-style title
    const titleText = this.add.text(width / 2, height / 2 - 100, 'ALL IN: LA ULTIMA MANO', {
      font: '32px "Courier New"',
      fill: '#00ff00',
      align: 'center',
      stroke: '#003300',
      strokeThickness: 4
    });
    titleText.setOrigin(0.5);

    // Add loading text with blinking effect
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'CARGANDO...', {
      font: '24px "Courier New"',
      fill: '#00ff00',
      align: 'center'
    });
    loadingText.setOrigin(0.5);

    // Create blinking cursor effect
    const cursor = this.add.text(width / 2 + 100, height / 2 - 50, '_', {
      font: '24px "Courier New"',
      fill: '#00ff00'
    });
    cursor.setOrigin(0.5);

    // Blink cursor animation
    this.time.addEvent({
      delay: 500,
      callback: () => {
        cursor.setVisible(!cursor.visible);
      },
      loop: true
    });

    // Add retro-style progress bar frame
    const progressFrame = this.add.graphics();
    progressFrame.lineStyle(4, 0x00ff00);
    progressFrame.strokeRect(width / 2 - 160, height / 2 - 25, 320, 50);

    // Add progress bar background (darker green)
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x003300, 1);
    progressBox.fillRect(width / 2 - 156, height / 2 - 21, 312, 42);

    // Add progress bar
    const progressBar = this.add.graphics();

    // Add percentage text
    const percentText = this.add.text(width / 2, height / 2 + 40, '0%', {
      font: '20px "Courier New"',
      fill: '#00ff00',
      align: 'center'
    });
    percentText.setOrigin(0.5);

    // Loading progress events
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ff00, 1);
      progressBar.fillRect(width / 2 - 156, height / 2 - 21, 312 * value, 42);
      
      // Update percentage text
      percentText.setText(Math.round(value * 100) + '%');
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      progressFrame.destroy();
      loadingText.destroy();
      cursor.destroy();
      titleText.destroy();
      percentText.destroy();
      
      // Add completion message
      const completeText = this.add.text(width / 2, height / 2, 'LOAD COMPLETE', {
        font: '24px "Courier New"',
        fill: '#00ff00',
        align: 'center'
      });
      completeText.setOrigin(0.5);
      
      // Fade out and start next scene
      this.tweens.add({
        targets: completeText,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          completeText.destroy();
          this.scene.start('IntroScene');
        }
      });
    });

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
    this.load.image('portada', portada);
    //this.cache.shader.add('fondoBatallas', fondoBatallas);
    this.load.image('interactKey', interactKey);
    this.load.spritesheet('botones', botones, {
      frameWidth: 36,  // width of each frame
      frameHeight: 18   // height of each frame (112 / 4)
    });
    // NEW: Load sort button images
    this.load.image('sortNum', sortNum);
    this.load.image('sortColor', sortColor);

    this.load.image('star', star);
    this.load.image('moneda', moneda);

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

    this.load.spritesheet('alienIdle', alienIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('rubioIdle', rubioIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('calvoIdle', calvoIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('hermenegildoIdle', hermenegildoIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('chicaIdle', chicaIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pacoIdle', pacoIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('robertoIdle', robertoIdle, { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('pelirrojoIdle', pelirrojoIdle, { frameWidth: 64, frameHeight: 64 });

    // Load the dialog pictures
    this.load.image('samuel', samuel);
    this.load.image('dante', dante);
    this.load.image('helena', helena);
    this.load.image('oveja', oveja);
    this.load.image('padre', padre);
    this.load.image('gemelos', gemelos);
    this.load.image('pescador', pescador);
    this.load.image('guardia', guardia);
    this.load.image('hombre', hombre);
    this.load.image('vaca', vaca);
    this.load.image('gordo', gordo);
    this.load.image('alien', alien);
    this.load.image('rubio', rubio);
    this.load.image('calvo', calvo);
    this.load.image('hermenegildo', hermenegildo);
    this.load.image('chica', chica);
    this.load.image('paco', paco);
    this.load.image('roberto', roberto);
    this.load.image('pelirrojo', pelirrojo);
    
    this.load.image('broken_car', broken_car);
    this.load.image('cow', cow);
    this.load.image('guard', guard);
    this.load.image('big_man', big_man);

    // Inject custom font into the page
    this.loadFont('Mleitod', fontUrl);
    this.loadFont('RetroFont', retroFontUrl);

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

    // Load music
    this.load.audio('rain', rain);
    this.load.audio('mapSceneMusic', mapSceneMusic);
    this.load.audio('olvidoMusic', olvidoMusic);
    this.load.audio('mainMenuMusic', mainMenuMusic);
    this.load.audio('creditsMusic', creditsMusic);
    this.load.audio('asadorMusic', asadorMusic);

    //Imágnes para los jokers
    this.load.image('joker1', joker1);
    this.load.image('gilitoJoker', gilitoJoker);
    this.load.image('juanJoker', juanJoker);
    this.load.image('espadachinJoker', espadachinJoker);
    this.load.image('tragaldabasJoker', tragaldabasJoker);
    this.load.image('locoJoker', locoJoker);
    this.load.image('chifladoJoker', chifladoJoker);
    this.load.image('piradoJoker', piradoJoker);
    this.load.image('bufonJoker', bufonJoker);
    this.load.image('zorroJoker', zorroJoker);
    this.load.image('astutoJoker', astutoJoker);
    this.load.image('listoJoker', listoJoker);
    this.load.image('tramposoJoker', tramposoJoker);
    this.load.image('maranosoJoker', maranosoJoker);
    this.load.image('sombraJoker', sombraJoker);
    this.load.image('banderinJoker', banderinJoker);
    this.load.image('cimaJoker', cimaJoker);
    this.load.image('abstractoJoker', abstractoJoker);
    this.load.image('eruditoJoker', eruditoJoker);
    this.load.image('caminanteJoker', caminanteJoker);
    this.load.image('nobleJoker', nobleJoker);
    this.load.image('baronJoker', baronJoker);
    this.load.image('fotografiaJoker', fotografiaJoker);
    this.load.image('juglarJoker', juglarJoker);
    this.load.image('ahorradorJoker', ahorradorJoker);
    this.load.image('caballistaJoker', caballistaJoker);
    this.load.image('acrobataJoker', acrobataJoker);
    this.load.image('duoJoker', duoJoker);
    this.load.image('trioJoker', trioJoker);
    this.load.image('familiaJoker', familiaJoker);
    this.load.image('ordenJoker', ordenJoker);
    this.load.image('tribuJoker', tribuJoker);
    this.load.image('flechaJoker', flechaJoker);
    this.load.image('gemaJoker', gemaJoker);
    this.load.image('manchadoJoker', manchadoJoker);
    this.load.image('trapecistaJoker', trapecistaJoker);
    this.load.image('billeteJoker', billeteJoker);
    this.load.image('cromosJoker', cromosJoker);
    this.load.image('doradoJoker', doradoJoker);
  }

  create() {
    // Start the IntroScene after preloading assets
    // In a BootScene or before starting game scenes
    this.registry.set('coins', 150);  // start with 0 or loaded value
    this.registry.set('jokers', []);  // start with empty array or loaded value
    this.registry.set('stage', 0);
    this.registry.set('musicEnabled', true);
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
