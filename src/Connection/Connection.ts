import { PCFShadowMap } from 'three';
import { io, Socket } from 'socket.io-client';

interface IHash<T> {
    [details: string]: T;
}
export default class Connection {
    // myPeers: IHash<RTCPeerConnection>;
    remotePeers: IHash<RTCPeerConnection>;
    DataChannels: IHash<RTCDataChannel>;
    remoteDataChannels: IHash<RTCDataChannel>;
    ready: boolean
    signalling: Socket;
    id: string;
    config: any;
    constructor() {
        const ref = this;
        this.ready = false;
        this.remotePeers = {}
        this.DataChannels = {};
        this.remoteDataChannels = {}
        this.playerCount = 0;
        this.config = {
            iceServers: [
                { urls: "stun:stun.budgetphone.nl:3478" },
                { urls: "turn:admin.orbitskomputer.com:3478", credential: "somepassword", username: "guest", user: "guest" }]
        }
        const signalling = io(`ws://admin.orbitskomputer.com:2000`);
        this.signalling = signalling;


        ref.signalling.on("join", (id: string) => {

            const tempPeer = new RTCPeerConnection(ref.config)

            tempPeer.onicecandidate = ({ candidate }) => {
                ref.signalling.emit("candidate", { id, candidate });
            }



            tempPeer.onnegotiationneeded = async () => {
                var offer_desc = await tempPeer.createOffer()
                await tempPeer.setLocalDescription(offer_desc);
                ref.signalling.emit("offer", { id, sdp: tempPeer.localDescription }); //broadcast to others except me
            }




            const tempDataChannel = tempPeer.createDataChannel("main", { ordered: false, maxRetransmits: 0 });
            tempDataChannel.onopen = () => {
                alert("open")
                ref.ready = true;
            }
            tempDataChannel.onmessage = ref.recieve.bind(ref);
            ref.DataChannels[id] = tempDataChannel;
            ref.remotePeers[id] = tempPeer;
            if (ref.onnewplayer)
                ref.onnewplayer(id)

        })
        ref.signalling.on("candidate", async ({ id, candidate }) => {
            if (ref.remotePeers.hasOwnProperty(id)) { //mencegah console error saja, tanpa if ini sebenarnya juga bisa tapi entah knapa error
                console.log({ candidate })
                await ref.remotePeers[id].addIceCandidate(candidate)
            }
        })
        ref.signalling.on("offer", async ({ id, sdp }: { id: string, sdp: RTCSessionDescription }) => {

            const tempPeer = new RTCPeerConnection(ref.config)

            tempPeer.onicecandidate = ({ candidate }) => {
                console.log("giving candidate to other player..")
                ref.signalling.emit("candidate", { id, candidate });
            }


            console.log(`recieving ${sdp.type} from ${id}`);
            tempPeer.ondatachannel = (e) => {
                ref.remoteDataChannels[id] = e.channel;
                // ref.remoteDataChannel = e.channel;
                const dc = e.channel;
                e.channel.onopen = (e) => {
                    ref.ready = true;

                }
                e.channel.onmessage = this.recieve.bind(ref);
            };

            await tempPeer.setRemoteDescription(sdp)
            var answer_desc = await tempPeer.createAnswer()
            await tempPeer.setLocalDescription(answer_desc);
            ref.signalling.emit("answer", { id, sdp: tempPeer.localDescription });
            this.remotePeers[id] = tempPeer;
            console.log("pushing new peers")
        })

        ref.signalling.on("answer", async ({ id, sdp }) => {
            console.log("my offered answered")
            await ref.remotePeers[id].setRemoteDescription(sdp);
        })

        ref.signalling.on("left", id => {
            //bila belum emit join maka bisa jadi remotePeers belum dibuat
            if (ref.remotePeers.hasOwnProperty(id)) {
                ref.remotePeers[id].close();
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
        })

        //hanya ketrigger 1x saat pertama x join room
        ref.signalling.on("players", (players: IHash<boolean>) => {
            console.log({ players })
            alert(players)
            for (var key in players) {
                if (key)
                    ref.onnewplayer(key);
            }
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
            this.DataChannels[key].send(message);
        }
        for (var key in this.remoteDataChannels) {
            this.remoteDataChannels[key].send(message);
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