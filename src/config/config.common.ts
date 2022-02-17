import * as THREE from "three";
import { Vector3 } from "three";
import * as CANNON from "cannon"

const Config = {
    camera: {
        near: 0.1,
        far: 1000,
        aspect: window.innerWidth / window.innerHeight,
        fov: 45,
        speed: {
            pan: 0.035,
            to_character: 0.3 //whenever camera unfocused and then character move
        }
    },
    waveEffect: {
        speed: 100,
        originPos: 0,
        range: {
            start: 0,
            max: 3000
        },
        overshoot: 2
    },
    invisibleEffect: {
        speed: 6
    },
    world: {
        gravity: new CANNON.Vec3(0, -10, 0),
        iteration: 40, //fps,
        step: 1 / 30
    },
    ground: {
        size: new CANNON.Vec3(1000, 0.5, 1000),
        friction: 1,
        restitution: 0.1
    },
    lights: {
        ambient: {
            power: 0.75,
            color: 0xffffff
        },
        sun: {
            power: 0.5,
            color: 0xffffff,
            position: new THREE.Vector3(0, 100, 100),
            target: new THREE.Vector3(0, 0, 0)
        }
    },
    area: {
        lobby: {
            offset: 0,
            camera: {
                offset: new Vector3(25, 35, 30),
                transition: {
                    type: "linear",
                    speed: 1
                },
            },

        },
        knowledge: {
            offset: 100,
            camera: {
                offset: new Vector3(15, 20, 35),
                transition: {
                    type: "linear",
                    speed: 1
                },
            }
        },
        portofolio: {
            offset: 40,
            camera: {
                offset: new Vector3(5, 40, 20),
                transition: {
                    type: "linear",
                    speed: 1
                },
            }
        },
        playground: {
            offset: -40,
            camera: {
                offset: new Vector3(15, 35, 50),
                transition: {
                    type: "linear",
                    speed: 1
                },
            }
        }
    }
}

export default Config;