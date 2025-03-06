// Shop.js – A Phaser Scene for the Joker Shop
import Jokers from '../utils/Jokers.js';
import Inventory from '../utils/Inventory.js';

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
        this.add.text(width / 2, 50, "Joker Shop", { font: "24px Arial", fill: "#fff" })
                .setOrigin(0.5);

        // Create an Inventory helper for this scene
        this.inventory = new Inventory(this);

        // Display player's current coin count at top
        this.coinText = this.add.text(20, 20, `Coins: ${this.registry.get('coins')}`, 
                                                                    { font: '18px Arial', fill: '#fff' });

        // Randomly select five unique jokers for sale
        let jokerOptions = [...Jokers];
        Phaser.Utils.Array.Shuffle(jokerOptions);
        jokerOptions = jokerOptions.slice(0, 5);

        // Layout variables for positioning the shop items
        const startX = width / 2 - 150;
        const startY = 100;
        let offsetY = 0;

        jokerOptions.forEach(joker => {
            const { id, name, price } = joker;
            const owned = this.inventory.hasJoker(id);

            // Display Joker name and price
            this.add.text(startX, startY + offsetY, `${name} - ${price} coins`, 
                                        { font: '16px Arial', fill: '#ffffff' }).setOrigin(0, 0.5);

            if (owned) {
                // If already owned, show "Owned" label instead of a buy button
                this.add.text(startX + 200, startY + offsetY, "Owned", 
                                            { font: '16px Arial', fill: '#00ff00' }).setOrigin(0, 0.5);
      } else {
        // Create a Buy button for this Joker
        const buyButton = this.add.text(startX + 200, startY + offsetY, "[ Buy ]", 
                                        { font: '16px Arial', fill: '#00aeff' });
        buyButton.setInteractive();  // make the text clickable as a button&#8203;:contentReference[oaicite:6]{index=6}

        // Handle the click (pointerdown) event on the buy button
        buyButton.on('pointerdown', () => {  // listen for pointerdown on this GameObject&#8203;:contentReference[oaicite:7]{index=7}
          const currentCoins = this.registry.get('coins');
          if (currentCoins >= price) {
            // Deduct price and add Joker to inventory
            this.registry.set('coins', currentCoins - price);
            this.inventory.addJoker(id);
            // Update UI: coin display and mark this item as owned
            this.coinText.setText(`Coins: ${this.registry.get('coins')}`);
            buyButton.setText("Owned").setStyle({ fill: '#00ff00' });
            buyButton.disableInteractive();  // disable further clicks on this button
          } else {
            // Optional: feedback that not enough coins (e.g., flash red or show a message)
            buyButton.setStyle({ fill: '#ff0000' });
            this.time.delayedCall(500, () => {
              buyButton.setStyle({ fill: '#00aeff' });
            });
          }
        });
      }

      offsetY += 30;  // move down for the next item
    });

    // Add this after your jokerOptions.forEach loop in the create() method:

// Exit button at the bottom
const exitButton = this.add.text(width / 2, height - 50, "[ Exit ]", 
    { font: "20px Arial", fill: "#ff0000" })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

exitButton.on('pointerdown', () => {
    this.scene.stop('ShopScene');
    this.scene.resume('MapScene');
    this.scene.wake('UIOverlay');
});

  }
}
