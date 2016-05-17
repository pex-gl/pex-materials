#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormalView;
varying vec3 vPositionView;

uniform sampler2D uTexture;

void main() {
    vec3 e = normalize(vPositionView);
    vec3 n = normalize(vNormalView);
    vec3 r = (reflect(e, n));
    float m = 2.0 * sqrt(r.x * r.x + r.y * r.y + (r.z + 1.0) * (r.z + 1.0));
    vec2 N = r.xy / m + 0.5;
    vec3 base = texture2D( uTexture, N ).rgb;
    gl_FragColor = vec4(base, 1.0);
}
