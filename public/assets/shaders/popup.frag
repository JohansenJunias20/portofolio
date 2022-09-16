uniform float move;
uniform vec3 originPos;
uniform vec3 size;
uniform float borderWidth;
uniform float opacity;
varying vec3 modelPos;
varying vec3 vPosition;
uniform bool darkenBloom;
void main(){
    if(modelPos.y<0.){
        discard;
        // return;
    }
    if(darkenBloom){
        gl_FragColor=vec4(vec3(0.),1.);
        return;
    }
    float fenceAlpha;
    fenceAlpha=mod(vPosition.x+vPosition.y+vPosition.z+move,1.);
    
    float y=vPosition.y-originPos.y;
    fenceAlpha=step(fenceAlpha,.5);
    
    float borderBawah=step(y,borderWidth+size.y/2.*(-1.));
    float borderAtas=step(size.y/2.-borderWidth,y);
    
    float finalBorder=max(borderBawah,borderAtas);
    float finalAlpha=max(fenceAlpha,finalBorder);
    
    gl_FragColor=vec4(vec3(1.),finalAlpha*opacity);
    
}