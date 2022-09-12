

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
    shape: CANNON.Box,
    scale: THREE.Vector3,
    rotationDeg: 0 | 45 | 75,
}
export default class Projector extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(0.15, 0.15, 0.15),
        floorShadow: {
            textureUrl: "",
            modelUrl: "",
            scale: new Vector3(0),
            offset: new Vector3(),
            Mesh: new THREE.Group(),
            preload: false
        }
    }
    constructor(parameters: IParameter) {
        super(parameters.world, parameters.scene, parameters.position, 0, "BOX", 0);
        this.followWaveEffect = false;
        this.asset.scale = parameters.scale;
        this.asset.url = `/assets/environment/projector/projector.obj`;
        this.asset.mtl = `/assets/environment/projector/projector.mtl`;
        this.asset.floorShadow = {
            textureUrl: `/assets/environment/projector/floorShadow.png`, // because trees not using url string but instead use three.Texture Object.
            modelUrl: "/assets/floorShadow.obj",
            scale: new THREE.Vector3(9.7 * parameters.scale.x, 0, 9.7 * parameters.scale.z),
            offset: new THREE.Vector3(),
            Mesh: new THREE.Group(),
            preload: false,
        }
        this.selectiveOutline = true;
        // this.asset.floorShadow.textureUrl = `/assets/environment/trees/floorShadow_${type}_deg${rotationDeg}.png`;
        // this.asset.floorShadow.modelUrl = ``;
        // this.asset.floorShadow.scale = new Vector3(10, 0, 10);
    }


}