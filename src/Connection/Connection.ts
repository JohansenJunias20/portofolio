import { PCFShadowMap } from 'three';
import { io, Socket } from 'socket.io-client';
import getCountry from '../utility/getCountry';
import capitalizeFirstLetter from '../utility/UpperCaseFirstLetter';

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
    connected: boolean;
    constructor() {
        const ref = this;
        this.AM_I_RM = false;
        this.boardDOM = document.querySelector("#board");
        this.connected = false;
        this.ready = false;
        this.remotePeers = {}
        this.DataChannels = {};
        this.remoteDataChannels = {}
        this.playerCount = 0;
        this.pending_candidates = []
        this.config = {
            iceServers: [
                { urls: "stun:stun.budgetphone.nl:3478" },
                { urls: `turn:${TURN_DOMAIN}:${location.protocol == "https:" ? TURN_PORT_TLS : TURN_PORT}`, secure: false, credential: TURN_PASSWORD, username: TURN_USERNAME, user: TURN_USERNAME }]
        }

        const signalling = io(`${production ? "wss" : "ws"}://${WS_DOMAIN}:${WS_PORT}`, { secure: production });
        this.connected = true;
        this.signalling = signalling;

        //check if I'm the first to connect?
        ref.signalling.on("first?", () => {
            ref.AM_I_RM = true;
        })

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
                await ref.remotePeers[id].addIceCandidate(candidate)
            }
            else {
                ref.pending_candidates.push(candidate);
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
        ref.signalling.on("initialized", () => {
            ref.initCountry();
        })
        ref.signalling.on("players", async (players: { [socketid: string]: { guest_id: string, countryCode?: string } }) => { // whenever socket connected to server, server rebroadcast players
            ref.players = players;
            ref.updateBillboard();
            // ref.playerCount = count;
        })
        ref.signalling.on("id", id => {
            ref.id = id;
        })
    }
    public boardDOM: HTMLDivElement;
    public AM_I_RM: boolean;
    public playerCount: number;
    private connectSignal: boolean;
    private __myCountryCode: string;
    get myCountryCode(): string {
        return this.__myCountryCode;
    }
    set myCountryCode(value: string) {
        this.__myCountryCode = value;
        this.updateBillboard();
    }
    public connect() {
        this.connectSignal = true; //memberi tahu kpd signal "first?" bahwa fungsi connect() sudah kepanggil
        // console.log("fs from connect", this.firstSignal)
        // console.log("1connecting...")

        if (this.AM_I_RM) return; //jika RM maka tidak perlu emit join, biarkan CL(client) yang join
        this.signalling.emit("join");

    }

    async initCountry() {
        var response = await getCountry();
        this.myCountryCode = response.countryCode; // trigger updateBillboard()
        this.signalling.emit("country", response.countryCode);
    }
    players: { [socketid: string]: { guest_id: string, countryCode?: string } }
    onleft: (id: string) => any;
    onnewplayer: (id: string) => any;
    onrecieve: (e: any) => any;
    private recieve(e: any) {
        if (this.onrecieve)
            this.onrecieve(e);
    }
    public updateBillboard() {
        const playerCount = Object.keys(this.players).length;
        const ref = this;
        var html = `<div id="title_board" style="font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;font-weight:normal;text-align: center;">${playerCount} users</div>`;
        html += "<div style='overflow-y:auto; max-height:200px'></div>";
        for (var key in ref.players) {
            const player = ref.players[key];
            var a: string = '';
            if (key == ref.id)
                a = `<div 
                    style="cursor:pointer;color:#fff700;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                    font-weight:normal;text-align:left;">guest${player.guest_id}
                    ${ref.myCountryCode &&
                    `<img
                        src="https://flagcdn.com/16x12/${this.myCountryCode.toLowerCase()}.png"
                        srcset="https://flagcdn.com/32x24/${this.myCountryCode.toLowerCase()}.png 2x,
                        https://flagcdn.com/48x36/${this.myCountryCode.toLowerCase()}.png 3x"
                        width="16"
                        height="12"
                        alt="indonesia flag">`
                    }
                    </div>`
            else
                a = `<div style="cursor:pointer;color:white;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-weight:normal;text-align:left;">guest${player.guest_id}
                   ${player.countryCode ?
                        `<img
                    src="https://flagcdn.com/16x12/${player.countryCode.toLowerCase()}.png"
                    srcset="https://flagcdn.com/32x24/${player.countryCode.toLowerCase()}.png 2x,
                      https://flagcdn.com/48x36/${player.countryCode.toLowerCase()}.png 3x"
                    width="16"
                    height="12"
                    alt="indonesia flag">` : ``
                    }

                    </div>`
            html = `${html}${a}`;
        }
        html += "</div>"
        ref.boardDOM.innerHTML = html;
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