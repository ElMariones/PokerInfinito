// NPCManager.js
import Phaser from 'phaser';

export default class NPCManager {
  /**
   * @param {Phaser.Scene} scene - The scene in which these NPCs exist
   * @param {Array} collidableLayers - Array of tilemap layers or other objects to collide with
   * @param {Phaser.GameObjects.GameObject} player - The player sprite (for collisions & facing logic)
   */
  constructor(scene, collidableLayers = [], player) {
    this.scene = scene;
    this.collidableLayers = collidableLayers;
    this.player = player;

    this.npcArray = [];
    this.interactUI = null; // Moved initialization here
  }

  /**

   * Create all animations for your NPCs (idle, walk, dance, etc.).
 
   * Call this once in your scene's create() before adding NPCs.
 
   */

  createAnimations() {

    const npcNames = ['samuel', 'helena', 'pescador', 'padre', 'gemelos', 'oveja'];



    npcNames.forEach(npc => {

      // Idle animations

      if (!this.scene.anims.exists(`${npc}-idle-up`)) {

        this.scene.anims.create({

          key: `${npc}-idle-up`,

          frames: [{ key: `${npc}Idle`, frame: 0 }],

          frameRate: 1,

          repeat: -1

        });

      }



      if (!this.scene.anims.exists(`${npc}-idle-left`)) {

        this.scene.anims.create({

          key: `${npc}-idle-left`,

          frames: [{ key: `${npc}Idle`, frame: 1 }],

          frameRate: 1,

          repeat: -1

        });

      }



      if (!this.scene.anims.exists(`${npc}-idle-down`)) {

        this.scene.anims.create({

          key: `${npc}-idle-down`,

          frames: [{ key: `${npc}Idle`, frame: 2 }],

          frameRate: 1,

          repeat: -1

        });

      }



      if (!this.scene.anims.exists(`${npc}-idle-right`)) {

        this.scene.anims.create({

          key: `${npc}-idle-right`,

          frames: [{ key: `${npc}Idle`, frame: 3 }],

          frameRate: 1,

          repeat: -1

        });

      }



      // Walk animations (based on your Walk.png sprite, 8 frames per direction)

      if (npc === 'oveja') {

        if (!this.scene.anims.exists('oveja-walk-up')) {

          this.scene.anims.create({

            key: 'oveja-walk-up',

            frames: this.scene.anims.generateFrameNumbers('ovejaWalk', { start: 0, end: 3 }),

            frameRate: 8,

            repeat: -1

          });

        }

        if (!this.scene.anims.exists('oveja-walk-left')) {

          this.scene.anims.create({

            key: 'oveja-walk-left',

            frames: this.scene.anims.generateFrameNumbers('ovejaWalk', { start: 4, end: 7 }),

            frameRate: 8,

            repeat: -1

          });

        }

        if (!this.scene.anims.exists('oveja-walk-down')) {

          this.scene.anims.create({

            key: 'oveja-walk-down',

            frames: this.scene.anims.generateFrameNumbers('ovejaWalk', { start: 8, end: 11 }),

            frameRate: 8,

            repeat: -1

          });

        }

        if (!this.scene.anims.exists('oveja-walk-right')) {

          this.scene.anims.create({

            key: 'oveja-walk-right',

            frames: this.scene.anims.generateFrameNumbers('ovejaWalk', { start: 12, end: 15 }),

            frameRate: 8,

            repeat: -1

          });

        }

      } else {

        if (!this.scene.anims.exists(`${npc}-walk-up`)) {

          this.scene.anims.create({

            key: `${npc}-walk-up`,

            frames: this.scene.anims.generateFrameNumbers(`${npc}Walk`, { start: 0, end: 7 }),

            frameRate: 8,

            repeat: -1

          });

        }

        if (!this.scene.anims.exists(`${npc}-walk-left`)) {

          this.scene.anims.create({

            key: `${npc}-walk-left`,

            frames: this.scene.anims.generateFrameNumbers(`${npc}Walk`, { start: 8, end: 15 }),

            frameRate: 8,

            repeat: -1

          });

        }

        if (!this.scene.anims.exists(`${npc}-walk-down`)) {

          this.scene.anims.create({

            key: `${npc}-walk-down`,

            frames: this.scene.anims.generateFrameNumbers(`${npc}Walk`, { start: 16, end: 23 }),

            frameRate: 8,

            repeat: -1

          });

        }

        if (!this.scene.anims.exists(`${npc}-walk-right`)) {

          this.scene.anims.create({

            key: `${npc}-walk-right`,

            frames: this.scene.anims.generateFrameNumbers(`${npc}Walk`, { start: 24, end: 31 }),

            frameRate: 8,

            repeat: -1

          });

        }

      }
    });

  }



  /**
   * Creates a new NPC as a physics sprite that can collide with layers and the player.
   *
   * @param {string} name - The NPC's name (used for data, texture key fallback, and dialogue trigger)
   * @param {number} posX - X coordinate
   * @param {number} posY - Y coordinate
   * @param {string} initialFrameOrAnim - The initial animation key (e.g., 'idle-down') OR a texture key for static sprites.
   * @param {boolean} facesPlayer - If true, this NPC will rotate its idle animation to face the player
   * @returns {Phaser.Physics.Arcade.Sprite} The created NPC sprite
   */
  addNPC(name, posX, posY, initialFrameOrAnim, facesPlayer) {
    // --- MODIFICATION START ---
    // Determine texture key: Use initialFrameOrAnim directly if it's likely a texture key,
    // otherwise assume it's an animation suffix and construct the key.
    let textureKey = `${name}Idle`; // Default assumption for animated NPCs
    let isStaticSprite = false;

    // If initialFrameOrAnim doesn't look like a standard animation suffix, treat it as the direct texture key
    if (!initialFrameOrAnim.includes('idle-') && !initialFrameOrAnim.includes('walk-')) {
      textureKey = initialFrameOrAnim; // e.g., 'broken_car', 'cow'
      isStaticSprite = true;
    } else {
      // If it's an animation key, it should already exist (created in createAnimations)
      // We still need a base texture for the sprite creation, use the idle one.
      textureKey = `${name}Idle`;
    }

    // Check if the determined texture key exists
    if (!this.scene.textures.exists(textureKey)) {
      console.warn(`Texture key "${textureKey}" not found for NPC "${name}". Using default texture.`);
      // You might want to have a default placeholder texture key here
      // textureKey = 'defaultPlaceholder';
    }


    const npc = this.scene.physics.add.sprite(posX, posY, textureKey);

    // Store data flags on the sprite itself
    npc.setData('npcName', name); // Use the 'name' for dialogue lookup
    npc.setData('facesPlayer', facesPlayer);

    // Path / movement data
    npc.setData('path', null);
    npc.setData('pathIndex', 0);
    npc.setData('speed', 0);
    npc.setData('loopPath', false);

    // Play the initial animation if it's not a static sprite
    if (!isStaticSprite && this.scene.anims.exists(`${name}-${initialFrameOrAnim}`)) {
      npc.play(`${name}-${initialFrameOrAnim}`);
    }
    // For static sprites, no animation is played, it just shows the texture.

    // Make the NPC immovable
    npc.setImmovable(true);
    // --- MODIFICATION END ---


    // Collide with tilemap layers
    this.collidableLayers.forEach(layer => {
      this.scene.physics.add.collider(npc, layer);
    });

    // Collide with the player
    this.scene.physics.add.collider(npc, this.player);

    npc.setData('isStaticSprite', isStaticSprite);
    // Add to our manager array
    this.npcArray.push(npc);
    // this.interactUI = null; // Moved initialization to constructor
    return npc;
  }

  /**
   * Assigns a path for an NPC to follow (simple waypoint system).
   * The NPC will move to each waypoint in order, then either loop or stop.
   *
   * @param {Phaser.Physics.Arcade.Sprite} npc - The NPC sprite returned by addNPC()
   * @param {Array} pathPoints - An array of {x, y} objects for waypoints
   * @param {number} speed - Movement speed in px/sec
   * @param {boolean} loop - If true, loop back to the first waypoint after the last
   */
  setNPCPath(npc, pathPoints, speed = 50, loop = true) {
    // --- NO CHANGES NEEDED HERE ---
    npc.setData('path', pathPoints);
    npc.setData('speed', speed);
    npc.setData('loopPath', loop);
    npc.setData('pathIndex', 0);
    // --- END OF NO CHANGES ---
  }

  /**
   * Update logic for all NPCs:
   * 1) If an NPC has a path, move it along that path.
   * 2) If facesPlayer = true, make it rotate its idle animation to face the player.
   * Call this once per frame in your scene's update().
   */
  updateNPCs() {
    // --- MINOR CHANGE: ADD interactDistance variable initialization ---
    let interactDistance = 50; // Default interaction distance
    let nearestNpc = null;
    let minDist = Infinity;
    // --- END OF MINOR CHANGE ---


    this.npcArray.forEach(npc => {
      // Check if NPC sprite is still active/exists before processing
      if (!npc.active) {
        return; // Skip if inactive
      }

      const path = npc.getData('path');
      const speed = npc.getData('speed');
      const facesPlayer = npc.getData('facesPlayer');
      const name = npc.getData('npcName');
      const isStaticSprite = npc.getData('isStaticSprite');


      // --- Set body size/offset (adjust for barriers if needed) ---
      // You might need specific offsets if the barrier sprites are different dimensions
      if (name === 'oveja') {
        npc.body.setSize(20, 28);
        npc.body.setOffset(22, 20);
      } else if (name === 'barrier_car') { // Example: adjust offset if needed
        npc.body.setSize(npc.width * 0.9, npc.height * 0.1); // Adjust size as needed
        npc.body.setOffset(npc.width * 0, npc.height * 0.85); // Adjust offset to be bottom-center ish
      } else if (name === 'barrier_cow') {
        npc.body.setSize(npc.width * 0.7, npc.height * 0.6);
        npc.body.setOffset(npc.width * 0.15, npc.height * 0.4);
      } else if (name === 'barrier_guard') {
        npc.body.setSize(npc.width * 0.6, npc.height * 0.8);
        npc.body.setOffset(npc.width * 0.2, npc.height * 0.2);
      } else if (name === 'barrier_big_man') {
        npc.body.setSize(npc.width * 0.8, npc.height * 0.5);
        npc.body.setOffset(npc.width * 0.1, npc.height * 0.5);
      } else {
        // Default for other humanoids
        npc.body.setSize(20, 28);
        npc.body.setOffset(22, 36);
      }
      // --- End body size/offset adjustments ---

      // Reset interaction distance for each NPC check
      interactDistance = 50; // Reset to default
      if (name === 'samuel') { // Keep specific distance for Samuel
        interactDistance = 75; // Original code used 100 here, changed to 75 based on updateNPCs logic
      } else if (name.startsWith('barrier_car')) {
        interactDistance = 150; // Slightly larger interaction distance for barriers might be nice
      }


      // 1) Move along path if defined (Barriers won't have paths)
      if (path && path.length > 0) {
        // --- PATH MOVEMENT CODE (NO CHANGES NEEDED) ---
        const index = npc.getData('pathIndex');
        const target = path[index];
        const dist = Phaser.Math.Distance.Between(npc.x, npc.y, target.x, target.y);

        if (dist > 5) {
          // Move NPC toward the current waypoint
          const angle = Phaser.Math.Angle.Between(npc.x, npc.y, target.x, target.y);
          npc.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
          );

          // Play walking animation based on direction
          // ... (walk animation logic) ...

        } else {
          // Reached the waypoint
          npc.setData('pathIndex', index + 1);

          // If we've exceeded the path, loop or stop
          if (npc.getData('pathIndex') >= path.length) {
            if (npc.getData('loopPath')) {
              npc.setData('pathIndex', 0);
            } else {
              // Stop at the last waypoint
              npc.setData('pathIndex', path.length - 1);
              npc.body.setVelocity(0, 0);
              // Optionally play idle animation facing last direction here
            }
          }
        }
        // --- END PATH MOVEMENT CODE ---
      } else {
        // No path => stand still
        npc.body.setVelocity(0, 0);

        // If not moving and not facing player, ensure a default idle anim plays
        if (!facesPlayer && !isStaticSprite && !npc.anims.isPlaying) {
          // Check current animation key and play the corresponding idle if stopped
          const currentAnimKey = npc.anims.currentAnim?.key || '';
          let idleKey = `${name}-idle-down`; // Default idle
          if (currentAnimKey.includes('-up')) idleKey = `${name}-idle-up`;
          else if (currentAnimKey.includes('-left')) idleKey = `${name}-idle-left`;
          else if (currentAnimKey.includes('-right')) idleKey = `${name}-idle-right`;
          else if (currentAnimKey.includes('-down')) idleKey = `${name}-idle-down`;

          if (this.scene.anims.exists(idleKey)) {
            npc.play(idleKey, true);
          }
        }
      }

      // 2) If this NPC should face the player, update its idle animation
      if (facesPlayer) {
        // --- FACE PLAYER CODE (NO CHANGES NEEDED) ---
        const angle = Phaser.Math.Angle.Between(npc.x, npc.y, this.player.x, this.player.y);
        let animKeySuffix = 'idle-down'; // Default

        if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
          animKeySuffix = 'idle-right';
        } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
          animKeySuffix = 'idle-down';
        } else if (angle >= -3 * Math.PI / 4 && angle < -Math.PI / 4) {
          animKeySuffix = 'idle-up';
        } else {
          animKeySuffix = 'idle-left';
        }
        const fullAnimKey = `${name}-${animKeySuffix}`;
        if (this.scene.anims.exists(fullAnimKey)) {
          npc.play(fullAnimKey, true);
        }
        // --- END FACE PLAYER CODE ---
      }

      // 3) Check distance for interaction UI
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        nearestNpc = npc;
      }
    });

    // 4) Show/hide the NPC "E" icon
    if (nearestNpc) {
      if (!this.interactUI) {
        // Ensure 'interactKey' texture is loaded
        if (this.scene.textures.exists('interactKey')) {
          if (nearestNpc.name = 'barrier_car') {
            this.interactUI = this.scene.add.image(1195, 2280, 'interactKey').setScale(0.07).setDepth(9999);
          }
          else{
          this.interactUI = this.scene.add.image(nearestNpc.x, nearestNpc.y - 30, 'interactKey');
          this.interactUI.setScale(0.07);
          this.interactUI.setDepth(9999); // Ensure it's on top
        }
      } else {
          console.warn("Texture 'interactKey' not loaded. Cannot display interaction UI.");
        }
      } else {
        if (nearestNpc.name = 'barrier_car') {
          this.interactUI.setPosition(1195, 2280, 'interactKey').setVisible(true).setDepth(9999);
        }
        else{
        this.interactUI.setPosition(nearestNpc.x, nearestNpc.y - 30);
        this.interactUI.setVisible(true);
        this.interactUI.setDepth(9999); // Ensure depth is maintained
        }}
    } else {
      if (this.interactUI) {
        this.interactUI.setVisible(false);
      }
    }
  }

  /**
   * If you need to iterate NPCs (e.g. for interactions), you can get the array here.
   */
  getAllNPCs() {
    return this.npcArray;
  }

  /**
   * Attempts to interact with the nearest NPC within range.
   */
  tryInteract() {
    let interactDistance = 50; // Default interaction distance
    let nearestNpc = null;
    let minDist = Infinity; // Use infinity to ensure first NPC in range is selected

    this.npcArray.forEach(npc => {
      if (!npc.active) return; // Skip inactive NPCs

      const name = npc.getData('npcName');
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);

      // Set specific interaction distance for certain NPCs or types
      interactDistance = 50; // Reset to default
      if (name === 'samuel') {
        interactDistance = 75; // Adjusted based on updateNPCs
      } else if (name.startsWith('barrier_car')) {
        interactDistance = 150; // Use the same distance as the UI check
      }

      if (dist < interactDistance && dist < minDist) {
        minDist = dist; // Update minimum distance found
        nearestNpc = npc;
      }
    });

    // If an NPC was found within range
    if (nearestNpc) {
      const name = nearestNpc.getData('npcName');
      console.log(`Interacting with: ${name}`); // Debug log

      // Stop player movement when dialogue starts (optional but good practice)
      if (this.player && typeof this.player.stopMovement === 'function') {
        this.player.stopMovement();
      }

      // Launch the dialogue scene
      // Ensure 'Dialogos' scene is registered in your game config
      if (this.scene.scene.get('Dialogos')) {
        this.scene.scene.launch('Dialogos', { npc: name, scene: this.scene });
        this.scene.scene.bringToTop('Dialogos');
      } else {
        console.error("Scene 'Dialogos' not found or not running.");
      }

      // Hide interaction UI immediately after interaction
      if (this.interactUI) {
        this.interactUI.setVisible(false);
      }
    }
  }

  /**
  * Removes an NPC from the game and the manager.
  * @param {Phaser.Physics.Arcade.Sprite} npc - The NPC sprite to remove.
  */
  removeNPC(npc) {
    if (!npc) return;

    // Remove from the array
    const index = this.npcArray.indexOf(npc);
    if (index > -1) {
      this.npcArray.splice(index, 1);
    }

    // Destroy the sprite
    npc.destroy();

    // If this was the NPC showing the interaction UI, hide the UI
    if (this.interactUI && this.interactUI.visible && !this.findNearestNPCToPlayer()) {
      this.interactUI.setVisible(false);
    }
  }

  // Helper function to find the nearest NPC (used after removing one)
  findNearestNPCToPlayer() {
    let interactDistance = 50;
    let nearestNpc = null;
    let minDist = Infinity;

    this.npcArray.forEach(npc => {
      if (!npc.active) return;
      const name = npc.getData('npcName');
      interactDistance = 50; // Reset
      if (name === 'samuel') interactDistance = 75;
      else if (name.startsWith('barrier_')) interactDistance = 60;

      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        nearestNpc = npc;
      }
    });
    return nearestNpc;
  }
}