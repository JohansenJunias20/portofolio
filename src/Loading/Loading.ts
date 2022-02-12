

export default class Loading {
    constructor() {
        this.DOMmodal = document.querySelector("#progressModal");
        this.DOMtext = document.querySelector("#progressText");
        this.DOMbar = document.querySelector("#progressBar");

        this.progress = 0;// 0 - 100
    }
    private DOMmodal: HTMLElement;
    private DOMtext: HTMLElement;
    private DOMbar: HTMLElement;
    private progress: number;
    onfull: () => void;
    isFull() {
        return this.progress == 100;
    }
    isEmpty() {
        return this.progress == 0;
    }
    show() {
        this.DOMmodal.style.display = "flex";
    }
    hide() {
        this.DOMmodal.style.display = "none";
    }
    setProgress(progress: number) {
        this.progress = progress;
        this.DOMbar.style.width = `${progress}%`;
        this.check();
    }
    addProgress(progress: number) {
        this.progress += progress;
        this.DOMbar.style.width = `${this.progress}%`;
        this.check();
    }
    setText(text: string) {
        this.DOMtext.innerHTML = text;
    }
    private check() {
        if (this.isFull()) {
            const ref = this;
            if (this.onfull)
                this.onfull();
            ref.hide()
            // setTimeout(() => {
            // }, 500);
        }
    }
}