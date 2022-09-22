uniform sampler2D mapTexture;
uniform bool darkenBloom;
uniform vec3 color;
uniform bool useTexture;
// uniform sampler2D bloomTexture;
varying vec2 vUv;
void main(){
    if(darkenBloom){
        gl_FragColor=vec4(0.);
        return;
    }
    // gl_FragColor = vec4(1.);
    //alpha ne 0 ikuti 0
    vec4 result=texture2D(mapTexture,vUv);
    if(useTexture){
        result.a = step(0.5,result.a);
        gl_FragColor=result;
    }
    else{
        float alpha=min(result.a,result.x);
        gl_FragColor=vec4(color,alpha);
    }
}