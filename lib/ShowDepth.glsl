#ifdef VERT

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float near;
uniform float far;
uniform vec4 farColor;
uniform vec4 nearColor;
attribute vec3 position;
varying vec4 vColor;

float eyeSpaceDepthToNDC(float zEye) {
  float A = -(far + near) / (far - near); //projectionMatrix[2].z
  float B = -2.0 * far * near / (far - near); //projectionMatrix[3].z; //

  float zNDC = (A * zEye + B) / -zEye;
  return zNDC;
}

void main() {
  //Z in Normalized Device Coordinates math from http://www.songho.ca/opengl/gl_projectionmatrix.html
  vec4 ecPos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * ecPos;

  float zEye = ecPos.z;
  float zNDC = eyeSpaceDepthToNDC(zEye);

  //depth buffer encoding http://stackoverflow.com/questions/6652253/getting-the-true-z-value-from-the-depth-buffer
  float zBuf = 0.5 * zNDC + 0.5;

  vColor = vec4(zBuf);
}

#endif

#ifdef FRAG

varying vec4 vColor;

void main() {
  gl_FragColor = vColor;
}

#endif
