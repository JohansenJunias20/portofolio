

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';

export default class NavigationBoard extends PhysicsObject3d {
    asset: {
        castShadow: boolean,
        recieveShadow: boolean,
        url: string,
        scale: THREE.Vector3
        floorShadow?: {
            textureUrl: string;
            modelUrl: string;
        }
    }
    public readonly text: "knowledge" | "project" | "playground" | "d";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "knowledge" | "project" | "playground" | "d") {
        super(world, scene, position, 0, "CUSTOM", 0, new CANNON.Box(new CANNON.Vec3(1 / 2, 14 / 2, 1 / 2)));
        this.text = text;
        this.asset = {

            url: `/assets/environment/navigation/navigation_board_${text}.fbx`,
            castShadow: false,
            recieveShadow: false,
            scale: new THREE.Vector3(0.07, 0.07, 0.07),
            floorShadow: text == "knowledge" && {
                textureUrl: `/assets/environment/navigation/floorShadow_${text}.png`,
                modelUrl: `/assets/floorShadow.obj`,
            }
        }
    }
    public async init() {
        await super.init()
        this.mesh.children[2].castShadow = true;
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}