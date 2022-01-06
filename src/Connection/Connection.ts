import { PCFShadowMap } from 'three';
import { io, Socket } from 'socket.io-client';


export default class Connection {
    myPeer: RTCPeerConnection;
    myDataChannel: RTCDataChannel;
    signalling: Socket;
    constructor() {
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
                    ref.myDataChannel = e.channel;
                    e.channel.onmessage = ref.recieve;
                };

                await ref.myPeer.setRemoteDescription(offer_desc);;
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
            ref.myDataChannel = ref.myPeer.createDataChannel("main", { ordered: false, maxRetransmits: 0 });




        })
    }
    public connect() {
        this.signalling.emit("join");


    }
    public recieve(e: any) {
        console.log(e);
    }
    public send(message: string) {
        // this.otherDataChannel.forEach(dc => {
        //     dc.send(message);
        // })

    }
}