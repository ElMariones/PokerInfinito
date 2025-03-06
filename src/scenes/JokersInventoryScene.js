// JokersInventoryScene.js – Scene for displaying the player's owned jokers
import Inventory from '../utils/Inventory.js';  // adjust the import path as needed

export default class JokersInventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JokersInventoryScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Optional: a semi-transparent background to dim the underlying game
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        // Title for the inventory scene
        this.add.text(width / 2, 50, "Your Owned Jokers", { font: "24px Arial", fill: "#fff" })
            .setOrigin(0.5);

        // Create an Inventory helper instance
        const inventory = new Inventory(this);
        // Get the owned jokers array from the registry (should be an array of IDs)
        const ownedIds = this.registry.get('jokers') || [];

        let offsetY = 100;
        if (ownedIds.length === 0) {
            this.add.text(width / 2, offsetY, "You don't own any jokers yet.", 
                { font: "18px Arial", fill: "#ffaaaa" }).setOrigin(0.5);
        } else {
            // For each owned joker, display its name (and optionally other details)
            ownedIds.forEach(id => {
                const joker = inventory.getJokerById(id);
                if (joker) {
                    // Display name and effect as an example
                    this.add.text(width / 2, offsetY, `${joker.name} - ${joker.effect}`, 
                        { font: "18px Arial", fill: "#ffffaa" }).setOrigin(0.5);
                    offsetY += 30;
                }
            });
        }

        // Exit button at the bottom
        const exitButton = this.add.text(width / 2, height - 50, "[ Exit ]", 
                          { font: "20px Arial", fill: "#ff0000" })
                          .setOrigin(0.5)
                          .setInteractive({ useHandCursor: true });
        exitButton.on('pointerdown', () => {
            // Retrieve the key of the current map scene
            const currentMap = this.registry.get('currentMap');
            this.scene.stop('JokersInventoryScene');
            if (currentMap) {
            this.scene.resume(currentMap);
            }
            this.scene.wake('UIOverlay');
        });
    }
}
