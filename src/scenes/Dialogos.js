import Phaser from 'phaser';

export default class Dialogos extends Phaser.Scene {
    constructor() {
        super({key: 'Dialogos'});
        this.container = null;
        this.text = null;
        this.currentIndex = -1;
        this.dialogLines = [];
        this.callback = null;
        this.currentStep = 0; 
        this.transitionData = {};
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

        this.npc = opts.npc || null;
        this.createWindow();
        if (this.npc)
            this.startDialog(this.npc, this.gameScene);
    }

    create() {
        this.scene.bringToTop();
        this.gameScene = this.scene.get('MapScene');
    }

    createWindow() {
        let { width, height } = this.sys.game.canvas;
        let x = this.padding;
        let y = height - this.windowHeight - this.padding;
        let rectWidth = width - (this.padding * 2);
        let rectHeight = this.windowHeight;

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(this.windowColor, this.windowAlpha);
        this.graphics.fillRoundedRect(x, y, rectWidth, rectHeight, 8);
        this.graphics.lineStyle(this.borderThickness, this.borderColor);
        this.graphics.strokeRoundedRect(x, y, rectWidth, rectHeight, 8);

        this.container = this.add.container(0, 0, [this.graphics]);
        this.container.setAlpha(0);
        this.container.setVisible(false);

        this.container.setInteractive(new Phaser.Geom.Rectangle(x, y, rectWidth, rectHeight), Phaser.Geom.Rectangle.Contains);
        this.container.on('pointerdown', () => this.nextDialogLine());
    }

    startDialog(npc, background) {
        npc = 'samuel';
        switch(npc) {
            case 'samuel':
                this.cutsceneImages = ['samuel'];
                this.transitionData = { npc: 'samuel', pointsNeeded: 100, rounds: 5 };
                this.dialogLines = [
                    { character: "Samuel", text: "Dante… no sabía si alguna vez vendrías. Apuesto a que tienes una carta dorada escondida en el bolsillo, ¿no es así?" },
                    { character: "Dante", text: "¿Cómo sabes mi nombre?" },
                    { character: "Samuel", text: "Eso no es lo importante. Si de verdad quieres saber lo que te come por dentro, tendrás que ganarme a mí y al resto. La paciencia es buena, pero si esperas demasiado, te quedas con las brasas. La vida es un juego, Dante, y el fuego siempre exige su turno." },
                    { character: "Dante", text: "Espero no quemarme entonces." },
                    { character: "Samuel", text: "Las cartas no mienten, Dante. Y esta mesa es mi trono. Si quieres un lugar en la historia de este pueblo, tendrás que arrebatármelo." }
                ];
                break;
            case 'bruja':
                this.cutsceneImages = ['bruja'];
                this.transitionData = { npc: 'bruja', pointsNeeded: 80, rounds: 4 };
                this.dialogLines = [
                    { character: "Helena", text: "Mira nada más… Dante Holloway, caminando entre las sombras. ¿Ya sabes lo que buscas o solo sigues las huellas de tu padre?" },
                    { character: "Dante", text: "¿Tú también? ¿Cómo es que todos saben quién soy?" },
                    { character: "Helena", text: "Dante, dulce Dante… si tienes esa carta dorada, entonces ya eres parte del juego. Ya debes saber por Samuel que lo único importante es ganar, avanzar y solo avanzar de local a local. Pero primero, tendrás que cruzar el Olvido." },
                    { character: "Helena", text: "Las reglas son como el humo, querido… difíciles de atrapar. Lo mismo que mi juego." },
                    { character: "Dante", text: "Entonces tendré que ver a través de la niebla." },
                    { character: "Helena", text: "Mmm... eso me gusta. Juguemos, antes de que olvides por qué viniste." }
                ];
                break;
            case 'gemelos':
                this.cutsceneImages = ['gemelos1', 'gemelos2'];
                this.transitionData = { npc: 'gemelos', pointsNeeded: 90, rounds: 3 };
                this.dialogLines = [
                    { character: "Hermano 1", text: "Míralo, hermano. Ahí está el chico con la carta dorada." },
                    { character: "Hermano 2", text: "Oh sí… creía que tardaría más en aparecer." },
                    { character: "Dante", text: "Son todos igual de insoportables." },
                    { character: "Hermano 1", text: "Este ha salido peor que su padre. De igual manera querido Dante, si realmente quieres entrar al Casino, tendrás que demostrar que no solo eres un jugador… sino un estratega." },
                    { character: "Hermano 2", text: "Aquí no basta con jugar bien, Dante." },
                    { character: "Hermano 1", text: "Aquí necesitas pensar dos veces antes de cada jugada." },
                    { character: "Hermano 2", text: "O mejor dicho… pensar como dos." }
                ];
                break;
            case 'padre':
                this.cutsceneImages = ['padre1', 'padre2'];
                this.transitionData = { npc: 'padre', pointsNeeded: 70, rounds: 3 };
                this.dialogLines = [
                   //Falta poner
                ];
                break;
            case 'pescador':
                this.cutsceneImages = ['pescador1', 'pescador2'];
                this.transitionData = { npc: 'pescador', pointsNeeded: 60, rounds: 2 };
                this.dialogLines = [
                    { character: "Marco", text: "¡Ja! ¡Sabía que vendrías! Todos lo sabíamos. Ningún Holloway puede resistirse al brillo del Casino Ébano." },
                    { character: "Dante", text: "Parece que mi reputación me precede." },
                    { character: "Marco", text: "No es la reputación, muchacho. Es la carta dorada que arde en tu bolsillo. Pero antes de alzar las velas, tendrás que demostrar que sabes navegar estas aguas." },
                    { character: "Dante", text: "Si si, estoy un poco harto de hablar con cada uno, empieza a barajar las cartas." },
                    { character: "Marco", text: "La suerte es como el mar: caprichosa, despiadada... pero si sabes leer las corrientes, te lleva a la victoria" }
                ];
                break;
            default:
                this.dialogLines = [];
                this.startBattle();
                break;
        }
        this.currentIndex = 0;
    
        if (this.backgroundImage) this.backgroundImage.destroy();
        this.backgroundImage = this.add.image(512, 384, background).setDepth(-1).setScale(1.2);
    
        this.container.setAlpha(1);
        this.container.setVisible(true);
        this.showText();
    }

     // Nueva función para continuar el diálogo después de la batalla --Hay que reajustar
    afterBattle(playerWon) {
        const postBattleDialog = playerWon
            ? [{ character: "Samuel", text: "Bien jugado… La paciencia cocina la mejor jugada, y tú la serviste en su punto. Ahora, ve a la Taberna del Olvido. Allí te espera Helena." }]
            : [{ character: "Samuel", text: "Tienes la paciencia… pero no la precisión. Aquí, solo los reyes se sientan en la mesa final. Y hoy, no fue tu día." }];

        this.dialogBox.startDialog(postBattleDialog, "asador_fondo", () => {
            this.dialogBox.container.setVisible(false);
        });
    }
    
    nextDialogLine() {
        this.currentIndex++;

        if (this.currentIndex >= this.dialogLines.length) {
            this.container.setVisible(false);
            this.startBattle();
            if (this.callback) this.callback();
        } else {
        this.showText();
        }
    }
    
    showText() {
        let x = this.padding + 10;
        let y = this.sys.game.canvas.height - this.windowHeight - this.padding + 15;
    
        if (this.text) this.text.destroy();
        if (this.characterName) this.characterName.destroy();
        if (this.cutsceneImage) this.cutsceneImage.destroy();
    
        const currentLine = this.dialogLines[this.currentIndex];
    
        // Mostrar el nombre del personaje
        this.characterName = this.add.text(x, y - 10, `🂠 ${currentLine.character}:`, {
            fontSize: `${this.fontSize + 4}px`,
            fontFamily: this.fontFamily,
            color: '#FFD700'
        });

        this.cutsceneImage = this.add.image(512, 384, `${currentLine.character}`);
    
        // Mostrar el texto del diálogo
        this.text = this.add.text(x, y + 25, currentLine.text, {
            fontSize: `${this.fontSize}px`,
            fontFamily: this.fontFamily,
            wordWrap: { width: this.sys.game.canvas.width - (this.padding * 2) - 20, useAdvancedWrap: true },
            color: '#FFFFFF'
        });
    
        this.container.add([this.characterName, this.text]);
    }  

    startBattle() {
        this.scene.start('TransicionBatalla', this.transitionData);
    }
}
