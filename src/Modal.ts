declare var hideModal: () => void;
declare var showModal: () => void;
export default class Modal {
    public parentDOM: HTMLDivElement
    private innerDOM: HTMLDivElement
    public close: () => void
    public open: () => void
    private _Content: HTMLElement | string
    constructor(content: HTMLElement | string) {
        this._Content = content;
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
            console.log({ content: ref._Content })
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