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
  
      // Cambiar de escena
      if (this.scene.sound) {
        this.scene.sound.stopAll();
    }
    
      const currentSceneKey = this.scene.scene.key;
      const nextSceneKey = this.nearestDoor.toScene;

      // 📌 1️⃣ Asegurar que la escena actual se detiene
      this.scene.scene.stop(currentSceneKey);

      // 📌 2️⃣ Iniciar la nueva escena y pasarle la anterior
      this.scene.scene.start(nextSceneKey, {
        spawnX: this.nearestDoor.spawnX,
        spawnY: this.nearestDoor.spawnY,
        fromScene: currentSceneKey // Guardamos la escena anterior
      });
    }
  }
  