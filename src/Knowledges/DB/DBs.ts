import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import DB from "./DB";


export default class DBs {
    keys: Array<DB>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new DB(world, scene, new Vector3(-17.5, -5, 100), "redis"),
            new DB(world, scene, new Vector3(-17.5, -5, 120), "mongo"),
            new DB(world, scene, new Vector3(-17.5, -5, 140), "mysql"),
        ];

    }
    public async init(floorModel: THREE.Group) {
        var promises = [];
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            key.asset.floorShadow.preload = true;
            key.asset.floorShadow.Mesh = floorModel;
            promises.push(key.init())

        }
        await Promise.all(promises);
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            key.mesh.rotateY(degToRad(-45));
            key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = false
        }
        this.initialized = true;
        return;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}