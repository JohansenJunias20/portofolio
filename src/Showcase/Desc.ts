import MeshOnlyObject3d from "../MeshOnlyObject";
import * as THREE from "three";

import floorFrag from "../../public/assets/shaders/floorMesh.frag";
import floorVert from "../../public/assets/shaders/floorMesh.vert";
import { Mesh, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
export default class Desc extends MeshOnlyObject3d {
    private pathTexture: string;
    private degX: number;
    private degY: number;
    private color: THREE.Vector3;
    constructor(scene: THREE.Scene, position: THREE.Vector3, pathTexture: string, degX: number = -90, degY: number = 0, color = new Vector3(1, 1, 1)) {
        super(scene, position);
        this.pathTexture = pathTexture;
        this.color = color;
        this.degX = degX;
        this.degY = degY;

    }
    public async loadAsset(): Promise<void> {
        var desc_text_texture = await new THREE.TextureLoader().loadAsync(this.pathTexture)
        const sizePlaneDescText = {
            x: desc_text_texture.image.width as number / 15,
            y: desc_text_texture.image.height as number / 15
        }
        const descGeometry = new THREE.PlaneGeometry(sizePlaneDescText.x, sizePlaneDescText.y);

        // const desc_text_material = new THREE.MeshBasicMaterial({
        //     alphaMap: desc_text_texture,
        //     transparent: true
        // })
        const desc_text_material = new THREE.ShaderMaterial({
            uniforms: {
                _opacity: {
                    value: 1
                },
                darkenBloom: {
                    value: false
                },
                mapTexture: {
                    value: desc_text_texture
                },
                color: {
                    value: this.color
                }
            },
            // lights: true,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            vertexShader: floorVert,
            fragmentShader: floorFrag,
        });
        const planeDescText = new THREE.Mesh(descGeometry, desc_text_material);
        planeDescText.position.copy(this.position);
        planeDescText.receiveShadow = false;
        planeDescText.castShadow = false;
        // planeDescText.position.y = 0.1;
        // planeDescText.position.z += sizePlaneDescText.y / 2 + 5;
        // planeDescText.position.x += 12;
        planeDescText.rotateX(degToRad(this.degX))
        planeDescText.rotateY(degToRad(this.degY))
        this.scene.add(planeDescText);
        (this.mesh) = planeDescText as any;
    }
}