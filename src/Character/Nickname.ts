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
    isMainCharater: boolean; //determine if this is from the main character or otherplayer
    constructor(isMainCharater: boolean) {
        this.isMainCharater = isMainCharater;
        if(!this.isMainCharater) this.started = true; //because it is not main character, no need nickname respawn transition
        this.DOM = document.createElement('div');
        this.asset = { bubble: "/assets/character/bubble.png" };
        this.DOM.classList.add('nickname');
        this.DOM.style.position = 'absolute';
        this.DOM.style.top = '0';
        this.DOM.style.left = '0';
        // this.DOM.style.width = '100px';

        this.DOM.style.padding = '5px';
        this.DOM.style.borderRadius = '5px';
        this.DOM.style.display = 'flex';
        this.DOM.style.justifyContent = 'center';
        this.DOM.style.fontFamily = "'Montserrat', sans-serif";
        this.DOM.style.fontWeight = "bold";
        this.DOM.style.color = "black"
        this.DOM.style.alignItems = 'center';
        this.DOM.style.border = '2px solid black';
        this.DOM.style.opacity = `0`;
        // this.DOM.style.height = '50px';
        this.DOM.style.backgroundColor = "#f7b945";
        // this.DOM.style.display = "none";ssss
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
        //create crosshair element that mark the center of screen
        // var crosshair = document.createElement('div');
        // crosshair.style.position = 'absolute';
        // crosshair.style.top = '50%';
        // crosshair.style.left = '50%';
        // crosshair.style.width = '0px';
        // crosshair.style.height = '0px';
        // crosshair.style.border = '2px solid black';
        // crosshair.style.borderRadius = '50%';
        // crosshair.style.backgroundColor = 'transparent';
        // crosshair.style.pointerEvents = 'none';
        // this.DOM.appendChild(crosshair);
        // this.DOM.style.display = "none";
        // document.body.appendChild(crosshair);

        var domNickname = document.querySelector("#nicknames");
        domNickname.appendChild(this.DOM);

    }
    lastGsap: gsap.core.Tween;
    update(position: THREE.Vector3, camera: THREE.PerspectiveCamera, leftMouseClick: boolean, followCharacter: boolean) {
        if (this.started) {
            var distance = position.distanceTo(camera.position);
            var minDistance = 37;
            var normalDistance = 52;
            var maxDistance = 100;
            distance -= normalDistance;
            var opacity = distance / (maxDistance - normalDistance);
            this.DOM.style.opacity = `${(1 - Math.abs(opacity))}`;
        }

        if (!leftMouseClick && followCharacter) { // ini seolah2 mengikuti character tetapi sebenarnya nickname diam di tengah2 screen
            //set this dom to center of the screen
            // this.DOM.style.left = `0px`;
            // this.DOM.style.top = `0px`;
            this.DOM.style.left = `${(window.innerWidth / 2) - (this.DOM.clientWidth / 2)}px`;
            this.DOM.style.top = `${(window.innerHeight / 2) - (this.DOM.clientHeight) - 50}px`;
            return;
        }
        // var finalPos = mesh.position.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);        // var charPosV4 = new THREE.Vector4(charPos.x, charPos.y, charPos.z, 1.0);
        var finalPos1 = position.clone().project(camera);
        // console.log({ x: finalPos1.x, y: finalPos1.y, z: finalPos1.z });
        // set dom position from finalPos1 that has -1 to 1 values
        this.DOM.style.left = (((finalPos1.x + 1) / 2) * window.innerWidth) - (this.DOM.clientWidth / 2) + 'px';
        this.DOM.style.top = ((1 - ((finalPos1.y + 1) / 2)) * window.innerHeight) - (this.DOM.clientHeight) - 50 + 'px';



        return
        if (this.lastGsap) {
            this.lastGsap.pause();
            this.lastGsap.kill()
        }

        this.lastGsap = gsap.to(this.DOM,
            {
                //bila ini adalah nickname berasal dari otheruser, letak nickname pada layar akan sering berubah.sehingga duration harus diperkecil
                //bila saat user grab camera (left mouse click true) maka duration diperkecil sehingga pergerakan nickname lebih cepat mengikuti
                // duration: this.isMainCharater == false ? 0.01 : leftMouseClick == false ? 0.04 : 0.01,
                duration: 0,
                x: (((finalPos1.x + 1) / 2) * window.innerWidth) - (this.DOM.clientWidth / 2),
                y: ((1 - ((finalPos1.y + 1) / 2)) * window.innerHeight) - (this.DOM.clientHeight) - 50,
                ease: Linear.easeNone
            });
    }
    private started: boolean;
    //start is called when all assets loaded
    //start will start respawn nickname animation
    public start() {
        gsap.to(this.DOM, {
            opacity: 1,
            ease: Linear.easeNone,
            duration: 1,
            onComplete: () => {
                this.started = true;
            }
        })
    }
    set text(value: string) {
        this._text = value;
        this.DOM.innerHTML = value;
    }
    get text(): string {
        return this._text;
    }


}