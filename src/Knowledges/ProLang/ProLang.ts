

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../../PhysicsObject';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class ProLang extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: true,
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
        }
    }
    public readonly text: "js" | "ts" | "golang" | "cs" | "python" | "html" | "css" | "php" | "cpp" | "bash";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "js" | "ts" | "golang" | "cs" | "python" | "html" | "css" | "php" | "cpp" | "bash") {
        super(world, scene, position, 0, "TRIMESH", 0);
        this.text = text;
        this.asset.url = `/assets/environment/knowledge/ProLang/${text}.obj`;
        this.asset.mtl = `/assets/environment/knowledge/ProLang/${text}.mtl`;
    }
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }


}