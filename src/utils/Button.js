// Buttons.js
export default class UIButton extends Phaser.GameObjects.Container {
    // Mapping for button types to their respective frame indices.
    static BUTTON_FRAMES = {
        green: { normal: 1, hover: 2, down: 3 },
        red:   { normal: 4, hover: 5, down: 6 },
        sound: { normal: 7, hover: 8, down: 9 }
    };

    /**
     * @param {Phaser.Scene} scene - The scene this button belongs to.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {string} labelText - The text to display on the button.
     * @param {string} buttonType - Button type ('green', 'red', or 'sound').
     * @param {Function} callback - Function to call when the button is clicked.
     * @param {any} context - (Optional) Context for the callback.
     */
    constructor(scene, x, y, labelText, buttonType, callback, context) {
        super(scene, x, y);
        this.scene = scene;
        this.callback = callback;
        this.context = context;
        this.buttonType = buttonType;

        // For sound buttons, initialize toggled property.
        if (this.buttonType === 'sound') {
            this.toggled = false;
        }

        // Create the button background using the "botones" spritesheet.
        const frames = UIButton.BUTTON_FRAMES[this.buttonType] || { normal: 1, hover: 2, down: 3 };
        this.bg = scene.add.sprite(0, 0, 'botones', frames.normal).setOrigin(0.5);
        
        // Calculate the base width (36 pixels) and the minimum width needed for the text
        const baseWidth = 36 * 2.2;
        const textWidth = labelText.length * 8; // Approximate width per character
        const minWidth = Math.max(baseWidth, textWidth + 20); // Add some padding
        
        // Set the button size with dynamic width
        this.bg.setDisplaySize(minWidth, 18 * 2.2);
        
        // Create the text label to display on the button.
        this.label = scene.add.text(0, 0, labelText, { 
            font: '11px RetroFont', 
            fill: '#fff', 
            stroke: '#000000', 
            strokeThickness: 2,
            letterSpacing: -2 // Negative letter spacing to make text more compact
        }).setOrigin(0.5, 1);
        
        // Add both the background and the label to the container.
        this.add(this.bg);
        this.add(this.label);

        // Set size for input and make the container interactive.
        this.setSize(this.bg.displayWidth, this.bg.displayHeight);
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                -this.bg.displayWidth / 2 + this.bg.displayWidth * 0.5, 
                -this.bg.displayHeight / 2 + this.bg.displayHeight * 0.5, 
                this.bg.displayWidth, 
                this.bg.displayHeight
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // Set up pointer events.
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
            const frames = UIButton.BUTTON_FRAMES[this.buttonType];
            // For sound buttons, if toggled, remain down.
            if (this.buttonType === 'sound' && this.toggled) return;
            if (frames) {
                this.bg.setFrame(frames.hover);
            }
        }
    }

    onOut() {
        if (!this.disabled) {
            const frames = UIButton.BUTTON_FRAMES[this.buttonType];
            // For sound buttons, if toggled, remain down.
            if (this.buttonType === 'sound' && this.toggled) return;
            if (frames) {
                this.bg.setFrame(frames.normal);
            }
        }
    }

    onDown() {
        if (!this.disabled) {
            const frames = UIButton.BUTTON_FRAMES[this.buttonType];
            if (this.buttonType === 'sound') {
                if (!this.toggled && frames) {
                    this.bg.setFrame(frames.down);
                    this.label.setY(5);
                }
            } else {
                if (frames) {
                    this.bg.setFrame(frames.down);
                    this.label.setY(5);
                }
            }
        }
    }

    onUp() {
        if (!this.disabled) {
            const frames = UIButton.BUTTON_FRAMES[this.buttonType];
            if (this.buttonType === 'sound') {
                // Toggle the audio button.
                if (!this.toggled) {
                    this.toggled = true;
                    if (frames) {
                        this.bg.setFrame(frames.down); // Stay in the down state.
                    }
                } else {
                    this.toggled = false;
                    if (frames) {
                        this.bg.setFrame(frames.normal);
                    }
                    this.label.setY(0);
                }
                if (this.callback) {
                    this.callback.call(this.context || this.scene, this.toggled);
                }
            } else {
                if (frames) {
                    this.bg.setFrame(frames.hover);
                    this.label.setY(0);
                }
                if (this.callback) {
                    this.callback.call(this.context || this.scene);
                }
            }
        }
    }

    /**
     * Disables the button (sets to disabled frame and makes it non-interactive).
     */
    disable() {
        this.disabled = true;
        this.bg.setFrame(0);
        this.disableInteractive();
        this.label.setY(5);
    }

    /**
     * Enables the button and resets it to the normal state.
     */
    enable() {
        this.disabled = false;
        const frames = UIButton.BUTTON_FRAMES[this.buttonType];
        if (frames) {
            this.bg.setFrame(frames.normal);
        }
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                -this.bg.displayWidth / 2, 
                -this.bg.displayHeight / 2, 
                this.bg.displayWidth, 
                this.bg.displayHeight
            ),
            Phaser.Geom.Rectangle.Contains
        );
    }
}
