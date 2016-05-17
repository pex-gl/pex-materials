#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor; //=1,1,1,1

void main() {
  gl_FragColor = uColor;
}
