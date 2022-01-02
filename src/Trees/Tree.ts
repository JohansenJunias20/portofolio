

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class ProLang extends PhysicsObject3d {
    asset = {
        castShadow: false,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(10, 10, 10)
    }
    public readonly type: 1 | 2 | 3;
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, type: 1 | 2 | 3, shape: null | CANNON.Shape = null) {
        super(world, scene, position, 0, "TRIMESH", 0, shape);
        this.type = type;
        this.asset.url = `/assets/environment/trees/tree${type}.fbx`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}