// UIOverlay.js - A persistent HUD scene for coin display and menu buttons
import UIButton from '../utils/Button.js';  // Adjust the path as necessary

export default class UIOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'UIOverlay', active: false }); 
        // We start it manually from the game scene when needed
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // 1. Coin display (icon + text in top-left)
        this.coinText = this.add.text(50, 15, 'dinero: ' + this.registry.get('coins'), {
            font: '25px MarioKart', fill: '#fff', stroke: '#000000', strokeThickness: 2 
        }).setOrigin(0).setScrollFactor(0);
        // Update coin text when the global coin count changes
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinText.setText('dinero: ' + value);
        });

        // 2. Shop Button (next to coin count)
        const shopButton = new UIButton(this, 85, 70, 'tienda', 'green', () => {
            // Retrieve the key of the currently active map from the registry
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
            this.scene.pause(currentMap);
            }
            this.scene.launch('ShopScene'); // Ensure the key matches your Shop scene
            this.scene.sleep('UIOverlay');
        });

        // 2.1 Audio Button (just below the tienda button)
        // Ensure a global flag is set for music (default: enabled)
        if (this.registry.get('musicEnabled') === undefined) {
            this.registry.set('musicEnabled', true);
        }
        // Determine the initial toggled state based on the musicEnabled flag
        const isToggled = !this.registry.get('musicEnabled');
        // Create an audio button using the "sound" type.
        // The callback receives the toggled state (true when toggled on).
        const audioButton = new UIButton(this, 85, 130, '', 'sound', (toggled) => {
            if (toggled) {
            // Music is toggled off
            this.registry.set('musicEnabled', false);
            this.sound.pauseAll();
            } else {
            // Music is toggled on
            this.registry.set('musicEnabled', true);
            this.sound.resumeAll();
            }
        }, isToggled);
        
        // 3. Jokers Button (bottom-right corner)
        const jokersButton = new UIButton(this, width - 120, height - 40, 'jokers', 'green', () => {
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
            this.scene.pause(currentMap);
            }
            this.scene.launch('JokersInventoryScene');
            this.scene.sleep('UIOverlay');
        });
        
        // 4. Deck Button (above Jokers button in bottom-right)
        const deckButton = new UIButton(this, width - 120, height - 100, 'misiones', 'green', () => {
            this.showMisionesPopup();
        });

        // When the scene wakes (e.g., returning from Shop or Inventory), update coin text
        this.events.on('wake', () => {
            this.coinText.setText('Dinero: ' + this.registry.get('coins'));
        });
    }

// Popup for Misiones
showMisionesPopup() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Create a semi-transparent background rectangle
    const popupBg = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.8, 0x000000, 0.7);

    // Retrieve the current stage; default to 0 if not set
    const stage = this.registry.get('stage') || 0;
    let missionText = '';

    // Select the mission text based on the current stage
    switch (stage) {
        case 0:
            missionText = 'deberías ir al asador y derrotar al dueño.';
            break;
        case 1:
            missionText = 'el siguiente paso es el olvido, alguien te espera dentro.';
            break;
        case 2:
            missionText = 'deberias ir al barco y luchar contra el capitán.';
            break;
        case 3:
            missionText = 'Los gemelos te esperan en el Rincon del bandido';
            break;
        case 4:
            missionText = 've al casino y enfrentate a su lider.';
            break;
        case 5:
            missionText = 'enhorabuena. has completado el juego...';
            break;
        default:
            missionText = 'Mision desconocida.';
    }

    // Create a text object for displaying the mission
    const missionDisplay = this.add.text(width / 2, height / 2, missionText, {
        font: '18px MarioKart',
        fill: '#fff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);

    // Create a smaller hint text at the bottom center
    const closeHint = this.add.text(width / 2, height * 0.75, '(haz click para cerrar)', {
        font: '14px MarioKart',
        fill: '#fff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);

    // Group all popup elements into a container for easy management
    const popupContainer = this.add.container(0, 0, [popupBg, missionDisplay, closeHint]);

    // Also allow clicking on the background to close the popup
    popupBg.setInteractive().on('pointerdown', () => popupContainer.destroy());
}


}
