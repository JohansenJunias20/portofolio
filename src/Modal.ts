import * as THREE from "three";

declare var hideModal: () => void;
declare var showModal: () => void;
export default class Modal {
    public parentDOM: HTMLDivElement
    private innerDOM: HTMLDivElement
    public size: "small" | "large" | "full";
    public close: () => void
    public open: () => void
    private _Content: HTMLElement | string
    constructor(content: HTMLElement | string, size: "small" | "large" | "full" = "large") {
        this._Content = content;
        this.size = size;
        this.parentDOM = document.querySelector("#modal")
        this.innerDOM = document.querySelector("#modal_content")
        this.close = hideModal;
        const ref = this;
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
            else if (size == "full"){
                ref.innerDOM.style.minWidth = "";
                ref.innerDOM.style.maxWidth = "";
                ref.innerDOM.style.height = "100%";
                ref.innerDOM.style.width = "100%";
                ref.innerDOM.style.padding ="0";
                
                // ref.innerDOM.style.width = window.innerWidth + "px";
            }
            showModal();
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