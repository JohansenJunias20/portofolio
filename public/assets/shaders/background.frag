const vec3 leftTop=vec3(245./255.,136./255.,60./255.);
const vec3 rightTop=vec3(255./255.,144./255.,67./255.);
const vec3 leftBottom=vec3(252./255.,207./255.,146./255.);
const vec3 rightBottom=vec3(245./255.,170./255.,88./255.);
varying vec3 vPosition;
uniform vec2 Size;
void main(){
    vec3 finalColor;
    vec2 normalizedPos=vPosition.xy;
    normalizedPos.x+=1.;
    normalizedPos.y+=1.;
    // normalizedPos.z+=1.;
    
    vec2 normalizedSize=vec2(2.,2.);
    // percentagePos adalah persentase berapa persen posisi fragment terhadap ukuran width mesh. value: 0-1 (bila posisi frag paling kanan maka value pasti 1)
    float percentagePosHorizontal=normalizedPos.x/normalizedSize.x;
    //bila y inverted
    float percentagePosVertical=1.-normalizedPos.y/normalizedSize.y;
    // bila percentagePos adalah 1 maka warna LeftTop dikali dengan 0 (1.0-percentagePos) sehingga posisi yg paling kanan hanya mengandung warna rightTop
    vec3 finalColorTop=leftTop*(1.-percentagePosHorizontal)+rightTop*(percentagePosHorizontal);
    vec3 finalColorBottom=leftBottom*(1.-percentagePosHorizontal)+rightBottom*(percentagePosHorizontal);
    finalColor=mix(finalColorTop,finalColorBottom,percentagePosVertical);
    
    gl_FragColor=vec4(finalColor,1.);
}