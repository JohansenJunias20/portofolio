import MeshOnlyObject3d from "../MeshOnlyObject";
import * as THREE from "three"
import generateTexture from "../utility/generateTexture";
import { ShaderMaterial, Vector3 } from "three";
import vertexShader from "../../public/assets/shaders/floorMesh.vert";
import fragShader from "../../public/assets/shaders/floorMesh.frag";
import customShader from "../utility/customShader";
import wrapText from "../utility/WrapText";
import { degToRad } from "three/src/math/MathUtils";
import PopUp from "../PopUps/PopUp";
import Character from "../Character/Character";
export interface ISpotify {
    image_url: string;
    song: {
        name: string;
        artist: string;
        length: number;
    },
    is_playing: boolean,
    currentDuration: number;
    url: string;
}
export default class SpotifyFloor extends MeshOnlyObject3d {
    currentSpotify: ISpotify | null;
    popUpPlay: PopUp;
    canvas: HTMLCanvasElement = document.querySelector("#debug");
    // mesh: THREE.Mesh;
    changeTexture: boolean = false;
    character: Character;
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera, position: THREE.Vector3, character: Character) {
        super(scene, position.clone().setY(0).add(new Vector3(0,0,10)));
        this.character = character;
        const ref = this;
        window.addEventListener("spotify", (e: any) => {
            var data = (e.detail as ISpotify);
            console.log({ data })
            this.currentSpotify = data;
            // console.log("recieve from spotify.ts file!")
            this.changeTexture = true;
            if (ref.popUpPlay) {
                this.popUpPlay.urlRef = data.url;
                // console.log(this.popUpPlay)
            }
        });
        this.popUpPlay = new PopUp(world, scene, camera, {
            x: 12, y: 2, z: 6
        }, 0.3, "play", "");
        this.popUpPlay.setPosition(position.clone().setY(0).add(new Vector3(0, 0, 18)));
        this.canvas.width = 600;
        this.canvas.height = 250;
        this.canvas.style.width = `${600}px`;
        this.canvas.style.height = `${250}px`;
    };
    public async loadAsset() {
        // var desc_text_texture = await new THREE.TextureLoader().loadAsync(this.pathTexture)
        var loader = new THREE.TextureLoader();
        var material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: fragShader,
            uniforms: {
                mapTexture: {
                    value: null,
                },
                useTexture: {
                    value: true
                },
                darkenBloom: {
                    value: false
                }
            },
            depthWrite: false,
            transparent: true,

        });
        var geometry = new THREE.PlaneGeometry(12, 5)
        this.mesh = (new THREE.Mesh(geometry, material)) as any;
        this.mesh.rotateX(degToRad(-90))
        this.mesh.scale.x = 2;
        this.mesh.scale.y = 2;
        this.scene.add(this.mesh);
        await this.popUpPlay.init();
        this.mesh.position.copy(this.position.clone().setY(5));
        // this.mesh.position = this.mesh.position.add(new Vector3(0,
        this.popUpPlay.floor.mesh.visible = false;
        this.popUpPlay.borderFloor.mesh.visible = false;
        this.popUpPlay.fence.mesh.visible = false;
        this.initialized = true;
    }
    imageCache: HTMLImageElement;
    public customUpdate(deltatime: number, intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
        if (this.changeTexture) {
            var alreadyChange = false;
            this.changeTexture = false;
            if (this.popUpPlay.initialized) {
                this.popUpPlay.floor.mesh.visible = false;
                this.popUpPlay.borderFloor.mesh.visible = false;
                this.popUpPlay.fence.mesh.visible = false;
            }
            if (!this.currentSpotify) {
                if (this.popUpPlay.initialized)
                    this.popUpPlay.update(deltatime, this.character, intersects);
                return; //currently not playing because value is {}
            }
            if (this.popUpPlay.initialized) {
                this.popUpPlay.floor.mesh.visible = true;
                this.popUpPlay.borderFloor.mesh.visible = true;
                this.popUpPlay.fence.mesh.visible = true;
            }
            // const canvas = document.createElement("canvas");
            // canvas.
            const ctx = this.canvas.getContext("2d");
            if (!ctx) {
                throw "context not found"
            }
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            if (this.imageCache?.src != this.currentSpotify.image_url) {
                alreadyChange = true;
                const img = new Image(200, 200);
                img.crossOrigin = "anonymous"
                img.src = this.currentSpotify.image_url;
                const ref = this;
                img.onload = () => {
                    ref.imageCache = img;
                    ctx.drawImage(img, 5, 5, 200, 200);
                    ((this.mesh as any).material as ShaderMaterial).uniforms.mapTexture.value = new THREE.CanvasTexture(this.canvas);
                    ((this.mesh as any).material as ShaderMaterial).needsUpdate = true;
                    // console.log("set")
                }
            }
            else {
                if (this.imageCache)
                    ctx.drawImage(this.imageCache, 5, 5, 200, 200);
            }

            ctx.font = "700 30px Montserrat";
            // ctx.font
            ctx.fillStyle = "rgba(255,255,255,1)";
            var wrappedText = wrapText(ctx, this.currentSpotify.song.name, 210, 45, this.canvas.width - 305, 30);
            // console.log({ wrappedText });
            for (let i = 0; i < wrappedText.length; i++) {
                const txt = wrappedText[i];
                ctx.fillText(txt[0].toString(), parseInt((txt[1] as any)), parseInt((txt[2] as any)));

            }
            ctx.fill();
            ctx.fillText(this.currentSpotify.song.artist, 210, (wrappedText.at(-1)[2] as any) + 50);
            ctx.fill();

            ctx.fillStyle = "rgba(250,211,174,1)";
            ctx.fillRect(5, this.canvas.height - 40, this.canvas.width - 10, 10);
            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.fillRect(5, this.canvas.height - 40, (this.currentSpotify.currentDuration / this.currentSpotify.song.length) * (this.canvas.width - 10), 10);

            // ctx.fillStyle = "rgba(0,0,0,1)";
            ctx.font = "700 25px Montserrat";
            ctx.fillText(
                `${Math.round(Math.round(this.currentSpotify.currentDuration) / 60)}:${Math.round(this.currentSpotify.currentDuration % 60).toString().padStart(2, "0")} / ${Math.round(Math.round(this.currentSpotify.song.length) / 60)}:${Math.round(this.currentSpotify.song.length % 60).toString().padStart(2, "0")}`,
                this.canvas.width - 150, this.canvas.height - 50);
            if (!alreadyChange) {
                ((this.mesh as any).material as ShaderMaterial).uniforms.mapTexture.value = new THREE.CanvasTexture(this.canvas);
                ((this.mesh as any).material as ShaderMaterial).needsUpdate = true;
            }
        }
        else {
            // if (this.popUpPlay.initialized) {
            //     this.popUpPlay.floor.mesh.visible = false;
            //     this.popUpPlay.borderFloor.mesh.visible = false;
            //     this.popUpPlay.fence.mesh.visible = false;
            // }
        }
        // console.log({ meshposition: this.mesh.position.y})
        if (this.popUpPlay.initialized)
            this.popUpPlay.update(deltatime, this.character, intersects);
    }
}