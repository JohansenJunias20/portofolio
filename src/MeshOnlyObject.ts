import { Group, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';
import * as THREE from "three";
import Loading from "./Loading/Loading";
import { WaveEffect } from "./waveEffect";

//default parent for Mesh Only Object (without physics & collision on it)
export default class MeshOnlyObject3d {
    waveEffect: WaveEffect
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
    }
    public initialized: boolean;
    public mesh: THREE.Group;
    public readonly position: Vector3;
    public scene: THREE.Scene;
    constructor(scene: THREE.Scene, position: Vector3) {
        this.scene = scene;
        this.initialized = false;
        this.position = position;
        this.waveEffect = {
            originPos: new Vector3(),
            range: 0
        }
    }
    public async init(loading: Loading) {
        await this.loadAsset();
    }
    public prepare() {
        // await this.loadAsset();
    }
    public update(deltatime: number) {
        this.mesh.position.copy(this.position);
        this.updateWaveEffect()
    }
    public updateWaveEffect() {

    }
    public async loadAsset() {
        const fbx = await new Promise<Group>((res, rej) => {
            const loader = new FBXLoader();
            loader.load(this.asset.url, (f) => {
                f.traverse(c => {
                    c.castShadow = this.asset.castShadow;
                    if (this.asset.recieveShadow != undefined)
                        c.receiveShadow = this.asset.recieveShadow;
                    return c;
                })
                f.scale.x = this.asset.scale.x;
                f.scale.y = this.asset.scale.y;
                f.scale.z = this.asset.scale.z;
                res(f);
            })
        })
        this.scene.add(fbx);
        this.position.y += 5;
        this.mesh = fbx;
        this.scene.add(fbx);

        this.initialized = true;
    }

}