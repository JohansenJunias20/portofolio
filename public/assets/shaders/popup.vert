varying vec3 vPosition;
varying vec3 modelPos;
void main(){
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    modelPos=(modelMatrix*vec4(position.xyz,1.)).xyz;
    vPosition=position.xyz;
    gl_Position=projectionMatrix*mvPosition;
}