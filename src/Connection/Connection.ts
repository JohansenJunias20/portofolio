import { PCFShadowMap } from 'three';
import { io, Socket } from 'socket.io-client';

interface IHash<T> {
    [details: string]: T;
}
declare var production: boolean;
declare var TURN_PORT_TLS: number;
declare var TURN_PORT: number;
declare var TURN_DOMAIN: string;
declare var TURN_USERNAME: string;
declare var TURN_PASSWORD: string;
declare var WS_PORT: number;
declare var WS_DOMAIN: string;
export default class Connection {
    // myPeers: IHash<RTCPeerConnection>;
    remotePeers: IHash<RTCPeerConnection>;
    DataChannels: IHash<RTCDataChannel>;
    remoteDataChannels: IHash<RTCDataChannel>;
    ready: boolean
    signalling: Socket;
    id: string;
    config: any;
    pending_candidates: Array<RTCIceCandidateInit>;
    constructor() {
        const ref = this;
        this.ready = false;
        this.remotePeers = {}
        this.DataChannels = {};
        this.remoteDataChannels = {}
        this.playerCount = 0;
        this.pending_candidates = []
        this.config = {
            iceServers: [
                { urls: "stun:stun.budgetphone.nl:3478" },
                { urls: `turn:${TURN_DOMAIN}:${location.protocol == "https" ? TURN_PORT_TLS : TURN_PORT}`, credential: TURN_PASSWORD, username: TURN_USERNAME, user: TURN_USERNAME }]
        }
        console.log("url ws:")
        console.log(`${location.protocol == "https" ? "wss" : "ws"}://${WS_DOMAIN}:${WS_PORT}`)
        const signalling = io(`${location.protocol == "https" ? "wss" : "ws"}://${WS_DOMAIN}:${WS_PORT}`, { secure: location.protocol == "https" });
        this.signalling = signalling;


        ref.signalling.on("join", (id: string) => {
            const tempPeer = new RTCPeerConnection(ref.config)

            tempPeer.onicecandidate = ({ candidate }) => {
                console.log("giving candidate...");
                ref.signalling.emit("candidate", { id, candidate });
            }



            tempPeer.onnegotiationneeded = async () => {
                var offer_desc = await tempPeer.createOffer()
                await tempPeer.setLocalDescription(offer_desc);
                ref.signalling.emit("offer", { id, sdp: tempPeer.localDescription }); //broadcast to others except me
            }




            // const tempDataChannel = tempPeer.createDataChannel("main", { ordered: false, maxRetransmits: 0 });
            // tempDataChannel.onopen = () => {
            //     ref.ready = true;
            // }
            // tempDataChannel.onmessage = ref.recieve.bind(ref);
            // ref.DataChannels[id] = tempDataChannel;
            ref.remotePeers[id] = tempPeer;
            if (ref.onnewplayer)
                ref.onnewplayer(id)

            ref.signalling.emit("rm_ready", id)

        })
        ref.signalling.on("candidate", async ({ id, candidate }) => {
            if (!candidate) return;
            if (ref.remotePeers.hasOwnProperty(id)) { //mencegah console error saja, tanpa if ini sebenarnya juga bisa tapi entah knapa error
                console.log({ candidate })
                await ref.remotePeers[id].addIceCandidate(candidate)
            }
            else {
                ref.pending_candidates.push(candidate);
                console.log("there is pending candidate")
            }
        })
        ref.signalling.on("offer", async ({ id, sdp }: { id: string, sdp: RTCSessionDescription }) => {

            const tempPeer = ref.remotePeers[id];
            await tempPeer.setRemoteDescription(sdp)
            var answer_desc = await tempPeer.createAnswer()
            await tempPeer.setLocalDescription(answer_desc);
            ref.signalling.emit("answer", { id, sdp: tempPeer.localDescription });
            this.remotePeers[id] = tempPeer;

        })

        ref.signalling.on("answer", async ({ id, sdp }) => {
            console.log("my offered answered")
            await ref.remotePeers[id].setRemoteDescription(sdp);
        })

        ref.signalling.on("left", id => {
            //bila belum emit join maka bisa jadi remotePeers belum dibuat
            if (ref.remotePeers.hasOwnProperty(id)) {
                ref.remotePeers[id].close();
                delete ref.remotePeers[id];

            }
            else {
                return; //nothing to delete
            }
            delete ref.remotePeers[id];
            if (ref.DataChannels.hasOwnProperty(id)) {
                ref.DataChannels[id].close();
                delete ref.DataChannels[id];
            }
            if (ref.remoteDataChannels.hasOwnProperty(id)) {
                ref.remoteDataChannels[id].close();
                delete ref.remoteDataChannels[id]

            }
            ref.onleft(id);
        })

        //hanya ketrigger 1x saat pertama x join room
        ref.signalling.on("rm_ready", (player_id: string) => {
            const tempPeer = new RTCPeerConnection(ref.config)

            tempPeer.onicecandidate = ({ candidate }) => {
                console.log("giving candidate to other player..")
                ref.signalling.emit("candidate", { id: player_id, candidate });
            }


            tempPeer.ondatachannel = (e) => {
                ref.remoteDataChannels[player_id] = e.channel;
                // ref.remoteDataChannel = e.channel;
                const dc = e.channel;
                e.channel.onopen = (e) => {
                    ref.ready = true;
                }
                e.channel.onmessage = ref.recieve.bind(ref);
            };
            ref.remotePeers[player_id] = tempPeer;
            ref.signalling.emit("cl_ready", player_id);

            ref.onnewplayer(player_id);
        })
        ref.signalling.on("cl_ready", id => {
            ref.DataChannels[id] = ref.remotePeers[id].createDataChannel("main", { ordered: false, maxRetransmits: 0 });
            ref.DataChannels[id].onopen = () => {
                ref.ready = true;
            }
            ref.DataChannels[id].onmessage = ref.recieve.bind(ref);
        })
        ref.signalling.on("player_count", count => {
            ref.playerCount = count;
        })
        ref.signalling.on("id", id => {
            ref.id = id;
        })
    }
    public playerCount: number;
    public connect() {
        this.signalling.emit("join");
        this.signalling.emit("player_count");//get player count

    }
    onleft: (id: string) => any;
    onnewplayer: (id: string) => any;
    onrecieve: (e: any) => any;
    private recieve(e: any) {
        if (this.onrecieve)
            this.onrecieve(e);
    }
    public send(message: any) {
        if (!this.ready) return;

        message = JSON.stringify(message);
        for (var key in this.DataChannels) {
            if (this.DataChannels[key].readyState == "open") {
                this.DataChannels[key].send(message);
            }
        }
        for (var key in this.remoteDataChannels) {
            if (this.remoteDataChannels[key].readyState == "open") {
                this.remoteDataChannels[key].send(message);
            }
        }

        // this.DataChannels.send(message);
        // console.log({ length: this.remoteDataChannels.length })
        // for (let i = 0; i < this.remoteDataChannels.length; i++) {
        //     const element = this.remoteDataChannels[i];
        //     element.send(message)
        // }
        // this.otherDataChannel.forEach(dc => {
        //     dc.send(message);
        // })

    }
}