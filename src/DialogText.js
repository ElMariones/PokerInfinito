export default class DialogText {
    constructor(scene, opts) {
        this.scene = scene;
        this.init(opts);
        this.characterImage = null;
        this.backgroundImage = null;
        this.container = null;
    }

    init(opts) {
        if (!opts) opts = {};

        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x8B0000;
        this.borderAlpha = opts.borderAlpha || 1;
        this.windowColor = opts.windowColor || 0x222222;
        this.windowAlpha = opts.windowAlpha || 0.9;
        this.windowHeight = opts.windowHeight || 180;
        this.padding = opts.padding || 32;
        this.dialogSpeed = opts.dialogSpeed || 3;
        this.fontSize = opts.fontSize || 26;
        this.fontFamily = opts.fontFamily || 'serif';

        this.animating = false;
        this.fullText = '';
        this.eventCounter = 0;
        this.visible = false;

        this.text = null;
        this.graphics = null;
        this.createWindow();
    }

    createWindow() {
        let { width, height } = this.scene.sys.game.canvas;
        let x = this.padding;
        let y = height - this.windowHeight - this.padding;
        let rectWidth = width - (this.padding * 2);
        let rectHeight = this.windowHeight;
    
        this.graphics = this.scene.add.graphics();
        this.graphics.fillStyle(this.windowColor, this.windowAlpha);
        this.graphics.fillRoundedRect(x, y, rectWidth, rectHeight, 8);
        this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
        this.graphics.strokeRoundedRect(x, y, rectWidth, rectHeight, 8);
    
        // 🟢 Asegurar que `container` siempre se crea correctamente
        if (!this.container) {
            this.container = this.scene.add.container(0, 0, [this.graphics]);
        } else {
            this.container.add(this.graphics);
        }
    
        this.container.setAlpha(0);
    }
    

    setText(text, character, background, animate = true) {
        this.fullText = text;
        this.dialog = text.split('');
        this.eventCounter = 0;

        if (this.timedEvent) this.timedEvent.remove();
        let tempText = animate ? '' : text;
        this.updateScene(character, background);
        this.renderText(tempText, character);

        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        if (animate) {
            this.timedEvent = this.scene.time.addEvent({
                delay: 150 - (this.dialogSpeed * 30),
                callback: this.animateText,
                callbackScope: this,
                loop: true
            });
        }
    }

    updateScene(character, background) {
        if (this.backgroundImage) this.backgroundImage.destroy();
        if (this.characterImage) this.characterImage.destroy();

        this.backgroundImage = this.scene.add.image(512, 384, background).setDepth(-1).setScale(1.2);
        this.characterImage = this.scene.add.image(512, 384, character).setDepth(0).setScale(1.0);
        this.container.add([this.backgroundImage, this.characterImage]);
    }

    animateText() {
        if (this.eventCounter < this.dialog.length) {
            this.text.setText(this.text.text + this.dialog[this.eventCounter]);
            this.eventCounter++;
        } else {
            this.timedEvent.remove();
            this.animating = false;
        }
    }

    renderText(text, character) {
        let x = this.padding + 10;
        let y = this.scene.sys.game.canvas.height - this.windowHeight - this.padding + 15;
        if (this.text) this.text.destroy();

        let textColor = character === 'Dante' ? '#FFD700' : '#FFFFFF';
        let fontStyle = character === 'Dante' ? 'bold' : 'normal';

        this.text = this.scene.add.text(x, y, text, {
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            wordWrap: { width: this.scene.sys.game.canvas.width - (this.padding * 2) - 20 },
            color: textColor,
            fontStyle: fontStyle
        });
        this.container.add(this.text);
    }
}