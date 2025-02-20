import BootScene from './scenes/BootScene.js';
import IntroScene from './scenes/IntroScene.js';
// import AudioLoader from './scenes/AudioLoader.js';
import MapScene from './scenes/MapScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';
import TransicionBatalla from './scenes/TransicionBatalla.js';
import Phaser from 'phaser';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    // “Virtual” resolution. The actual size is scaled to fit the container.
    width: 1024,
    height: 768,

    // Attach the game canvas to <div id="juego">
    parent: 'juego',

    // Configure scaling to fit various screen sizes.
    scale: {
        mode: Phaser.Scale.FIT,             // Maintains aspect ratio & fits in parent
        autoCenter: Phaser.Scale.CENTER_BOTH // Center horizontally & vertically
    },

      // Enable arcade physics here:
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 } // or whatever you want
        }
    },

    pixelArt: true,
    
    backgroundColor: '#006400', // fallback color if images don't cover background

    scene: [BootScene, IntroScene, MapScene, TransicionBatalla, GameScene, UIScene],
};

// Create the Phaser game using the config above
new Phaser.Game(config);
