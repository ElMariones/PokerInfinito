// Inventory.js – Handles Joker management (adding/checking ownership)
import Jokers from './Jokers.js';

class Inventory {
  
  constructor(scene) {
    if (!scene || !scene.registry) {
      throw new Error("Inventory requiere una escena de Phaser con registry válido");
    }
    
    this.scene = scene;  // reference to the Phaser scene for registry access

    // Initialize jokers array in registry if it doesn't exist
    if (!this.scene.registry.get('jokers')) {
      this.scene.registry.set('jokers', []);
    }
  }

  // Fetch the full Joker object by id from the Jokers catalog
  getJokerById(id) {
    return Jokers.find(j => j.id === id) || null;
  }

  // Get all jokers the player owns
  getOwnedJokers() {
    const jokerIds = this.scene.registry.get('jokers') || [];
    return jokerIds.map(id => this.getJokerById(id)).filter(j => j !== null);
  }

  // Check if the player already owns the Joker with given id
  hasJoker(id) {
    const owned = this.scene.registry.get('jokers') || [];  // get owned joker IDs array
    return owned.includes(id);
  }

  // Add a Joker to the player's inventory if not owned
  addJoker(id) {
    if (this.hasJoker(id)) {
      return false;  // already owned, do nothing
    }
    // Get current owned list (or empty array if none set)
    const owned = this.scene.registry.get('jokers') || [];
    owned.push(id);
    this.scene.registry.set('jokers', owned);  // update the registry with new owned list
    return true;
  }
  // Remove a joker from inventory (in case it's destroyed during gameplay)
  removeJoker(id) {
    const owned = this.scene.registry.get('jokers') || [];
    const index = owned.indexOf(id);
    if (index !== -1) {
      owned.splice(index, 1);
      this.scene.registry.set('jokers', owned);
      return true;
    }
    return false;
  }
  
  // For debugging: add 5 jokers to inventory
  addFiveJokers() {
    for (let i = 1; i <= 2; i++) {
      this.addJoker(i);  
    }
  }
}

export default Inventory;
