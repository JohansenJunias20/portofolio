

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Word extends PhysicsObject3d {
    asset = {
        castShadow: false,
        recieveShadow: false,
        url: ``,
        scale: new THREE.Vector3()
    }
    public readonly text: "J" | "O" | "H" | "A" | "N" | "S" | "E";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "J" | "O" | "H" | "A" | "N" | "S" | "E", scale: Vector3 = new THREE.Vector3(0.07, 0.07, 0.07)) {
        super(world, scene, position, 0, "BOX", 0.3);
        this.text = text;
        this.asset.scale = scale;
        this.asset.url = `/assets/environment/johansen/${text}.fbx`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}