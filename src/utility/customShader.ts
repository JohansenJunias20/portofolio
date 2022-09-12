import * as THREE from "three";
import { Vector3 } from "three";

import defaultFrag from '../../public/assets/shaders/default.frag';
import defaultVert from '../../public/assets/shaders/default.vert';

export default function customShader(color: THREE.ColorRepresentation) {
    if (!color) {
        console.log("COLOR NOT FOUND!")
    }
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
            },
            waveRange: {
                value: 0
            },
            originPos: {
                value: new Vector3(0, 0, 0)
            },
            darkenBloom: {
                value: false
            }
        },
        lights: true,
        transparent: true,
        vertexShader: defaultVert,
        fragmentShader: defaultFrag,

    })

}