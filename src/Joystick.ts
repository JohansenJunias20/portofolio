import { normalize } from "gsap/all";
import isMobile from "is-mobile";
import { clamp } from "three/src/math/MathUtils";
declare var production: boolean;

export default class Joystick {
    containerDOM: HTMLDivElement;
    outerDOM: HTMLDivElement;
    innerDOM: HTMLDivElement;
    position: {
        x: number;
        y: number;
    }
    mouse: {
        x: number;
        y: number;
    }
    constructor(mousePos: { x: number, y: number }) {
        this.mouse = mousePos;
        this.mount();
        this.hide(); return;
        if (!production) {
            this.show();
            return;
        }

        if (isMobile()) {
            this.show()
        }

    }
    private mount() {
        this.containerDOM = document.querySelector("#container_joystick");
        this.innerDOM = document.querySelector("#inner_joystick");
        this.outerDOM = document.querySelector("#outer_joystick");
        const ref = this;
        this.outerDOM.onmousedown = (e) => {
            console.log({ mouse: this.mouse })
        }
        this.outerDOM.onmousemove = (e) => {
            // normalize()
            // const { pageX, pageY, clientX, clientY } = e;
            // const width = parseInt(this.outerDOM.style.width.replace("px", ""));
            // const height = parseInt(this.outerDOM.style.height.replace("px", ""));
            // var rect = ref.outerDOM.getBoundingClientRect();
            // //buat fungsi isInCircle?
            // var x = e.clientX - rect.left; //x position within the element.
            // var y = e.clientY - rect.top;  //y position within the element.
            // console.log({ clientX, rectLEFT: rect.left })
            // x = clamp(x, 0, width);
            // y = clamp(y, 0, height);
            // // ref.innerDOM.style.left = `calc(${x}px - ${ref.innerDOM.style.width}/2)`;
            // // ref.innerDOM.style.top = `calc(${y}px - ${ref.innerDOM.style.height}/2)`;
            // ref.innerDOM.style.left = `${Math.abs(x).toFixed(0)}px`;
            // ref.innerDOM.style.top = `${Math.abs(y).toFixed(0)}px`;
            // console.log({ left: ref.innerDOM.style.left, top: ref.innerDOM.style.top, x, y, width, height });
        }
    }
    public hide() {
        this.containerDOM.style.display = "none";
    }
    public show() {
        this.containerDOM.style.display = "block";

    }

}