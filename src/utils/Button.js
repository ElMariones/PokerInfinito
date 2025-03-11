// Button.js
export default class UIButton extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene - The scene this button belongs to.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {string} labelText - The text to display on the button.
     * @param {Function} callback - Function to call when the button is clicked.
     * @param {any} context - (Optional) Context for the callback.
     */
    constructor(scene, x, y, labelText, callback, context) {
        super(scene, x, y);
        this.scene = scene;
        this.callback = callback;
        this.context = context;

        // Create the button background using the button_default spritesheet.
        // Assumes the spritesheet key is 'button_default' and the first frame (index 0) is the normal state.
        this.bg = scene.add.sprite(0, 0, 'button_default', 0).setOrigin(0.5);
        
        // Create the text label on top of the button background.
        this.label = scene.add.text(0, 0, labelText, { font: '16px Arial', fill: '#fff' })
                              .setOrigin(0.5);
        
        // Add background and text to the container.
        this.add(this.bg);
        this.add(this.label);

        // Set the size for input and make it interactive.
        this.setSize(this.bg.displayWidth, this.bg.displayHeight);
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                -this.bg.displayWidth / 12, 
                -this.bg.displayHeight / 12, 
                this.bg.displayWidth, 
                this.bg.displayHeight
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // Set up pointer events to change frames.
        this.on('pointerover', this.onHover, this);
        this.on('pointerout', this.onOut, this);
        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);

        // Add this container to the scene.
        scene.add.existing(this);
        this.disabled = false;
    }

    onHover() {
        if (!this.disabled) {
            this.bg.setFrame(1); // Hover state
        }
    }

    onOut() {
        if (!this.disabled) {
            this.bg.setFrame(0); // Normal state
        }
    }

    onDown() {
        if (!this.disabled) {
            this.bg.setFrame(2); // Clicked state
        }
    }

    onUp() {
        if (!this.disabled) {
            // Return to hover if still over, or normal if not.
            this.bg.setFrame(1);
            if (this.callback) {
                this.callback.call(this.context || this.scene);
            }
        }
    }

    disable() {
        this.disabled = true;
        this.bg.setFrame(3); // Disabled state
        this.disableInteractive();
    }

    enable() {
        this.disabled = false;
        this.bg.setFrame(0); // Normal state
        this.setInteractive(
            new Phaser.Geom.Rectangle(-this.bg.width / 2, -this.bg.height / 2, this.bg.width, this.bg.height),
            Phaser.Geom.Rectangle.Contains
        );
    }
}
