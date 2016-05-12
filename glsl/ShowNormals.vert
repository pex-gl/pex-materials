uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

attribute vec3 aPosition;
attribute vec3 aNormal;

varying vec3 vNormalView;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
  vNormalView = uNormalMatrix * aNormal;
}
