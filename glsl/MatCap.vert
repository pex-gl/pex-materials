attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormalView;
varying vec3 vPositionView;

void main() {
    vec4 positionView = uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);

    vNormalView = uNormalMatrix * aNormal;
    vPositionView = positionView.xyz;
    
    gl_Position = uProjectionMatrix * positionView;
}

