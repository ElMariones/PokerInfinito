// VHS_fx.js
import Phaser from 'phaser';

export default class VHSFxPlugin extends Phaser.Plugins.ScenePlugin {
  constructor(scene, pluginManager) {
    super(scene, pluginManager);
    // Listen for the scene's "create" event (fires once per scene)
    scene.events.once(Phaser.Scenes.Events.CREATE, this.onSceneCreate, this);
  }

  onSceneCreate() {
    const postFxPlugin = this.systems.plugins.get('rexhorrifipipelineplugin');
    if (postFxPlugin) {
      // Apply the pipeline to this scene's main camera and save a reference
      this.fxPipeline = postFxPlugin.add(this.scene.cameras.main, {
        enable: true,

        // Bloom
        bloomEnable: true,
        bloomRadius: 1,
        bloomIntensity: 0.01,
        bloomThreshold: 0.01,
        bloomTexelWidth: 0.01,

        // Chromatic Aberration
        chromaticEnable: false,
        chabIntensity: 0.1,

        // Vignette
        vignetteEnable: true,
        vignetteStrength: 5,
        vignetteIntensity: 0.15,

        // Noise
        noiseEnable: true, // (keep this false if you don't want it always on)
        noiseStrength: 0.06,
        noiseSeed: 1,

        // VHS
        vhsEnable: false,
        vhsStrength: 0.05,

        // Scanlines
        scanlinesEnable: true,
        scanStrength: 0.05,

        // CRT
        crtEnable: true,
        crtWidth: 15,
        crtHeight: 15
      });

      // Listen to the scene's update event to change the noise seed continuously.
      this.scene.events.on('update', this.update, this);
    }
  }

  update(time, delta) {
    if (this.fxPipeline) {
      // Update the noiseSeed with a new random value each frame
      this.fxPipeline.noiseSeed = Math.random();
    }
  }
}
