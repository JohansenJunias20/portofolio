import { Vec3 } from "cannon";
import * as CANNON from "cannon";
import * as THREE from "three";
import { ShaderMaterial, WebGLRenderTarget } from "three";


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
    constructor(world: CANNON.World, scene: THREE.Scene, dirLight: THREE.DirectionalLight, position: THREE.Vector3, size: { x: number, y: number, z: number }, color: string, shadowColor: string) {
        this.world = world;
       
        this.scene = scene;
        this.position = position;
        this.size = size;

        const groundBody = new CANNON.Body({ mass: 0, material: { friction: 1, restitution: 0.1, id: 1, name: "test" }, shape: new CANNON.Box(new Vec3(size.x, 0.1, size.z)) });
        world.addBody(groundBody);


        const geometry = new THREE.PlaneGeometry(size.x, size.z);
        const length = 8;
        const vertices = new Float32Array(length * 3)
        const uvs = new Uint32Array(length * 2)
        const indices = new Uint32Array(length * 6)
        const { x, y, z } = size;
        var dirLightDirection = new THREE.Vector3();
        dirLight.getWorldDirection(dirLightDirection)
        //#endregion
        const material = new THREE.MeshToonMaterial({ color: "#c49a66", side: THREE.FrontSide });
        this.material = material;

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotation.x = (THREE.MathUtils.degToRad(-90))
        this.mesh.receiveShadow = true;
        scene.add(this.mesh)
    }
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    setDepthTexture(textureDepth: THREE.Texture) {
        // this.material.uniforms.shadowMap.value = textureDepth;
        // this.material.needsUpdate = true;
    }
    setWorldMatrix(worldMatrix: THREE.Matrix4) {
        // this.material.uniforms.worldMatrix.value = worldMatrix;
        // this.material.needsUpdate = true;
    }
    update(deltatime: number) {
        //nothing to update
    }


}