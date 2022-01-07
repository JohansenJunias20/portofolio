varying mat4 cameraSpaceMatrix;

void main(){
    float fenceAlpha;
    fenceAlpha=mod(modelPos.x+modelPos.y+modelPos.z+move,1.);
    
    float y=modelPos.y-originPos.y;
    fenceAlpha=step(fenceAlpha,.5);
    
    float borderBawah=step(y,borderWidth+size.y/2.*(-1.));
    float borderAtas=step(size.y/2.-borderWidth,y);
    
    float finalBorder=max(borderBawah,borderAtas);
    float finalAlpha=max(fenceAlpha,finalBorder);
    
    gl_FragColor=vec4(vec3(1.),finalAlpha*opacity);
    
}