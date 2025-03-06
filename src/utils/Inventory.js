class Inventory {
    constructor() {
      if (Inventory.instance) {
        return Inventory.instance;
      }
  
      this.jokers = [];
      Inventory.instance = this;
    }
  
    // Añadir un joker al inventario
    addJoker(joker) {
      this.jokers.push(joker);
    }
  
    // Eliminar un joker del inventario
    removeJoker(joker) {
      const index = this.jokers.indexOf(joker);
      if (index > -1) {
        this.jokers.splice(index, 1);
      }
    }
  
    // Obtener todos los jokers del inventario
    getJokers() {
      return this.jokers;
    }
  
    // Limpiar el inventario
    clear() {
      this.jokers = [];
    }
  }
  
const instance = new Inventory();
Object.freeze(instance);

export default instance;