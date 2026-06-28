import { ShaderMaterial } from 'three';

export function createCorneaMaterial() {
  return new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      fresnelPower: { value: 3.0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float fresnelPower;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec2 vUv;

      // Simple noise for moisture shimmer
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(noise(i), noise(i + vec2(1.0, 0.0)), f.x),
          mix(noise(i + vec2(0.0, 1.0)), noise(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      void main() {
        // Fresnel term
        float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), fresnelPower);

        // Moisture shimmer
        float shimmer = smoothNoise(vUv * 20.0 + time * 0.15) * 0.03;
        fresnel = clamp(fresnel + shimmer, 0.0, 1.0);

        // Chromatic aberration at edges: shift RGB slightly
        float chromaticStrength = fresnel * 0.015;
        float r = fresnel + chromaticStrength;
        float g = fresnel;
        float b = fresnel - chromaticStrength;

        // Cool blue-white glass tint
        vec3 glassColor = vec3(0.85, 0.92, 1.0);
        vec3 rimColor = vec3(0.6, 0.8, 1.0);

        vec3 color = mix(glassColor * 0.05, rimColor, vec3(r, g, b));

        // Alpha: mostly transparent, opaque at rim
        float alpha = fresnel * 0.7 + 0.03;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
}
