import { Vec3 } from "cannon";
import * as CANNON from "cannon";
import * as THREE from "three";
import { ShaderMaterial, WebGLRenderTarget } from "three";
import vertShader from '../../public/assets/shaders/background.vert';
import fragShader from '../../public/assets/shaders/background.frag';

export default class Plane {
    world: CANNON.World;
    scene: THREE.Scene;
    position: THREE.Vector3
    size: {
        x: number,
        y: number,
        z: number
    }
    geometry: THREE.BufferGeometry
    constructor(world: CANNON.World, scene: THREE.Scene, position: THREE.Vector3, size: { x: number, y: number, z: number }) {
        this.world = world;

        this.scene = scene;
        this.position = position;
        this.size = size;

        const groundBody = new CANNON.Body({ mass: 0, material: { friction: 1, restitution: 0.1, id: 1, name: "test" }, shape: new CANNON.Box(new Vec3(size.x, 0.1, size.z)) });
        world.addBody(groundBody);

        const screenSize = {
            x: window.innerWidth,
            y: window.innerHeight
        }
        this.initialized = false;

    }
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    private createVertices(): Float32Array {
        const vertices: number[] = [];
        //left top
        vertices[0] = -1;
        vertices[1] = 1;
        vertices[2] = 1;

        //right top
        vertices[3] = 1;
        vertices[4] = 1;
        vertices[5] = 1;

        //left bottom
        vertices[6] = -1;
        vertices[7] = -1;
        vertices[8] = 1;

        //right bottom
        vertices[9] = 1;
        vertices[10] = -1;
        vertices[11] = 1;

        return new Float32Array(vertices);
    }
    private createIndices() {
        return new Uint16Array([2, 3, 1, 2, 1, 0])
    }
    setDepthTexture(textureDepth: THREE.Texture) {
        // this.material.uniforms.shadowMap.value = textureDepth;
        // this.material.needsUpdate = true;
    }
    setWorldMatrix(worldMatrix: THREE.Matrix4) {
        // this.material.uniforms.worldMatrix.value = worldMatrix;
        // this.material.needsUpdate = true;
    }
    public async init() {
        var geometry = new THREE.BufferGeometry();
        const vertices = this.createVertices();
        const indices = this.createIndices();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1, false));
        //#endregion
        const material = new THREE.ShaderMaterial({
            vertexShader: vertShader,
            // pakai syntax import, jangan fetch
            fragmentShader: fragShader,
            // side: THREE.FrontSide
        });
        this.material = material;
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.frustumCulled = false;
        // this.material.depthTest = false;
        // this.mesh.rotation.x = (THREE.MathUtils.degToRad(-90))
        // this.mesh.receiveShadow = true;
        this.material.needsUpdate = true;
        this.scene.add(this.mesh)
        this.initialized = true;
    }
    initialized: boolean;
    update(deltatime: number) {
        //nothing to update
        this.material.needsUpdate = true;
    }


}