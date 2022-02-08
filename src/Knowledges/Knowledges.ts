import * as THREE from "three"
import { Group, ShaderMaterial, TextureLoader, Vector3 } from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import Loading from "../Loading/Loading"
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
    async loadShadowTexture() {
        this.floorShadow = await new TextureLoader().loadAsync("/assets/environment/knowledge/floorShadow.png");
    }
}