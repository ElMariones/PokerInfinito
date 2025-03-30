// main.js or wherever you define your config
import Phaser from 'phaser';
import VHSFxPlugin from './utils/VHS_fx.js';

import BootScene from './scenes/BootScene.js';
import IntroScene from './scenes/IntroScene.js';
import MapScene from './scenes/MapScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import TransicionBatalla from './scenes/TransicionBatalla.js';
import Dialogos from './scenes/Dialogos.js';
import MapAsador from './scenes/MapAsador.js';
import MapPuerto from './scenes/MapPuerto.js';
import MapRicon from './scenes/MapRincon.js';
import MapOlvido from './scenes/MapOlvido.js';
import MapCasino from './scenes/MapCasino.js';
import UIOverlay from './scenes/UIOverlay.js';
import Shop from './scenes/Shop.js';
import JokersInventoryScene from './scenes/JokersInventoryScene.js';
import MapExtCasino from './scenes/MapExtCasino.js';

let config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'juego',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  },
  pixelArt: true,
  roundPixels: true,
  maxLights: 200,

  
  backgroundColor: '#006400',
  scene: [
    BootScene,
    IntroScene,
    MapScene,
    MapAsador,
    MapPuerto,
    MapRicon,
    MapOlvido,
    MapCasino,
    MapExtCasino,
    TransicionBatalla,
    GameScene,
    UIScene,
    Dialogos,
    UIOverlay,
    Shop,
    JokersInventoryScene,
  ],

  // Register the plugin so it loads in each scene
  plugins: {
    scene: [
      { key: 'VHSFxPlugin', plugin: VHSFxPlugin, mapping: 'vhsfx' }
    ]
  }
};

new Phaser.Game(config);
