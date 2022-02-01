const vec3 leftTop=vec3(.9529,.5922,.1216);
const vec3 rightTop=vec3(.9608,.5608,.0353);
// const vec3 leftBottom=vec3(.9608,.3765,.0353);
// const vec3 rightBottom=vec3(.9608,.251,.0353);
varying vec3 position;
uniform vec2 Size;
void main(){
    vec3 finalColor;
    vec2 normalizedPos;
    vec2 normalizedSize;
    // percentagePos adalah persentase berapa persen posisi fragment terhadap ukuran width mesh. value: 0-1 (bila posisi frag paling kanan maka value pasti 1)
    vec2 percentagePos=normalizedPos.x/normalizedSize.x;
    // bila percentagePos adalah 1 maka warna LeftTop dikali dengan 0 (1.0-percentagePos) sehingga posisi yg paling kanan hanya mengandung warna rightTop
    vec3 finalColor = leftTop * (1.-percentagePos) + rightTop * (percentagePos);
    
    gl_FragColor=vec4(finalColor,1.);
}