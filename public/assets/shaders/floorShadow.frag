uniform sampler2D textureMap;
varying vec2 vUv;
const vec3 shadowColor=vec3(0.0, 0.0, 0.0);
void main(){
    vec3 textureColor=texture(textureMap,vUv).xyz;
    float alpha=1.-textureColor.x;
    // if(alpha!=0.){
        //     alpha+=.05;
    // }
    alpha-=.2;
    gl_FragColor=vec4(shadowColor,clamp(alpha,0.,1.));
}