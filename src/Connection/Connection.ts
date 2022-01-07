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
    constructor() {
        const ref = this
        this.ready = false;
        this.remotePeers = {}
        this.DataChannels = {};
        this.remoteDataChannels = {}
        const config = {

        }
        const signalling = io(`ws://localhost:2000`);
        this.signalling = signalling;


        ref.signalling.on("join", (id: string) => {

            const tempPeer = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:stun.budgetphone.nl:3478" },
                    { urls: "turn:admin.orbitskomputer.com:3478", credential: "somepassword", username: "guest" }]
            })

            tempPeer.onicecandidate = ({ candidate }) => {
                console.log(`sending candidate`);
                console.log({ candidate })
                ref.signalling.emit("candidate", { id, candidate });
            }



            tempPeer.onnegotiationneeded = async () => {
                var offer_desc = await tempPeer.createOffer()
                await tempPeer.setLocalDescription(offer_desc);
                ref.signalling.emit("offer", { id, sdp: tempPeer.localDescription }); //broadcast to others except me
            }




            const tempDataChannel = tempPeer.createDataChannel("main", { ordered: false, maxRetransmits: 0 });
            tempDataChannel.onopen = () => {
                ref.ready = true;
                alert("ready mydatachannel")
            }
            tempDataChannel.onmessage = ref.recieve;
            ref.DataChannels[id] = tempDataChannel;
            ref.remotePeers[id] = tempPeer;
            console.log("pushing new peers")



        })
        ref.signalling.on("candidate", async ({ id, candidate }) => {
            console.log(`recieve candidate from ${id}`);
            console.log({ peers: ref.remotePeers });
            console.log({ candidate: JSON.stringify(candidate) })
            console.log({ currentPeer: ref.remotePeers[id] })
            await ref.remotePeers[id].addIceCandidate(candidate)
        })
        ref.signalling.on("offer", async ({ id, sdp }: { id: string, sdp: RTCSessionDescription }) => {

            const tempPeer = new RTCPeerConnection({
                iceServers: [
                    { urls: "stun:stun.budgetphone.nl:3478" },
                    { urls: "turn:admin.orbitskomputer.com:3478", credential: "somepassword", username: "guest" }]
            })

            tempPeer.onicecandidate = ({ candidate }) => {
                console.log(`sending candidate`);
                console.log({ candidate })
                ref.signalling.emit("candidate", { id, candidate });
            }


            console.log(`recieving ${sdp.type} from ${id}`);
            tempPeer.ondatachannel = (e) => {
                ref.remoteDataChannels[id] = e.channel;
                // ref.remoteDataChannel = e.channel;
                const dc = e.channel;
                e.channel.onopen = (e) => {
                    ref.ready = true;
                    alert("ready remotedatachannel")

                }
                e.channel.onmessage = this.recieve;
            };

            await tempPeer.setRemoteDescription(sdp)
            var answer_desc = await tempPeer.createAnswer()
            await tempPeer.setLocalDescription(answer_desc);
            ref.signalling.emit("answer", { id, sdp: tempPeer.localDescription });
            this.remotePeers[id] = tempPeer;
            console.log("pushing new peers")
        })

        ref.signalling.on("answer", async ({ id, sdp }) => {
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
    }
    public connect() {
        this.signalling.emit("join");


    }
    public recieve(e: any) {
        alert(e.data)
    }
    public send(message: string) {
        if (!this.ready) return;
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