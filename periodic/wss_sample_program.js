
const io =require( 'socket.io-client')
let socket = io('wss://pubwss.bithumb.com/pub/ws')

// 웹소켓 연결
function connectWS() {
	if(socket != undefined){		socket.close();
	}
	console.log("connecting ...") // ,$('#url').val());
		socket.on('connect', 	(e)=>{ console.log("connect..."); })
	socket.on('open', 	(e)=>{ console.log("onopen..."); })
	socket.on('close',(e)=>{ console.log("onclose..."); $('#session_id').val(''); socket = undefined; })
	socket.on('message',(e)=>{ console.log("onmessage...", e.data); }		)
}

// 웹소켓 연결 해제
function closeWS() {
    if(socket != undefined){
        console.log("closing requested");
        socket.close();
        socket = undefined;
    }	
}

// 웹소켓 요청
function filterRequest( filter) {
        if(socket == undefined){
            alert('no connect exists');
            return;
        }
//				socket.send(filter);
				socket.emit(filter);
}

function test() {
	connectWS();
	filterRequest('{"type":"ticker","symbols":["BTC_KRW","ETH_KRW","FNB_KRW","PCM_KRW","WET_KRW","ZRX_KRW"],"tickTypes":["1H","6H"]}');
	// ......
//	closeWS();
}

// run test()
test();