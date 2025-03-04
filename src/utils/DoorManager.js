export default class DoorManager {
    constructor(scene, doors) {
      this.scene = scene;
      this.doors = doors;
      this.doorInteractUI = null;
  
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
  
      // Cambiar de escena
      this.scene.scene.start(this.nearestDoor.toScene, {
        spawnX: this.nearestDoor.spawnX,
        spawnY: this.nearestDoor.spawnY,
        fromScene: this.scene.scene.key
      });
    }
  }
  