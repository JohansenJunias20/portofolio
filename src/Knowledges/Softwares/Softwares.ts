import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Software from "./Software";


export default class Softwares {
    keys: Array<Software>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new Software(world, scene, new Vector3(52.5, -5, 100), "blender"),
            new Software(world, scene, new Vector3(52.5, -5, 120), "ue"),
        ];

    }
    public async init(floorModel: THREE.Group) {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            key.asset.floorShadow.preload = true;
            key.asset.floorShadow.Mesh = floorModel;
            await key.init();
            key.mesh.rotateY(degToRad(-45));
            key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = false
        }
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}