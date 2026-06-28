import { ShaderMaterial } from 'three';

export function createPupilMaterial() {
  return new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      dilation: { value: 0.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform float dilation;
      varying vec2 vUv;

      // Caustic-like light pattern
      float caustic(vec2 p, float t) {
        vec2 q = vec2(
          p.x * cos(t * 0.3) - p.y * sin(t * 0.3),
          p.x * sin(t * 0.3) + p.y * cos(t * 0.3)
        );
        float a = atan(q.y, q.x);
        float r = length(q);
        float wave = sin(a * 7.0 + t * 0.8) * sin(r * 12.0 - t * 0.5);
        return max(0.0, wave * 0.5 + 0.5);
      }

      void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center) * 2.0; // 0 at center, 1 at edge

        // Dilation expands the pupil — at high dilation, edge ring brightens
        float pupilEdge = 0.85 + dilation * 0.12; // where pupil fades to bright
        float edgeWidth = 0.08;

        // Deep black base
        vec3 deepBlack = vec3(0.02, 0.02, 0.04);

        // Caustic patterns (very subtle)
        float c = caustic(center * 3.0, time) * 0.06 * (1.0 - dist);
        vec3 causticColor = vec3(0.3, 0.5, 0.8) * c;

        // Edge glow (brightens on hover/dilation)
        float edgeGlow = smoothstep(pupilEdge, pupilEdge + edgeWidth, dist);
        edgeGlow *= dilation * 0.6 + 0.1; // always slightly bright, more on hover
        vec3 glowColor = vec3(0.6, 0.7, 0.9) * edgeGlow;

        // Combine
        vec3 color = deepBlack + causticColor + glowColor;

        // Alpha: fully opaque within pupil disc
        // Soft edge at disc boundary
        float alpha = 1.0 - smoothstep(0.9, 1.0, dist);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
  });
}
