import * as THREE from "three";

interface IConstruct {
    text: string;

}


export default class NickName {
    position: THREE.Vector2;
    text: string;
    DOM: HTMLElement;
    asset: {
        bubble: string;
    }
    constructor(construct: IConstruct) {
        this.DOM = document.createElement('div');
        this.asset = { bubble: "/assets/character/bubble.png" };
        this.DOM.classList.add('nickname');
        this.DOM.style.position = 'absolute';
        this.DOM.style.top = '0';
        this.DOM.style.left = '0';
        this.DOM.style.width = '100px';
        var image = document.createElement("img");
        image.style.width = "100%";
        this.DOM.appendChild(image);
        image.src = this.asset.bubble;
        var domNickname = document.querySelector("#nicknames");
        domNickname.appendChild(this.DOM);

    }
    update(mesh: THREE.Object3D<THREE.Event>, camera: THREE.PerspectiveCamera) {
        // var position = new THREE.Vector3();
        // // position.setFromMatrixPosition(cameraView);
        // position.applyMatrix4(cameraView);
        var finalPos = mesh.position.clone().applyMatrix4(mesh.matrixWorld).applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);        // var charPosV4 = new THREE.Vector4(charPos.x, charPos.y, charPos.z, 1.0);
        // var finalPos = charPosV4.applyMatrix4((cameraView.multiply(projectionMatrix)));
        console.log({ x: finalPos.x, y: finalPos.y, z: finalPos.z });
        // this.DOM.style.left = (position.x + charPos.x) + 'px';
        // this.DOM.style.top = (position.y + charPos.y) + 'px';
    }


}