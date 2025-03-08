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
        this.coinText = this.add.text(50, 15, 'Dinero: ' + this.registry.get('coins'), {
            font: '18px Arial', fill: '#fff'
        }).setOrigin(0).setScrollFactor(0);
        // Update coin text when the global coin count changes
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinText.setText('Dinero: ' + value);
        });

        // 2. Shop Button (next to coin count)
        const shopButton = new UIButton(this, 110, 60, 'Tienda', () => {
            // Retrieve the key of the currently active map from the registry
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
            this.scene.pause(currentMap);
            }
            this.scene.launch('ShopScene'); // Ensure the key matches your Shop scene
            this.scene.sleep('UIOverlay');
        }, { frameWidth: 142, frameHeight: 28 });
        
        // 3. Jokers Button (bottom-right corner)
        const jokersButton = new UIButton(this, width - 120, height - 50, 'Jokers', () => {
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
            this.scene.pause(currentMap);
            }
            this.scene.launch('JokersInventoryScene');
            this.scene.sleep('UIOverlay');
        }, { frameWidth: 142, frameHeight: 28 });
        
        // 4. Deck Button (above Jokers button in bottom-right)
        const deckButton = new UIButton(this, width - 120, height - 80, 'Baraja', () => {
            this.showDeckPopup();
        }, { frameWidth: 142, frameHeight: 28 });

        // When the scene wakes (e.g., returning from Shop or Inventory), update coin text
        this.events.on('wake', () => {
            this.coinText.setText('Coins: ' + this.registry.get('coins'));
        });
    }

    // Popup for Deck cards remains here as an example
    showDeckPopup() {
        const width = this.scale.width;
        const height = this.scale.height;
        const popupBg = this.add.rectangle(width / 2, height / 2, width * 0.8, height * 0.8, 0x000000, 0.7);
        const deckList = this.add.text(width / 2, height / 2, 'Player Deck:\n- Card 1\n- Card 2\n- ...', {
            font: '18px Arial', fill: '#fff', align: 'center'
        }).setOrigin(0.5);
        const closeBtn = new UIButton(this, width * 0.9, height * 0.2, 'X', () => {
            popupContainer.destroy();
        });
        // Group elements in a container for easier management
        const popupContainer = this.add.container(0, 0, [popupBg, deckList, closeBtn]);
        // Also allow clicking on the background to close the popup
        popupBg.setInteractive().on('pointerdown', () => popupContainer.destroy());
    }
}
