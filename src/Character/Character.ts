

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, ShaderMaterial, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';
import { WaveEffect } from '../waveEffect';
import NickName from './Nickname';
declare var followCharacter: boolean;

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Character extends PhysicsObject3d {
    public isPress: {
        w: boolean,
        a: boolean,
        s: boolean,
        d: boolean,
        " ": boolean
    }
    lastTweenPos:gsap.core.Tween
    lastTweenRot:gsap.core.Tween
    asset = {
        castShadow: true,
        url: `/assets/character/Ball FBX.fbx`,
        scale: new THREE.Vector3(0.01, 0.01, 0.01)
    }
    nickname: NickName;
    camera: THREE.PerspectiveCamera;
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera, position: Vector3, movementSpeed = 25, isMainCharacter: boolean = false) {
        super(world, scene, position, movementSpeed, "SPHERE", 2);
        this.isPress = {
            w: false,
            a: false,
            s: false,
            d: false,
            " ": false
        }
        this.camera = camera;
        this.on = "lobby";
        this.nickname = new NickName(isMainCharacter);
    }
    on: "lobby" | "knowledge" | "playground" | "portofolio"
    public async init() {
        this.position.y += 5;
        await super.init()
    }
    public update(deltatime: number, leftMouseClick: boolean = false, followCharacter: boolean = false) {
        super.update(deltatime);
        // (this.mesh.material[0] as ShaderMaterial).
        this.nickname.update(new Vector3(this.body.position.x, this.body.position.y, this.body.position.z), this.camera, leftMouseClick, followCharacter);
    }
    private isWalking: boolean;
    addResistance() {
        if (!this.body) return
        if (this.isPress.a == this.isPress.d) {
            this.body.velocity.x = 0;
        }
        if (this.isPress.w == this.isPress.s) {
            this.body.velocity.z = 0;
        }

        //whenever ball stop moving, decreasing velocity of rotation over time to near 0
        if (this.body.velocity.x == 0 && this.body.velocity.z == 0) {
            this.body.angularVelocity.x += this.body.angularVelocity.x > 0 ? -0.5 : 0.5;
            this.body.angularVelocity.y += this.body.angularVelocity.y > 0 ? -0.5 : 0.5;
            this.body.angularVelocity.z += this.body.angularVelocity.z > 0 ? -0.5 : 0.5;
            if (this.body.angularVelocity.x <= 0.5 && this.body.angularVelocity.x >= -0.5) {
                this.body.angularVelocity.x = 0;
            }
            if (this.body.angularVelocity.y <= 0.5 && this.body.angularVelocity.y >= -0.5) {
                this.body.angularVelocity.y = 0;

            }
            if (this.body.angularVelocity.z <= 0.5 && this.body.angularVelocity.z >= -0.5) {
                this.body.angularVelocity.z = 0;
            }
        }
        // console.log({ y: this.body.angularVelocity.y })
        // console.log({ x: this.body.velocity.x, z: this.body.velocity.z })

    }
    //applyforce make it more natural than add velocity. 
    public walk(deltatime: number) {
        if (!this.body) return
        this.addResistance();
        if (!this.isWalking) {
            //start animating walk
            this.isWalking = true;
        }
        var result = [];

        if (Math.abs(this.body.velocity.z) <= this.movementSpeed) { //belum melebihi
            if (this.isPress.w && this.isPress.s) {
                this.body.applyForce(new CANNON.Vec3(0, 0, 0), this.body.position);
            }
            else if (this.isPress.w) {
                //tidak perlu di * delta time karena jumlah force tidak pengaruh karena batas maksimalnya adalah movementSpeed
                //yang terpenting adalah kecepatan world.step() itu yang harus di kali deltatime karena kalau
                //stepnya makin cepat maka hasil position yang dihasilkan dari force akan lebih sering terupdate
                this.body.applyForce(new CANNON.Vec3(0, 0, -70), this.body.position);
                // this.body.velocity.z = -this.movementSpeed;
            }
            else if (this.isPress.s) {
                //tidak perlu di * delta time karena jumlah force tidak pengaruh karena batas maksimalnya adalah movementSpeed
                //yang terpenting adalah kecepatan world.step() itu yang harus di kali deltatime karena kalau
                //stepnya makin cepat maka hasil position yang dihasilkan dari force akan lebih sering terupdate
                this.body.applyForce(new CANNON.Vec3(0, 0, 70), this.body.position);
                // console.log("ADD FORCE")
                // this.body.velocity.z = this.movementSpeed;
            }

        }
        if (Math.abs(this.body.velocity.x) <= this.movementSpeed) {
            if (this.isPress.a && this.isPress.d) {
                this.body.applyForce(new CANNON.Vec3(0, 0, 0), this.body.position);
            }
            else if (this.isPress.a) {
                //tidak perlu di * delta time karena jumlah force tidak pengaruh karena batas maksimalnya adalah movementSpeed
                //yang terpenting adalah kecepatan world.step() itu yang harus di kali deltatime karena kalau
                //stepnya makin cepat maka hasil position yang dihasilkan dari force akan lebih sering terupdate
                this.body.applyForce(new CANNON.Vec3(-70, 0, 0), this.body.position);
                // this.body.velocity.x = -this.movementSpeed;
            }
            if (this.isPress.d) {
                //tidak perlu di * delta time karena jumlah force tidak pengaruh karena batas maksimalnya adalah movementSpeed
                //yang terpenting adalah kecepatan world.step() itu yang harus di kali deltatime karena kalau
                //stepnya makin cepat maka hasil position yang dihasilkan dari force akan lebih sering terupdate
                this.body.applyForce(new CANNON.Vec3(70, 0, 0), this.body.position);
                // this.body.velocity.x = this.movementSpeed;
            }
        }
        // console.log({ posy: this.position.y, velocity: this.body.velocity.y })
        if (this.isPress[" "] && this.body.position.y <= 1.1) {
            console.log("SPACE JUMP")
            this.body.applyForce(new CANNON.Vec3(0, 750, 0), this.body.position);
            this.isPress[" "] = false;
        }
    }

    //w,a,s,d should be float number 0-1
    public JoystickWalk(w: number, a: number, s: number, d: number, deltatime: number) {
        if (!this.body) return
        this.addResistanceJoystick();
        if (!this.isWalking) {
            //start animating walk
            this.isWalking = true;
        }
        var result = [];

        if (Math.abs(this.body.velocity.z) <= this.movementSpeed) { //belum melebihi
            // if (this.isPress.w && this.isPress.s) {
            //     this.body.applyForce(new CANNON.Vec3(0, 0, 0), this.body.position);

            // }
            // else

            if (w) {
                if (this.body.velocity.z > 0) {
                    this.body.velocity.z = 0;
                }
                this.body.applyForce(new CANNON.Vec3(0, 0, -2000 * deltatime * w), this.body.position);
                // this.body.velocity.z = -this.movementSpeed;
            }
            else if (s) {
                if (this.body.velocity.z < 0) {
                    this.body.velocity.z = 0;
                }
                this.body.applyForce(new CANNON.Vec3(0, 0, 2000 * deltatime * s), this.body.position);
                // this.body.velocity.z = this.movementSpeed;
            }
            else {
                this.body.velocity.z = 0;
            }
        }
        if (Math.abs(this.body.velocity.x) <= this.movementSpeed) {
            if (a) {
                if (this.body.velocity.x > 0) {
                    this.body.velocity.x = 0;
                }
                this.body.applyForce(new CANNON.Vec3(-2000 * deltatime * a, 0, 0), this.body.position);
                // this.body.velocity.x = -this.movementSpeed;
            } else if (d) {
                if (this.body.velocity.x < 0) {
                    this.body.velocity.x = 0;
                }
                this.body.applyForce(new CANNON.Vec3(2000 * deltatime * d, 0, 0), this.body.position);
                // this.body.velocity.x = this.movementSpeed;
            }
            else {
                this.body.velocity.x = 0;
            }
        }
        this.joystick = {
            w, a, s, d
        }

    }
    private test?: boolean;
    private joystick?: {
        w: number;
        a: number;
        s: number;
        d: number;
    }
    addResistanceJoystick() {
        if (!this.body) return
        if (!this.joystick) return;

        if (this.joystick.a == this.joystick.d) {
            this.body.velocity.x = 0;
        }
        if (this.joystick.w == this.joystick.s) {
            this.body.velocity.z = 0;
        }

        // if (this.joystick.a == 0 && this.body.velocity.x < 0) {
        //     this.body.velocity.x += 1;
        //     //add resistance
        // }

        // if (this.joystick.d == 0 && this.body.velocity.x > 0) {
        //     this.body.velocity.x -= 1;
        //     //add resistance
        // }

        // if (this.joystick.w == 0 && this.body.velocity.z < 0) {
        //     this.body.velocity.z += 1;
        //     //add resistance
        // }

        // if (this.joystick.s == 0 && this.body.velocity.z > 0) {
        //     this.body.velocity.z -= 1;
        //     //add resistance
        // }

        // const { max } = Math;
        // const yAx = max(this.joystick.w, this.joystick.s)
        // const xAx = max(this.joystick.a, this.joystick.d)
        // if (max(xAx, yAx) == yAx) {
        //     this.body.velocity.x = 0;
        // }

        // if (max(xAx, yAx) == xAx) {
        //     this.body.velocity.z = 0;
        // }

        //whenever ball stop moving, decreasing velocity of rotation over time to near 0
        if (this.body.velocity.x == 0 && this.body.velocity.z == 0) {

            this.body.angularVelocity.x += this.body.angularVelocity.x > 0 ? -0.1 : 0.1;
            this.body.angularVelocity.y += this.body.angularVelocity.y > 0 ? -0.1 : 0.1;
            this.body.angularVelocity.z += this.body.angularVelocity.z > 0 ? -0.1 : 0.1;
        }
    }
    public _walk(deltatime: number) {
        if (!this.body) return
        // this.addResistance();
        if (!this.isWalking) {
            //start animating walk
            this.isWalking = true;
        }
        // alert("test")
        var result = [];
        const movementSpeed = 15;
        const resistance = 100; //resist movement since the button unpressed

        // if (!this.isPress.w) {
        //     this.body.velocity.z += resistance * deltatime;
        //     this.body.velocity.z = Math.min(this.body.velocity.z, 0);
        // }

        // if (!this.isPress.s) {
        //     this.body.velocity.z -= resistance * deltatime;
        //     this.body.velocity.z = Math.max(this.body.velocity.z, 0);
        // }

        // if (this.isPress.w) {
        //     this.body.velocity.z = -movementSpeed;
        // }

        // if (this.isPress.s) {
        //     this.body.velocity.z = movementSpeed;
        // }

        // if (this.isPress.a) {
        //     this.body.velocity.x = -movementSpeed;
        // }
        // else {
        //     this.body.velocity.x += resistance * deltatime;
        //     this.body.velocity.x = Math.min(this.body.velocity.x, 0);
        // }



        // if(this.isPress.w && this.isPress.s){
        //     this.body.velocity.z = 0;
        // }





        if (Math.abs(this.body.velocity.z) <= this.movementSpeed) {
            if (this.isPress.w && this.isPress.s) {
                this.body.applyForce(new CANNON.Vec3(0, 0, 0), this.body.position);

            }
            else if (this.isPress.w) {
                // this.body.applyForce(new CANNON.Vec3(0, 0, -2000 * deltatime), this.body.position);
                // this.body.velocity.z = -this.movementSpeed;
                this.body.velocity.z = -50;
            }
            else if (this.isPress.s) {
                // this.body.applyForce(new CANNON.Vec3(0, 0, 2000 * deltatime), this.body.position);
                // this.body.velocity.z = this.movementSpeed;
                this.body.velocity.z = 50;
            }
        }
        // if (Math.abs(this.body.velocity.x) <= this.movementSpeed) {

        //     if (this.isPress.a) {
        //         this.body.applyForce(new CANNON.Vec3(-2000 * deltatime, 0, 0), this.body.position);
        //         // this.body.velocity.x = -this.movementSpeed;
        //     }
        //     if (this.isPress.d) {
        //         this.body.applyForce(new CANNON.Vec3(2000 * deltatime, 0, 0), this.body.position);
        //         // this.body.velocity.x = this.movementSpeed;
        //     }
        // }

    }

}