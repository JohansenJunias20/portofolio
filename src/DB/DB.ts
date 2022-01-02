

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class DB extends PhysicsObject3d {
    asset = {
        castShadow: false,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(10, 10, 10)
    }
    public readonly text: "redis" | "mysql" | "firebird" | "mongo"
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "redis" | "mysql" | "firebird" | "mongo") {
        super(world, scene, position, 0, "TRIMESH", 0);
        this.text = text;
        this.asset.url = `/assets/environment/knowledge/DB/${text}.obj`;
        this.asset.mtl = `/assets/environment/knowledge/DB/${text}.mtl`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}