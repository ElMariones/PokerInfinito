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
                                    //              tiledset    boot
    const texturasBookShelf = map.addTilesetImage('bookShelf', 'bookShelf');
    const texturasDrawerShelf = map.addTilesetImage('drawerShelf', 'drawerShelf');
    const texturasHabitacionInside1 = map.addTilesetImage('habitacionInside1', 'habitacionInside1');
    const texturasSuelos = map.addTilesetImage('suelos', 'suelos');
    const texturasParedes = map.addTilesetImage('paredes', 'paredes');
    const texturasHabitacionInside2 = map.addTilesetImage('habitacionInside2', 'habitacionInside2');
    const texturasTV = map.addTilesetImage('TV', 'TV');
    const texturasWindows = map.addTilesetImage('windows', 'windows');
    const texturasTVBig = map.addTilesetImage('TVBig', 'TVBig');

    // 3) Create layers
// 3) Crear capas

const todosLosTilesets = [
  texturasBookShelf,
  texturasDrawerShelf,
  texturasHabitacionInside1,
  texturasSuelos,
  texturasParedes,
  texturasHabitacionInside2,
  texturasTV,
  texturasWindows,
  texturasTVBig
];

const layerSuelo = map.createLayer('suelo', todosLosTilesets, 0, 0);
const layerPared = map.createLayer('wall', todosLosTilesets, 0, 0);
const layerDecoracionPared = map.createLayer('walldecoration', todosLosTilesets, 0, 0);
const layerVentanas = map.createLayer('windows', todosLosTilesets, 0, 0);
const layerMobiliario = map.createLayer('furniture', todosLosTilesets, 0, 0);
const layerEncimaMobiliario = map.createLayer('onTopOfFurniture', todosLosTilesets, 0, 0);
