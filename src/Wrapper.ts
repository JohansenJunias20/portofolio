
//Wrapper class adalah parent class dari class yang berperan sebagai wrapper yaitu kumpulan list/array objects dari 
//children classnya physics3dObject atau MeshOnlyObject3d
//contoh class yang punya parent Wrapper: NavigationBoards, Dbs, Statues, Playgrounds
//Wrapper juga bisa berperan sebagai parent dari sebuah class sebagai wrapper dari kumpulan list/array Wrapper.

import Billboard from "./Billboards/Billboard";
import Loading from "./Loading/Loading";
import MeshOnlyObject3d from "./MeshOnlyObject";
import PhysicsObject3d from "./PhysicsObject";

//T extends A | B artinya T bisa typesnya A atau B
export default class Wrapper<T extends PhysicsObject3d | MeshOnlyObject3d>{ //karena Billboard memiliki sruktur class yg unik
    public keys: Array<T>;
    public initialized: boolean;
    constructor(keys: Array<T> = []) {
        this.keys = keys;
        this.initialized = false;
        this.counter = 0;
    }
    public async init(loading: Loading | null = null, onEachInitialized: (key: T) => void = null) {
        const ref = this;
        return new Promise<void>((res, rej) => {

            for (let i = 0; i < ref.keys.length; i++) {
                const key = ref.keys[i];
                key.init(loading).then(() => {
                    if (onEachInitialized)
                        onEachInitialized(key);
                    if (ref.isAllInitialized()) {
                        res();
                    }
                });

            }
        })
    }
    public onKeysInitialized: () => void;
    public counter: number;
    protected isAllInitialized() {
        const initialized = this.keys.filter(key => key.initialized == true).length;
        if (initialized == this.keys.length || this.counter == this.keys.length) {
            this.initialized = true;
            if (this.onKeysInitialized)
                this.onKeysInitialized();
            return true;
        }
        return false;
    }

    public update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }

}