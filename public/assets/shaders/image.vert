
varying vec2 vUv;
// attribute vec2 uv;
void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}