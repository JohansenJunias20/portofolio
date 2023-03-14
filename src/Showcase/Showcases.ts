import * as THREE from "three";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import { WaveEffect } from "../waveEffect";
import Wrapper from "../Wrapper";
import Showcase, { ShowcaseName } from "./Showcase";


export default class Showcases {
    updateWaveEffect(deltatime: number) {
        this.keys.forEach(key => {
            key.updateWaveEffect(deltatime);
        })
    }
    setWaveEffect(waveEffect: WaveEffect) {
        this.keys.forEach(key => {
            key.setWaveEffect(waveEffect);
        })
    }
    keys: Array<Showcase>;
    initialized: boolean;
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.keys = [
            new Showcase({ world, scene, position: new Vector3(-50, 10.5, -5), camera, name: "WPU", imageCount: 40, url: "https://www.youtube.com/embed/pjDYyyMh4rM?start=3997&autoplay=1" }),
            new Showcase({ world, scene, position: new Vector3(-50, 10.5, -40), camera, name: "MRPRT", imageCount: 20, url: "https://www.youtube.com/embed/8q3J0Ec51kE?autoplay=1" }),
        ];

    }
    public async init() {
        var promises: Array<Promise<void>> = [];
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            promises.push(key.init());
        }
        await Promise.all(promises);
        this.initialized = true;

    }
    update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
}