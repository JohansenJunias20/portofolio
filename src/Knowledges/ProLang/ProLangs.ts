import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import ProLang from "./ProLang";


export default class ProLangs {
    keys: Array<ProLang>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new ProLang(world, scene, new Vector3(-52.5, -5, 100), "js"),
            new ProLang(world, scene, new Vector3(-52.5, -5, 120), "ts"),
            new ProLang(world, scene, new Vector3(-52.5, -5, 140), "golang"),
            new ProLang(world, scene, new Vector3(-52.5, -5, 160), "cs"),
            new ProLang(world, scene, new Vector3(-17.5, -5, 160), "python"),
            new ProLang(world, scene, new Vector3(17.5, -5, 160), "php"),
            new ProLang(world, scene, new Vector3(52.5, -5, 140), "cpp"),
            new ProLang(world, scene, new Vector3(52.5, -5, 160), "bash"),
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