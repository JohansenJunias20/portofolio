varying vec3 modelPos;

varying mat4 cameraSpaceMatrix;
void main(){
    cameraSpaceMatrix = projectionMatrix * modelViewMatrix;
    vec4 mvPosition=modelViewMatrix*vec4(position,1.);
    modelPos=position.xyz;
    gl_Position=projectionMatrix*mvPosition;
}