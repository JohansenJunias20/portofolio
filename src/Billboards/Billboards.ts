import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Character from "../Character/Character";
import { WaveEffect } from "../waveEffect";
import Wrapper from "../Wrapper";
import Billboard from "./Billboard";


export default class Billboards {
    keys: Array<Billboard>
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.keys = [
            // new Billboard(world, scene, camera,  "miles madness" , new Vector3(0.5, 0.5, 0.5), 100, [`/app/Miles Madness.rar`], 0.15, "download"),
            // new Billboard(world, scene, camera, new Vector3(95, 0, 40)  , "laughing clown", new Vector3(0.5, 0.5, 0.5), 100, [`https://www.youtube.com/watch?v=ILq6IDReb0Mt`,], 0.15, "open"),
            new Billboard(world, scene, camera, new Vector3(50, 0, 40), "tokopedia integration", new Vector3(0.5, 0.5, 0.5), 100, [`https://youtu.be/1laZ4rNeE3o`, `https://www.tokopedia.com/hartono-m`, `https://www.tokopedia.com/kasri-motor`], 0.15, "open"),
            new Billboard(world, scene, camera, new Vector3(105, 0, 40), "shopee integration", new Vector3(0.5, 0.5, 0.5), 100, [`https://shopee.co.id/hartono_motor`,], 0.15, "open"),
            new Billboard(world, scene, camera, new Vector3(150, 0, 40), "life of student", new Vector3(0.5, 0.5, 0.5), 100, [`https://junias20.itch.io/life-of-a-student`,], 0.15, "open"),
        ];

    }
    public async init() {
        // await super.init();
        var promises: Promise<void>[] = [];
        this.keys.forEach(key => {
            promises.push(key.init())
        })
        await Promise.all(promises)
        this.initialized = true;

    }
    updateBillboard(deltatime: number, character: Character, intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
        this.keys.forEach(key => {
            key.update(deltatime, character, intersects);
        })
    }
    public updateWaveEffect() {
        this.keys.forEach(key => {
            key.updateWaveEffect();
        })

    }
    public setWaveEffect(waveEffect: WaveEffect) {
        this.keys.forEach(key => {
            // key.waveEffect = waveEffect;
        })
    }
}