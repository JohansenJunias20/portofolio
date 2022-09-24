import { Vec3 } from "cannon"
import * as THREE from "three"
import { Group, Material, ShaderMaterial, TextureLoader, Vector3 } from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import Loading from "../Loading/Loading"    
import createBody from "../utility/createBody"
import customShader from "../utility/customShader"
import loadFBX from "../utility/loadFBX"
import loadOBJ from "../utility/loadOBJ"
import DBs from "./DB/DBs"
import Frameworks from "./Frameworks/Frameworks"
import ProLangs from "./ProLang/ProLangs"
import Softwares from "./Softwares/Softwares"


import vertShader from "../../public/assets/shaders/floorShadow.vert";
import fragShader from "../../public/assets/shaders/floorShadow.frag";
import { WaveEffect } from "../waveEffect"
import { degToRad } from "three/src/math/MathUtils"
export default class Knowledge {
    setWaveEffect(waveEffect: WaveEffect) {
        this.prolang.keys.forEach(key => {
            key.waveEffect = waveEffect;
        })
        this.dbs.keys.forEach(key => {
            key.waveEffect = waveEffect;
        })
        this.frameworks.keys.forEach(key => {
            key.waveEffect = waveEffect;
        })
        this.softwares.keys.forEach(key => {
            key.waveEffect = waveEffect;
        })
    }
    prolang: ProLangs
    dbs: DBs
    frameworks: Frameworks
    softwares: Softwares
    constructor(world: CANNON.World, scene: THREE.Scene) {
        this.initialized = false
        this.prolang = new ProLangs(world, scene)
        this.dbs = new DBs(world, scene)
        this.frameworks = new Frameworks(world, scene)
        this.softwares = new Softwares(world, scene)
        this.floorShadow = new THREE.Texture();
        this.floorModel = new THREE.Group();
    }
    async init(loading: Loading) {
        var promises: Promise<void>[] = []
        var circlePlate: THREE.Mesh;
        promises.push(this.loadShadowTexture());
        promises.push(this.loadShadowModel());
        promises.push((async () => circlePlate = await this.loadCirclePlate())())
        promises.push(this.dbs.loadAsset())
        promises.push(this.softwares.loadAsset())
        promises.push(this.prolang.loadAsset())
        promises.push(this.frameworks.loadAsset())
        await Promise.all(promises);
        this.initShadowModel();
        // circlePlate.scale.set(10, 10, 10);
        // console.log({ circlePlate })
        circlePlate.rotateY(degToRad(45))

        for (let i = 0; i < this.prolang.keys.length; i++) {
            const newCirclePlane = circlePlate.clone(); // ternyata mesh.clone() itu menggunakan reference material yang sama
            newCirclePlane.material = (circlePlate.material as Material).clone();
            this.prolang.keys[i].asset.additionalMesh[0] = newCirclePlane;

            this.prolang.keys[i].shape = createBody(newCirclePlane);
            (this.prolang.keys[i].shape as any).setScale(new Vec3(10, 10, 10) as any) //because obj 10 times bigger
            this.prolang.keys[i].asset.floorShadow.preload = true;
            this.prolang.keys[i].asset.floorShadow.Mesh = this.floorModel;
            // (this.prolang.keys[i].mesh as any).selectiveOutline = true;

        }

        for (let i = 0; i < this.dbs.keys.length; i++) {
            const newCirclePlane = circlePlate.clone(); // ternyata mesh.clone() itu menggunakan reference material yang sama
            newCirclePlane.material = (circlePlate.material as Material).clone();
            this.dbs.keys[i].asset.additionalMesh[0] = newCirclePlane;

            this.dbs.keys[i].shape = createBody(newCirclePlane);
            (this.dbs.keys[i].shape as any).setScale(new Vec3(10, 10, 10) as any) //because obj 10 times bigger.

            this.dbs.keys[i].asset.floorShadow.preload = true;
            this.dbs.keys[i].asset.floorShadow.Mesh = this.floorModel;
        }

        for (let i = 0; i < this.softwares.keys.length; i++) {
            const newCirclePlane = circlePlate.clone(); // ternyata mesh.clone() itu menggunakan reference material yang sama
            newCirclePlane.material = (circlePlate.material as Material).clone();
            this.softwares.keys[i].asset.additionalMesh[0] = newCirclePlane;

            this.softwares.keys[i].shape = createBody(newCirclePlane);
            (this.softwares.keys[i].shape as any).setScale(new Vec3(10, 10, 10) as any) //because obj 10 times bigger

            this.softwares.keys[i].asset.floorShadow.preload = true;
            this.softwares.keys[i].asset.floorShadow.Mesh = this.floorModel;
        }

        for (let i = 0; i < this.frameworks.keys.length; i++) {
            const newCirclePlane = circlePlate.clone(); // ternyata mesh.clone() itu menggunakan reference material yang sama
            newCirclePlane.material = (circlePlate.material as Material).clone();
            this.frameworks.keys[i].asset.additionalMesh[0] = newCirclePlane;

            this.frameworks.keys[i].shape = createBody(newCirclePlane);
            (this.frameworks.keys[i].shape as any).setScale(new Vec3(10, 10, 10) as any) //because obj 10 times bigger

            this.frameworks.keys[i].asset.floorShadow.preload = true;
            this.frameworks.keys[i].asset.floorShadow.Mesh = this.floorModel;
        }

        this.dbs.prepare();
        this.frameworks.prepare();
        this.softwares.prepare();
        this.prolang.prepare();
        // for (let i = 0; i < this.prolang.keys.length; i++) {
        //     const key = this.prolang.keys[i];
        //     key.prepare();
        //     key.mesh.rotat
        // }

        // for (let i = 0; i < this.dbs.keys.length; i++) {
        //     const key = this.dbs.keys[i];
        //     key.prepare();
        // }

        // for (let i = 0; i < this.softwares.keys.length; i++) {
        //     const key = this.softwares.keys[i];
        //     key.prepare();
        // }

        // for (let i = 0; i < this.frameworks.keys.length; i++) {
        //     const key = this.frameworks.keys[i];
        //     key.prepare();
        // }

        loading.addProgress(40);
        this.initialized = true;
    }
    initialized: boolean;
    update(deltatime: number) {
        this.prolang.update(deltatime)
        this.dbs.update(deltatime)
        this.frameworks.update(deltatime)
        this.softwares.update(deltatime)
    }
    floorShadow: THREE.Texture;
    floorModel: THREE.Group;
    public updateWaveEffect(deltatime: number) {
        this.prolang.updateWaveEffect(deltatime)
        this.dbs.updateWaveEffect(deltatime)
        this.frameworks.updateWaveEffect(deltatime)
        this.softwares.updateWaveEffect(deltatime)
    }
    async loadShadowModel() {

        const material = new ShaderMaterial({
            depthWrite: false,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            uniforms: {
                textureMap: {
                    value: null
                }
            },
            transparent: true
        })

        const ref = this;
        const object = await new Promise<Group>((res, rej) => {
            var objLoader = new OBJLoader();
            objLoader.load("/assets/floorShadow.obj", function (object) {
                object.traverse(async (c: THREE.Mesh) => {
                    if (c.isMesh) {
                    }
                    c.material = material;
                    return c;
                })
                object.scale.copy(new Vector3(6, 0, 6))
                res(object)
            });
        });

        this.floorModel = object;
    }
    private initShadowModel() {
        const ref = this;
        this.floorModel.children.forEach((c: THREE.Mesh) => {
            (c.material as ShaderMaterial).uniforms.textureMap.value = ref.floorShadow;
        })
    }
    async loadCirclePlate() {
        // customShader("gray")
        return (await loadOBJ("/assets/environment/knowledge/circlePlate.obj", "/assets/environment/knowledge/circlePlate.mtl")).children[0] as any;
    }
    async loadShadowTexture() {
        this.floorShadow = await new TextureLoader().loadAsync("/assets/environment/knowledge/floorShadow.png");
    }
}