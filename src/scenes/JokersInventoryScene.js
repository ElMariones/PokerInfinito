// JokersInventoryScene.js – Scene for displaying the player's owned jokers
import Inventory from '../utils/Inventory.js';  // adjust the import path as needed
import UIButton from '../utils/Button.js';        // import the custom UIButton

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
        this.add.text(width / 2, 50, "Tus jokers:", { font: "24px Arial", fill: "#fff" })
            .setOrigin(0.5);

        // Create an Inventory helper instance
        const inventory = new Inventory(this);
        // Get the owned jokers array from the registry (should be an array of IDs)
        const ownedIds = this.registry.get('jokers') || [];

        let offsetY = 100;
        if (ownedIds.length === 0) {
            this.add.text(width / 2, offsetY, "Aún no tienes ningún joker.", 
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

        // Exit button at the bottom using UIButton
        const exitButton = new UIButton(
            this, 
            width / 2, 
            height - 50, 
            "Cerrar", 
            () => {
                // Retrieve the key of the current map scene
                const currentMap = this.registry.get('currentMap');
                this.scene.stop('JokersInventoryScene');
                if (currentMap) {
                    this.scene.resume(currentMap);
                }
                this.scene.wake('UIOverlay');
            }
        );
        // Optionally adjust scale if necessary:
        exitButton.setScale(1.0);
    }
}
