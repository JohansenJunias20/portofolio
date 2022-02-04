#define LAMBERT
#define USE_LAMBERT
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>

#include <fog_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

#ifndef FLAT_SHADED
varying vec3 vNormal;
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
varying vec3 vLightFront;
#ifdef DOUBLE_SIDED
varying vec3 vLightBack;
#endif
void main(){
    
    #include <clipping_planes_fragment>
    vec4 diffuseColor=vec4(diffuse,opacity);
    
    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <normal_fragment_begin>
    #include <normal_fragment_maps>

    vec3 outgoingLight=vec3(0.);
    #ifdef DOUBLE_SIDED
    if(gl_FrontFacing)
    outgoingLight+=diffuseColor.rgb*vLightFront+emissive;
    else
    outgoingLight+=diffuseColor.rgb*vLightBack+emissive;
    #else
    outgoingLight+=diffuseColor.rgb*vLightFront+emissive;
    #endif
    
    gl_FragColor=vec4(outgoingLight,diffuseColor.a);
    #include <fog_fragment>
    
}

// void main(){
    //     gl_FragColor=vec4(0.,1.,0.,1);
    
// }