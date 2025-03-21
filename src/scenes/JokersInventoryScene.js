import Inventory from '../utils/Inventory.js';
import UIButton from '../utils/Button.js';

export default class JokersInventoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JokersInventoryScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Semi-transparent background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        // Title for the inventory scene
        this.add.text(width / 2, 50, "Tus jokers:", { font: "24px Arial", fill: "#fff" }).setOrigin(0.5);

        // Create an Inventory helper instance and get the owned jokers (IDs)
        const inventory = new Inventory(this);
        const ownedIds = this.registry.get('jokers') || [];

        if (ownedIds.length === 0) {
            this.add.text(width / 2, height / 2, "Aún no tienes ningún joker.",
                { font: "18px Arial", fill: "#ffaaaa" }).setOrigin(0.5);
        } else {
            // Limit display to a maximum of 5 jokers
            const displayIds = ownedIds.slice(0, 5);

            // Split into two rows: first row (max 3 jokers) and second row (remaining up to 2)
            const row1Ids = displayIds.slice(0, 3);
            const row2Ids = displayIds.slice(3);

            // Define y positions for each row (adjust as needed)
            const row1Y = height / 2 - 100; // top row
            const row2Y = height / 2 + 150; // bottom row

            // Helper function to create the animated plane and name text for a given joker
            const createJokerDisplay = (joker, x, y) => {
                // Create the joker plane image and apply the shine and rotation effects
                const jokerPlane = this.add.plane(x, y, joker.image);
                jokerPlane.setScale(1);
                jokerPlane.postFX.addShine(1, 0.2, 5);
                this.add.tween({
                    targets: jokerPlane,
                    duration: 8000,
                    rotateY: 360,
                    repeat: -1
                });
                // Display the joker name below the image.
                // The image height is 210 pixels (original) scaled by 2 → 420 pixels tall,
                // so we offset by half that height plus a margin (e.g., 20 pixels).
                this.add.text(x, y + (210) / 2 + 20, joker.name, { font: "16px Arial", fill: "#fff" }).setOrigin(0.5);
            };

            // --- Display Row 1 ---
            row1Ids.forEach((id, i) => {
                const joker = inventory.getJokerById(id);
                if (joker) {
                    // Evenly space the row items horizontally.
                    const count = row1Ids.length;
                    const xPos = (i + 1) * (width / (count + 1));
                    createJokerDisplay(joker, xPos, row1Y);
                }
            });

            // --- Display Row 2 (if any) ---
            row2Ids.forEach((id, i) => {
                const joker = inventory.getJokerById(id);
                if (joker) {
                    const count = row2Ids.length;
                    const xPos = (i + 1) * (width / (count + 1));
                    createJokerDisplay(joker, xPos, row2Y);
                }
            });
        }

        // Exit button at the bottom of the scene using UIButton
        const exitButton = new UIButton(
            this,
            width / 2,
            height - 50,
            "Cerrar",
            () => {
                const currentMap = this.registry.get('currentMap');
                this.scene.stop('JokersInventoryScene');
                if (currentMap) {
                    this.scene.resume(currentMap);
                }
                this.scene.wake('UIOverlay');
            }
        );
        exitButton.setScale(1.3);
    }
}
