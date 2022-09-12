uniform sampler2D mapTexture;
uniform bool darkenBloom;
// uniform sampler2D bloomTexture;
varying vec2 vUv;
void main(){
    if(darkenBloom){
        gl_FragColor = vec4(0.);
        return;
    }
    // gl_FragColor = vec4(1.);
    //alpha ne 0 ikuti 0
    vec4 result = texture2D(mapTexture,vUv);
    float alpha = min(result.a,result.x);
    gl_FragColor = vec4(vec3(1.),alpha);
}