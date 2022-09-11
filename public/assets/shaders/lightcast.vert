
varying vec3 pos;
void main(){
    // pos =( modelMatrix *  vec4( position, 1.0 )).xyz;
    pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}