import Phaser from 'phaser';
import DialogText from '../DialogText.js';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
    this.dialogActive = false; // Controla si hay diálogo activo
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);
    this.player = this.add.image(100, 200, 'player').setScale(0.1);

    this.cursors = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E
    });

    this.npc1 = this.add.image(300, 200, 'npc1').setScale(0.1);
    this.npc2 = this.add.image(500, 300, 'npc2').setScale(0.1);
    this.npc3 = this.add.image(700, 200, 'npc3').setScale(0.1);
    this.npcArray = [this.npc1, this.npc2, this.npc3];

    this.dialogBox = new DialogText(this, { dialogSpeed: 4 });

    this.npcData = {
      npc1: { name: "Samuel", background: "asador_fondo", dialog: ["Las cartas no mienten, Dante.", "¿Quieres jugar conmigo?"], gameData: { pointsNeeded: 100, rounds: 5 } },
      npc2: { name: "Helena", background: "taberna_fondo", dialog: ["Las reglas son como el humo, querido.", "Se doblan si sabes cómo hacerlo."], gameData: { pointsNeeded: 400, rounds: 5 } },
      npc3: { name: "Marco", background: "puerto_fondo", dialog: ["La suerte es como el mar: caprichosa.", "Pero hoy sopla a tu favor."], gameData: { pointsNeeded: 500, rounds: 2 } }
    };

    this.input.keyboard.on('keydown-E', () => {
      if (!this.dialogActive) {
        this.tryInteract();
      }
    });
  }

  update() {
    if (!this.dialogActive) {
      const speed = 3;
      if (this.cursors.up.isDown) this.player.y -= speed;
      if (this.cursors.down.isDown) this.player.y += speed;
      if (this.cursors.left.isDown) this.player.x -= speed;
      if (this.cursors.right.isDown) this.player.x += speed;
    }
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
        const { name, background, dialog, gameData } = this.npcData[npcKey];

        this.dialogActive = true;
        this.dialogBox.startDialog(dialog, name, background, () => {
          this.dialogActive = false;
          this.scene.start('GameScene', gameData);
        });
      }
    }
  }

  getNPCKey(npc) {
    if (npc === this.npc1) return 'npc1';
    if (npc === this.npc2) return 'npc2';
    if (npc === this.npc3) return 'npc3';
    return null;
  }
}
