import MeshOnlyObject3d from "../MeshOnlyObject";
import * as THREE from "three"
import generateTexture from "../utility/generateTexture";
import { ShaderMaterial } from "three";
import vertexShader from "../../public/assets/shaders/floorMesh.vert";
import fragShader from "../../public/assets/shaders/floorMesh.frag";
import customShader from "../utility/customShader";
import wrapText from "../utility/WrapText";
import { degToRad } from "three/src/math/MathUtils";
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
    canvas: HTMLCanvasElement = document.querySelector("#debug");
    // mesh: THREE.Mesh;
    changeTexture: boolean = false;
    constructor(scene: THREE.Scene, position: THREE.Vector3) {
        super(scene, position.clone().add(new THREE.Vector3(0, 0, 10)));
        const ref = this;
        window.addEventListener("spotify", (e: any) => {
            var data = (e.detail as ISpotify);
            this.currentSpotify = data;
            // console.log("recieve from spotify.ts file!")
            this.changeTexture = true;
        })
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
        this.mesh.position.copy(this.position.clone().setY(0));
        this.scene.add(this.mesh);
        this.initialized = true;
    }
    imageCache: HTMLImageElement;
    public update() {
        if (this.changeTexture) {
            var alreadyChange = false;
            this.changeTexture = false;
            if (!this.currentSpotify) return; //currently not playing because value is {}

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
                    console.log("set")
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
    }
}