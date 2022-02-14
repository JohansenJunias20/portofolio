

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from './PhysicsObject';
import { WaveEffect } from './waveEffect';
declare var followCharacter: boolean;

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Character extends PhysicsObject3d {
    public isPress: {
        w: boolean,
        a: boolean,
        s: boolean,
        d: boolean
    }
    asset = {
        castShadow: true,
        url: `/assets/character/Ball FBX.fbx`,
        scale: new THREE.Vector3(0.01, 0.01, 0.01)
    }
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, movementSpeed = 20) {
        super(world, scene, position, movementSpeed, "SPHERE", 2);
        this.isPress = {
            w: false,
            a: false,
            s: false,
            d: false
        }
        this.on = "lobby";
    }
    on: "lobby" | "knowledge" | "playground" | "portofolio"
    public async init() {
        await super.init()
    }
    public update(deltatime: number) {
        super.update(deltatime);
    }
    private isWalking: boolean;
    addResistance() {
        if (this.isPress.a == this.isPress.d) {
            this.body.velocity.x = 0;
        }
        if (this.isPress.w == this.isPress.s) {
            this.body.velocity.z = 0;
        }

        //whenever ball stop moving, decreasing velocity of rotation over time to near 0
        if (this.body.velocity.x == 0 && this.body.velocity.z == 0) {

            this.body.angularVelocity.x += this.body.angularVelocity.x > 0 ? -0.1 : 0.1;
            this.body.angularVelocity.y += this.body.angularVelocity.y > 0 ? -0.1 : 0.1;
            this.body.angularVelocity.z += this.body.angularVelocity.z > 0 ? -0.1 : 0.1;
        }

    }
    public walk(deltatime: number) {
        this.addResistance();
        if (!this.isWalking) {
            //start animating walk
            this.isWalking = true;
        }
        var result = [];

        if (Math.abs(this.body.velocity.z) <= this.movementSpeed) {
            if (this.isPress.w && this.isPress.s) {
                this.body.applyForce(new CANNON.Vec3(0, 0, 0), this.body.position);

            }
            else if (this.isPress.w) {
                this.body.applyForce(new CANNON.Vec3(0, 0, -2000 * deltatime), this.body.position);
                // this.body.velocity.z = -this.movementSpeed;
            }
            else if (this.isPress.s) {
                this.body.applyForce(new CANNON.Vec3(0, 0, 2000 * deltatime), this.body.position);
                // this.body.velocity.z = this.movementSpeed;
            }
        }
        if (Math.abs(this.body.velocity.x) <= this.movementSpeed) {

            if (this.isPress.a) {
                this.body.applyForce(new CANNON.Vec3(-2000 * deltatime, 0, 0), this.body.position);
                // this.body.velocity.x = -this.movementSpeed;
            }
            if (this.isPress.d) {
                this.body.applyForce(new CANNON.Vec3(2000 * deltatime, 0, 0), this.body.position);
                // this.body.velocity.x = this.movementSpeed;
            }
        }

    }

}