

import * as CANNON from 'cannon';
import * as THREE from 'three';
import { Color, Group, PositionalAudio, Triangle, Vector, Vector3, WebGLRenderer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { clamp, degToRad } from 'three/src/math/MathUtils';
import PhysicsObject3d from '../PhysicsObject';
import PopUp from '../PopUps/PopUp';

interface AnimationCharacter {
    walk: THREE.AnimationAction;
}
export default class Billboard {
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
    public Yrotation: number;
    text: string
    constructor(world: CANNON.World, scene: THREE.Scene, position: Vector3, text: "miles madness" = "miles madness", scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1), rotation: number = 100) {
        this.text = text;
        // this.asset.url = `/assets/environment/portofolio/billboard_${text}.fbx`;   this.PhysicsWorld = world;
        this.scene = scene;
        this.initialized = false;
        this.position = position;

        this.mass = 0;
        this.PhysicsWorld = world;

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
    public update(deltatime: number) {
        this.PopUpObject.update(deltatime);

        // this.mesh.position.copy(this.position);

        // this.updatePhysics(deltatime);
    }
    private async loadAsset() {
        var size = new THREE.Vector3();

        const ref = this;
        const mtlLoader = new MTLLoader();
        const mtl = await mtlLoader.loadAsync(this.asset.mtl);
        const object = await new Promise<Group>((res, rej) => {

            var objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load(ref.asset.url, function (object) {
                object.traverse(c => {
                    if (c.isMesh) {
                        c.castShadow = ref.asset.castShadow;
                        // c.receiveShadow = ref.asset.recieveShadow;
                    }
                    // return c;
                })
                object.scale.set(10 * ref.asset.scale.x, 10 * ref.asset.scale.y, 10 * ref.asset.scale.z)

                console.log("OBJECT DONE")
                res(object)
            });
        });

        // this.position.y += 5;
        // this.mesh = fbx;

        this.position.y += 14 * this.asset.scale.y;
        object.position.copy(this.position);
        object.rotateY(degToRad(10))
        this.scene.add(object);
        // this.mesh = fbx;
        const texture = await new THREE.TextureLoader().loadAsync(`/assets/environment/portofolio/${this.text}/billboard_image.png`);


        const geometry = new THREE.PlaneGeometry(30 * this.asset.scale.x, 17 * this.asset.scale.y);


        const material = new THREE.MeshLambertMaterial({
            map: texture,
            side: THREE.FrontSide,
            lightMap: texture
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.copy(this.position)
        plane.rotateY(degToRad(10));
        this.scene.add(plane);
        new THREE.Box3().setFromObject(object).getSize(size);
        console.log({ size })
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
            mass: 0,
            material: { friction: 1, restitution: 0.3, id: 1, name: "test" }
        })
        this.body.position.set(50, 5, 40);
        this.body.quaternion.copy(object.quaternion)
        this.PhysicsWorld.addBody(this.body)


        //description
        const descGeometry = new THREE.PlaneGeometry(70 * this.asset.scale.x, 40 * this.asset.scale.y);
        const desc_text_texture = await new THREE.TextureLoader().loadAsync(`/assets/environment/portofolio/${this.text}/desc_text.png`);
        const desc_text_material = new THREE.MeshLambertMaterial({
            map: desc_text_texture,
            lightMap: desc_text_texture,
            side: THREE.FrontSide,
            transparent: true
        })
        const planeDescText = new THREE.Mesh(descGeometry, desc_text_material);
        planeDescText.position.copy(this.position);
        planeDescText.receiveShadow = false;
        planeDescText.castShadow = false;
        planeDescText.position.y -= 6.8;
        planeDescText.position.z += 14;
        planeDescText.position.x += 12;
        planeDescText.rotateX(degToRad(-90))
        this.scene.add(planeDescText);

        //#region links

        this.PopUpObject = new PopUp(this.PhysicsWorld, this.scene, new Vector3(3.0, 0.1, 3.0), {
            x: 15, y: 2, z: 8
        }, 0.3, `/assets/environment/portofolio/${this.text}/floor.png`);
        await this.PopUpObject.init();
        this.initialized = true;
        //#endregion
    }
    onPopUpMouseHover() {
        this.PopUpObject.onMouseHover()

    }
    onPopUpMouseNotHover() {
        this.PopUpObject.onMouseNotHover()
    }
    PopUpObject: PopUp;
    body: CANNON.Body;


}