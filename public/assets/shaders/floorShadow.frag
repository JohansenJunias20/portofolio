uniform sampler2D textureMap;
uniform float _opacity;
varying vec2 vUv;
uniform bool darkenBloom;
const vec3 shadowColor=vec3(.8588,.3686,.0392);
// const vec3 shadowColor=vec3(0.,0.,.0);
void main(){
    if(darkenBloom){
        gl_FragColor=vec4(0.,0.,0.,0.);
        return;
    }
    vec3 textureColor=texture(textureMap,vUv).xyz;
    float alpha=1.-textureColor.x;
    // if(alpha!=0.){
        //     alpha+=.05;
    // }
    alpha-=.05;
    gl_FragColor=vec4(shadowColor,_opacity*clamp(alpha,0.,1.));
    // gl_FragColor=vec4(textureColor,alpha);
}