import { ShaderMaterial } from 'three';

export function createScleraMaterial() {
  return new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      // Thin vein function: returns strength of vein at point p
      float vein(vec2 p, float seed) {
        // Animate veins slowly
        vec2 q = p + vec2(sin(time * 0.05 + seed), cos(time * 0.04 + seed)) * 0.02;
        float n = noise(q * 6.0 + seed);
        float n2 = noise(q * 12.0 - seed * 0.5);
        // Thin the noise into lines
        float line = abs(fract(n * 4.0 + n2 * 2.0) - 0.5) * 2.0;
        return 1.0 - smoothstep(0.0, 0.15, line);
      }

      void main() {
        // Base sclera color: off-white, slightly warm
        vec3 baseWhite = vec3(0.96, 0.93, 0.88);

        // Limbal ring: darker circle where iris meets sclera
        // In sphere UVs, the "front" is around uv=(0.5, 0.5) ish
        // Use the normal direction to determine how "front-facing" a point is
        float frontness = dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
        frontness = clamp(frontness, 0.0, 1.0);

        // Yellowish tint near iris region (high frontness)
        float irisProximity = smoothstep(0.5, 0.9, frontness);
        vec3 warmTint = vec3(0.95, 0.88, 0.78);
        vec3 scleraColor = mix(baseWhite, warmTint, irisProximity * 0.4);

        // Blood veins — only visible on the sides (low frontness)
        float veinRegion = 1.0 - smoothstep(0.3, 0.8, frontness);

        float vein1 = vein(vUv, 1.0) * veinRegion;
        float vein2 = vein(vUv + vec2(0.3, 0.7), 2.5) * veinRegion;
        float vein3 = vein(vUv + vec2(0.7, 0.2), 4.0) * veinRegion * 0.5;
        float totalVein = clamp(vein1 + vein2 + vein3, 0.0, 1.0) * 0.35;

        vec3 veinColor = vec3(0.72, 0.2, 0.2);
        scleraColor = mix(scleraColor, veinColor, totalVein);

        gl_FragColor = vec4(scleraColor, 1.0);
      }
    `,
    transparent: false,
  });
}
