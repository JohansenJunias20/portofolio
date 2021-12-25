

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Character {
    public scene: THREE.Scene;
    public position: Vector3;
    public initialized: boolean;
    public mesh: THREE.Mesh<THREE.SphereGeometry, any>;
    public movementSpeed: number;
    private animation: AnimationCharacter;
    private body: CANNON.Body;
    private PhysicsWorld: CANNON.World;
    private isPress: {
        w: boolean,
        a: boolean,
        s: boolean,
        d: boolean
    }
    private size: {
        x: number,
        y: number,
        z: number
    }
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 10) {
        this.isPress = {
            w: false,
            a: false,
            s: false,
            d: false
        }
        this.size = {
            x: 1,
            y: 1,
            z: 1
        }
        this.PhysicsWorld = world;
        this.scene = scene;
        this.initialized = false;
        this.position = position;
        this.movementSpeed = movementSpeed;

        this.body = new CANNON.Body({ mass: 3, material: { friction: 1, restitution: 1, id: 1, name: "test" }, shape: new CANNON.Sphere(this.size.x) });
        this.PhysicsWorld.addBody(this.body);
        document.onkeydown = (e) => {
            if (e.key == "w") {
            }
            else if (e.key == "s") {
            }
            else if (e.key == "a") {
            }
            else if (e.key == "d") {
            }
            else {
                return
            }
            this.isPress[e.key] = true;
        }

        document.onkeyup = (e) => {
            if (e.key == "w") {
            }
            else if (e.key == "s") {
            }
            else if (e.key == "a") {

            }
            else if (e.key == "d") {

            }
            else {
                return;
            }
            this.isPress[e.key] = false;
        }

        this.body.addEventListener('intersectsw', () => {
            console.log("test")
        })

    }
    public async init() {
        await this.loadAsset();
    }
    private async loadAsset() {
        // const fbx = await new Promise<Group>((res, rej) => {
        //     const loader = new FBXLoader();
        //     loader.load("./assets/character/character.fbx", (f) => {
        //         f.traverse(c => {
        //             c.castShadow = true;
        //         })
        //         f.scale.x = 0.05;
        //         f.scale.y = 0.05;
        //         f.scale.z = 0.05;
        //         res(f);
        //     })
        // })
        const texture = new THREE.TextureLoader().load('assets/character/textures/Character_baseColor.jpg');
        const geometry = new THREE.SphereGeometry(this.size.x);
        const material = new THREE.MeshToonMaterial({ color: "white", map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        this.position.y += 10;
        this.mesh = sphere;

        this.body.position.set(this.position.x, this.position.y, this.position.z);
        this.scene.add(sphere);
        // const fbxAnim = await new Promise<Group>((res, rej) => {
        //     const loader = new FBXLoader();
        //     loader.load("./assets/character/animation_walk.fbx", (f) => {
        //         const mixer = new THREE.AnimationMixer(fbx);
        //         this.animation.walk = mixer.clipAction(f.animations[0])
        //         this.animation.walk.play();
        //         res(f);
        //         // f.traverse(c => {
        //         //     c.castShadow = true;
        //         // })
        //         // f.scale.x = 0.05;
        //         // f.scale.y = 0.05;
        //         // f.scale.z = 0.05;
        //     })
        // })

        this.initialized = true;
    }
    public update() {
        this.walk();
        this.updatePhysics();
        this.mesh.position.copy(this.position);
    }
    private updatePhysics() {

        this.PhysicsWorld.step(1 / 60);
        this.position.copy(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z));
        this.mesh.quaternion.copy(this.body.quaternion);
    }
    public render() {
        this.scene.add(this.mesh);
    }
    private isWalking: boolean;
    addResistance() {
        if (this.isPress.a == false && this.isPress.d == false) {
            this.body.velocity.x = 0;
        }
        if (this.isPress.w == false && this.isPress.s == false) {
            this.body.velocity.z = 0;
        }


        //whenever ball stop moving, decreasing velocity of rotation over time to near 0
        if (this.body.velocity.x == 0 && this.body.velocity.z == 0) {

            this.body.angularVelocity.x += this.body.angularVelocity.x > 0 ? -0.1 : 0.1;
            this.body.angularVelocity.y += this.body.angularVelocity.y > 0 ? -0.1 : 0.1;
            this.body.angularVelocity.z += this.body.angularVelocity.z > 0 ? -0.1 : 0.1;
        }

    }
    private isIntersects: boolean;
    public walk() {
        this.addResistance();
        if (!this.isWalking) {
            //start animating walk
            this.isWalking = true;
        }
        var result = [];
        //todo list stop adding more velocity when sphere not intersect with any object.
        if (this.isIntersects) {
            return;
        }

        if (Math.abs(this.body.velocity.z) <= 10) {
            console.log("under 10")
            if (this.isPress.w) {
                this.body.applyForce(new CANNON.Vec3(0, 0, -200), this.body.position);
                // this.body.velocity.z = -this.movementSpeed;
            }
            if (this.isPress.s) {
                this.body.applyForce(new CANNON.Vec3(0, 0, 200), this.body.position);
                // this.body.velocity.z = this.movementSpeed;
            }


        }
        if (Math.abs(this.body.velocity.x) <= 10) {

            if (this.isPress.a) {
                this.body.applyForce(new CANNON.Vec3(-50, 0, 0), this.body.position);
                // this.body.velocity.x = -this.movementSpeed;
            }
            if (this.isPress.d) {
                this.body.applyForce(new CANNON.Vec3(50, 0, 0), this.body.position);
                // this.body.velocity.x = this.movementSpeed;

            }
        }

    }
    public stopWalk() {
        // stop animating
    }
}