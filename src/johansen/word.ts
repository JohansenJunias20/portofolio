

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp, radToDeg } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';
import Shadow from '../Shadow';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Word extends PhysicsObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        scale: new THREE.Vector3()
    }
    shadow: Shadow;
    public readonly text: "J" | "O" | "H" | "A" | "N" | "S" | "E";
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "J" | "O" | "H" | "A" | "N" | "S" | "E", scale: Vector3 = new THREE.Vector3(0.07, 0.07, 0.07)) {
        super(world, scene, position, 0, "BOX", 0.3);
        this.text = text;
        this.asset.scale = scale;
        this.asset.url = `/assets/environment/johansen/${text}.fbx`;
        // if (this.text == "J")
    }
    public async init() {
        await super.init()
        this.shadow = new Shadow(this.scene, this.mesh as any);

    }
    public update(deltatime: number) {
        super.update(deltatime);
        // if (this.text == "J")
        // console.log({ degZ: radToDeg(this.mesh.rotation.z) })
        this.shadow.update(this.mesh.rotation.y, this.mesh.position);
        PROBLEMNYA ADALAH TIDAK SELALU ROTATION AXIS Y (YANG JADI ROTASI Y WORLD PADA this.MESH)
        SEHINGGA TIDAK BISA PAKAI ROTATION.Y
        MISAL OBJEK WORD J JATUH KESAMPING, rotation.y bukan lagi menjadi ROTASI Y WORLD
    }


}