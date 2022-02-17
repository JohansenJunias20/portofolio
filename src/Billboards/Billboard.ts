

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Color, Group, MeshPhongMaterial, PositionalAudio, Raycaster, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { clamp, degToRad } from 'three/src/math/MathUtils';
import PopUp from '../PopUps/PopUp';
import customShader from '../utility/customShader';
import loadOBJ from '../utility/loadOBJ';

export default class Billboard {
    public isBillboard: boolean;
    private asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
        mtl?: string
    }
    private PhysicsWorld: CANNON.World;
    public initialized: boolean;
    public mesh: THREE.Object3D;
    public readonly position: Vector3;
    public scene: THREE.Scene;
    public movementSpeed: number;
    // public body: CANNON.Body;
    private shape: CANNON.Shape | null;
    public readonly mass: number;
    public floorText: "download" | "open";
    public Yrotation: number;
    private lightIntensity: number;
    text: string;
    urlRef: Array<string>;
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera, position: Vector3, text: "miles madness" | "tokopedia integration" = "miles madness",
        scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1), rotation: number = 100, urlRef: Array<string> = [],
        lightIntensity: number = 1, floorText: "download" | "open" = "download") {
        this.lightIntensity = lightIntensity;
        this.camera = camera;
        this.urlRef = urlRef;
        this.text = text;
        this.scene = scene;
        this.initialized = false;
        this.position = position;
        this.floorText = floorText;
        this.PopUpObjects = [];
        this.mass = 0;
        this.PhysicsWorld = world;
        this.isBillboard = true; // untuk memberi tahu Wrapper bahwa instance adalah dari Billboard Class

        this.Yrotation = rotation;
        this.asset = {
            url: `/assets/environment/portofolio/billboard.obj`,
            mtl: `/assets/environment/portofolio/billboard.mtl`,
            castShadow: true,
            scale: scale
        }


    }
    public async init() {
        await this.loadAsset();
    }
    public update(deltatime: number, characterBody: CANNON.Body, intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
        this.PopUpObjects.forEach(popup => popup.update(deltatime, characterBody, intersects))
    }
    camera: THREE.PerspectiveCamera;
    private async loadAsset() {
        var size = new THREE.Vector3();
        var promises: Array<Promise<any>> = [];
        const ref = this;
        var mtl: MTLLoader.MaterialCreator;
        const mtlLoader = new MTLLoader();
        var objLoader = new OBJLoader();
        var object: THREE.Group;
        promises.push((async () => { object = await loadOBJ(ref.asset.url, ref.asset.mtl, new THREE.Vector3(10 * ref.asset.scale.x, 10 * ref.asset.scale.y, 10 * ref.asset.scale.z)) })())
        // promises.push((async () => {
        //     mtl = await mtlLoader.loadAsync(this.asset.mtl);
        //     objLoader.setMaterials(mtl);

        // })())
        // promises.push(new Promise<void>((res, rej) => {
        //     objLoader.load(ref.asset.url, function (_object) {
        //         _object.traverse((c: THREE.Mesh) => {
        //             if (c.isMesh) {
        //                 c.castShadow = ref.asset.castShadow;
        //                 c.material = customShader((c.material as MeshPhongMaterial).color);
        //             }
        //             // return c;
        //         })
        //         _object.scale.set(10 * ref.asset.scale.x, 10 * ref.asset.scale.y, 10 * ref.asset.scale.z)
        //         object = _object;
        //         res()
        //     });
        // }))

        var texture: THREE.Texture;
        var desc_text_texture: THREE.Texture;
        promises.push((async () => texture = await new THREE.TextureLoader().loadAsync(`/assets/environment/portofolio/${ref.text}/billboard_image.png`))());
        promises.push((async () => desc_text_texture = await new THREE.TextureLoader().loadAsync(`/assets/environment/portofolio/${ref.text}/desc_text.png`))());
        //#region links
        const popUpSize = {
            x: 12, y: 2, z: 6
        }
        for (let i = 0; i < this.urlRef.length; i++) {
            const url = this.urlRef[i];
            const popUp = new PopUp(this.PhysicsWorld, this.scene, this.camera,
                popUpSize, 0.3, `${this.floorText}`, url);
            promises.push(popUp.init());
            // todo: ini pakai promise All.
            this.PopUpObjects.push(popUp);
        }
        //#endregion
        await Promise.all(promises);
        // this.position.y += 5;
        // this.mesh = fbx;


        //#region initialize loaded asset
        this.position.y += 14 * this.asset.scale.y;
        object.position.copy(this.position);
        object.rotateY(degToRad(10))
        this.scene.add(object);
        this.mesh = object;
        // this.mesh = fbx;



        const geometry = new THREE.PlaneGeometry(27 * this.asset.scale.x, 16 * this.asset.scale.y);

        const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.FrontSide,
            lightMap: texture,
            lightMapIntensity: this.lightIntensity
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(this.position)
        plane.rotateY(degToRad(10));
        this.scene.add(plane);
        new THREE.Box3().setFromObject(object).getSize(size);
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 6)), // znya ternyata lebih besar
            mass: 0,
            material: { friction: 1, restitution: 0.3, id: 1, name: "test" }
        })
        this.body.position.copy(object.position as any);
        this.body.quaternion.copy(object.quaternion as any);
        this.PhysicsWorld.addBody(this.body)


        //description
        const sizePlaneDescText = {
            x: desc_text_texture.image.width as number / 25,
            y: desc_text_texture.image.height as number / 25
        }
        const descGeometry = new THREE.PlaneGeometry(sizePlaneDescText.x, sizePlaneDescText.y);

        const desc_text_material = new THREE.MeshBasicMaterial({
            alphaMap: desc_text_texture,
            transparent: true
        })
        const planeDescText = new THREE.Mesh(descGeometry, desc_text_material);
        planeDescText.position.copy(this.position);
        planeDescText.receiveShadow = false;
        planeDescText.castShadow = false;
        planeDescText.position.y = 0.1;
        planeDescText.position.z += sizePlaneDescText.y / 2 + 5;
        planeDescText.position.x += 12;
        planeDescText.rotateX(degToRad(-90))
        this.scene.add(planeDescText);

        //initialize objectpos
        for (let i = 0; i < this.PopUpObjects.length; i++) {
            const PopUpObject = this.PopUpObjects[i];
            PopUpObject.setPosition(new Vector3(this.position.x + (i * (popUpSize.x + 2)), 0.25, planeDescText.position.z + sizePlaneDescText.y / 2 + 5))
        }
        plane.position.copy(this.position)
        this.mesh.position.copy(this.position)
        this.body.position.copy(this.position as any)
        //#endregion
        this.initialized = true;
    }
    public updateWaveEffect() {

    }
    PopUpObjects: PopUp[];
    body: CANNON.Body;


}