// Weather.js

// ---------------------------
// Rain Fragment Shader
// ---------------------------
const rainFragShader = `
#define DROP_WITH 0.008
#define LIGHT 0.20
#define SLOPE 4.0

precision mediump float;

uniform sampler2D uMainSampler;
uniform float uTime;

varying vec2 outTexCoord;

vec3 rnd(float vmax, float vmin){
    float vx = abs(sin(uTime))*(vmax + vmin) - vmin;
    float vy = abs(sin(vx))*(vmax + vmin) - vmin;
    float vz = fract(uTime)*(vmax + vmin) - vmin;
    return vec3(vx, vy, vz);
}

// Draws three lines per frame using the equation: Y = 1.0 - SLOPE * X
float plot(vec2 pos){
    vec3 offset = rnd(0.9, SLOPE);
    return smoothstep(DROP_WITH, 0.0, abs(pos.y - (1.0 - SLOPE * pos.x) + offset.x)) +
           smoothstep(DROP_WITH, 0.0, abs(pos.y - (1.0 - SLOPE * pos.x) + offset.y)) +
           smoothstep(DROP_WITH, 0.0, abs(pos.y - (1.0 - SLOPE * pos.x) + offset.z));
}

void main (){
    vec4 pixel = texture2D(uMainSampler, outTexCoord);
    float isDrop = plot(outTexCoord);
    vec3 color = vec3(LIGHT);
    gl_FragColor = vec4(pixel.rgb + isDrop * color * fract(uTime), 1.0);
}
`;

// ---------------------------
// Fog Fragment Shader (Revised)
// ---------------------------
const fogFragShader = `
precision mediump float;
uniform sampler2D uMainSampler;
uniform float uTime;
varying vec2 outTexCoord;

// A simple random function based on the fragment coordinates
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2D noise function using the random() helper
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec4 pixel = texture2D(uMainSampler, outTexCoord);
    
    // Create a shifting noise pattern for the fog with a higher frequency
    float n = noise(outTexCoord * 12.0 + uTime * 0.0002);
    
    // Calculate fog strength using smoothstep, then lower the opacity significantly (e.g., 20%)
    float fogStrength = smoothstep(0.6, 0.8, n) * 0.2;
    
    // Add a subtle pulsation effect for dynamism
    fogStrength *= 0.8 + 0.2 * sin(uTime * 0.001);
    
    // Define a new fog color, here a pale turquoise for a cool, atmospheric feel
    vec3 fogColor = vec3(0.7, 0.85, 0.8);
    
    // Mix the fog color with the original pixel color using the calculated fog strength
    vec3 finalColor = mix(pixel.rgb, fogColor, fogStrength);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// ---------------------------
// RainFX Pipeline Class
// ---------------------------
class RainFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: 'rainPostFX',
      fragShader: rainFragShader
    });
  }

  onPreRender() {
    this.set1f('uTime', this.game.loop.time);
  }
}

// ---------------------------
// FogFX Pipeline Class
// ---------------------------
class FogFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game) {
    super({
      game,
      name: 'fogPostFX',
      fragShader: fogFragShader
    });
  }

  onPreRender() {
    this.set1f('uTime', this.game.loop.time);
  }
}

// ---------------------------
// Weather Class
// ---------------------------
class Weather {
  constructor(game) {
    this.game = game;
    this.rainActive = false;
    this.fogActive = false;

    // Register custom pipelines if they haven't been added yet.
    if (!this.game.renderer.pipelines.has('rainPostFX')) {
      this.game.renderer.pipelines.addPostPipeline('rainPostFX', RainFX);
    }
    if (!this.game.renderer.pipelines.has('fogPostFX')) {
      this.game.renderer.pipelines.addPostPipeline('fogPostFX', FogFX);
    }
  }

  // Get the active camera from the first scene that has one.
  getMainCamera() {
    let scene = this.game.scene.scenes.find(s => s.cameras && s.cameras.main);
    return scene ? scene.cameras.main : null;
  }

  // Update the camera's post pipelines based on active effects.
  updatePipelines() {
    const camera = this.getMainCamera();
    if (camera) {
      const pipelines = [];
      if (this.rainActive) pipelines.push('rainPostFX');
      if (this.fogActive) pipelines.push('fogPostFX');
      camera.setPostPipeline(pipelines);
    }
  }

  addRain() {
    this.rainActive = true;
    this.updatePipelines();
  }

  removeRain() {
    this.rainActive = false;
    this.updatePipelines();
  }

  addFog() {
    this.fogActive = true;
    this.updatePipelines();
  }

  removeFog() {
    this.fogActive = false;
    this.updatePipelines();
  }
}

export default Weather;
