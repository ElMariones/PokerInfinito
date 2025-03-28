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
        this.gameScene = null;
        console.log("Creando dialogos");
        
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
        this.gameScene = opts.scene;

        this.npc = opts.npc || null;
        this.createWindow();
        if (this.npc)
            this.startDialog(this.npc, this.gameScene);
    }

    create() {
        this.scene.sleep('UIOverlay');
        this.scene.bringToTop();
        //this.gameScene = this.scene.get('MapScene');
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
        console.log("Dialogando");
        let stage = this.registry.get('stage');
        switch(npc) {
                case 'samuel':
                    if (stage === 0) {
                        // Initial dialog with Samuel at stage 0
                        this.transitionData = { npc: 'samuel', pointsNeeded: 10, rounds: 5, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "samuel", text: "Dante… no sabía si alguna vez vendrías. Apuesto a que tienes una carta dorada escondida en el bolsillo, ¿no es así?" },
                            { character: "dante", text: "¿Cómo sabes mi nombre?" },
                            { character: "samuel", text: "Eso no es lo importante. Si de verdad quieres saber lo que te come por dentro, tendrás que ganarme a mí y al resto. La paciencia es buena, pero si esperas demasiado, te quedas con las brasas. La vida es un juego, Dante, y el fuego siempre exige su turno." },
                            { character: "dante", text: "Espero no quemarme entonces." },
                            { character: "samuel", text: "Las cartas no mienten, Dante. Y esta mesa es mi trono. Si quieres un lugar en la historia de este pueblo, tendrás que arrebatármelo." }
                        ];
                    } else if (stage === 1) {
                        // After Samuel has been defeated, his afterBattle dialog is shown.
                        this.transitionData = { npc: 'samuel', pointsNeeded: 100, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "samuel", text: "Bien jugado… La paciencia cocina la mejor jugada, y tú la serviste en su punto. Ahora, ve a enfrentar a Helena." }
                        ];
                    } else {
                        // If already past Samuel, he just gives a brief message.
                        this.dialogLines = [
                            { character: "samuel", text: "Ya pasamos ese duelo, Dante. Tu camino continúa." }
                        ];
                    }
                    break;
                case 'helena':
                    if (stage === 1) {
                        this.transitionData = { npc: 'helena', pointsNeeded: 80, rounds: 4, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "helena", text: "Mira nada más… Dante Holloway, caminando entre las sombras. ¿Ya sabes lo que buscas o solo sigues las huellas de tu padre?" },
                            { character: "dante", text: "¿Tú también? ¿Cómo es que todos saben quién soy?" },
                            { character: "helena", text: "Dante, dulce Dante… si tienes esa carta dorada, entonces ya eres parte del juego. Ya debes saber por Samuel que lo único importante es ganar, avanzar y solo avanzar de local a local. Pero primero, tendrás que cruzar el Olvido." },
                            { character: "helena", text: "Las reglas son como el humo, querido… difíciles de atrapar. Lo mismo que mi juego." },
                            { character: "dante", text: "Entonces tendré que ver a través de la niebla." },
                            { character: "helena", text: "Mmm... eso me gusta. Juguemos, antes de que olvides por qué viniste." }
                        ];
                    } else if (stage > 1) {
                        // After Helena has been defeated
                        this.transitionData = { npc: 'helena', pointsNeeded: 80, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "helena", text: "Excelente, Dante. Has probado tu temple. Ahora, prepárate para enfrentar al Pescador." }
                        ];
                    } else {
                        this.transitionData = { npc: 'helena', pointsNeeded: 80, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "helena", text: "Ahora no es el momento para mí, Dante." }
                        ];
                    }
                    break;
                case 'pescador':
                    if (stage === 2) {
                        this.transitionData = { npc: 'pescador', pointsNeeded: 60, rounds: 2, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "pescador", text: "¡Ja! ¡Sabía que vendrías! Todos lo sabíamos. Ningún Holloway puede resistirse al brillo del Casino Ébano." },
                            { character: "dante", text: "Parece que mi reputación me precede." },
                            { character: "pescador", text: "No es la reputación, muchacho. Es la carta dorada que arde en tu bolsillo. Pero antes de alzar las velas, tendrás que demostrar que sabes navegar estas aguas." },
                            { character: "dante", text: "Si si, estoy un poco harto de hablar con cada uno, empieza a barajar las cartas." },
                            { character: "pescador", text: "La suerte es como el mar: caprichosa, despiadada... pero si sabes leer las corrientes, te lleva a la victoria." }
                        ];
                    } else if (stage > 2) {
                        this.transitionData = { npc: 'pescador', pointsNeeded: 60, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "pescador", text: "Ya hemos pasado por este desafío, sigue adelante." }
                        ];
                    } else {
                        this.transitionData = { npc: 'pescador', pointsNeeded: 60, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "pescador", text: "No es tu turno aún, Dante." }
                        ];
                    }
                    break;
                case 'gemelos':
                    if (stage === 3) {
                        this.transitionData = { npc: 'gemelos', pointsNeeded: 90, rounds: 3, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "gemelos", text: "Míralo, hermano. Ahí está el chico con la carta dorada." },
                            { character: "gemelos", text: "Oh sí… creía que tardaría más en aparecer." },
                            { character: "dante", text: "Son todos igual de insoportables." },
                            { character: "gemelos", text: "Este ha salido peor que su padre. De igual manera, querido Dante, si realmente quieres entrar al Casino, tendrás que demostrar que no solo eres un jugador… sino un estratega." },
                            { character: "gemelos", text: "Aquí no basta con jugar bien, Dante." },
                            { character: "gemelos", text: "Aquí necesitas pensar dos veces antes de cada jugada." },
                            { character: "gemelos", text: "O mejor dicho… pensar como dos." }
                        ];
                    } else if (stage > 3) {
                        this.transitionData = { npc: 'gemelos', pointsNeeded: 90, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "gemelos", text: "El juego avanza, Dante." }
                        ];
                    } else {
                        this.transitionData = { npc: 'gemelos', pointsNeeded: 90, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "gemelos", text: "Aún no te corresponde enfrentarte a nosotros." }
                        ];
                    }
                    break;
                case 'padre':
                    if (stage === 4) {
                        this.transitionData = { npc: 'padre', pointsNeeded: 70, rounds: 3, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "dante", text: "Papá." },
                            { character: "padre", text: "Has llegado, Dante. Tal como imaginé." },
                            { character: "dante", text: "Todos en el pueblo lo sabían… Me estaban preparando para esto, ¿verdad?" },
                            { character: "padre", text: "Teníamos que asegurarnos de que estuvieras listo." },
                            { character: "padre", text: "Los llamaste rivales, pero eran tus maestros. ¿Crees que fue coincidencia que cada uno te enseñara una faceta del juego?" },
                            { character: "dante", text: "El Monarca me enseñó paciencia. La Bruja, la duda. El Náufrago, el riesgo. Los Hermanos Blackwood, la estrategia..." },
                            { character: "dante", text: "¡¿Por qué nunca volviste?! ¿Por qué dejaste todo atrás?" },
                            { character: "padre", text: "Porque no tenía elección. Mi deuda con este lugar era más grande que cualquier apuesta que hubiera hecho antes. No se trata solo de dinero… sino del juego en sí." },
                            { character: "dante", text: "Te convertiste en su prisionero." },
                            { character: "padre", text: "Y en su guardián. Perdí mi última mano hace años… y desde entonces, el Casino me retuvo como su crupier eterno. Pero no fue solo una condena, Dante. Me enamoré del juego. De su arte. De la forma en que cada carta cuenta una historia, cada mano es un destino." },
                            { character: "dante", text: "Pero esto no es vida." },
                            { character: "padre", text: "Lo sé." },
                            { character: "padre", text: "Pero ahora tienes la oportunidad de cambiar eso." },
                            { character: "dante", text: "¿Cómo?" },
                            { character: "padre", text: "Una última partida. Si ganas, mi deuda se salda. Seré libre. Si pierdes… digamos que hay espacio para un nuevo crupier." },
                            { character: "dante", text: "Eso no va a pasar." },
                            { character: "padre", text: "Entonces, baraja, hijo mío… y demuestra lo que has aprendido." }
                        ];
                    } else if (stage > 4) {
                        this.transitionData = { npc: 'padre', pointsNeeded: 70, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "padre", text: "Tu duelo conmigo ya ha quedado atrás." }
                        ];
                    } else {
                        this.transitionData = { npc: 'padre', pointsNeeded: 70, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "padre", text: "No es tu momento, Dante." }
                        ];
                    }
                    break;
            case 'oveja':
                this.transitionData = { npc: 'oveja', pointsNeeded: 0, rounds: 0, scene: this.gameScene }; //Si ponemos rounds a 0 no hay batalla, solo diálogo
                this.dialogLines = [
                    { character: "oveja", text: "¡Baaa! ¿No esperabas encontrarme aquí, eh?" },
                    { character: "dante", text: "¿Una oveja que habla? Vaya, creía que ya lo había visto todo en este pueblo..." },
                    { character: "oveja", text: "Shhh... no se lo cuentes a nadie. Si descubren que hablo, querrán retarme a una batalla de cartas también. Y la verdad, paso de jugar." },
                    { character: "dante", text: "En fin... al menos eres más simpática que la mayoría." },
                    { character: "oveja", text: "¡Baaa-aadios! Y recuerda, si alguien pregunta, ni me viste." }
                ];
                break;
            default:
                this.dialogLines = [];
                this.startBattle();
                break;
        }
        this.currentIndex = 0;
    
        this.container.setAlpha(1);
        this.container.setVisible(true);

        // Pause the MapScene
        const currentMap = this.registry.get('currentMap');
        if (currentMap) {
            this.scene.pause(currentMap);
        }
        
        this.showText();
    }

    // Nueva función para continuar el diálogo después de la batalla --Hay que reajustar
    afterBattle(playerWon) {
        this.createWindow();
        let postBattleDialog;
        this.transitionData = { npc: '', pointsNeeded: 0, rounds: 0, scene: this.gameScene }; //Si ponemos rounds a 0 no hay batalla, solo diálogo
        if (this.npc === 'samuel') {
            if (playerWon) {
            postBattleDialog = [{ character: "samuel", text: "Bien jugado… La paciencia cocina la mejor jugada, y tú la serviste en su punto. Ahora, ve a enfrentar a Helena." }];
            this.registry.set('stage', 1);
            } else {
            postBattleDialog = [{ character: "samuel", text: "Tienes la paciencia… pero no la precisión. Aquí, solo los reyes se sientan en la mesa final. Y hoy, no fue tu día." }];
            }
        } else if (this.npc === 'helena') {
            if (playerWon) {
            postBattleDialog = [{ character: "helena", text: "Excelente, Dante. Has probado tu temple. Ahora, prepárate para enfrentar al Pescador." }];
            this.registry.set('stage', 2);
            } else {
            postBattleDialog = [{ character: "helena", text: "La niebla te ha envuelto, Dante. Vuelve cuando puedas ver a través de ella." }];
            }
        } else if (this.npc === 'pescador') {
            if (playerWon) {
            postBattleDialog = [{ character: "pescador", text: "¡Ja! Has navegado bien estas aguas. Ahora, sigue adelante y enfrenta a los Gemelos." }];
            this.registry.set('stage', 3);
            } else {
            postBattleDialog = [{ character: "pescador", text: "El mar no siempre es amable, Dante. Vuelve cuando estés listo para navegar de nuevo." }];
            }
        } else if (this.npc === 'gemelos') {
            if (playerWon) {
            postBattleDialog = [{ character: "gemelos", text: "Impresionante, Dante. Has demostrado ser un estratega. Ahora, ve a enfrentar a tu padre." }];
            this.registry.set('stage', 4);
            } else {
            postBattleDialog = [{ character: "gemelos", text: "Pensar como dos no es fácil, Dante. Vuelve cuando estés listo para intentarlo de nuevo." }];
            }
        } else if (this.npc === 'padre') {
            if (playerWon) {
            postBattleDialog = [{ character: "padre", text: "Has ganado, Dante. Mi deuda está saldada. Eres libre." }];
            this.registry.set('stage', 5);
            } else {
            postBattleDialog = [{ character: "padre", text: "Aún no estás listo, hijo mío. Vuelve cuando hayas aprendido más." }];
            }
        } else {
            postBattleDialog = [{ character: this.npc, text: "El duelo ha terminado." }];
        }
    
        this.dialogLines = postBattleDialog;
        this.currentIndex = 0;
    
        // Ensure the dialog container is visible and active
        this.container.setAlpha(1);
        this.container.setVisible(true);
    
        const currentMap = this.registry.get('currentMap');
        if (currentMap) {
            this.scene.pause(currentMap);
        }
        
        // Display the dialog text
        this.showText();
    }
    
    nextDialogLine() {
        if (this.isTyping) {
            // If the text is still typing, finish it instantly
            this.text.setText(this.dialogLines[this.currentIndex].text);
            this.isTyping = false; // Mark as fully typed
        } else {
            // Move to the next line
            this.currentIndex++;
    
            if (this.currentIndex >= this.dialogLines.length) {
                this.container.setVisible(false);
                this.startBattle();
                if (this.callback) this.callback();

                // Resume the MapScene
                const currentMap = this.registry.get('currentMap');
                if (currentMap) {
                    this.scene.resume(currentMap);
                }
                            } else {
                this.showText();
            }
        }
    }
    
    
    showText() {
        let x = this.padding + 10;
        let y = this.sys.game.canvas.height - this.windowHeight - this.padding + 15;
    
        // Destroy previous text objects
        if (this.text) this.text.destroy();
        if (this.characterName) this.characterName.destroy();
        if (this.cutsceneImage) this.cutsceneImage.destroy();
    
        const currentLine = this.dialogLines[this.currentIndex];
    
        this.characterName = this.add.text(x, y - 10, `🂠 ${currentLine.character}:`, {
            fontSize: `${this.fontSize + 4}px`,
            fontFamily: this.fontFamily,
            color: '#FFD700'
        });
    
        this.text = this.add.text(x, y + 25, "", {
            fontSize: `${this.fontSize}px`,
            fontFamily: this.fontFamily,
            wordWrap: { width: this.sys.game.canvas.width - (this.padding * 2) - 20, useAdvancedWrap: true },
            color: '#FFFFFF'
        });
    
        this.container.setDepth(10);
        this.container.add([this.characterName, this.text]);
    
        this.cutsceneImage = this.add.image(
            currentLine.character === "dante"
                ? this.sys.game.canvas.width - this.padding - 50  // Far right
                : currentLine.character === "gemelos"
                ? this.padding + 200 // Slightly to the right of the default left-side characters
                : this.padding + 50, // Default far-left placement
            this.sys.game.canvas.height - this.windowHeight - this.padding - 50,
            `${currentLine.character}`
        ).setScale(1);
        
        this.cutsceneImage.setDepth(5);
    
        // Cancel previous typing event if it exists
        if (this.typingEvent) {
            this.typingEvent.remove(false);
        }
    
        // Typing effect logic
        this.isTyping = true; // Start typing mode
        let fullText = currentLine.text;
        let currentIndex = 0;
        let typingSpeed = 40; // Adjust speed here (lower = faster)
    
        this.typingEvent = this.time.addEvent({
            delay: typingSpeed,
            repeat: fullText.length - 1,
            callback: () => {
                if (!this.isTyping) return;
                this.text.setText(fullText.substring(0, currentIndex + 1));
                currentIndex++;
    
                if (currentIndex >= fullText.length) {
                    this.isTyping = false; // Finished typing
                }
            }
        });
    }  

    startBattle() {
        if (this.transitionData.rounds == 0) {
            this.container.setVisible(false);
            this.cutsceneImage.destroy();
            this.scene.wake('UIOverlay');
            // Resume the game scene before stopping the Dialogos scene.
            const currentMap = this.registry.get('currentMap');
            if (currentMap) {
                this.scene.resume(currentMap);
            }
                        if (this.callback) this.callback();
            this.scene.stop();
            return;
        }
        this.scene.start('TransicionBatalla', this.transitionData);
    }
    
}
