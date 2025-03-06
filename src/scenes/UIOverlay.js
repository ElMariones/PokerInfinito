// UIOverlay.js - A persistent HUD scene for coin display and menu buttons
export default class UIOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'UIOverlay', active: false }); 
        // We start it manually from the game scene when needed
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // 1. Coin display (icon + text in top-left)
        this.coinText = this.add.text(50, 15, 'Coins: ' + this.registry.get('coins'), {
            font: '18px Arial', fill: '#fff'
        }).setOrigin(0).setScrollFactor(0);
        // Update coin text when the global coin count changes
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinText.setText('Coins: ' + value);
        });

        // 2. Shop Button (next to coin count)
        const shopButton = this.add.text(150, 15, '[Shop]', { font: '18px Arial', fill: '#0f0' })
            .setOrigin(0)
            .setInteractive({ useHandCursor: true });
        // On click, open the Shop scene
        shopButton.on('pointerdown', () => {
            // Pause the current game (MapScene) and launch Shop scene
            // Retrieve the key of the currently active map from the registry
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
                this.scene.pause(currentMap);
            }
            this.scene.launch('ShopScene'); // Ensure the key matches your Shop scene
            // Hide the UI overlay while in Shop
            this.scene.sleep('UIOverlay');
        });

        // 3. Jokers Button (bottom-right corner)
        const jokersButton = this.add.text(width - 100, height - 50, '[Jokers]', { font: '16px Arial', fill: '#fff' })
            .setInteractive({ useHandCursor: true });
        jokersButton.on('pointerdown', () => {
            // Pause the main game and launch the Jokers Inventory scene
            // Retrieve the key of the currently active map from the registry
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
                this.scene.pause(currentMap);
            }
            this.scene.launch('JokersInventoryScene');
            this.scene.sleep('UIOverlay');
        });

        // 4. Deck Button (above Jokers button in bottom-right)
        const deckButton = this.add.text(width - 100, height - 80, '[Deck]', { font: '16px Arial', fill: '#fff' })
            .setInteractive({ useHandCursor: true });
        deckButton.on('pointerdown', () => {
            this.showDeckPopup();
        });

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
        const closeBtn = this.add.text(width * 0.9, height * 0.2, 'X', { font: '20px Arial', fill: '#f00' })
            .setInteractive({ useHandCursor: true });
        const popupContainer = this.add.container(0, 0, [popupBg, deckList, closeBtn]);
        closeBtn.on('pointerdown', () => popupContainer.destroy());
        popupBg.setInteractive().on('pointerdown', () => popupContainer.destroy());
    }
}
