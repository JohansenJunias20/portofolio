

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp, degToRad } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class ProLang extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(0.15, 0.15, 0.15)
    }
    rotationDeg = 0;
    public readonly type: 1 | 2 | 3;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, type: 1 | 2 | 3, shape: null | CANNON.Shape = null, scale = new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg = 0) {
        super(world, scene, position, 0, "CUSTOM", 0, shape);
        this.type = type;
        this.rotationDeg = rotationDeg;
        this.asset.scale = scale;
        this.asset.url = `/assets/environment/trees/tree${type}.fbx`;
    }
    public async init() {
        await super.init()
        // this.mesh.rotateY(degToRad(this.rotationDeg));
        // this.body.quaternion.copy(this.mesh.quaternion);

    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}