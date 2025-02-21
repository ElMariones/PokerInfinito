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
  
  backgroundColor: '#006400',
  scene: [
    BootScene,
    IntroScene,
    MapScene,
    TransicionBatalla,
    GameScene,
    UIScene,
    Dialogos
  ],

  // Register the plugin so it loads in each scene
  plugins: {
    scene: [
      { key: 'VHSFxPlugin', plugin: VHSFxPlugin, mapping: 'vhsfx' }
    ]
  }
};

new Phaser.Game(config);
