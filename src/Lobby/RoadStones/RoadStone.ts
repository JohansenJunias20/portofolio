

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import MeshOnlyObject3d from '../../MeshOnlyObject';

export default class RoadStone extends MeshOnlyObject3d {
    asset = {
        castShadow: true,
        recieveShadow: true,
        url: `/assets/environment/Lobby/RoadStones/RoadStone.fbx`,
        scale: new THREE.Vector3(0.07, 0.07, 0.07)
    }
    constructor(scene: THREE.Scene, position: Vector3) {
        super(scene, position);
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}