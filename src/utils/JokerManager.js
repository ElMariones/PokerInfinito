// JokerManager.js - Manages joker UI display and effects
import Phaser from 'phaser';
import Jokers from './Jokers.js';

class JokerManager {
  constructor(scene, inventory) {
    this.scene = scene;
    this.inventory = inventory;
    this.jokerSprites = [];
    this.jokerInfoText = null;
  }
  
  // Display owned jokers at the top of the screen
  displayJokers() {
    // Clear any existing joker sprites
    this.jokerSprites.forEach(sprite => sprite.destroy());
    this.jokerSprites = [];
    
    if (this.jokerInfoText) {
      this.jokerInfoText.destroy();
      this.jokerInfoText = null;
    }
    
    // Get all owned jokers
    const ownedJokers = this.inventory.getOwnedJokers();
    
    if (ownedJokers.length === 0) {
      return; // No jokers to display
    }
    
    // Display them in a row at the top
    const spacing = 100;
    const startX = this.scene.cameras.main.width - (ownedJokers.length * spacing) - 20; 
    const y = 100; 
    
    ownedJokers.forEach((joker, index) => {
      const x = startX + (index * spacing);
      const sprite = this.scene.add.image(x, y, joker.image)
        .setScale(0.7)
        .setInteractive();
        
      // Add hover effects to show joker details
      sprite.on('pointerover', () => {
        sprite.setScale(0.9);
        this.showJokerInfo(joker);
      });
      
      sprite.on('pointerout', () => {
        sprite.setScale(0.7);
        if (this.jokerInfoText) {
          this.jokerInfoText.destroy();
          this.jokerInfoText = null;
        }
      });
      
      this.jokerSprites.push(sprite);
    });
  }
  
  showJokerInfo(joker) {
    if (this.jokerInfoText) {
      this.jokerInfoText.destroy();
    }

    const x = this.scene.cameras.main.width - 125;
    const y = 175; 
    
    this.jokerInfoText = this.scene.add.text(x, y, joker.description, {
      fontSize: '16px',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 },
      color: '#ffffff',
      align: 'left',
      wordWrap: { width: 300 }
    }).setOrigin(1, 0);
  }
  
  // Animate joker effect when it's applied
  animateJokerEffect(jokerId, targetCard) {
    const joker = this.inventory.getJokerById(jokerId);
    if (!joker) return;
    
    // Find the joker sprite
    const jokerSprite = this.jokerSprites.find(sprite => 
      sprite.texture.key === joker.image
    );
    
    if (!jokerSprite) return;
    
    // Flash the joker to show it's being activated
    this.scene.tweens.add({
      targets: jokerSprite,
      alpha: { from: 1, to: 0.5 },
      scale: { from: 0.5, to: 0.7 },
      duration: 300,
      yoyo: true,
      repeat: 1
    });
    
    // If we have a target card, animate connecting to it
    if (targetCard) {
      const cardSprite = this.scene.cardSprites.find(s => s.texture.key === targetCard.key);
      if (cardSprite) {
        // Create a line or particle effect from joker to card
        // This is just a simple example
        const line = this.scene.add.graphics();
        line.lineStyle(2, 0xffff00);
        line.beginPath();
        line.moveTo(jokerSprite.x, jokerSprite.y);
        line.lineTo(cardSprite.x, cardSprite.y);
        line.strokePath();
        
        // Fade out line
        this.scene.tweens.add({
          targets: line,
          alpha: 0,
          duration: 500,
          onComplete: () => line.destroy()
        });
      }
    }
  }
}

export default JokerManager;