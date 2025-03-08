// Shop.js – A Phaser Scene for the Joker Shop
import Jokers from '../utils/Jokers.js';
import Inventory from '../utils/Inventory.js';
import UIButton from '../utils/Button.js';  // Import the custom button class

export default class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Add semi-transparent background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        // Title for the shop
        this.add.text(width / 2, 50, "Tienda de Jokers", { font: "24px Arial", fill: "#fff" })
                .setOrigin(0.5);

        // Create an Inventory helper for this scene
        this.inventory = new Inventory(this);

        // Display player's current coin count at top
        this.coinText = this.add.text(20, 20, `Dinero: ${this.registry.get('coins')}`, 
                                       { font: '18px Arial', fill: '#fff' });

        // Randomly select five unique jokers for sale
        let jokerOptions = [...Jokers];
        Phaser.Utils.Array.Shuffle(jokerOptions);
        jokerOptions = jokerOptions.slice(0, 5);

        // Layout variables for positioning the shop items
        const startX = width / 2 - 150;
        const startY = 100;
        let offsetY = 10;

        jokerOptions.forEach(joker => {
            const { id, name, price } = joker;
            const owned = this.inventory.hasJoker(id);

            // Display Joker name and price
            this.add.text(startX, startY + offsetY, `${name} - ${price} monedas`, 
                          { font: '16px Arial', fill: '#ffffff' }).setOrigin(0, 0.5);

            if (owned) {
                // If already owned, show "Owned" label instead of a buy button
                const ownedButton = new UIButton(
                  this, 
                  startX + 300, 
                  startY + offsetY, 
                  "Comprado", 
                  () => {}
                );
                ownedButton.bg.setFrame(3); // Set to disabled state
                ownedButton.disable();
            } else {
                // Create a Buy button using UIButton
                const buyButton = new UIButton(
                    this, 
                    startX + 300, 
                    startY + offsetY, 
                    "Comprar", 
                    () => {
                        const currentCoins = this.registry.get('coins');
                        if (currentCoins >= price) {
                            // Deduct price and add Joker to inventory
                            this.registry.set('coins', currentCoins - price);
                            this.inventory.addJoker(id);
                            // Update coin display and mark this item as owned
                            this.coinText.setText(`Dinero: ${this.registry.get('coins')}`);
                            buyButton.label.setText("Comprado");
                            buyButton.bg.setFrame(3); // Optionally show disabled state
                            buyButton.disable();
                        } else {
                            // Optional: feedback that not enough coins (flash red, etc.)
                            buyButton.bg.setFrame(2); // Use the clicked state briefly
                            this.time.delayedCall(500, () => {
                                buyButton.bg.setFrame(0);
                            });
                        }
                    }
                );
            }
            offsetY += 30;  // Move down for the next item
        });

        // Add an Exit button at the bottom using UIButton
        const exitButton = new UIButton(
            this, 
            width / 2, 
            height - 50, 
            "Cerrar", 
            () => {
                // Retrieve the key of the current map scene
                const currentMap = this.registry.get('currentMap');
                this.scene.stop('ShopScene');
                if (currentMap) {
                    this.scene.resume(currentMap);
                }
                this.scene.wake('UIOverlay');
            }
        );
        exitButton.setScale(1.0);
    }
}
