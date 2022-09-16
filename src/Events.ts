


export default class Events {
    public readonly events: {
        [name: string]: Event
    };
    constructor() {
        this.events = {}
    }
    public addEvent(name: string) {
        if (this.events[name]) return;
        const event = new Event(name);
        this.events[name] = event;
    }
    public addEventListener(name: string, callback: (...args: any) => void) {
        
    }
}