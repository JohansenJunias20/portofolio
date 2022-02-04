import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import NavigationBoard from "./NavigationBoard";


export default class NavigationBoards {
    keys: Array<NavigationBoard>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            new NavigationBoard(world, scene, new Vector3(-10, -5, 60), "knowledge"),
            new NavigationBoard(world, scene, new Vector3(25, -5, 33), "project"),
            new NavigationBoard(world, scene, new Vector3(-12, -5, 33), "playground"),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            switch (key.text) {
                case "knowledge":
                    key.mesh.rotateY(degToRad(-95));
                    break;
                case "project":
                    key.mesh.rotateY(degToRad(-15));
                    // key.mesh.rotateY(degToRad(-95));
                    break;
                case "playground":
                    key.mesh.rotateY(degToRad(15));
                    break;
                default:
                    break;
            }
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