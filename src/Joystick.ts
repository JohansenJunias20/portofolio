import { normalize } from "gsap/all";
import isMobile from "is-mobile";
import { Vector2 } from "three";
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
    private canvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
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
    public ontouchmove(touch: Touch) {
        const x = touch.pageX;
        const y = touch.pageY;
        var result_xy = new Vector2();
        // console.log({ x, y })
        // const rect = this.innerDOM.getBoundingClientRect()
        const xJoystick = this.position.x + parseFloat(this.innerDOM.style.width.replace("px", "")) / 2;
        const yJoystick = this.position.y + parseFloat(this.innerDOM.style.height.replace("px", "")) / 2;
        const joystick_xy = new Vector2(xJoystick, yJoystick);
        const mouse_xy = new Vector2(x, y);
        if (this.MouseInsideJoystick(mouse_xy)) {
            //left = get left outerDOM
            //x = mos.x - left
            //y = mos.y - top
            const rect = this.outerDOM.getBoundingClientRect();
            result_xy.x = mouse_xy.x - rect.left - rect.width / 2;
            result_xy.y = mouse_xy.y - rect.top - rect.height / 2;
            //cari distance dari titik tengah joystick ke mouse bandingkan distance tsb dgn width atau height outerDOM dibagi 2.
            //jika melebihi maka perlu dinormalize
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const distance: number = Math.abs(new Vector2(centerX, centerY).distanceTo(mouse_xy));
            const maxDistance: number = parseFloat(this.outerDOM.style.width.replace("px", "")) / 2;
            console.log({ centerX, centerY, distance, maxDistance, result_xy })
            if (distance > maxDistance) {
                //melebihi sehingga harus dinormalize
                const distance_xy = new Vector2().copy(mouse_xy).sub(joystick_xy)
                result_xy = distance_xy.normalize().multiplyScalar(parseFloat(this.outerDOM.style.width.replace("px", "")) / 2);
                console.log("outside")
            }
            else {
                result_xy.x = mouse_xy.x - rect.left - rect.width / 2;
                result_xy.y = mouse_xy.y - rect.top - rect.height / 2;
                // result_xy = mouse_xy.clone();
                console.log("inside")

            }
            // this.innerDOM.style.transform = `translate(${result_xy.x}px,${result_xy.y}px)`;
        }
        else {
            const distance_xy = new Vector2().copy(mouse_xy).sub(joystick_xy)
            result_xy = distance_xy.normalize().multiplyScalar(parseFloat(this.outerDOM.style.width.replace("px", "")) / 2);
            console.log({ result_xy, distance_xy });
        }
        this.innerDOM.style.transform = `translate(${result_xy.x}px,${result_xy.y}px)`;
        // const resultX = 

    }
    MouseInsideJoystick(mosPos: Vector2) {
        const rect = this.outerDOM.getBoundingClientRect();
        return rect.left < mosPos.x && mosPos.x < rect.right && rect.top < mosPos.y && mosPos.y < rect.bottom
    }
    private reCenter() {
        this.innerDOM.style.transform = "translate(0px,0px)";
    }
    private mount() {
        this.containerDOM = document.querySelector("#container_joystick");
        this.innerDOM = document.querySelector("#inner_joystick");
        this.outerDOM = document.querySelector("#outer_joystick");
        const ref = this;


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
        setTimeout(() => {
            const rect = ref.innerDOM.getBoundingClientRect();
            ref.position.x = rect.x;
            ref.position.y = rect.y;
        }, 0);
    }
    public hide() {
        this.containerDOM.style.display = "none";
    }
    public show() {
        this.containerDOM.style.display = "block";

    }

}