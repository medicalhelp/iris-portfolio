import { ShaderMaterial, Color } from 'three';

// Helper to create a new instance each time (materials are stateful)
export function createIrisMaterial() {
  return new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      irisColor: { value: new Color('#c47a1a') },
      dissolve: { value: 0 },
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
      uniform vec3 irisColor;
      uniform float dissolve;
      varying vec2 vUv;

      // Hash for Voronoi
      vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453123);
      }

      // Voronoi distance
      float voronoi(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float minDist = 1.0;
        for (int x = -1; x <= 1; x++) {
          for (int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = hash2(i + neighbor);
            point = 0.5 + 0.5 * sin(time * 0.3 + 6.2831 * point);
            vec2 diff = neighbor + point - f;
            float dist = length(diff);
            minDist = min(minDist, dist);
          }
        }
        return minDist;
      }

      // Radial fiber pattern
      float fiberPattern(vec2 uv) {
        // Convert to polar-ish coords for radial fibers
        float angle = atan(uv.y - 0.5, uv.x - 0.5);
        float radius = length(uv - 0.5) * 2.0;

        // Radial lines (fibers)
        float fibers = abs(sin(angle * 80.0 + voronoi(uv * 8.0) * 2.0));
        fibers = pow(fibers, 3.0);

        // Voronoi cells for organic texture
        float cells = voronoi(uv * 12.0 + time * 0.05);
        cells = smoothstep(0.0, 0.4, cells);

        // Fade at edges
        float radialFade = 1.0 - smoothstep(0.0, 0.8, radius);

        return (fibers * 0.7 + cells * 0.3) * radialFade;
      }

      void main() {
        float pattern = fiberPattern(vUv);

        // Base golden color
        vec3 goldBase = vec3(0.85, 0.65, 0.1);
        vec3 darkBase = vec3(0.08, 0.05, 0.02);

        // Mix with iris color
        vec3 tintedGold = mix(goldBase, irisColor, 0.4);

        vec3 color = mix(darkBase, tintedGold, pattern);

        // Add subtle brightness variation
        color += pattern * 0.15 * vec3(1.0, 0.9, 0.5);

        // Dissolve (for future transition use — full fade to transparent)
        float alpha = 1.0 - dissolve;

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
  });
}
