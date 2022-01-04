import * as THREE from "three";
import { ShaderMaterial } from "three";


export default class PopUp {
    vert: string;
    frag: string;
    world: CANNON.World;
    scene: THREE.Scene;
    position: THREE.Vector3
    size: {
        x: number,
        y: number,
        z: number
    }
    geometry: THREE.BufferGeometry
    constructor(world: CANNON.World, scene: THREE.Scene, position: THREE.Vector3, size: { x: number, y: number, z: number }, borderWidth: number = 0.1) {
        this.world = world;
        this.vert =

            ` 
            varying vec3 modelPos;
            void main(){
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                modelPos = position.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        this.frag = `
        uniform float move;
        uniform vec3 originPos;
        uniform vec3 size;
        uniform float borderWidth;
        varying vec3 modelPos;
        void main() {
            float fenceAlpha;
                fenceAlpha = mod(modelPos.x + modelPos.y + modelPos.z + move ,1.0);

            float y = modelPos.y -originPos.y;
            fenceAlpha = step(fenceAlpha, 0.5);


            float borderBawah = step(y,  borderWidth + size.y/2.0 * (- 1.0));
            float borderAtas = step(size.y/2.0  - borderWidth,y);

            float finalBorder = max(borderBawah, borderAtas);
            float finalAlpha = max(fenceAlpha, finalBorder);
           
            gl_FragColor = vec4(vec3(1.0),finalAlpha);

        }
        `
        this.scene = scene;
        this.position = position;
        this.size = size;
        this.geometry = new THREE.BufferGeometry();
        const length = 8;
        const vertices = new Float32Array(length * 3)
        const uvs = new Uint32Array(length * 2)
        const indices = new Uint32Array(length * 6)
        const { x, y, z } = size;

        //#region un used
        // left side
        //top front
        // vertices[0] = -x / 2 // x
        // vertices[1] = position.y +  y / 2 // y
        // vertices[2] = position.z + z / 2 // z
        // //top back
        // vertices[3] = -x / 2 // x
        // vertices[4] = position.y +  y / 2 // y
        // vertices[5] = -z / 2 // z
        // //bottom back
        // vertices[6] = -x / 2 // x
        // vertices[7] = -y / 2 // y
        // vertices[8] = -z / 2 // z
        // //bottom front
        // vertices[9] = -x / 2 // x
        // vertices[10] = -y / 2 // y
        // vertices[11] = position.z + z / 2 // z

        // //right side
        // //top front
        // vertices[12] = position.x + x / 2 // x
        // vertices[13] = position.y +  y / 2 // y
        // vertices[14] = position.z + z / 2 // z
        // //top back
        // vertices[15] = position.x + x / 2 // x
        // vertices[16] = position.y +  y / 2 // y
        // vertices[17] = -z / 2 // z
        // //bottom back
        // vertices[18] = position.x + x / 2 // x
        // vertices[19] = -y / 2 // y
        // vertices[20] = -z / 2 // z
        // //bottom front
        // vertices[21] = position.x + x / 2 // x
        // vertices[22] = -y / 2 // y
        // vertices[23] = position.z + z / 2 // z
        //#endregion

        // Vertices
        //#region front
        vertices[0 * 3 + 0] = position.x + x * 0.5
        vertices[0 * 3 + 1] = position.y + y * 0.5
        vertices[0 * 3 + 2] = position.z

        vertices[1 * 3 + 0] = position.x + x * 0.5
        vertices[1 * 3 + 1] = position.y - y * 0.5
        vertices[1 * 3 + 2] = position.z

        vertices[2 * 3 + 0] = position.x - x * 0.5
        vertices[2 * 3 + 1] = position.y + y * 0.5
        vertices[2 * 3 + 2] = position.z

        vertices[3 * 3 + 0] = position.x - x * 0.5
        vertices[3 * 3 + 1] = position.y - y * 0.5
        vertices[3 * 3 + 2] = position.z
        //#endregion
        //#region back
        vertices[4 * 3 + 0] = position.x + x * 0.5
        vertices[4 * 3 + 1] = position.y + y * 0.5
        vertices[4 * 3 + 2] = position.z - z

        vertices[5 * 3 + 0] = position.x + x * 0.5
        vertices[5 * 3 + 1] = position.y - y * 0.5
        vertices[5 * 3 + 2] = position.z - z

        vertices[6 * 3 + 0] = position.x - x * 0.5
        vertices[6 * 3 + 1] = position.y + y * 0.5
        vertices[6 * 3 + 2] = position.z - z

        vertices[7 * 3 + 0] = position.x - x * 0.5
        vertices[7 * 3 + 1] = position.y - y * 0.5
        vertices[7 * 3 + 2] = position.z - z
        //#endregion

        //#region  Index
        //front
        indices[0 * 3 + 0] = 0
        indices[0 * 3 + 1] = 2
        indices[0 * 3 + 2] = 1

        indices[1 * 3 + 0] = 2
        indices[1 * 3 + 1] = 1
        indices[1 * 3 + 2] = 3

        //back
        indices[2 * 3 + 0] = 4
        indices[2 * 3 + 1] = 5
        indices[2 * 3 + 2] = 6

        indices[3 * 3 + 0] = 6
        indices[3 * 3 + 1] = 5
        indices[3 * 3 + 2] = 7

        //left
        indices[4 * 3 + 0] = 2
        indices[4 * 3 + 1] = 3
        indices[4 * 3 + 2] = 6

        indices[5 * 3 + 0] = 3
        indices[5 * 3 + 1] = 7
        indices[5 * 3 + 2] = 6

        //right
        indices[6 * 3 + 0] = 0
        indices[6 * 3 + 1] = 1
        indices[6 * 3 + 2] = 4

        indices[7 * 3 + 0] = 4
        indices[7 * 3 + 1] = 1
        indices[7 * 3 + 2] = 5
        //#endregion
        this.geometry.setIndex(new THREE.BufferAttribute(indices, 1, false));
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        console.log({ vert: this.vert })
        this.material = new ShaderMaterial({
            vertexShader: this.vert,
            fragmentShader: this.frag,
            side: THREE.DoubleSide,
            uniforms: {
                originPos: {
                    value: position
                },
                move: {
                    value: 0
                },
                size: {
                    value: size
                },
                borderWidth: {
                    value: borderWidth
                }
            },
            depthTest: true,
            depthWrite: false,
            transparent: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh)
    }
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    update(deltatime: number) {
        //nothing to update
        this.material.uniforms.move.value += 1 * deltatime;
        this.material.needsUpdate = true;
    }


}