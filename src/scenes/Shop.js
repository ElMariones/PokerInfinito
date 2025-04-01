import Jokers from '../utils/Jokers.js';
import Inventory from '../utils/Inventory.js';
import UIButton from '../utils/Button.js';

export default class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Add a semi-transparent background
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        // Title for the shop
        this.add.text(width / 2, 50, "tienda de jokers", {font: '24px MarioKart', fill: '#fff', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5);

        // Create the Inventory helper and display player's coin count
        this.inventory = new Inventory(this);
        this.coinText = this.add.text(20, 20, `dinero: ${this.registry.get('coins')}`, {font: '18px MarioKart', fill: '#fff', stroke: '#000000', strokeThickness: 2  });

        // Randomly select three unique jokers for sale
        let jokerOptions = [...Jokers];
        Phaser.Utils.Array.Shuffle(jokerOptions);
        jokerOptions = jokerOptions.slice(0, 3);

        // Layout settings for rows and positioning
        const rowHeight = 250;   // Vertical spacing per joker row
        const startY = 150;      // Starting Y position for the first row
        const imageX = 100;      // X position for the joker plane image
        const textX = 250;       // X position for the text details

        // Loop through each selected joker and display its details
        jokerOptions.forEach((joker, index) => {
            const { id, name, image, effect, price } = joker;
            const yPos = startY + index * rowHeight;

            // Create a plane for the joker image with the provided postFX effect
            const jokerPlane = this.add.plane(imageX, yPos, image);
            // Scale the plane (adjust scale as needed to suit your layout)
            jokerPlane.setScale(0.8);
            // Add a shine effect to the plane
            jokerPlane.postFX.addShine(1, 0.2, 5);
            // Animate the plane to rotate along the Y-axis continuously
            this.add.tween({
                targets: jokerPlane,
                duration: 8000,
                rotateY: 360,
                repeat: -1
            });

            // Display the Joker's name above the image
            this.add.text(textX, yPos - 60, name, { font: '20px Arial', fill: '#fff' }).setOrigin(0, 0);
            // Display the Joker's effect as a description
            this.add.text(textX, yPos - 30, effect, { font: '16px Arial', fill: '#ddd' }).setOrigin(0, 0);
            // Display the Joker's price
            this.add.text(textX, yPos, `Precio: ${price} monedas`, { font: '16px Arial', fill: '#fff' }).setOrigin(0, 0);

            // Position for the Buy/Owned button
            const buttonX = width - 120;
            const buttonY = yPos;

            // Check if the player already owns the joker
            if (this.inventory.hasJoker(id)) {
                const ownedButton = new UIButton(this, buttonX, buttonY, "comprado", "green", () => {});
                ownedButton.disable();
            } else if (this.registry.get('jokers').length >= 5) {
                const fullInventoryButton = new UIButton(this, buttonX, buttonY, "inventario lleno", "green", () => {});
                fullInventoryButton.disable();
            } else {
                // Create a Buy button using UIButton with green type
                const buyButton = new UIButton(this, buttonX, buttonY, "comprar", "green", () => {
                    const currentCoins = this.registry.get('coins');
                    if (currentCoins >= price && this.registry.get('jokers').length < 5) {
                        // Deduct the price, add the joker to inventory, and update the display
                        this.registry.set('coins', currentCoins - price);
                        this.inventory.addJoker(id);
                        this.coinText.setText(`Dinero: ${this.registry.get('coins')}`);
                        buyButton.label.setText("comprado");
                        buyButton.disable();
                    } else if (this.registry.get('jokers').length >= 5) {
                        // Feedback for full inventory
                        buyButton.label.setText("inventario lleno");
                        buyButton.disable();
                        buyButton.label.setColor('#ff0000'); // Set text color to red
                    } else {
                        buyButton.label.setText("dinero insuficiente");
                        buyButton.disable();
                        buyButton.label.setColor('#ff0000'); // Set text color to red
                    }
                });
            }
        });

        // Add an Exit button at the bottom of the scene (red button)
        const exitButton = new UIButton(
            this,
            width / 2,
            height - 50,
            "cerrar",
            "red",
            () => {
                const currentMap = this.registry.get('currentMap');
                this.scene.stop('ShopScene');
                if (currentMap) {
                    this.scene.resume(currentMap);
                }
                this.scene.wake('UIOverlay');
            }
        );
        exitButton.setScale(1.3);
    }
}
