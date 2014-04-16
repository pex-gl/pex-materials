#ifdef VERT

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 normalMatrix;
uniform float pointSize;
attribute vec3 position;
attribute vec3 normal;

varying vec2 vN;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vec3 e = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
  vec3 n = normalize(vec3(normalMatrix * vec4(normal, 1.0)));

  vec3 r = reflect(e, n);
  float m = 2.0 * sqrt(
      pow(r.x, 2.0) +
      pow(r.y, 2.0) +
      pow(r.z + 1.0, 2.0)
  );
  vN = r.xy / m + 0.5;
}

#endif

#ifdef FRAG

uniform sampler2D texture;

varying vec2 vN;

void main() {
  vec3 base = texture2D( texture, vN ).rgb;
  gl_FragColor = vec4( base, 1.0 );
}

#endif
