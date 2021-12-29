

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../../PhysicsObject';

export default class Statue extends PhysicsObject3d {
    asset = {
        castShadow: false,
        recieveShadow: false,
        url: ``,
        scale: new THREE.Vector3(0.07, 0.07, 0.07)
    }
    public readonly text: "waving" | "dab" | "style" | "clapping";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "waving" | "dab" | "style" | "clapping") {
        super(world, scene, position, 0, "BOX", 0);
        this.text = text;
        this.asset.url = `/assets/environment/lobby/Statues/statue_${text}.fbx`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}