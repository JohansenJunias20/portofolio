import gsap, { normalize } from "gsap/all";
import isMobile from "is-mobile";
import { Vector2 } from "three";
import { clamp } from "three/src/math/MathUtils";
declare var production: boolean;

export default class Joystick {
    containerDOM: HTMLDivElement;
    outerDOM: HTMLDivElement;
    innerDOM: HTMLDivElement;
    initialPos: { //initial pos adalah coordinate joystick pada layar
        x: number;
        y: number;
    }
    position: {
        x: number;
        y: number;
    }
    mouse: {
        x: number;
        y: number;
    }
    private canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.touchStartInside = false;
        this.initialPos = {
            x: 0,
            y: 0
        }
        this.position = {
            x: 0,
            y: 0
        }

        this.mount();

        // this.hide(); return;
        if (!production) {
            this.show();
            return;
        }

        if (isMobile()) {
            this.show()
        }

    }
    public ontouchend() {
        this.reCenter();
    }
    public touchStartInside: boolean;
    public ontouchmove(touch: Touch) {
        if (!this.touchStartInside) return;
        const x = touch.pageX;
        const y = touch.pageY;
        var result_xy = new Vector2();
        const rectInner = this.innerDOM.getBoundingClientRect()
        const xJoystick = this.initialPos.x + rectInner.width / 2;
        const yJoystick = this.initialPos.y + rectInner.height / 2;
        const joystick_xy = new Vector2(xJoystick, yJoystick);
        const mouse_xy = new Vector2(x, y);
        const rect = this.outerDOM.getBoundingClientRect();
        // it detect the outer DOM element only which is square shape
        if (this.MouseInsideJoystick(mouse_xy)) {
            // mouse is inside the outerDOM but still not sure wether mouse is inside or outside the circle (because border radius)
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            result_xy.x = mouse_xy.x - centerX; //get x coordinate of mouse relative from center joystick coordinate
            result_xy.y = mouse_xy.y - centerY;// get y coordinate of mouse relative from center joystick coordinate
            //cari distance dari titik tengah joystick ke mouse bandingkan distance tsb dgn width atau height outerDOM dibagi 2.
            //jika melebihi maka perlu dinormalize
            const distance: number = Math.abs(new Vector2(centerX, centerY).distanceTo(mouse_xy));
            const maxDistance: number = rect.width / 2; // maksimal distance yg bisa dilewati oleh joystick
            if (distance < maxDistance) { // it is inside the joystick
                result_xy.x = mouse_xy.x - rect.left - rect.width / 2;
                result_xy.y = mouse_xy.y - rect.top - rect.height / 2;
                this.position = result_xy.clone()
                this.innerDOM.style.transform = `translate(${result_xy.x}px,${result_xy.y}px)`;
                return;

            }
            //bila diluar maka tetap ikut algoritma mouse diluar outerDOM element.
        }

        const distance_xy = new Vector2().copy(mouse_xy).sub(joystick_xy)
        result_xy = distance_xy.normalize().multiplyScalar(rect.width / 2);
        this.position = result_xy.clone()
        this.innerDOM.style.transform = `translate(${result_xy.x}px,${result_xy.y}px)`;

    }
    private MouseInsideJoystick(mosPos: Vector2) {
        const rect = this.outerDOM.getBoundingClientRect();
        return rect.left < mosPos.x && mosPos.x < rect.right && rect.top < mosPos.y && mosPos.y < rect.bottom
    }
    private reCenter() {
        const ref = this;
        // ref.innerDOM.style.transform = `translate(0px,0px)`;
        // return;
        gsap.to(this.position, {
            duration: 0.1,
            x: 0,
            y: 0,
            onUpdate: (e) => {
                ref.innerDOM.style.transform = `translate(${ref.position.x}px,${ref.position.y}px)`;
            }
        })
    }
    private mount() {
        this.containerDOM = document.querySelector("#container_joystick");
        this.innerDOM = document.querySelector("#inner_joystick");
        this.outerDOM = document.querySelector("#outer_joystick");
        const ref = this;


        this.outerDOM.ontouchstart = (e) => {
            ref.touchStartInside = true;
            // karena bila user hanya touch start maka joystick masih akan ada dicenter sehingga perlu kita panggil function ini
            // supaya joystick lgsg bergerak ke posisi jari user walaupun hanya touch start
            ref.ontouchmove(e.touches[0]);
        }
        this.outerDOM.ontouchend = (e) => {
            ref.touchStartInside = false;
            ref.reCenter();
        }
        setTimeout(() => {
            const rect = ref.innerDOM.getBoundingClientRect();
            ref.initialPos.x = rect.x;
            ref.initialPos.y = rect.y;
        }, 0);
    }
    public hide() {
        this.containerDOM.style.display = "none";
    }
    public show() {
        this.containerDOM.style.display = "block";

    }

}