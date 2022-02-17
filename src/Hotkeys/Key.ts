

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Key extends PhysicsObject3d {
    asset = {
        castShadow: true,
        url: ``,
        scale: new THREE.Vector3(0.07, 0.07, 0.07)
    }
    // public followWaveEffect = false;
    public readonly key: "W" | "A" | "S" | "D";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, key: "W" | "A" | "S" | "D") {
        super(world, scene, position, 0, "BOX", 0.2);
        console.log({ poskey: position })
        this.key = key;
        this.asset.url = `/assets/environment/hotkeys/key ${key}.fbx`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}