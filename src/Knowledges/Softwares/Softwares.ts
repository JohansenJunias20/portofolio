import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Wrapper from "../../Wrapper";
import Software from "./Software";


export default class Softwares extends Wrapper<Software> {
    keys: Array<Software>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
        this.keys = [
            new Software(world, scene, new Vector3(52.5, -5, 100), "blender"),
            new Software(world, scene, new Vector3(52.5, -5, 120), "ue"),
            new Software(world, scene, new Vector3(52.5, -5, 180), "docker"),
            new Software(world, scene, new Vector3(17.5, -5, 180), "aws"),
            new Software(world, scene, new Vector3(-17.5, -5, 180), "adobe"),
            new Software(world, scene, new Vector3(-52.5, -5, 180), "nginx"),
            new Software(world, scene, new Vector3(-52.5, -5, 200), "opengl"),
            new Software(world, scene, new Vector3(17.5, -5, 200), "nodejs"),
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