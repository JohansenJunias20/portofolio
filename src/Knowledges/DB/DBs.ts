import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Wrapper from "../../Wrapper";
import DB from "./DB";


export default class DBs extends Wrapper<DB> {
    keys: Array<DB>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
        this.keys = [
            new DB(world, scene, new Vector3(-17.5, -5, 100), "redis"),
            new DB(world, scene, new Vector3(-17.5, -5, 120), "mongo"),
            new DB(world, scene, new Vector3(-17.5, -5, 140), "mysql"),
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