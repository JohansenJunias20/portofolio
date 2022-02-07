import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Tree from "./Tree";
import * as CANNON from 'cannon';


export default class Trees {
    keys: Array<Tree>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.keys = [
            // new Tree(world, scene, new Vector3(-15, -5, 10), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1))),
            // new Tree(world, scene, new Vector3(-9, -5, 10), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.15, 0.15, 0.15), 75),
            new Tree({
                world, scene,
                position: new Vector3(-15, -5, 10),
                type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)),
                rotationDeg: 0, scale: new THREE.Vector3(0.15, 0.15, 0.15)
            }),
            new Tree({
                world, scene,
                position: new Vector3(-40, -5, 5),
                type: 1,
                shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)),
                scale: new THREE.Vector3(0.15, 0.15, 0.15),
                rotationDeg: 75
            }),
            new Tree({
                world, scene,
                position: new Vector3(5, -5, 8),
                type: 1,
                shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)),
                scale: new THREE.Vector3(0.15, 0.15, 0.15),
                rotationDeg: 45
            }),
            // new Tree(world, scene, new Vector3(-25, -5, 85), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), 25),
            // new Tree(world, scene, new Vector3(20, -5, 15), 2, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), 25),

            // new Tree(world, scene, new Vector3(-50, -5, 20), 3, new CANNON.Box(new CANNON.Vec3(0.75, 5, 0.75)), new THREE.Vector3(0.075, 0.075, 0.075), 19),
            // new Tree(world, scene, new Vector3(75, -5, 30), 1, new CANNON.Box(new CANNON.Vec3(1.5, 5, 1.5)), new THREE.Vector3(0.15, 0.15, 0.15), 90),
            // new Tree(world, scene, new Vector3(-40, -5, 175), 2, new CANNON.Box(new CANNON.Vec3(1, 5, 3)), new THREE.Vector3(0.1, 0.1, 0.1), 120),

            // new Tree(world, scene, new Vector3(-10, -5, 80), 3, new CANNON.Box(new CANNON.Vec3(0.75, 5, 0.75)), new THREE.Vector3(0.075, 0.075, 0.075), 75),
            // new Tree(world, scene, new Vector3(-70, -5, 100), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.15, 0.15, 0.15), 30),
            // new Tree(world, scene, new Vector3(40, -5, 60), 2, new CANNON.Box(new CANNON.Vec3(0.5, 4, 0.5)), new THREE.Vector3(0.1, 0.1, 0.1), 180),

            // new Tree(world, scene, new Vector3(-15, -5, 129), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), -120),
            // new Tree(world, scene, new Vector3(30, -5, 155), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), -90),
            // new Tree(world, scene, new Vector3(40, -5, 130), 2, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), -45),


            // new Tree(world, scene, new Vector3(-60, -5, 120), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), 120),
            // new Tree(world, scene, new Vector3(-90, -5, 170), 1, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), 90),
            // new Tree(world, scene, new Vector3(-120, -5, 110), 2, new CANNON.Box(new CANNON.Vec3(1, 5, 1)), new THREE.Vector3(0.1, 0.1, 0.1), 45),
        ];

    }
    public async init() {
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            await key.init();
            // key.mesh.rotateY(degToRad(-45));
            key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = true
            key.mesh.castShadow = true
        }
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}