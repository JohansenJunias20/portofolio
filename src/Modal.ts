import * as THREE from "three";

declare var hideModal: () => void;
declare var showModal: (duration: number) => void;
export default class Modal {
    public parentDOM: HTMLDivElement
    private innerDOM: HTMLDivElement
    public size: "small" | "large" | "full";
    public close: () => void
    public open: () => void
    private origin: "center" | "top"
    private _Content: HTMLElement | string
    private duration: number;
    constructor(content: HTMLElement | string, size: "small" | "large" | "full" = "large", origin: "center" | "top" = "center", duration = 0) {
        this._Content = content;
        this.size = size;
        this.duration = duration;
        this.parentDOM = document.querySelector("#modal")
        this.innerDOM = document.querySelector("#modal_content")
        this.close = hideModal;
        const ref = this;
        this.origin = origin;
        this.open = () => {
            ref.innerDOM.innerHTML = '';
            ref._Content = ref._Content;
            if (typeof ref._Content == "string")
                ref.innerDOM.innerHTML = ref._Content;
            else
                ref.innerDOM.appendChild(ref._Content)
            // console.log({ content: ref._Content })
            if (size == "small") {
                ref.innerDOM.style.minWidth = "300px";
                ref.innerDOM.style.maxWidth = "600px";
                ref.innerDOM.style.height = "15%";
                ref.innerDOM.style.width = "20%";
            }
            else if (size == "large") {
                ref.innerDOM.style.minWidth = "600px";
                ref.innerDOM.style.maxWidth = "900px";
                ref.innerDOM.style.height = "75%";
                ref.innerDOM.style.width = "75%";
            }
            else if (size == "full") {
                ref.innerDOM.style.minWidth = "";
                ref.innerDOM.style.maxWidth = "";
                ref.innerDOM.style.height = "100%";
                ref.innerDOM.style.width = "100%";
                ref.innerDOM.style.padding = "0";

                // ref.innerDOM.style.width = window.innerWidth + "px";
            }
            if (ref.origin == "top") {
                ref.innerDOM.style.marginTop = "10px"
                ref.parentDOM.style.alignItems = "flex-start";
            }
            else {
                ref.parentDOM.style.alignItems = "center";

            }
            if (ref.duration) {
                ref.innerDOM.style.borderRadius = "0px;"
                var div = document.createElement("div");
                div.id = "progressDuration";
                div.style.animation = "progress";
                div.style.animationDuration = ref.duration + "s";
                div.style.width = "0%";
                // div.style.transition = "";
                div.style.height = "5px";
                // div.style.display ="absolute";
                div.style.backgroundColor = "rgb(252,186,3)";
                ref.innerDOM.appendChild(div);
            }
            else{
                ref.innerDOM.style.borderRadius = "5px;"
            }
            showModal(ref.duration);
        };
    }
    set Content(val: HTMLDivElement | string) {
        this._Content = val;
        if (typeof val == "string")
            this.innerDOM.innerHTML = val;
        else
            this.innerDOM.append(val)
    }

}