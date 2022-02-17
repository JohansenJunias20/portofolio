import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Wrapper from "../../Wrapper";
import Framework from "./Framework";


export default class Frameworks extends Wrapper<Framework> {
    keys: Array<Framework>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
        this.keys = [
            new Framework(world, scene, new Vector3(17.5, -5, 100), "react"),
            new Framework(world, scene, new Vector3(17.5, -5, 120), "tensorflow"),
            new Framework(world, scene, new Vector3(17.5, -5, 140), "electron"),
        ];

    }

    public prepare() {
        super.prepare();
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            key.mesh.rotateY(degToRad(-45));
            // key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = false
        }
        this.initialized = true;
        return;
    }
}