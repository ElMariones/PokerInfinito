// UIOverlay.js - A persistent HUD scene for coin display and menu buttons
import UIButton from '../utils/Button.js';  // Adjust the path as necessary

export default class UIOverlay extends Phaser.Scene {
    constructor() {
        super({ key: 'UIOverlay', active: false }); 
        // We start it manually from the game scene when needed
        this.isPopupShowing = false; // Add property to track popup state
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // 1. Coin display (icon + text in top-left)
        // Add coin image
        this.coinImage = this.add.image(40, 37, 'moneda')
            .setScale(0.05)
            .setScrollFactor(0);
        
        // Add glow effect to coin using postFX
        this.coinImage.setPostPipeline('rexhorrifipipelineplugin');
        this.coinImage.postFX.addGlow(0xfaac01, 0.8, 0.8);
        
        // Add 3D distort effect to coin
        this.tweens.add({
            targets: this.coinImage,
            scaleX: 0.055,
            scaleY: 0.045,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add coin text with new styling
        this.coinText = this.add.text(70, 25, this.registry.get('coins'), {
            font: '25px RetroFont',
            fill: '#faac01',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0).setScrollFactor(0);

        // Add glow effect to text using postFX
        this.coinText.setPostPipeline('rexhorrifipipelineplugin');
        this.coinText.postFX.addGlow(0xfaac01, 0.8, 0.8);

        // Add 3D distort effect to text
        this.tweens.add({
            targets: this.coinText,
            scaleX: 1.05,
            scaleY: 0.95,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Update coin text when the global coin count changes
        this.registry.events.on('changedata-coins', (parent, value) => {
            this.coinText.setText(value);
        });

        // 2. Shop Button (next to coin count)
        const shopButton = new UIButton(this, 83, 90, 'Tienda', 'green', () => {
            // Retrieve the key of the currently active map from the registry
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
            this.scene.pause(currentMap);
            }
            this.scene.launch('ShopScene'); // Ensure the key matches your Shop scene
            this.scene.sleep('UIOverlay');
        });
        // Add glow effect to shop button
        shopButton.setPostPipeline('rexhorrifipipelineplugin');
        shopButton.postFX.addGlow(0x5fb965, 0.8, 0.8);
        shopButton.setScale(1.2); // Make button bigger

        // 2.1 Audio Button (just below the tienda button)
        // Ensure a global flag is set for music (default: enabled)
        if (this.registry.get('musicEnabled') === undefined) {
            this.registry.set('musicEnabled', true);
        }
        // Determine the initial toggled state based on the musicEnabled flag
        const isToggled = !this.registry.get('musicEnabled');
        // Create an audio button using the "sound" type.
        // The callback receives the toggled state (true when toggled on).
        const audioButton = new UIButton(this, 83, 150, '', 'sound', (toggled) => {
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
        // Add glow effect to audio button
        audioButton.setPostPipeline('rexhorrifipipelineplugin');
        audioButton.postFX.addGlow(0x5fb6b9, 0.8, 0.8);
        audioButton.setScale(1.2); // Make button bigger
        
        // 3. Jokers Button (bottom-right corner)
        const jokersButton = new UIButton(this, width - 90, height - 50, 'Jokers', 'green', () => {
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
            this.scene.pause(currentMap);
            }
            this.scene.launch('JokersInventoryScene');
            this.scene.sleep('UIOverlay');
        });
        // Add glow effect to jokers button
        jokersButton.setPostPipeline('rexhorrifipipelineplugin');
        jokersButton.postFX.addGlow(0x5fb965, 0.8, 0.8);
        jokersButton.setScale(1.2); // Make button bigger
        
        // 4. Deck Button (above Jokers button in bottom-right)
        const deckButton = new UIButton(this, width - 90, height - 110, 'Misión', 'yellow', () => {
            if (this.isPopupShowing) {
                // If popup is showing, destroy it
                if (this.popupContainer) {
                    this.popupContainer.destroy();
                    this.popupContainer = null;
                }
                this.isPopupShowing = false;
            } else {
                // If popup is not showing, show it
                this.showMisionesPopup();
            }
        });
        // Add glow effect to deck button
        deckButton.setPostPipeline('rexhorrifipipelineplugin');
        deckButton.postFX.addGlow(0xa8984e, 0.8, 0.8);
        deckButton.setScale(1.2); // Make button bigger

        // When the scene wakes (e.g., returning from Shop or Inventory), update coin text
        this.events.on('wake', () => {
            this.coinText.setText(this.registry.get('coins'));
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
            missionText = 'Deberías ir al asador\ny derrotar al dueño.';
            break;
        case 1:
            missionText = 'El siguiente paso es El Olvido,\nalguien te espera dentro.';
            break;
        case 2:
            missionText = 'Deberias ir al barco\ny luchar contra el capitán.';
            break;
        case 3:
            missionText = 'Los gemelos te esperan\nen el Rincon del Bandido';
            break;
        case 4:
            missionText = 'Ve al casino\ny enfrentate a su lider.';
            break;
        case 5:
            missionText = 'Enhorabuena.\nHas completado el juego...';
            break;
        default:
            missionText = 'Mision desconocida.';
    }

    // Create a text object for displaying the mission
    const missionDisplay = this.add.text(width / 2, height / 2, missionText, {
        font: '16px RetroFont',
        fill: '#fff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);

    // Create a smaller hint text at the bottom center
    const closeHint = this.add.text(width / 2, height * 0.75, '(Haz click para cerrar)', {
        font: '14px RetroFont',
        fill: '#fff',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 2
    }).setOrigin(0.5);

    // Group all popup elements into a container for easy management
    this.popupContainer = this.add.container(0, 0, [popupBg, missionDisplay, closeHint]);
    this.isPopupShowing = true;

    // Also allow clicking on the background to close the popup
    popupBg.setInteractive().on('pointerdown', () => {
        this.popupContainer.destroy();
        this.popupContainer = null;
        this.isPopupShowing = false;
    });
}

}
