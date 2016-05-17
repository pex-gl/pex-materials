#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;
uniform vec4 uColor;

void main() {
    gl_FragColor = texture2D(uTexture, gl_PointCoord.xy) * uColor;
}
