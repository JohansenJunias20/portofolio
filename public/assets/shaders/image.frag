varying vec2 vUv;
uniform sampler2D textureMap;
void main(){
    gl_FragColor=vec4(texture2D(textureMap,vUv).xyz*.45,1.);
}