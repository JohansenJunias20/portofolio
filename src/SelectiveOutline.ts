import { Group, ShaderMaterial, Vector, Vector2, Vector3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as CANNON from 'cannon';
import * as THREE from "three";
import Loading from "./Loading/Loading";
import { WaveEffect } from "./waveEffect";
import isFBX from "./utility/isFBX";
import loadFBX from "./utility/loadFBX";
import loadOBJ from "./utility/loadOBJ";
import getVertices from "./utility/getVertices";
import toChunks from "./utility/toChucks";
import vertShader from "../public/assets/shaders/selectiveOutline.vert";
import fragShader from "../public/assets/shaders/selectiveOutline.frag";
//default parent for Mesh Only Object (without physics & collision on it)
export default class SelectiveOutline {
    waveEffect: WaveEffect
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        shader?: {
            vertex: string;
            fragment: string;
            uniforms?: { [name: string]: { value: Vector3 | Vector2 | number } };
        }
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
        this.asset = {
            scale: new Vector3(1, 1, 1),
            url: "",
            shader: {
                vertex: vertShader,
                fragment: fragShader,
            }
        }
    }
    public async init() {
        await this.loadAsset();
    }
   
    public update(deltatime: number) {
        this.mesh.position.copy(this.position);
    }

    public async loadAsset() {
        var material: string | THREE.ShaderMaterial;
        var { url, scale } = this.asset;
        material = new THREE.ShaderMaterial({
            vertexShader: this.asset.shader.vertex,
            fragmentShader: this.asset.shader.fragment,
            transparent: true,
            uniforms: this.asset.shader.uniforms,
            depthWrite: false
        })

        material.transparent = true;
        var object: THREE.Group = await (isFBX(url) ? loadFBX(url, scale) : loadOBJ(url, material, scale));
        // console.log({ object })


        // const fbx = await new Promise<Group>((res, rej) => {
        //     const loader = new FBXLoader();
        //     loader.load(this.asset.url, (f) => {
        //         f.traverse(c => {
        //             c.castShadow = this.asset.castShadow;
        //             if (this.asset.recieveShadow != undefined)
        //                 c.receiveShadow = this.asset.recieveShadow;
        //             return c;
        //         })
        //         f.scale.x = this.asset.scale.x;
        //         f.scale.y = this.asset.scale.y;
        //         f.scale.z = this.asset.scale.z;
        //         res(f);
        //     })
        // })
        this.scene.add(object);
        this.position.y += 5;
        this.mesh = object;

        this.initialized = true;
    }

}