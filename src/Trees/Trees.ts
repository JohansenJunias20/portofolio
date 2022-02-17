import * as THREE from "three";
import { BufferGeometry, Group, Mesh, ShaderMaterial, TextureLoader, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Tree from "./Tree";
import * as CANNON from 'cannon';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import shadowVert from '../../public/assets/shaders/floorShadow.vert';
import shadowFrag from '../../public/assets/shaders/floorShadow.frag';
// const shadowFrag = `
// uniform sampler2D textureMap;
// uniform float _opacity;
// varying vec2 vUv;
// const vec3 shadowColor=vec3(.8588,.3686,.0392);
// void main(){
//     vec3 textureColor=texture(textureMap,vUv).xyz;
//     float alpha=1.-textureColor.x;
//     // if(alpha!=0.){
//         //     alpha+=.05;
//     // }
//     alpha-=.05;
//     // gl_FragColor=vec4(shadowColor,_opacity*clamp(alpha,0.,1.));
//     // gl_FragColor=vec4(shadowColor,clamp(alpha,0.,1.));
//     gl_FragColor=vec4(textureColor,1.);
//     // gl_FragColor=vec4(shadowColor,0.2);
// }
// `
import loadOBJ from "../utility/loadOBJ";
import Wrapper from "../Wrapper";
import CloneMesh from "../utility/CloneMesh";

export default class Trees extends Wrapper<Tree> {
    scene: THREE.Scene;
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
        this.scene = scene;
        this.shadowTexture = []
        this.keys = [
            new Tree({ world, scene, position: new Vector3(89, -5, 101), type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 0 }),
            new Tree({ world, scene, position: new Vector3(-40, -5, 5), type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 75 }),
            new Tree({ world, scene, position: new Vector3(-70, -5, 100), type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 45 }),
            new Tree({ world, scene, position: new Vector3(-25, -5, 85), type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 0 }),
            new Tree({ world, scene, position: new Vector3(20, -5, 15), type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 75 }),
            new Tree({ world, scene, position: new Vector3(-50, -5, 20), type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 45 }),
            new Tree({ world, scene, position: new Vector3(-50, -5, 20), type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 0 }),
            new Tree({ world, scene, position: new Vector3(75, -5, 30), type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 45 }),
            new Tree({ world, scene, position: new Vector3(-40, -5, 175), type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 75 }),
            new Tree({ world, scene, position: new Vector3(-60, -5, 120), type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 0 }),
            new Tree({ world, scene, position: new Vector3(-90, -5, 170), type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 0 }),
            new Tree({ world, scene, position: new Vector3(-120, -5, 110), type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 45 }),
            new Tree({ world, scene, type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.12, 0.12, 0.12), rotationDeg: 0, position: new Vector3(53, -5, 23) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 45, position: new Vector3(32, -5, 64) }),
            new Tree({ world, scene, type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.12, 0.12, 0.12), rotationDeg: 75, position: new Vector3(43, -5, 124) }),
            new Tree({ world, scene, type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 0, position: new Vector3(8, -5, 136) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.12, 0.12, 0.12), rotationDeg: 45, position: new Vector3(-3, -5, 168) }),
            new Tree({ world, scene, type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 75, position: new Vector3(81, -5, 162) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 0, position: new Vector3(96, -5, 133) }),
            new Tree({ world, scene, type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 45, position: new Vector3(-49, -5, 71) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 75, position: new Vector3(-74, -5, 80) }),
            new Tree({ world, scene, type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 0, position: new Vector3(-77, -5, 2) }),
            new Tree({ world, scene, type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 45, position: new Vector3(-79, -5, 147) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 75, position: new Vector3(-59, -5, 188) }),
            new Tree({ world, scene, type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.12, 0.12, 0.12), rotationDeg: 0, position: new THREE.Vector3(28, -5, 90) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 75, position: new THREE.Vector3(66, -5, 92) }),
            new Tree({ world, scene, type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.15, 0.15, 0.15), rotationDeg: 45, position: new THREE.Vector3(48, -5, 2) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.14, 0.14, 0.14), rotationDeg: 0, position: new THREE.Vector3(-29, -5, -19) }),
            new Tree({ world, scene, type: 1, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.1, 0.1, 0.1), rotationDeg: 45, position: new THREE.Vector3(-3, -5, -21) }),
            new Tree({ world, scene, type: 3, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.12, 0.12, 0.12), rotationDeg: 75, position: new THREE.Vector3(-34, -5, 61) }),
            new Tree({ world, scene, type: 2, shape: new CANNON.Box(new CANNON.Vec3(1, 5, 1)), scale: new THREE.Vector3(0.13, 0.13, 0.13), rotationDeg: 75, position: new THREE.Vector3(38, -5, -14) }),
        ];
        this.shadowModel = []

    }
    public async init() {
        const ref = this;
        var promises = [];
        promises.push(this.loadShadowTextures());
        promises.push(this.loadShadowModel());
        // await Promise.all(promises);
        // todo: jadikan 1 dgn promise All utk semua loadnya kemudian baru di init

        // var promises = [];

        ref.initialized = false;
        for (let i = 0; i < ref.keys.length; i++) {
            const key = ref.keys[i];
            promises.push(key.loadAsset())


        }
        await Promise.all(promises)
        this.prepareShadowModel();
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            const shadowModel = ref.shadowModel.find(_ => _.name == `floorShadow_${key.type}_deg${key.rotationDeg}`).model;
            const newShadowModel = CloneMesh(shadowModel.children[0] as THREE.Mesh) as any;
            key.asset.floorShadow.Mesh = newShadowModel;
            key.asset.floorShadow.Mesh.scale.copy(new THREE.Vector3(44 * key.asset.scale.x, 0, 44 * key.asset.scale.z));
            key.prepare();
            // key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = true
            key.mesh.castShadow = true
        }

        this.initialized = true;


        return;

    }
    prepareShadowModel() {
        const ref = this;
        this.shadowTexture.forEach(_ => {
            const { name, texture } = _;
            const newModel = ref.loadedShadowModel.clone();
            (newModel.children[0] as THREE.Mesh).material = ((newModel.children[0] as THREE.Mesh).material as ShaderMaterial).clone();
            ((newModel.children[0] as THREE.Mesh).material as ShaderMaterial).uniforms.textureMap.value = texture;
            ((newModel.children[0] as THREE.Mesh).material as ShaderMaterial).needsUpdate = true;
            ((newModel.children[0] as THREE.Mesh).material as ShaderMaterial).transparent = true;
            ((newModel.children[0] as THREE.Mesh).material as ShaderMaterial).uniformsNeedUpdate = true;
            ref.shadowModel.push({ name, model: newModel })
        })
     
    }
    async loadShadowModel() {
        const material = new ShaderMaterial({
            depthWrite: false,
            vertexShader: shadowVert,
            fragmentShader: shadowFrag,
            uniforms: {
                textureMap: {
                    value:null
                }

            },
            transparent: true
        })
        const ref = this;
        this.loadedShadowModel = await new Promise<Group>((res, rej) => {
            var objLoader = new OBJLoader();
            objLoader.load("/assets/floorShadow.obj", function (object) {
                object.traverse((c: THREE.Mesh) => {
                    if (c.isMesh) {
                    }
                    c.material = material;
                    return c;
                })
                res(object)
            });
        });
        // this.loadedShadowModel = await loadOBJ("/assets/floorShadow.obj", material);

    }
    async loadShadowTextures() {
        var promises: any[] = [];
        promises.push((async () => {
            var texture_1_deg0 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_1_deg0.png");
            this.shadowTexture.push({ name: "floorShadow_1_deg0", texture: texture_1_deg0 })
        })())
        promises.push((async () => {
            var texture_1_deg45 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_1_deg45.png");
            this.shadowTexture.push({ name: "floorShadow_1_deg45", texture: texture_1_deg45 })
        })())
        promises.push((async () => {
            var texture_1_deg75 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_1_deg75.png");
            this.shadowTexture.push({ name: "floorShadow_1_deg75", texture: texture_1_deg75 })
        })())
        promises.push((async () => {
            var texture_2_deg0 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_2_deg0.png");
            this.shadowTexture.push({ name: "floorShadow_2_deg0", texture: texture_2_deg0 })
        })())
        promises.push((async () => {
            var texture_2_deg45 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_2_deg45.png");
            this.shadowTexture.push({ name: "floorShadow_2_deg45", texture: texture_2_deg45 })
        })())
        promises.push((async () => {
            var texture_2_deg75 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_2_deg75.png");
            this.shadowTexture.push({ name: "floorShadow_2_deg75", texture: texture_2_deg75 })
        })())
        promises.push((async () => {
            var texture_3_deg0 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_3_deg0.png");
            this.shadowTexture.push({ name: "floorShadow_3_deg0", texture: texture_3_deg0 })
        })())
        promises.push((async () => {
            var texture_3_deg45 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_3_deg45.png");
            this.shadowTexture.push({ name: "floorShadow_3_deg45", texture: texture_3_deg45 })
        })())
        promises.push((async () => {
            var texture_3_deg75 = await new TextureLoader().loadAsync("/assets/environment/trees/floorShadow_3_deg75.png");
            this.shadowTexture.push({ name: "floorShadow_3_deg75", texture: texture_3_deg75 })
        })())
        await Promise.all(promises);
    }

    loadedShadowModel: THREE.Group;
    shadowTexture: {
        name: entityNames,
        texture: THREE.Texture
    }[]
    shadowModel: {
        name: entityNames
        model: THREE.Group
    }[];
}

type degrees = 0 | 45 | 75;
type types = 1 | 2 | 3;

type entityNames = `floorShadow_${types}_deg${degrees}` | "";