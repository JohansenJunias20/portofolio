import * as THREE from "three";
import { ShaderMaterial, Vector2, Vector3 } from "three";
import { clamp, degToRad } from "three/src/math/MathUtils";
import * as CANNON from "cannon";


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
    constructor(world: CANNON.World, scene: THREE.Scene, position: THREE.Vector3, size: { x: number, y: number, z: number }, borderWidth: number = 0.1, urlTextureFloor: string) {
        this.world = world;
        //#region shader language for fence
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
        uniform float opacity;
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
           
            gl_FragColor = vec4(vec3(1.0),finalAlpha * opacity);

        }
        `
        //#endregion
        this.scene = scene;
        this.position = position;
        this.size = size;
        this.fence = {
            material: new THREE.ShaderMaterial(),
            mesh: new THREE.Mesh(),
            maxYanimation: 0,
            borderWidth: borderWidth,
            position: new Vector3().copy(position).sub(new Vector3(0, size.y / 2, 0)),
            originalPosition: new Vector3().copy(position).sub(new Vector3(0, size.y / 2, 0))
        }
        this.floor = {
            size: new Vector2(size.x, size.z),
            mesh: new THREE.Mesh(),
            position: position,
            urlTexture: urlTextureFloor
        }
        this.borderFloor = {
            size: new Vector2(size.x, size.z),
            mesh: new THREE.Mesh(),
            position: position,
            urlTexture: `/assets/environment/portofolio/border floor.png`,
            body: new CANNON.Body()
        }


    }
    initialized: boolean;
    createGeometryFence(size: { x: number, y: number, z: number }, position: THREE.Vector3) {
        const geometry = new THREE.BufferGeometry();
        const length = 8;
        const vertices = new Float32Array(length * 3)
        const uvs = new Uint32Array(length * 2)
        const indices = new Uint32Array(length * 6)
        const { x, y, z } = size;

        // Vertices
        //#region front
        vertices[0 * 3 + 0] = position.x + x * 0.5
        vertices[0 * 3 + 1] = position.y + y * 0.5
        vertices[0 * 3 + 2] = position.z + z * 0.5

        vertices[1 * 3 + 0] = position.x + x * 0.5
        vertices[1 * 3 + 1] = position.y - y * 0.5
        vertices[1 * 3 + 2] = position.z + z * 0.5

        vertices[2 * 3 + 0] = position.x - x * 0.5
        vertices[2 * 3 + 1] = position.y + y * 0.5
        vertices[2 * 3 + 2] = position.z + z * 0.5

        vertices[3 * 3 + 0] = position.x - x * 0.5
        vertices[3 * 3 + 1] = position.y - y * 0.5
        vertices[3 * 3 + 2] = position.z + z * 0.5
        //#endregion
        //#region back
        vertices[4 * 3 + 0] = position.x + x * 0.5
        vertices[4 * 3 + 1] = position.y + y * 0.5
        vertices[4 * 3 + 2] = position.z - z * 0.5

        vertices[5 * 3 + 0] = position.x + x * 0.5
        vertices[5 * 3 + 1] = position.y - y * 0.5
        vertices[5 * 3 + 2] = position.z - z * 0.5

        vertices[6 * 3 + 0] = position.x - x * 0.5
        vertices[6 * 3 + 1] = position.y + y * 0.5
        vertices[6 * 3 + 2] = position.z - z * 0.5

        vertices[7 * 3 + 0] = position.x - x * 0.5
        vertices[7 * 3 + 1] = position.y - y * 0.5
        vertices[7 * 3 + 2] = position.z - z * 0.5
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
        geometry.setIndex(new THREE.BufferAttribute(indices, 1, false));
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geometry;
    }
    createMaterialFence(size: { x: number, y: number, z: number }, position: THREE.Vector3, borderWidth: number) {
        const material = new ShaderMaterial({
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
                },
                opacity: {
                    value: 0.8
                }
            },
            depthTest: true,
            depthWrite: false,
            transparent: true
        });
        return material;
    }
    async init() {
        await this.initFence();
        await this.initFloor()
        await this.initBorderFloor();
        this.initialized = true;
    }
    fence: {
        material: THREE.ShaderMaterial;
        mesh: THREE.Mesh;
        maxYanimation: number;
        borderWidth: number,
        position: THREE.Vector3; // current position
        originalPosition: THREE.Vector3; //start position before animating
    }
    floor: {
        mesh: THREE.Mesh;
        size: THREE.Vector2;
        position: THREE.Vector3;
        urlTexture: string;
    }
    borderFloor: {
        mesh: THREE.Mesh;
        size: THREE.Vector2;
        position: THREE.Vector3;
        urlTexture: string;
        body: CANNON.Body
    }
    // borderFloorMesh: THREE.Mesh;
    ceilingPosition: THREE.Vector3;
    onMouseHover() {
        if (!this.initialized) return;
        this.alphaAnimationUp += 0.05;
        this.alphaAnimationUp = clamp(this.alphaAnimationUp, 0, 1)
        this.fence.mesh.position.copy(this.fence.mesh.position.lerp(this.ceilingPosition, this.alphaAnimationUp));
        this.alphaAnimationDown = 0;
    }
    alphaAnimationUp = 0;
    alphaAnimationDown = 0;
    onMouseNotHover() {
        if (!this.initialized) return;
        this.alphaAnimationDown += 0.05;
        this.alphaAnimationDown = clamp(this.alphaAnimationDown, 0, 1)
        this.fence.mesh.position.copy(this.fence.mesh.position.lerp(this.fence.originalPosition, this.alphaAnimationDown));
        this.alphaAnimationUp = 0;

    }
    update(deltatime: number) {
        this.fence.material.uniforms.move.value += 1 * deltatime;
        this.fence.material.needsUpdate = true;

    }

    async initFloor() {
        const planeFloorGeom = new THREE.PlaneGeometry(this.floor.size.x, this.floor.size.y);

        const textureFloor = await new THREE.TextureLoader().loadAsync(this.floor.urlTexture);
        const planeFloorMaterial = new THREE.MeshLambertMaterial({
            lightMap: textureFloor,
            map: textureFloor,
            transparent: true
        })
        const mesh = new THREE.Mesh(planeFloorGeom, planeFloorMaterial);
        mesh.rotateX(degToRad(-90))
        mesh.position.copy(this.floor.position)
        this.floor.mesh = mesh;
        this.scene.add(mesh)
    }
    async initBorderFloor() {
        const borderFloorGeom = new THREE.PlaneGeometry(this.borderFloor.size.x, this.borderFloor.size.y);
        const textureBorderFloor = await new THREE.TextureLoader().loadAsync(this.borderFloor.urlTexture);
        const borderFloorMaterial = new THREE.MeshLambertMaterial({
            lightMap: textureBorderFloor,
            map: textureBorderFloor,
            transparent: true
        })
        const meshBorderFloor = new THREE.Mesh(borderFloorGeom, borderFloorMaterial);
        meshBorderFloor.rotateX(degToRad(-90))
        meshBorderFloor.position.copy(this.borderFloor.position)
        this.borderFloor.mesh = meshBorderFloor;
        this.borderFloor.mesh = meshBorderFloor;
        this.scene.add(meshBorderFloor)

        const body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(this.borderFloor.size.x / 2, 0.005, this.borderFloor.size.y / 2)),
            mass: 0
        })
        body.position.copy(this.borderFloor.position);
        this.borderFloor.body = body;
        this.world.addBody(body);
    }
    async initFence() {
        this.ceilingPosition = new Vector3();
        this.ceilingPosition = this.ceilingPosition.copy(this.fence.originalPosition).add(new Vector3(0, 3, 0));


        this.fence.material = this.createMaterialFence(this.size, new Vector3(), this.fence.borderWidth);
        this.fence.mesh = new THREE.Mesh(this.createGeometryFence(this.size, new Vector3()), this.fence.material); // inisialisasi di lokasi 0, 0, 0 dulu
        this.fence.mesh.position.copy(this.fence.originalPosition);


        this.scene.add(this.fence.mesh)
    }
}