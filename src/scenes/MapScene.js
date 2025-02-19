import Phaser from 'phaser';
import DialogText from '../DialogText.js';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 1) Background: top-down map
    this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height);

    // 2) Create player as a simple image
    //    No physics, no animation—just an image
    this.player = this.add.image(100, 200, 'player').setScale(0.1);

    // 3) WASD controls (plus E for interact)
    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });

    // 4) Create NPCs as images
    this.npc1 = this.add.image(300, 200, 'npc1').setScale(0.1);
    this.npc2 = this.add.image(500, 300, 'npc2').setScale(0.1);
    this.npc3 = this.add.image(700, 200, 'npc3').setScale(0.1);

    // Put NPCs in an array for easy iteration
    this.npcArray = [this.npc1, this.npc2, this.npc3];

    // Crear la caja de diálogo, pero oculta inicialmente
    this.dialogBox = new DialogText(this, { dialogSpeed: 4 });
    this.dialogBox.container.setVisible(false);

    // Información de NPCs
    this.npcData = {
      npc1: { name: "Samuel", background: "asador_fondo", gameData: { pointsNeeded: 100, rounds: 5 } },
      npc2: { name: "Helena", background: "taberna_fondo", gameData: { pointsNeeded: 400, rounds: 5 } },
      npc3: { name: "Marco", background: "puerto_fondo", gameData: { pointsNeeded: 500, rounds: 2 } },
      npc4: { name: "Hermanos Blackwood", background: "rincon_del_bandido_fondo", gameData: { pointsNeeded: 800, rounds: 3 } }
    };

    // 5) Interact key
    this.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });
  }

  update() {
    // Manual top-down movement
    const speed = 3;

    if (this.cursors.up.isDown) {
      this.player.y -= speed;
    } else if (this.cursors.down.isDown) {
      this.player.y += speed;
    }

    if (this.cursors.left.isDown) {
      this.player.x -= speed;
    } else if (this.cursors.right.isDown) {
      this.player.x += speed;
    }

    // Note: There's no collision or boundary check here;
    // you'd add clamp logic if you want to prevent out-of-bounds movement.
  }

  tryInteract() {
    const interactDistance = 50;
    let interactedNPC = null;

    this.npcArray.forEach(npc => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
        if (dist < interactDistance) {
            interactedNPC = npc;
        }
    });

    if (interactedNPC) {
        const npcKey = this.getNPCKey(interactedNPC);
        if (npcKey) {
            const { name, background, gameData } = this.npcData[npcKey];
            let dialogLines = [];
            // Diálogo de Samuel y Dante
            if (npcKey === 'npc1') {
              dialogLines = [
                  { character: "Samuel", text: "Dante… no sabía si alguna vez vendrías. Apuesto a que tienes una carta dorada escondida en el bolsillo, ¿no es así?" },
                  { character: "Dante", text: "¿Cómo sabes mi nombre?" },
                  { character: "Samuel", text: "Eso no es lo importante. Si de verdad quieres saber lo que te come por dentro, tendrás que ganarme a mí y al resto. La paciencia es buena, pero si esperas demasiado, te quedas con las brasas. La vida es un juego, Dante, y el fuego siempre exige su turno." },
                  { character: "Dante", text: "Espero no quemarme entonces." },
                  { character: "Samuel", text: "Las cartas no mienten, Dante. Y esta mesa es mi trono. Si quieres un lugar en la historia de este pueblo, tendrás que arrebatármelo." }
              ];
            }
            else if (npcKey === 'npc2') {
              dialogLines = [
                  { character: "Helena", text: "Mira nada más… Dante Holloway, caminando entre las sombras. ¿Ya sabes lo que buscas o solo sigues las huellas de tu padre?" },
                  { character: "Dante", text: "¿Tú también? ¿Cómo es que todos saben quién soy?" },
                  { character: "Helena", text: "Dante, dulce Dante… si tienes esa carta dorada, entonces ya eres parte del juego. Ya debes saber por Samuel que lo único importante es ganar, avanzar y solo avanzar de local a local. Pero primero, tendrás que cruzar el Olvido." },
                  { character: "Helena", text: "Las reglas son como el humo, querido… difíciles de atrapar. Lo mismo que mi juego." },
                  { character: "Dante", text: "Entonces tendré que ver a través de la niebla." },
                  { character: "Helena", text: "Mmm... eso me gusta. Juguemos, antes de que olvides por qué viniste." }
              ];
            }
            else if (npcKey === 'npc3') {
              dialogLines = [
                  { character: "Marco", text: "¡Ja! ¡Sabía que vendrías! Todos lo sabíamos. Ningún Holloway puede resistirse al brillo del Casino Ébano." },
                  { character: "Dante", text: "Parece que mi reputación me precede." },
                  { character: "Marco", text: "No es la reputación, muchacho. Es la carta dorada que arde en tu bolsillo. Pero antes de alzar las velas, tendrás que demostrar que sabes navegar estas aguas." },
                  { character: "Dante", text: "Si si, estoy un poco harto de hablar con cada uno, empieza a barajar las cartas." },
                  { character: "Marco", text: "La suerte es como el mar: caprichosa, despiadada... pero si sabes leer las corrientes, te lleva a la victoria" }
            
              ];
            }
            else if (npcKey === 'npc4') {
              dialogLines = [
                  { character: "Hermano 1", text: "Míralo, hermano. Ahí está el chico con la carta dorada." },
                  { character: "Hermano 2", text: "Oh sí… creía que tardaría más en aparecer." },
                  { character: "Dante", text: "Son todos igual de insoportables." },
                  { character: "Hermano 1", text: "Este ha salido peor que su padre. De igual manera querido Dante, si realmente quieres entrar al Casino, tendrás que demostrar que no solo eres un jugador… sino un estratega." },
                  { character: "Hermano 2", text: "Aquí no basta con jugar bien, Dante." },
                  { character: "Hermano 1", text: "Aquí necesitas pensar dos veces antes de cada jugada." },
                  { character: "Hermano 2", text: "O mejor dicho… pensar como dos." }
              ];
            }
            this.dialogBox.startDialog(dialogLines, background, () => {
                this.dialogBox.container.setVisible(false);
                this.scene.start('GameScene', gameData);
                // this.scene.start('GameScene', { 
                //     ...gameData, 
                //     callback: (playerWon) => this.afterBattle(playerWon) 
                // });
            });
        }
    }
  }

  // Nueva función para continuar el diálogo después de la batalla
  afterBattle(playerWon) {
      const postBattleDialog = playerWon
          ? [{ character: "Samuel", text: "Bien jugado… La paciencia cocina la mejor jugada, y tú la serviste en su punto. Ahora, ve a la Taberna del Olvido. Allí te espera Helena." }]
          : [{ character: "Samuel", text: "Tienes la paciencia… pero no la precisión. Aquí, solo los reyes se sientan en la mesa final. Y hoy, no fue tu día." }];

      this.dialogBox.startDialog(postBattleDialog, "asador_fondo", () => {
          this.dialogBox.container.setVisible(false);
      });
  }


  getNPCKey(npc) {
      if (npc === this.npc1) return 'npc1';
      if (npc === this.npc2) return 'npc2';
      if (npc === this.npc3) return 'npc3';
      if (npc === this.npc4) return 'npc4';
      return null;
  }

}
