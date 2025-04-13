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
        this.fontFamily = 'RetroFont';
        console.log("Creando dialogos");
        
    }

    init(opts) {
        this.borderThickness = opts.borderThickness || 3;
        this.borderColor = opts.borderColor || 0x8B0000;
        this.windowColor = opts.windowColor || 0x222222;
        this.windowAlpha = opts.windowAlpha || 0.9;
        this.windowHeight = opts.windowHeight || 180;
        this.padding = opts.padding || 32;
        this.fontSize = opts.fontSize || 16;
        this.fontFamily = opts.fontFamily || 'RetroFont';
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

        // Create main container
        this.container = this.add.container(0, 0);
        this.container.setAlpha(0);
        this.container.setVisible(false);

        // Create background with gradient
        this.graphics = this.add.graphics();
        
        // Main background
        this.graphics.fillStyle(0x222222, this.windowAlpha);
        this.graphics.fillRoundedRect(x, y, rectWidth, rectHeight, 8);
        
        // Create gradient effect using multiple rectangles
        const gradientSteps = 5;
        const stepHeight = rectHeight / gradientSteps;
        for (let i = 0; i < gradientSteps; i++) {
            const alpha = 0.3 - (i * 0.05); // Gradually decrease alpha
            this.graphics.fillStyle(0x000000, alpha);
            this.graphics.fillRoundedRect(x, y + (i * stepHeight), rectWidth, stepHeight, 8);
        }

        // Create retro-style border
        const borderThickness = this.borderThickness;
        const borderColor = this.borderColor;
        
        // Main border
        this.graphics.lineStyle(borderThickness, borderColor);
        this.graphics.strokeRoundedRect(x, y, rectWidth, rectHeight, 8);

        // Add subtle inner glow
        this.graphics.lineStyle(1, 0xFFFFFF, 0.1);
        this.graphics.strokeRoundedRect(x + 1, y + 1, rectWidth - 2, rectHeight - 2, 7);

        // Add container to main container
        this.container.add([this.graphics]);

        // Make the entire game screen interactive
        this.input.on('pointerdown', () => this.nextDialogLine());
        
        // Add keyboard input for 'E' key
        this.input.keyboard.on('keydown-E', () => this.nextDialogLine());
    }

    startDialog(npc, background) {
        console.log("Dialogando");
        let stage = this.registry.get('stage');
        switch(npc) {
                case 'samuel':
                    if (stage === 0) {
                        // Initial dialog with Samuel at stage 0
                        this.transitionData = { npc: 'samuel', pointsNeeded: 400, rounds: 3, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "samuel", text: "Dante… no sabía si alguna vez vendrías. Apuesto a que tienes una carta dorada escondida en el bolsillo, ¿no es así?" },
                            { character: "dante", text: "¿Cómo sabes mi nombre?" },
                            { character: "samuel", text: "Eso no es lo importante. Si de verdad quieres saber lo que te come por dentro, tendrás que ganarme a mí y al resto. La paciencia es buena, pero si esperas demasiado, te quedas con las brasas. La vida es un juego, Dante, y el fuego siempre exige su turno." },
                            { character: "dante", text: "Espero no quemarme entonces." },
                            { character: "samuel", text: "Las cartas no mienten, Dante. Y esta mesa es mi trono. Si quieres un lugar en la historia de este pueblo, tendrás que arrebatármelo." }
                        ];
                    } else if (stage === 1) {
                        // After Samuel has been defeated, his afterBattle dialog is shown.
                        this.transitionData = { npc: 'samuel', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
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
                        this.transitionData = { npc: 'helena', pointsNeeded: 550, rounds: 4, scene: this.gameScene };
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
                        this.transitionData = { npc: 'helena', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "helena", text: "Excelente, Dante. Has probado tu temple. Ahora, prepárate para enfrentar al Pescador." }
                        ];
                    } else {
                        this.transitionData = { npc: 'helena', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "helena", text: "Ahora no es el momento para mí, Dante." }
                        ];
                    }
                    break;
                case 'pescador':
                    if (stage === 2) {
                        this.transitionData = { npc: 'pescador', pointsNeeded: 800, rounds: 4, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "pescador", text: "¡Ja! ¡Sabía que vendrías! Todos lo sabíamos. Ningún Holloway puede resistirse al brillo del Casino Ébano." },
                            { character: "dante", text: "Parece que mi reputación me precede." },
                            { character: "pescador", text: "No es la reputación, muchacho. Es la carta dorada que arde en tu bolsillo. Pero antes de alzar las velas, tendrás que demostrar que sabes navegar estas aguas." },
                            { character: "dante", text: "Si si, estoy un poco harto de hablar con cada uno, empieza a barajar las cartas." },
                            { character: "pescador", text: "La suerte es como el mar: caprichosa, despiadada... pero si sabes leer las corrientes, te lleva a la victoria." }
                        ];
                    } else if (stage > 2) {
                        this.transitionData = { npc: 'pescador', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "pescador", text: "Ya hemos pasado por este desafío, sigue adelante." }
                        ];
                    } else {
                        this.transitionData = { npc: 'pescador', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "pescador", text: "No es tu turno aún, Dante." }
                        ];
                    }
                    break;
                case 'gemelos':
                    if (stage === 3) {
                        this.transitionData = { npc: 'gemelos', pointsNeeded: 1250, rounds: 3, scene: this.gameScene };
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
                        this.transitionData = { npc: 'gemelos', pointsNeeded: 10, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "gemelos", text: "El juego avanza, Dante." }
                        ];
                    } else {
                        this.transitionData = { npc: 'gemelos', pointsNeeded: 10, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "gemelos", text: "Aún no te corresponde enfrentarte a nosotros." }
                        ];
                    }
                    break;
                case 'padre':
                    if (stage === 4) {
                        this.transitionData = { npc: 'padre', pointsNeeded: 2500, rounds: 3, scene: this.gameScene };
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
                        this.transitionData = { npc: 'padre', pointsNeeded: 20, rounds: 0, scene: this.gameScene };
                        this.dialogLines = [
                            { character: "padre", text: "Tu duelo conmigo ya ha quedado atrás." }
                        ];
                    } else {
                        this.transitionData = { npc: 'padre', pointsNeeded: 20, rounds: 0, scene: this.gameScene };
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

                case 'barrier_car':
    this.transitionData = { npc: 'barrier_car', pointsNeeded: 0, rounds: 0, scene: this.gameScene }; // Sin batalla, solo diálogo
    this.dialogLines = [
        { character: "hombre", text: "¡Mi coche se averió y no puedo moverlo!" },
        { character: "dante", text: "Estás bloqueando la carretera." },
        { character: "hombre", text: "Estoy trabajando en ello, pero necesito un rato. ¿Por qué no esperas en el asador?" },
        { character: "dante", text: "Vale, espero que lo soluciones pronto." }
    ];
    break;

case 'barrier_cow':
    this.transitionData = { npc: 'barrier_cow', pointsNeeded: 0, rounds: 0, scene: this.gameScene }; // Diálogo sin batalla
    this.dialogLines = [
        { character: "vaca", text: "Muuu!" },
        { character: "dante", text: "Parece que te has perdido en medio de la carretera. Mejor regresaré más tarde." }
    ];
    break;

case 'barrier_guard':
    this.transitionData = { npc: 'barrier_guard', pointsNeeded: 0, rounds: 0, scene: this.gameScene }; // Solo diálogo
    this.dialogLines = [
        { character: "guardia", text: "Lo siento, pero el edificio está cerrado en este momento." },
        { character: "dante", text: "Entiendo, volveré más tarde entonces." }
    ];
    break;

case 'barrier_big_man':
    this.transitionData = { npc: 'barrier_big_man', pointsNeeded: 0, rounds: 0, scene: this.gameScene }; // Diálogo sin batalla
    this.dialogLines = [
        { character: "gordo", text: "Zzz... Zzz..." },
        { character: "dante", text: "Este grandullón está dormido aquí en medio. Mejor regreso más tarde." }
    ];
    break;

case 'calvo':
    this.transitionData = { npc: 'calvo', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "calvo", text: "¿Vas a hacer la ruta hasta el Casino Ébano? Mucha suerte, jovenzuelo... y recuerda: no todo lo que brilla son fichas." },
        { character: "dante", text: "¿Usted ha estado allí? Hay algo en su mirada que me dice que ha visto cosas que no caben en una partida." },
        { character: "calvo", text: "Vi más de lo que quise... y perdí más de lo que tenía. Si llegas, no te olvides de quién fuiste antes de la última mano." }
    ];
    break;

case 'rubio':
    this.transitionData = { npc: 'rubio', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "rubio", text: "¿Has ido ya al Puerto Azul? Está aquí al lado, hacia la derecha. Buen sitio para perder… o encontrar secretos." }
    ];
    break;

case 'alien':
    this.transitionData = { npc: 'alien', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "alien", text: "¡He venido desde Urano para enfrentarme a Helena… y me ha puesto en mi sitio! Lleva cuidado, y compra un Joker antes." },
        { character: "dante", text: "¿Un alienígena que juega a las cartas? Esto ya está yendo más allá de lo que esperaba." },
        { character: "alien", text: "Lo mismo pensé yo cuando llegué aquí." }
    ];
    break;

case 'hermenegildo':
    this.transitionData = { npc: 'hermenegildo', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "hermenegildo", text: "Esto antes era una tienda de Jokers, ¡pero ahora ya todo el mundo compra online! Incluso han puesto un botón para comprar arriba a la izquierda… ¡Qué vergüenza!" },
        { character: "dante", text: "Supongo que es más cómodo que venir aquí cada vez que quieres un Joker." },
        { character: "hermenegildo", text: "Maldita modernidad." }
    ];
    break;

case 'paco':
    this.transitionData = { npc: 'paco', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "paco", text: "Acabo de perder contra los gemelos en el Rincón del Bandido… esto de las cartas no es lo mío. Mejor vuelvo a estudiar." },
        { character: "dante", text: "No es tan malo perder si aprendes algo… ¿Qué vas a estudiar?" },
        { character: "paco", text: "Geografía. Los mapas no te gritan 'all-in' cuando te equivocas." }
    ];
    break;

case 'roberto':
    this.transitionData = { npc: 'roberto', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "roberto", text: "¿Sabías que si no tienes cartas para una buena mano durante una batalla de cartas, siempre puedes barajar y conseguir nuevas cartas?" },
        { character: "dante", text: "Interesante… ¿y qué pasa si lo haces demasiado?" },
        { character: "roberto", text: "Pues vas perdiendo puntos... y cartas también. Es arriesgado pero puede valer la pena." }
    ];
    break;

case 'chica':
    this.transitionData = { npc: 'chica', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "chica", text: "¿Cuánto dinero tienes? ¿Sabes que tras una batalla, la diferencia de puntos entre los tuyos y el objetivo es el dinero que ganas? El otro día gané por más de 1000 puntos de diferencia y me saqué un sobresueldo." },
        { character: "dante", text: "Entonces no solo se gana respeto… se gana también para la merienda." },
        { character: "chica", text: "Exacto. Aquí todos jugamos por fama, fortuna o porque no hay otra forma de pagar el alquiler." }
    ];
    break;

case 'pelirrojo':
    this.transitionData = { npc: 'pelirrojo', pointsNeeded: 0, rounds: 0, scene: this.gameScene };
    this.dialogLines = [
        { character: "pelirrojo", text: "Estoy aquí practicando las escaleras de color para poder ganarle a Helena. El problema es que siempre me confundo… ¿Después del 6 va el 8 o el 9?" },
        { character: "dante", text: "Creo que el 7 está entre esos dos." },
        { character: "pelirrojo", text: "¿El 7? ¿Es que no sabes contar?" }
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
        
        // Capitalize first letter of character name
        const formattedCharacterName = currentLine.character.charAt(0).toUpperCase() + currentLine.character.slice(1);
    
        this.characterName = this.add.text(x, y - 10, `🂠 ${formattedCharacterName}:`, {
            fontSize: `${this.fontSize + 5}px`,
            fontFamily: 'RetroFont',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2,
            letterSpacing: -2 // Negative letter spacing to make text more compact
        });
    
        this.text = this.add.text(x, y + 25, "", {
            fontSize: `${this.fontSize}px`,
            fontFamily: 'RetroFont',
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
