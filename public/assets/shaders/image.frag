varying vec2 vUv;
uniform sampler2D textureMap;
void main(){
    gl_FragColor=texture2D(textureMap,vUv);
}