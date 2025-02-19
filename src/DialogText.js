import Phaser from 'phaser';

export default class DialogText {
    constructor(scene, opts) {
        this.scene = scene;
        this.container = null;
        this.text = null;
        this.currentIndex = -1;
        this.dialogLines = [];
        this.callback = null;

        this.init(opts);
    }

    init(opts) {
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x8B0000;
        this.windowColor = opts.windowColor || 0x222222;
        this.windowAlpha = opts.windowAlpha || 0.9;
        this.windowHeight = opts.windowHeight || 180;
        this.padding = opts.padding || 32;
        this.fontSize = opts.fontSize || 26;
        this.fontFamily = opts.fontFamily || 'serif';

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
        this.graphics.lineStyle(this.borderThickness, this.borderColor);
        this.graphics.strokeRoundedRect(x, y, rectWidth, rectHeight, 8);

        this.container = this.scene.add.container(0, 0, [this.graphics]);
        this.container.setAlpha(0);
        this.container.setVisible(false);

        this.container.setInteractive(new Phaser.Geom.Rectangle(x, y, rectWidth, rectHeight), Phaser.Geom.Rectangle.Contains);
        this.container.on('pointerdown', () => this.nextDialogLine());
    }

    startDialog(dialogLines, background, onComplete) {
        this.dialogLines = dialogLines;
        this.currentIndex = 0;
        this.callback = onComplete;
    
        if (this.backgroundImage) this.backgroundImage.destroy();
        this.backgroundImage = this.scene.add.image(512, 384, background).setDepth(-1).setScale(1.2);
    
        this.container.setAlpha(1);
        this.container.setVisible(true);
        this.showText();
    }
    
    nextDialogLine() {
        this.currentIndex++;

        if (this.currentIndex >= this.dialogLines.length) {
        this.container.setVisible(false);
        if (this.callback) this.callback();
        } else {
        this.showText();
        }
    }
    
    showText() {
        let x = this.padding + 10;
        let y = this.scene.sys.game.canvas.height - this.windowHeight - this.padding + 15;
    
        if (this.text) this.text.destroy();
        if (this.characterName) this.characterName.destroy();
    
        const currentLine = this.dialogLines[this.currentIndex];
    
        // Mostrar el nombre del personaje
        this.characterName = this.scene.add.text(x, y - 10, `🂠 ${currentLine.character}:`, {
            fontSize: `${this.fontSize + 4}px`,
            fontFamily: this.fontFamily,
            color: '#FFD700'
        });
    
        // Mostrar el texto del diálogo
        this.text = this.scene.add.text(x, y + 25, currentLine.text, {
            fontSize: `${this.fontSize}px`,
            fontFamily: this.fontFamily,
            wordWrap: { width: this.scene.sys.game.canvas.width - (this.padding * 2) - 20, useAdvancedWrap: true },
            color: '#FFFFFF'
        });
    
        this.container.add([this.characterName, this.text]);
    }        
}
