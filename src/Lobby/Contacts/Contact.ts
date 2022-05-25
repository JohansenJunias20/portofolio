

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../../PhysicsObject';
import PopUp from '../../PopUps/PopUp';
import gsap from "gsap"
import { Power1, Power2, Power3, Power4, Back } from "gsap"

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
type Text = "linkedin" | "email" | "github"
export default class Contact extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(10, 10, 10)
        // floorShadow: {
        //     textureUrl: "/assets/environment/lobby/floorShadow.png",
        //     modelUrl: "/assets/floorShadow.obj",
        //     scale: new Vector3(6, 0, 6),
        //     offset: new Vector3(),
        //     preload: true,
        //     Mesh: new THREE.Group()
        // },
    }
    popUp: PopUp
    public readonly text: Text
    from = "CONTACT"
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera, position: Vector3, text: Text,url:string) {
        super(world, scene, position, 0, "BOX", 0);
        this.text = text;
        this.asset.url = `/assets/environment/Lobby/Contacts/${text}.obj`;
        this.asset.mtl = `/assets/environment/Lobby/Contacts/${text}.mtl`;
        this.popUp = new PopUp(world, scene, camera, {
            x: 8, y: 2, z: 4
        }, 0.3, "open", url);

    }
    tl: gsap.core.Timeline;
    tldown: gsap.core.Tween;
    public async init() {
        const ref = this;


        var init1 = super.init()
        var init2 = this.popUp.init()
        await Promise.all([init1, init2])
        this.popUp.setPosition(new Vector3(this.mesh.position.x, 0.1, this.mesh.position.z + 5.0));
        this.initialized = true;

        this.popUp.onBeginUp = () => {
            if (!ref.initialized) return;
            if (ref.tldown) {
                ref.tldown.pause();
            }
            ref.tl = gsap.timeline({ repeat: -1 });
            ref.tl.to(this.position, {
                ...this.originPosition.clone().add(new Vector3(0, 0.5, 0)),
                duration: 1,
                ease: Power1.easeInOut
            })
            ref.tl.to(this.position, {
                ...this.originPosition.clone(),
                duration: 1,
                ease: Power1.easeInOut
            })
            // if (ref.tldown)
            // ref.tldown.kill();
            // tl.star
            console.log("begin up!")
        }
        this.popUp.onEndDown = () => {
            if (!ref.initialized) return;
            console.log("end down!")
            if (ref.tl) {
                ref.tl.pause();
                ref.tl.clear();
            }
            if (ref.tldown)
                if (ref.tldown.paused())
                    ref.tldown.kill();
            ref.tldown = gsap.to(this.position, {
                ...this.originPosition.clone(),
                duration: 1,
            })
        }
    }

    public customUpdate(deltatime: number, body: CANNON.Body, intersect: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
        super.update(deltatime);
        if (this.popUp.initialized)
            this.popUp.update(deltatime, body, intersect);
    }


}