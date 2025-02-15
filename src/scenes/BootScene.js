import Phaser from 'phaser'; 
import cards from '../cards.js';

// Import additional assets
import playButton from '../../assets/images/play.png';
import submitBtn from '../../assets/images/submit.png';
import shuffleBtn from '../../assets/images/shuffle.png';
import rug from '../../assets/images/rug.png';

// NEW imports
import background from '../../assets/images/background.png';
import player from '../../assets/images/player.png';
import npc1 from '../../assets/images/npc1.png';
import npc2 from '../../assets/images/npc2.png';
import npc3 from '../../assets/images/npc3.png';
import blacksmith from '../../assets/images/blacksmith.png';
import adventurer from '../../assets/images/adventurer.png';
import faceoff from '../../assets/images/faceoff.png';


// NEW: Sort button skins
import sortNum from '../../assets/images/sortnum.png';
import sortColor from '../../assets/images/sortcolor.png';

// Load the font
import fontUrl from '../../assets/fonts/MarioKart.ttf';

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
    this.load.image('blacksmith', blacksmith);
    this.load.image('adventurer', adventurer);
    this.load.image('faceoff', faceoff);

    // NEW: Load sort button images
    this.load.image('sortNum', sortNum);
    this.load.image('sortColor', sortColor);

    // NEW: Load map, player, and NPC images
    this.load.image('background', background);
    this.load.image('player', player);
    this.load.image('npc1', npc1);
    this.load.image('npc2', npc2);
    this.load.image('npc3', npc3);

    // Inject custom font into the page
    this.loadFont('Mleitod', fontUrl);
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
