import PhysicsObject3d from "../PhysicsObject";
import Modal from "../Modal";
import PopUp from "../PopUps/PopUp";


export default class DigitRecognition {
    public modal: Modal;
    PopUp: PopUp
    protected asset: {
        url: string;
        scale: THREE.Vector3;
        recieveShadow?: boolean;
        castShadow: boolean;
        mtl?: string
    }
    constructor(world: CANNON.World, scene: THREE.Scene, camera: THREE.PerspectiveCamera, position: THREE.Vector3) {
        var iframeDOM = document.createElement("iframe")
        iframeDOM.setAttribute("src", "/assets/environment/playground/index.html");
        iframeDOM.style.marginTop = "auto";
        iframeDOM.style.marginBottom = "auto";
        iframeDOM.style.height = "100%";
        iframeDOM.style.width = "100%";
        iframeDOM.frameBorder = "0";
        iframeDOM.onload = (e) => {
            // iframeDOM.style.height = iframeDOM.contentWindow.document.documentElement.scrollHeight + "px";
        }
        var divDOM = document.createElement("div")
        divDOM.style.width = "100%";
        divDOM.style.height = "100%";
        divDOM.appendChild(iframeDOM)
        this.modal = new Modal(divDOM);
        this.PopUp = new PopUp(world, scene, camera, { x: 12, y: 2, z: 6 }, 0.3, "open", this.modal)
        this.position = position;
        this.initialized = false;
    }
    public position: THREE.Vector3;
    public initialized: boolean;
    public async init(): Promise<void> {
        await this.PopUp.init()
        this.PopUp.setPosition(this.position)
        // this.PopUp.rotation(0, 0, 0);
        // await super.inist()
        this.initialized = true;
    }
    public update(deltatime: number, characterBody: CANNON.Body, intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]): void {
        // super.update();
        this.PopUp.update(deltatime, characterBody, intersects)
    }


}