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
      npc1: { name: "Samuel", background: "asador_fondo", dialog: "Las cartas no mienten, Dante.", gameData: { pointsNeeded: 100, rounds: 5 } },
      npc2: { name: "Helena", background: "taberna_fondo", dialog: "Las reglas son como el humo, querido.", gameData: { pointsNeeded: 400, rounds: 5 } },
      npc3: { name: "Marco", background: "puerto_fondo", dialog: "La suerte es como el mar: caprichosa.", gameData: { pointsNeeded: 500, rounds: 2 } }
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

            // Diálogo de Samuel y Dante
            const dialogLines = [
                { character: "Samuel", text: "Dante… no sabía si alguna vez vendrías. Apuesto a que tienes una carta dorada escondida en el bolsillo, ¿no es así?" },
                { character: "Dante", text: "¿Cómo sabes mi nombre?" },
                { character: "Samuel", text: "Eso no es lo importante. Si de verdad quieres saber lo que te come por dentro, tendrás que ganarme a mí y al resto. La paciencia es buena, pero si esperas demasiado, te quedas con las brasas. La vida es un juego, Dante, y el fuego siempre exige su turno." },
                { character: "Dante", text: "Espero no quemarme entonces." },
                { character: "Samuel", text: "Las cartas no mienten, Dante. Y esta mesa es mi trono. Si quieres un lugar en la historia de este pueblo, tendrás que arrebatármelo." }
            ];

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
      return null;
  }

}
