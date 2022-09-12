
// varying vec3 vPosition;
uniform float intensity;
varying vec3 pos;
const vec3 posCenterSource = vec3(10.78,4.55,4.48);
const vec3 color = vec3(255./255.,255./255.,255./255.);
// const vec3 color=vec3(255./255.,253./255.,222./255.);
// uniform float maxX;
// uniform float minX;
// uniform float minY;
// uniform float maxY;
// uniform float minZ;
// uniform float maxZ;
uniform float maxDistance;
void main(){
    float dist = distance(posCenterSource,pos);
    float final = abs(dist) / maxDistance;
    // vec3 finalPos=pos;
    //pos.x tidak minus value 0/10
    // gl_FragColor=vec4(255./255.,255./255.,255./255.,clamp(pos.x-minX,0.,maxX)/(maxX-minX)*intensity);
    gl_FragColor=vec4(color*0.5,(1.-final)*intensity);
    // gl_FragColor=vec4(color,0.);
}