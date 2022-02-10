import { Vec3 } from "cannon"
import * as THREE from "three"
import { Group, ShaderMaterial, TextureLoader, Vector3 } from "three"
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

export default class Knowledge {
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
        await this.loadShadowTexture();
        await this.loadShadowModel();

        // circlePlate.scale.set(10, 10, 10);
        // console.log({ circlePlate })

        for (let i = 0; i < this.prolang.keys.length; i++) {
            const key = this.prolang.keys[i];
            if (key.text != "golang" && key.text != "ts") continue;

            const newCirclePlane = await this.loadCirclePlate(); // ternyata mesh.clone() itu menggunakan reference material yang sama
            this.prolang.keys[i].asset.additionalMesh[0] = newCirclePlane;



            this.prolang.keys[i].shape = createBody(newCirclePlane);
            (this.prolang.keys[i].shape as any).setScale(new Vec3(10, 10, 10) as any) //because obj 10 times bigger
        }
        // this.prolang.keys.forEach(key => {
        //     if (key.text != "golang" && key.text != "ts") return;

        //     const newCirclePlane = circlePlate.clone(true);
        //     key.asset.additionalMesh[0] = newCirclePlane;



        //     key.shape = createBody(newCirclePlane);
        //     (key.shape as any).setScale(new Vec3(10, 10, 10) as any) //because obj 10 times bigger
        //     // key.mesh = new THREE.Mesh();
        // })
        await this.prolang.init(this.floorModel)
        loading.addProgress(10);
        await this.dbs.init(this.floorModel)
        loading.addProgress(10);
        await this.softwares.init(this.floorModel)
        loading.addProgress(10);
        await this.frameworks.init(this.floorModel)
        loading.addProgress(10);

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
    async loadShadowModel() {

        const material = new ShaderMaterial({
            depthWrite: false,
            vertexShader: await (await fetch(`/assets/shaders/floorShadow.vert`)).text(),
            fragmentShader: await (await fetch(`/assets/shaders/floorShadow.frag`)).text(),
            uniforms: {
                textureMap: {
                    value: this.floorShadow
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
    async loadCirclePlate() {
        // customShader("gray")
        return (await loadOBJ("/assets/environment/knowledge/circlePlate.obj", "/assets/environment/knowledge/circlePlate.mtl")).children[0] as any;
    }
    async loadShadowTexture() {
        this.floorShadow = await new TextureLoader().loadAsync("/assets/environment/knowledge/floorShadow.png");
    }
}