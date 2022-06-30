import { PCFShadowMap } from 'three';
import { io, Socket } from 'socket.io-client';
import getCountry from '../utility/getCountry';
import capitalizeFirstLetter from '../utility/UpperCaseFirstLetter';
import Modal from '../Modal';

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
    playerBoardDOM: HTMLDivElement;
    modalChangeNickname: Modal;
    onrecievePlayers: (players: {
        [socketid: string]: {
            guest_id: string;
            countryCode?: string;
        };
    }) => void;
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

        var div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.width = "100%";
        div.style.height = "100%";
        var title = document.createElement("h5");
        //set font to montserrat
        title.style.fontFamily = "'Montserrat', sans-serif";
        title.style.fontWeight = "bold";
        title.style.textAlign = "center";
        //set margin to 0
        title.style.margin = "0";
        title.innerHTML = "Set your nickname";
        var innerDiv = document.createElement("div");

        innerDiv.appendChild(title);
        var input = document.createElement("input");
        //make input style with game theme style
        input.style.border = "none";
        input.style.borderRadius = "5px";
        input.style.padding = "5px";
        input.style.outline = "1px solid #fac020";
        input.style.textAlign = "center";
        input.style.margin = "0";
        input.style.marginTop = "5px";
        input.style.fontFamily = "'Montserrat', sans-serif";
        input.id = "input-nickname"
        //create button with style=display:block; margin-left: auto; border-color: transparent;cursor: pointer; margin-right: auto; padding: 8px; border-radius: 3px; font-weight: bold; font-size: 1rem; background-color: #F0B93A;

        var button = document.createElement("button");
        button.style.display = "block";
        button.style.marginLeft = "auto";
        button.style.borderColor = "transparent";
        button.style.cursor = "pointer";
        button.style.marginRight = "auto";
        button.style.marginTop = "4px";
        button.style.padding = "4px";
        button.style.borderRadius = "3px";
        // button.style.fontWeight = "bold";
        // button.style.fontSize = "1rem";
        button.style.backgroundColor = "#F0B93A";
        button.innerHTML = "Set";
        button.addEventListener("click", () => {
            if (input.value.length > 0) {
                // ref.myName = input.value;
                // ref.myName = capitalizeFirstLetter(ref.myName);
                ref.signalling.emit("nickname", input.value, ({ status, reason }: any) => {
                    if (status)
                        ref.modalChangeNickname.close();
                    else
                        alert(reason);
                });
            }
            //set outline to red for few seconds
            input.style.outline = "1px solid red";
            setTimeout(() => {
                input.style.outline = "1px solid #fac020";
            }
                , 1000);
        })
        innerDiv.appendChild(input)
        innerDiv.appendChild(button);
        div.appendChild(innerDiv);
        this.modalChangeNickname = new Modal(div, "small");
        // this.modalChangeNickname.open()
        this.config = {
            iceServers: [
                { urls: "stun:stun.budgetphone.nl:3478" },
                { urls: `turn:${TURN_DOMAIN}:${location.protocol == "https:" ? TURN_PORT_TLS : TURN_PORT}`, secure: location.protocol == "https:", credential: TURN_PASSWORD, username: TURN_USERNAME, user: TURN_USERNAME }]
        }
        console.log("protocol")
        console.log(location.protocol)

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
        ref.signalling.on("players", async (players: { [socketid: string]: { guest_id: string, nickname?: string, countryCode?: string } }) => { // whenever socket connected to server, server rebroadcast players
            ref.players = players;
            //if nickname is set then automatically set the nickname directly
            if (players[ref.id].nickname)
                ref.nickname = `${players[ref.id].nickname}`;
            else
                ref.nickname = `guest${players[ref.id].guest_id}`;

            console.log({ nickname: ref.nickname })
            if (ref.onrecievePlayers)
                ref.onrecievePlayers(ref.players);
            ref.updateBillboard();
            // ref.playerCount = count;
        })
        ref.signalling.on("id", id => {
            ref.id = id;
        })
    }
    public nickname: string;
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

        if (this.AM_I_RM) return; //jika RM maka tidak perlu emit join, biarkan CL(client) yang join
        this.signalling.emit("join");

    }

    async initCountry() {
        // var response = await getCountry();
        var response = {
            countryCode: "ID"
        }
        this.myCountryCode = response.countryCode; // trigger updateBillboard()
        this.signalling.emit("country", response.countryCode);
    }
    players: { [socketid: string]: { guest_id: string, countryCode?: string, nickname?: string } }
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
        html += "<div id='players_board' style='overflow-y:auto; max-height:200px'>";
        for (var key in ref.players) {
            const player = ref.players[key];
            var a: string = '';
            if (key == ref.id)
                a = `<div socketid="${key}"
                    style="cursor:pointer;color:#fff700;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                    font-weight:normal;text-align:left;">${ref.nickname}
                    ${ref.myCountryCode &&
                    `<img
                        src="https://flagcdn.com/16x12/${this.myCountryCode.toLowerCase()}.png"
                        srcset="https://flagcdn.com/32x24/${this.myCountryCode.toLowerCase()}.png 2x,
                        https://flagcdn.com/48x36/${this.myCountryCode.toLowerCase()}.png 3x"
                        width="16"
                        height="12"
                        alt="indonesia flag">`
                    }
                    <img  id="edit"
                    src="/assets/edit.png" style="width:16px;filter: brightness(0) invert(1);" />
                    </div>`
            else
                a = `<div  socketid="${key}" 
                class="nickname_inactive">${player.nickname ? player.nickname : `guest${player.guest_id}`}
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
        //listen on edit icon click
        ref.boardDOM.innerHTML = html;
        document.querySelector("#edit").addEventListener("click", () => {
            ref.modalChangeNickname.open();
            (document.querySelector("#input-nickname") as HTMLInputElement).value = ref.nickname;
        }
        )
        ref.bindDOMlistener();
    }
    bindDOMlistener() {
        if (!this.onPlayerNameClick) return;
        this.playerBoardDOM = document.querySelector("#players_board"); // rebind-ing because updateBillboard delete the old element
        for (let i = 0; i < this.playerBoardDOM.children.length; i++) {
            const element = this.playerBoardDOM.children[i];
            if (element.id == "title_board") continue; // ini bukan player tetapi jumlah player.. kita tidak mau listen ke element ini

            const socketid = element.getAttribute("socketid");
            (element as HTMLDivElement).onclick = () => {
                this.setFocus(element.attributes.getNamedItem("socketid").value);
                this.onPlayerNameClick(this.players[socketid], socketid);
            }
        }
    }
    //set focus on users board to the active player's nickname set to white
    public setFocus(socketid: string) {
        this.playerBoardDOM = document.querySelector("#players_board"); // rebind-ing because updateBillboard delete the old element
        for (let i = 0; i < this.playerBoardDOM.children.length; i++) {
            const element = this.playerBoardDOM.children[i];
            if (element.id == "title_board") continue; // ini bukan player tetapi jumlah player.. kita tidak mau listen ke element ini

            const _socketid = element.getAttribute("socketid");
            if (this.id == _socketid) {

            }
            else if (socketid == _socketid) {
                (element as HTMLDivElement).className = "nickname_active ";
                // alert("tke")
            }
            else {
                (element as HTMLDivElement).className = "nickname_inactive ";
            }
        }
    }
    public onPlayerNameClick: (guestName: { guest_id: string, countryCode?: string }, socketid: string) => void;
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
        // for (let i = 0; i < this.remoteDataChannels.length; i++) {
        //     const element = this.remoteDataChannels[i];
        //     element.send(message)
        // }
        // this.otherDataChannel.forEach(dc => {
        //     dc.send(message);
        // })

    }
}