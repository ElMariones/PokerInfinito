// Inventory.js – Handles Joker management (adding/checking ownership)
import Jokers from './Jokers.js';

class Inventory {
  constructor(scene) {
    this.scene = scene;  // reference to the Phaser scene for registry access
  }

  // Fetch the full Joker object by id from the Jokers catalog
  getJokerById(id) {
    return Jokers.find(j => j.id === id) || null;
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
}

export default Inventory;
