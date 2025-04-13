import Phaser from 'phaser';
import Player from '../utils/Player.js';
import DoorManager from '../utils/DoorManager.js';
import NPCManager from '../utils/NPCManager.js';

export default class MapHabitacion extends Phaser.Scene {
  constructor() {
    super('MapHabitacion');
  }

  create(data) {
    this.registry.set('currentMap', this.scene.key);

    // 1) Read optional spawn data (in case we're coming from another scene)
    const startX = data?.spawnX ?? 200;
    const startY = data?.spawnY ?? 500;

    // 2) Load your Tilemap and Tilesets
    const map = this.make.tilemap({ key: 'habitacionMap' });
