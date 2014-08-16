#ifdef VERT

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float near;
uniform float far;
uniform vec4 farColor;
uniform vec4 nearColor;
attribute vec3 position;
varying vec4 vColor;

//http://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
void main() {
  vec4 pos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * pos;

  float depth = length(pos.xyz);

  float A = -(far + near) / (far - near); //projectionMatrix[2].z;
  float B = -2 * far * near / (far - near); //projectionMatrix[3].z;

  depth  = 0.5 * (-A * depth + B) / depth + 0.5;

  vColor = vec4(depth);
}

#endif

#ifdef FRAG

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}

#endif
