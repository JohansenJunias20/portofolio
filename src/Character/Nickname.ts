import * as THREE from "three";
import gsap from "gsap"
import { Linear } from "gsap"
interface IConstruct {

}


export default class NickName {
    clear() {
        //remove this.DOM from DOM
        this.DOM.remove();
        // throw new Error('Method not implemented.');
    }
    position: THREE.Vector2;
    _text: string;
    DOM: HTMLElement;
    asset: {
        bubble: string;
    }
    constructor() {
        this.DOM = document.createElement('div');
        this.asset = { bubble: "/assets/character/bubble.png" };
        this.DOM.classList.add('nickname');
        this.DOM.style.position = 'absolute';
        this.DOM.style.top = '0';
        this.DOM.style.left = '0';
        this.DOM.style.width = '100px';
        this.DOM.style.display = 'flex';
        this.DOM.style.justifyContent = 'center';
        this.DOM.style.alignItems = 'center';
        this.DOM.style.height = '50px';
        this.DOM.style.backgroundColor = "#fcba03";
        // var image = document.createElement("img");
        // image.style.width = "100%";
        // this.DOM.appendChild(image);
        // image.src = this.asset.bubble;
        // image.style.filter = `
        // drop-shadow(2px 2px 0 black)
        // drop-shadow(-2px 2px 0 black)
        // drop-shadow(2px -2px 0 black)
        // drop-shadow(-2px -2px 0 black)
        // `
        var domNickname = document.querySelector("#nicknames");
        domNickname.appendChild(this.DOM);

    }
    lastGsap: gsap.core.Tween;
    update(mesh: THREE.Object3D<THREE.Event>, camera: THREE.PerspectiveCamera) {
        var finalPos = mesh.position.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);        // var charPosV4 = new THREE.Vector4(charPos.x, charPos.y, charPos.z, 1.0);
        var finalPos1 = mesh.position.clone().project(camera);
        var distance = mesh.position.distanceTo(camera.position);
        // console.log({ x: finalPos1.x, y: finalPos1.y, z: finalPos1.z });
        // set dom position from finalPos1 that has -1 to 1 values
        // this.DOM.style.left = (((finalPos1.x + 1) / 2) * window.innerWidth) - (this.DOM.clientWidth/2)+ 'px';
        // this.DOM.style.top = ((1 - ((finalPos1.y + 1) / 2)) * window.innerHeight) - (this.DOM.clientHeight) - 50 + 'px';

        var minDistance = 37;
        var normalDistance = 52;
        var maxDistance = 100;
        distance -= normalDistance;
        var opacity = distance / (maxDistance - normalDistance);
        this.DOM.style.opacity = `${(1 - Math.abs(opacity))}`;

        if (this.lastGsap) {
            this.lastGsap.pause();
            this.lastGsap.kill()
        }
        this.lastGsap = gsap.to(this.DOM,
            {
                duration: 0.03,
                x: (((finalPos1.x + 1) / 2) * window.innerWidth) - (this.DOM.clientWidth / 2),
                y: ((1 - ((finalPos1.y + 1) / 2)) * window.innerHeight) - (this.DOM.clientHeight) - 50,
                ease: Linear.easeNone
            });
    }

    set text(value: string) {
        this._text = value;
        this.DOM.innerHTML = value;
    }
    get text(): string {
        return this._text;
    }


}