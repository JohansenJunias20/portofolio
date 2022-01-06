import { PCFShadowMap } from 'three';
import { io, Socket } from 'socket.io-client';


export default class Connection {
    myPeer: RTCPeerConnection;
    DataChannels: Array<RTCDataChannel>;
    remoteDataChannels: Array<RTCDataChannel>;
    ready: boolean
    signalling: Socket;
    constructor() {
        this.ready = false;
        this.DataChannels = [];
        this.remoteDataChannels = [];
        const config = {

        }
        const signalling = io(`ws://localhost:2000`);
        this.signalling = signalling;
        this.myPeer = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.budgetphone.nl:3478" },
                { urls: "turn:admin.orbitskomputer.com:3478", credential: "somepassword", username: "guest" }]
        })
        const ref = this

        this.myPeer.onicecandidate = ({ candidate }) => {
            console.log(`sending candidate`);
            console.log({ candidate })
            ref.signalling.emit("candidate", { candidate });
        }

        ref.signalling.on("candidate", async ({ candidate }) => {
            console.log(`recieve candidate`);
            console.log({ candidate: JSON.stringify(candidate) })
            ref.myPeer.addIceCandidate(candidate)
        })

        this.myPeer.onnegotiationneeded = async () => {
            console.log("negotiation needed")
            console.log("creating offer")
            var offer_desc = await ref.myPeer.createOffer()
            await ref.myPeer.setLocalDescription(offer_desc);
            ref.signalling.emit("offer", ref.myPeer.localDescription); //broadcast to others except me
        }

        ref.signalling.on("offer", async (offer_desc: RTCSessionDescription) => {
            console.log(`recieving ${offer_desc.type}`);
            if (offer_desc.type == "offer") {
                ref.myPeer.ondatachannel = (e) => {
                    ref.remoteDataChannels.push(e.channel);
                    // ref.remoteDataChannel = e.channel;
                    const dc = e.channel;
                    e.channel.onopen = (e) => {
                        ref.ready = true;
                        alert("ready remotedatachannel")

                    }
                    e.channel.onmessage = this.recieve;
                };

                await ref.myPeer.setRemoteDescription(offer_desc)
                var answer_desc = await ref.myPeer.createAnswer()
                await ref.myPeer.setLocalDescription(answer_desc);
                ref.signalling.emit("offer", ref.myPeer.localDescription);
            }
            else if (offer_desc.type == "answer") {
                await ref.myPeer.setRemoteDescription(offer_desc);
            }




        })

        ref.signalling.on("join", () => {
            console.log("someone join")
            const tempDataChannel = ref.myPeer.createDataChannel("main", { ordered: false, maxRetransmits: 0 });
            tempDataChannel.onopen = () => {
                ref.ready = true;
                alert("ready mydatachannel")
            }
            tempDataChannel.onmessage = ref.recieve;
            ref.DataChannels.push(tempDataChannel);



        })
    }
    public connect() {
        this.signalling.emit("join");


    }
    public recieve(e: any) {
        alert(e.data)
        console.log(e);
    }
    public send(message: string) {
        if (!this.ready) return;
        console.log(`mydatachannel:`, this.DataChannels)
        console.log(`remotedatachannel:`, this.remoteDataChannels)
        for (let i = 0; i < this.DataChannels.length; i++) {
            const dataChannel = this.DataChannels[i];
            dataChannel.send(message);
        }
        for (let i = 0; i < this.remoteDataChannels.length; i++) {
            const dataChannel = this.remoteDataChannels[i];
            dataChannel.send(message);
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