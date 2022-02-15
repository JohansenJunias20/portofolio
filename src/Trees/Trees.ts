import * as THREE from "three";
import { Group, ShaderMaterial, TextureLoader, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils";
import Tree from "./Tree";
import * as CANNON from 'cannon';
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import shadowVert from '../../public/assets/shaders/floorShadow.vert';
import shadowFrag from '../../public/assets/shaders/floorShadow.frag';
import loadOBJ from "../utility/loadOBJ";
import Wrapper from "../Wrapper";

export default class Trees extends Wrapper<Tree> {
    constructor(world: CANNON.World, scene: THREE.Scene) {
        super()
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
        await Promise.all(promises);
        await this.initShadowModel();
        // todo: jadikan 1 dgn promise All utk semua loadnya kemudian baru di init

        promises = [];
        ref.initialized = false;
        for (let i = 0; i < ref.keys.length; i++) {
            const key = ref.keys[i];
            const { model } = ref.shadowModel.find(_ => _.name == `floorShadow_${key.type}_deg${key.rotationDeg}`)
            model.scale.copy(new THREE.Vector3(44 * key.asset.scale.x, 0, 44 * key.asset.scale.z))
            key.asset.floorShadow.Mesh = model;
            key.asset.floorShadow.preload = true;
            promises.push(key.init())
            // key.init().then(() => {
            //     ref.counter++;
            //     console.log(`${ref.counter} finished`)
            //     // console.log(ref.initialized)
            //     key.body.quaternion.copy(key.mesh.quaternion as any)
            //     if (super.isAllInitialized()) {
            //         ref.initialized = true;
            //         key.body.quaternion.copy(key.mesh.quaternion as any)
            //         key.mesh.receiveShadow = true
            //         key.mesh.castShadow = true
            //         alert("RESOLVE")
            //         res()
            //     }

            // });

        }
        var result = await Promise.all(promises)
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            key.body.quaternion.copy(key.mesh.quaternion as any)
            key.mesh.receiveShadow = true
            key.mesh.castShadow = true
        }
        this.initialized = true;


        return;

    }
    private initShadowModel() {
        const model = this.loadedShadowModel;
        for (let i = 0; i < this.shadowTexture.length; i++) {
            const { texture, name } = this.shadowTexture[i];
            model.children.forEach((c: THREE.Mesh) => {
                if ((c as THREE.Mesh).isMesh) {
                    (c.material as ShaderMaterial).uniforms.textureMap.value = texture;
                }
            })

            this.shadowModel.push({ model, name });
        }
    }
    private async loadShadowTextures() {
        var name: entityNames = "";
        const ref = this;
        var promises = [];

        promises.push((async () => {
            name = "floorShadow_1_deg0";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_1_deg45";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_1_deg75";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_2_deg0";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_2_deg45";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_2_deg75";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_3_deg0";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_3_deg45";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        promises.push((async () => {
            name = "floorShadow_3_deg75";
            ref.shadowTexture.push({ name, texture: await new TextureLoader().loadAsync(`/assets/environment/trees/${name}.png`) })
        })())
        await Promise.all(promises)
    }
    private async loadShadowModel() {
        const material = new ShaderMaterial({
            depthWrite: false,
            vertexShader: shadowVert,
            fragmentShader: shadowFrag,
            uniforms: {
                textureMap: {
                    value: null
                },
                _opacity: {
                    value: 1
                }

            },
            transparent: true
        })

        const object = await loadOBJ("/assets/floorShadow.obj", material);
        this.loadedShadowModel = object;

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