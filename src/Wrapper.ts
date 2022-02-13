
//Wrapper class adalah parent class dari class yang berperan sebagai wrapper yaitu kumpulan list/array objects dari 
//children classnya physics3dObject atau MeshOnlyObject3d
//contoh class yang punya parent Wrapper: NavigationBoards, Dbs, Statues, Playgrounds
//Wrapper juga bisa berperan sebagai parent dari sebuah class sebagai wrapper dari kumpulan list/array Wrapper.

import Billboard from "./Billboards/Billboard";
import Loading from "./Loading/Loading";
import MeshOnlyObject3d from "./MeshOnlyObject";
import PhysicsObject3d from "./PhysicsObject";
import { WaveEffect } from "./waveEffect";

//T extends A | B artinya T bisa typesnya A atau B
export default class Wrapper<T extends PhysicsObject3d | MeshOnlyObject3d>{ //karena Billboard memiliki sruktur class yg unik
    public waveEffect: WaveEffect
    public keys: Array<T>;
    public initialized: boolean;
    constructor(keys: Array<T> = []) {
        this.keys = keys;
        this.initialized = false;
        this.counter = 0;
    }
    public async init(loading: Loading | null = null, onEachInitialized: (key: T) => void = null) {
        const ref = this;
        var promises = [];
        for (let i = 0; i < this.keys.length; i++) {
            const keys = this.keys[i];
            promises.push(keys.init(loading));
        }
        // promises = this.keys.map(keys => keys.init);
        await Promise.all(promises);
        this.initialized = true;
        if (this.onKeysInitialized)
            this.onKeysInitialized();
        return;
    }
    public onKeysInitialized: () => void;
    public counter: number;
    // protected isAllInitialized() {
    //     const initialized = this.keys.filter(key => key.initialized == true).length;
    //     if (initialized == this.keys.length || this.counter == this.keys.length) {
    //         this.initialized = true;
    //         if (this.onKeysInitialized)
    //             this.onKeysInitialized();
    //         return true;
    //     }
    //     return false;
    // }

    public update(deltatime: number) {
        this.keys.forEach(key => {
            key.update(deltatime);
        })
    }
    public prepare() {
        this.keys.forEach(key => {
            key.prepare();
        })
    }
    public async loadAsset() {
        var promises = this.keys.map(_ => _.loadAsset());
        await Promise.all(promises);
    }
    public setWaveEffect(waveEffect: WaveEffect) {
        this.keys.forEach(key => {
            key.waveEffect = waveEffect;
        })
    }
}