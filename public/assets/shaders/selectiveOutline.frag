varying vec3 finalPos;
uniform float waveRange;
uniform vec3 originPos;
void main(){
    if(finalPos.y<0.){
        discard;
    }
    
    // if(distance(finalPos,originPos) > waveRange){
        // 	_opacity = 0.2;
    // }
    // gl_FragColor = vec4(gl_FragColor.xyz,abs(distance(finalPos,originPos)) > waveRange ? 0. : _opacity);
    gl_FragColor=vec4(1.,1.,1.,1.);
}