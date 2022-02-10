import * as THREE from "three";

import defaultFrag from '../../public/assets/shaders/default.frag';
import defaultVert from '../../public/assets/shaders/default.vert';

export default function customShader(color: THREE.ColorRepresentation) {
    return new THREE.ShaderMaterial({
        uniforms: {
            ...THREE.UniformsLib["common"],
            ...THREE.UniformsLib["fog"],
            ...THREE.UniformsLib["lights"],
            ...THREE.UniformsLib["bumpmap"],
            ...THREE.UniformsLib["displacementmap"],
            ...THREE.UniformsLib["normalmap"],
            diffuse: {
                value: color
            },
            _opacity: {
                value: 1
            }
        },
        lights: true,
        transparent: true,
        vertexShader: defaultVert,
        fragmentShader: defaultFrag
    })

}