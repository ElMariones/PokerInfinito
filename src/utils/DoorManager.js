export default class DoorManager {
  constructor(scene, doors, music) {
    this.scene = scene;
    this.doors = doors;
    this.doorInteractUI = null;
    this.songs = music;

    // Escuchar la tecla "E"
    this.scene.input.keyboard.on('keydown-E', () => {
      this.tryInteract();
    });
  }

  update(player) {
    const interactDistance = 50;
    let nearestDoor = null;
    let minDist = Infinity;

    this.doors.forEach(door => {
      const dist = Phaser.Math.Distance.Between(player.x, player.y, door.x, door.y);
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        nearestDoor = door;
      }
    });

    // Mostrar u ocultar el icono "E"
    if (nearestDoor) {
      if (!this.doorInteractUI) {
        this.doorInteractUI = this.scene.add.image(nearestDoor.x, nearestDoor.y - 20, 'interactKey').setScale(0.07).setDepth(9999);
      } else {
        this.doorInteractUI.setPosition(nearestDoor.x, nearestDoor.y - 20).setVisible(true).setDepth(9999);
      }
    } else if (this.doorInteractUI) {
      this.doorInteractUI.setVisible(false);
    }

    this.nearestDoor = nearestDoor;
  }

  tryInteract() {
    if (!this.nearestDoor) return;

    // Fade out de la cámara antes de cambiar de escena
    this.scene.cameras.main.fadeOut(500, 0, 0, 0); // 500ms de fade out

    // Cambiar de escena después del fade out
    this.scene.time.delayedCall(500, () => { // Esperar 500ms antes de cambiar de escena
      if (this.scene.sound) {
        this.scene.sound.stopAll();
      }

      const currentSceneKey = this.scene.scene.key;
      const nextSceneKey = this.nearestDoor.toScene;

      // Detener la escena actual
      this.scene.scene.stop(currentSceneKey);

      // Iniciar la nueva escena y pasarle la posición de spawn y la escena anterior
      this.scene.scene.start(nextSceneKey, {
        spawnX: this.nearestDoor.spawnX,
        spawnY: this.nearestDoor.spawnY,
        fromScene: currentSceneKey
      });

      // Fade in en la nueva escena
      this.scene.cameras.main.fadeIn(500, 0, 0, 0); // 500ms de fade in
    });
  }
}
