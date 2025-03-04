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

      // Example if you had a "dance" sprite sheet for each NPC:
      // this.scene.anims.create({
      //   key: `${npc}-dance`,
      //   frames: this.scene.anims.generateFrameNumbers(`${npc}Dance`, { start: 0, end: 5 }),
      //   frameRate: 8,
      //   repeat: -1
      // });

      // You can add more (walking, running, etc.) if needed.
    });
  }

  /**
   * Creates a new NPC as a physics sprite that can collide with layers and the player.
   *
   * @param {string} name - The NPC's name (must match your texture keys, e.g. 'samuelIdle')
   * @param {number} posX - X coordinate
   * @param {number} posY - Y coordinate
   * @param {string} animation - Which animation to play initially (e.g. 'idle-down', 'dance')
   * @param {boolean} facesPlayer - If true, this NPC will rotate its idle animation to face the player
   * @returns {Phaser.Physics.Arcade.Sprite} The created NPC sprite
   */
  addNPC(name, posX, posY, animation, facesPlayer) {
    // Use physics sprite so collisions will work
    const npc = this.scene.physics.add.sprite(posX, posY, `${name}Idle`);

    // Store data flags on the sprite itself
    npc.setData('npcName', name);
    npc.setData('facesPlayer', facesPlayer);

    // Path / movement data
    npc.setData('path', null);       // Will store an array of waypoints if needed
    npc.setData('pathIndex', 0);
    npc.setData('speed', 0);
    npc.setData('loopPath', false);  // Whether to loop the path or stop at the end

    // Play the initial animation (e.g. 'idle-down')
    npc.play(`${name}-${animation}`);

    // Collide with tilemap layers
    this.collidableLayers.forEach(layer => {
      this.scene.physics.add.collider(npc, layer);
    });

    // Collide with the player
    // This ensures the NPC physically stops the player from passing through
    this.scene.physics.add.collider(npc, this.player);
    

    // Add to our manager array
    this.npcArray.push(npc);
    this.interactUI = null;
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
    npc.setData('path', pathPoints);
    npc.setData('speed', speed);
    npc.setData('loopPath', loop);
    npc.setData('pathIndex', 0);
  }

  /**
   * Update logic for all NPCs:
   * 1) If an NPC has a path, move it along that path.
   * 2) If facesPlayer = true, make it rotate its idle animation to face the player.
   * Call this once per frame in your scene's update().
   */
  updateNPCs() {
    let interactDistance = 50;
    let nearestNpc = null;
    let minDist = Infinity;

    this.npcArray.forEach(npc => {
      const path = npc.getData('path');
      const speed = npc.getData('speed');
      const facesPlayer = npc.getData('facesPlayer');
      const name = npc.getData('npcName');

      if (name === 'oveja') {
      npc.body.setSize(20, 28);
      npc.body.setOffset(22, 20); // Adjusted offset for 'oveja'
      } else {
      npc.body.setSize(20, 28);
      npc.body.setOffset(22, 36);
      }
      if (name === 'samuel')
        interactDistance = 75;

      // 1) Move along path if defined
      if (path && path.length > 0) {
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
          if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
        npc.play(`${name}-walk-right`, true);
          } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
        npc.play(`${name}-walk-down`, true);
          } else if (angle >= -3 * Math.PI / 4 && angle < -Math.PI / 4) {
        npc.play(`${name}-walk-up`, true);
          } else {
        npc.play(`${name}-walk-left`, true);
          }
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
        }
          }
        }
      } else {
        // No path => stand still
        npc.body.setVelocity(0, 0);
      }

      // 2) If this NPC should face the player, update its idle animation
      //    (This example has them face the player even while moving, 
      //     but you can condition it so they only face if not on a path.)
      if (facesPlayer) {
        const angle = Phaser.Math.Angle.Between(npc.x, npc.y, this.player.x, this.player.y);

        if (angle >= -Math.PI / 4 && angle < Math.PI / 4) {
          npc.play(`${name}-idle-right`, true);
        } else if (angle >= Math.PI / 4 && angle < 3 * Math.PI / 4) {
          npc.play(`${name}-idle-down`, true);
        } else if (angle >= -3 * Math.PI / 4 && angle < -Math.PI / 4) {
          npc.play(`${name}-idle-up`, true);
        } else {
          npc.play(`${name}-idle-left`, true);
        }
      }

      // 3) If the NPC is close enough to the player, show the "E" icon
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < interactDistance && dist < minDist) {
        minDist = dist;
        nearestNpc = npc;
      }
    });
    // 4) Show/hide the NPC "E" icon
    if (nearestNpc) {
      if (!this.interactUI) {
        this.interactUI = this.scene.add.image(nearestNpc.x, nearestNpc.y - 30, 'interactKey');
        this.interactUI.setScale(0.07);
        this.interactUI.setDepth(9999);
      } else {
        this.interactUI.setPosition(nearestNpc.x, nearestNpc.y - 30);
        this.interactUI.setVisible(true);
        this.interactUI.setDepth(9999);
      }
    }
    else {
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

  tryInteract() {
    let interactDistance = 50;
    let nearestDoor = null;
    let nearestNpc = null;

    this.npcArray.forEach(npc => {
      const name = npc.getData('npcName');
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (name === 'samuel')
        interactDistance = 100;
      if (dist < interactDistance) {
        nearestNpc = npc;
        const name = npc.getData('npcName');
        this.scene.scene.launch('Dialogos', { npc: name , scene: this.scene});
        this.scene.scene.bringToTop('Dialogos');
      }
    });
  }
}
