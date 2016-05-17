#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormalView;
varying vec3 vLightDirView;

uniform vec4 uDiffuseColor;

void main() {
    vec3 N = normalize(vNormalView);
    vec3 L = normalize(vLightDirView);
    float dotNL = max(0.0, dot(N, L));

    vec3 linearColor = pow(uDiffuseColor.rgb, vec3(2.2));

    vec3 finalColor = pow(linearColor * dotNL, vec3(1.0/2.2));
 
    gl_FragColor.rgb = finalColor;
    gl_FragColor.a = 1.0;
}
