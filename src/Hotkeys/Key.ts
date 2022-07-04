

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';
import Shadow from '../Shadow';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Key extends PhysicsObject3d {
    asset = {
        castShadow: true,
        url: ``,
        scale: new THREE.Vector3(0.07, 0.07, 0.07)
    }
    shadow: Shadow;
    scene: THREE.Scene;
    // public followWaveEffect = false;
    public readonly key: "W" | "A" | "S" | "D" | "SPACE";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, key: "W" | "A" | "S" | "D" | "SPACE") {
        super(world, scene, position, 0, "BOX", 0.3);
        this.key = key;
        this.asset.url = `/assets/environment/hotkeys/key ${key}.fbx`;
    }
    public async init() {
        await super.init()
        this.shadow = new Shadow(this.scene, this.mesh as any);
    }
    public update(deltatime: number) {
        super.update(deltatime);
        // this.body.
        //get size from body cannon js
        // var size = new THREE.Vector3();
        // new THREE.Box3().setFromObject(this.mesh).getSize(size);

        //get height of Cannon body in world
        // const height = this.body.position.y;

        this.shadow.update(this.mesh.rotation.y, this.mesh.position);
    }


}