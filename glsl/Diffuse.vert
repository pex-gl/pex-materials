uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

uniform vec3 uLightPos;

attribute vec3 aPosition;
attribute vec3 aNormal;

varying vec3 vNormalView;
varying vec3 vLightDirView;

void main() {
    vec4 posView = uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * posView;
    vNormalView = uNormalMatrix * aNormal;
    vec3 lightPosView = vec3(uViewMatrix * vec4(uLightPos, 1.0));
    vLightDirView = lightPosView - posView.xyz;
}
