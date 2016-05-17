#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor; //=1,0,0,1
void main() {
  gl_FragColor = uColor;
}
