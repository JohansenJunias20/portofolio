// for floor mesh purposes, everyting that placed to floor like pop up, desc billboard should use this shader
// because the fragment shader need to customized because the bloom effect.
varying vec2 vUv;
uniform float waveRange;
void main(){
    vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}