

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Clock, Group, PositionalAudio, ShaderMaterial, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { clamp, degToRad, randInt } from 'three/src/math/MathUtils';
import MeshOnlyObject3d from '../MeshOnlyObject';
import PhysicsObject3d from '../PhysicsObject';

import shaderVert from "../../public/assets/shaders/lightcast.vert";
import shaderFrag from "../../public/assets/shaders/lightcast.frag";
import Loading from '../Loading/Loading';
import isFBX from '../utility/isFBX';
import loadFBX from '../utility/loadFBX';
import loadOBJ from '../utility/loadOBJ';
interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
interface IParameter {
    world: CANNON.World,
    scene: THREE.Scene,
    position: Vector3,
    shape: CANNON.Box,
    scale: THREE.Vector3,
    rotationDeg: 0 | 45 | 75,
}
export default class LightCast extends MeshOnlyObject3d {
    asset = {
        castShadow: true,
        recieveShadow: false,
        url: ``,
        mtl: ``,
        scale: new THREE.Vector3(0.15, 0.15, 0.15),
        floorShadow: {
            textureUrl: "",
            modelUrl: "",
            scale: new Vector3(0),
            offset: new Vector3(),
            Mesh: new THREE.Group(),
            preload: false
        },
        shader: {
            vertex: shaderVert,
            fragment: shaderFrag,
            uniforms: {

            }
        }
    }
    constructor(parameters: IParameter) {
        super(parameters.scene, parameters.position);
        this.clock = new Clock(true);
        this.asset.scale = parameters.scale;
        this.asset.url = `/assets/environment/projector/lightCast.obj`;
        this.asset.mtl = `/assets/environment/projector/lightCast.mtl`;
        this.asset.shader.uniforms = {
            intensity: {
                value: 1
            },
            maxDistance: {
                value: 1
            }
        }
        // this.asset.floorShadow = {
        //     textureUrl: ``, // because trees not using url string but instead use three.Texture Object.
        //     modelUrl: "",
        //     scale: new THREE.Vector3(9.7 * parameters.scale.x, 0, 9.7 * parameters.scale.z),
        //     offset: new THREE.Vector3(),
        //     Mesh: new THREE.Group(),
        //     preload: true,
        // }
        // this.asset.floorShadow.textureUrl = `/assets/environment/trees/floorShadow_${type}_deg${rotationDeg}.png`;
        // this.asset.floorShadow.modelUrl = ``;
        // this.asset.floorShadow.scale = new Vector3(10, 0, 10);
    }
    clock: Clock;
    nextFlicker: number;
    public async init(loading: Loading): Promise<void> {
        await this.loadAsset();
        var mesh = (this.mesh.children[0] as THREE.Mesh);
        var geom = (mesh.geometry as THREE.BufferGeometry)
        const position = geom.attributes.position;

        var xMin = 9999;
        var xMax = -9999;
        var zMax = -9999;
        var zMin = 9999;
        var yMin = 9999;
        var yMax = -9999;
        for (let i = 0; i < position.count; i++) {
            var x = position.getX(i)
            var y = position.getY(i)
            var z = position.getZ(i)

            if (yMin > y) {
                yMin = y;
            }
            if (yMax < y) {
                // return x;
                yMax = y;
            }
            if (xMin > x) {
                xMin = x;
            }
            if (xMax < x) {
                // return x;
                xMax = x;
            }
            if (zMin > z) {
                // return x;
                zMin = z;
            }
            if (zMax < z) {
                // return x;
                zMax = z;
            }


        }
        //xMin
        //yMin
        //zMax
        var FarestPoint = new Vector3(xMin, yMin, zMax);
        // xMax
        // yCenter = yMax + yMin / 2
        // zCenter = zMax + zMin / 2
        var yCenter = (yMax + yMin) / 2;
        var zCenter = (zMax + xMin) / 2;
        var centerPoint = new Vector3(xMax, yCenter, zCenter);
        var maxDistance = centerPoint.distanceTo(FarestPoint);
        (mesh.material as THREE.ShaderMaterial).uniforms.maxDistance.value = Math.abs(maxDistance);
        (mesh.material as THREE.ShaderMaterial).needsUpdate = true;

    }
    public async update(deltatime: number) {
        super.update(deltatime);
        var elapsedTime = this.clock.getElapsedTime();
        // console.log({ elapsedTime });
        if (!this.nextFlicker) {
            this.nextFlicker = (randInt(25, 50) / 1000) + elapsedTime;
        }

        if (this.nextFlicker <= elapsedTime) {
            this.nextFlicker = (randInt(25, 50) / 1000) + elapsedTime;
            this.flickLight();
        }

    }
    //ini di rewrite karena lightcast selalu muncul dulu sebelum semua image pada ImageSequence ke load
    //dikarenakan loodAsset akan memanggil this.scene.add(object) saat proses load obj selesai
    //jadi independen, sehingga dimodif supaya this.scene.add(object) tidak dipanggil saat masing2 object selesai tetapi saat semua object pada Main.ts selesai ke load semua menggunakan Promise.all()
    public async loadAsset() {
        var material: string | THREE.ShaderMaterial;
        var { url, scale, mtl } = this.asset;
        material = mtl;
        if (this.asset.shader) {
            material = new THREE.ShaderMaterial({
                vertexShader: this.asset.shader.vertex,
                fragmentShader: this.asset.shader.fragment,
                transparent: true,
                uniforms: this.asset.shader.uniforms,
                depthWrite: false
            })
            material.transparent = true;
        }

        var object: THREE.Group = await (isFBX(url) ? loadFBX(url, scale) : loadOBJ(url, material, scale));
        this.position.y += 5;
        object.position.copy(this.position);
        this.mesh = object;
    }
    private flickLight() {
        var intensity = randInt(65, 75) / 100;
        ((this.mesh.children[0] as THREE.Mesh).material as ShaderMaterial).uniforms.intensity.value = intensity;
        ((this.mesh.children[0] as THREE.Mesh).material as ShaderMaterial).needsUpdate = true;
    }


}