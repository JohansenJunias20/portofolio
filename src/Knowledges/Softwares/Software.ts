

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
type Text = "blender" | "ue" | "adobe" | "docker" | "aws" | "nginx" | "opengl" | "nodejs"
export default class Software extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(10, 10, 10),
        floorShadow: {
            textureUrl: "",
            modelUrl: "",
            scale: new Vector3(6, 0, 6),
            offset: new Vector3(),
            preload: true,
            Mesh: new THREE.Group()
        },
        additionalMesh: [new THREE.Mesh()]
    }
    public readonly text: Text
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: Text) {
        super(world, scene, position, 0, "CUSTOM", 0, new CANNON.Shape());
        // super(world, scene, position, 0, "TRIMESH", 0);
        this.text = text;
        this.asset.url = `/assets/environment/knowledge/Software/${text}.obj`;
        this.asset.mtl = `/assets/environment/knowledge/Software/${text}.mtl`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}