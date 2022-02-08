

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp, degToRad } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
interface IParameter {
    world: CANNON.World,
    scene: THREE.Scene,
    position: Vector3,
    type: 1 | 2 | 3,
    shape: CANNON.Box,
    scale: THREE.Vector3,
    rotationDeg: 0 | 45 | 75,
}
export default class ProLang extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(0.15, 0.15, 0.15),
        floorShadow: {
            textureUrl: "" ,
            modelUrl: "",
            scale: new Vector3(0),
            offset: new Vector3(),
        }
    }
    rotationDeg = 0;
    public readonly type: 1 | 2 | 3;
    // constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, type: 1 | 2 | 3, shape: null | CANNON.Shape = null, scale = new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg = 0) {
    //     super(world, scene, position, 0, "CUSTOM", 0, shape);
    //     this.type = type;
    //     this.rotationDeg = rotationDeg;
    //     this.asset.scale = scale;
    //     this.asset.url = `/assets/environment/trees/tree${type}.fbx`;
    //     this.asset.floorShadow = {
    //         textureUrl: `/assets/environment/trees/floorShadow_${type}_deg${rotationDeg}.png`,
    //         modelUrl: "/assets/floorShadow.obj",
    //         scale: new THREE.Vector3(6.5, 0, 6.5),
    //         offset: new THREE.Vector3()
    //     }
    //     // this.asset.floorShadow.textureUrl = `/assets/environment/trees/floorShadow_${type}_deg${rotationDeg}.png`;
    //     // this.asset.floorShadow.modelUrl = ``;
    //     // this.asset.floorShadow.scale = new Vector3(10, 0, 10);
    // }
    constructor(parameters: IParameter) {
        super(parameters.world, parameters.scene, parameters.position, 0, "CUSTOM", 0, parameters.shape);
        this.type = parameters.type;
        this.rotationDeg = parameters.rotationDeg;
        this.asset.scale = parameters.scale;
        this.asset.url = `/assets/environment/trees/tree${parameters.type}.fbx`;
        this.asset.floorShadow = {
            textureUrl: ``, // because trees not using url string but instead use three.Texture Object.
            modelUrl: "/assets/floorShadow.obj",
            scale: new THREE.Vector3(44 * parameters.scale.x, 0, 44 * parameters.scale.z),
            offset: new THREE.Vector3()
        }
        // this.asset.floorShadow.textureUrl = `/assets/environment/trees/floorShadow_${type}_deg${rotationDeg}.png`;
        // this.asset.floorShadow.modelUrl = ``;
        // this.asset.floorShadow.scale = new Vector3(10, 0, 10);
    }
    public async init() {
        await super.init()
        this.mesh.rotateY(degToRad(this.rotationDeg));
        // this.body.quaternion.copy(this.mesh.quaternion);

    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}