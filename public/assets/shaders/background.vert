
varying vec3 vPosition;
void main(){
    vPosition=position;
    gl_Position=vec4(position,1.);
}