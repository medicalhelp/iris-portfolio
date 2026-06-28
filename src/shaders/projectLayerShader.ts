import { ShaderMaterial, Texture, Color } from 'three';

export function createProjectLayerMaterial(textureA: Texture, textureB: Texture) {
  return new ShaderMaterial({
    uniforms: {
      textureA: { value: textureA },
      textureB: { value: textureB },
      dissolve: { value: 0.0 },
      irisColorA: { value: new Color('#1a4fff') },
      irisColorB: { value: new Color('#c47a1a') },
      irisColorProgress: { value: 0.0 },
      time: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D textureA;
      uniform sampler2D textureB;
      uniform float dissolve;
      uniform vec3 irisColorA;
      uniform vec3 irisColorB;
      uniform float irisColorProgress;
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;

      // Noise for dissolve mask
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1,0)), f.x),
          mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
          f.y
        );
      }

      void main() {
        vec4 colorA = texture2D(textureA, vUv);
        vec4 colorB = texture2D(textureB, vUv);

        // Radial dissolve mask: wipe from center outward
        // vUv center is (0.5, 0.5) for the sphere front
        float dist = length(vUv - vec2(0.5, 0.5)) * 1.8;
        float noiseVal = noise(vUv * 8.0 + time * 0.02) * 0.3;
        float mask = smoothstep(dissolve - 0.15, dissolve + 0.15, dist + noiseVal);

        vec4 color = mix(colorA, colorB, mask);

        // Iris color tint overlay (subtle, applied to the iris region)
        float frontness = dot(normalize(vNormal), vec3(0, 0, 1));
        float irisRegion = smoothstep(0.5, 0.9, frontness);
        vec3 currentIrisColor = mix(irisColorA, irisColorB, irisColorProgress);
        color.rgb = mix(color.rgb, color.rgb * (1.0 + currentIrisColor * 0.15), irisRegion * 0.3);

        // Slightly transparent so iris fiber shader shows through
        color.a = 0.88;

        gl_FragColor = color;
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}
