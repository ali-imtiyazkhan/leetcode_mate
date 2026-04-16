var en=Object.defineProperty;var tn=(n,e,t)=>e in n?en(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var F=(n,e,t)=>tn(n,typeof e!="symbol"?e+"":e,t);const L=Object.create(null);L.open="0";L.close="1";L.ping="2";L.pong="3";L.message="4";L.upgrade="5";L.noop="6";const ee=Object.create(null);Object.keys(L).forEach(n=>{ee[L[n]]=n});const we={type:"error",data:"parser error"},ht=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",ut=typeof ArrayBuffer=="function",ft=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,Te=({type:n,data:e},t,i)=>ht&&e instanceof Blob?t?i(e):ot(e,i):ut&&(e instanceof ArrayBuffer||ft(e))?t?i(e):ot(new Blob([e]),i):i(L[n]+(e||"")),ot=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function at(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let be;function nn(n,e){if(ht&&n.data instanceof Blob)return n.data.arrayBuffer().then(at).then(e);if(ut&&(n.data instanceof ArrayBuffer||ft(n.data)))return e(at(n.data));Te(n,!1,t=>{be||(be=new TextEncoder),e(be.encode(t))})}const ct="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",H=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<ct.length;n++)H[ct.charCodeAt(n)]=n;const sn=n=>{let e=n.length*.75,t=n.length,i,s=0,o,c,p,l;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const x=new ArrayBuffer(e),g=new Uint8Array(x);for(i=0;i<t;i+=4)o=H[n.charCodeAt(i)],c=H[n.charCodeAt(i+1)],p=H[n.charCodeAt(i+2)],l=H[n.charCodeAt(i+3)],g[s++]=o<<2|c>>4,g[s++]=(c&15)<<4|p>>2,g[s++]=(p&3)<<6|l&63;return x},rn=typeof ArrayBuffer=="function",Be=(n,e)=>{if(typeof n!="string")return{type:"message",data:mt(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:on(n.substring(1),e)}:ee[t]?n.length>1?{type:ee[t],data:n.substring(1)}:{type:ee[t]}:we},on=(n,e)=>{if(rn){const t=sn(n);return mt(t,e)}else return{base64:!0,data:n}},mt=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},gt="",an=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((o,c)=>{Te(o,!1,p=>{i[c]=p,++s===t&&e(i.join(gt))})})},cn=(n,e)=>{const t=n.split(gt),i=[];for(let s=0;s<t.length;s++){const o=Be(t[s],e);if(i.push(o),o.type==="error")break}return i};function ln(){return new TransformStream({transform(n,e){nn(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const o=new DataView(s.buffer);o.setUint8(0,126),o.setUint16(1,i)}else{s=new Uint8Array(9);const o=new DataView(s.buffer);o.setUint8(0,127),o.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let ye;function G(n){return n.reduce((e,t)=>e+t.length,0)}function Z(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function dn(n,e){ye||(ye=new TextDecoder);const t=[];let i=0,s=-1,o=!1;return new TransformStream({transform(c,p){for(t.push(c);;){if(i===0){if(G(t)<1)break;const l=Z(t,1);o=(l[0]&128)===128,s=l[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(G(t)<2)break;const l=Z(t,2);s=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(G(t)<8)break;const l=Z(t,8),x=new DataView(l.buffer,l.byteOffset,l.length),g=x.getUint32(0);if(g>Math.pow(2,21)-1){p.enqueue(we);break}s=g*Math.pow(2,32)+x.getUint32(4),i=3}else{if(G(t)<s)break;const l=Z(t,s);p.enqueue(Be(o?l:ye.decode(l),e)),i=0}if(s===0||s>n){p.enqueue(we);break}}}})}const bt=4;function m(n){if(n)return pn(n)}function pn(n){for(var e in m.prototype)n[e]=m.prototype[e];return n}m.prototype.on=m.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};m.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};m.prototype.off=m.prototype.removeListener=m.prototype.removeAllListeners=m.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};m.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};m.prototype.emitReserved=m.prototype.emit;m.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};m.prototype.hasListeners=function(n){return!!this.listeners(n).length};const se=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),C=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),hn="arraybuffer";function yt(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const un=C.setTimeout,fn=C.clearTimeout;function re(n,e){e.useNativeTimers?(n.setTimeoutFn=un.bind(C),n.clearTimeoutFn=fn.bind(C)):(n.setTimeoutFn=C.setTimeout.bind(C),n.clearTimeoutFn=C.clearTimeout.bind(C))}const mn=1.33;function gn(n){return typeof n=="string"?bn(n):Math.ceil((n.byteLength||n.size)*mn)}function bn(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function vt(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function yn(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function vn(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let o=t[i].split("=");e[decodeURIComponent(o[0])]=decodeURIComponent(o[1])}return e}class xn extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class Le extends m{constructor(e){super(),this.writable=!1,re(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new xn(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=Be(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=yn(e);return t.length?"?"+t:""}}class wn extends Le{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};cn(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,an(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=vt()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let xt=!1;try{xt=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const kn=xt;function _n(){}class En extends wn{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,o)=>{this.onError("xhr post error",s,o)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class B extends m{constructor(e,t,i){super(),this.createRequest=e,re(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=yt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=B.requestsCount++,B.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=_n,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete B.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}B.requestsCount=0;B.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",lt);else if(typeof addEventListener=="function"){const n="onpagehide"in C?"pagehide":"unload";addEventListener(n,lt,!1)}}function lt(){for(let n in B.requests)B.requests.hasOwnProperty(n)&&B.requests[n].abort()}const Sn=function(){const n=wt({xdomain:!1});return n&&n.responseType!==null}();class Cn extends En{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Sn&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new B(wt,this.uri(),e)}}function wt(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||kn))return new XMLHttpRequest}catch{}if(!e)try{return new C[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const kt=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Tn extends Le{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=kt?{}:yt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;Te(i,this.supportsBinary,o=>{try{this.doWrite(i,o)}catch{}s&&se(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=vt()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const ve=C.WebSocket||C.MozWebSocket;class Bn extends Tn{createSocket(e,t,i){return kt?new ve(e,t,i):t?new ve(e,t):new ve(e)}doWrite(e,t){this.ws.send(t)}}class Ln extends Le{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=dn(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=ln();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const o=()=>{i.read().then(({done:p,value:l})=>{p||(this.onPacket(l),o())}).catch(p=>{})};o();const c={type:"open"};this.query.sid&&(c.data=`{"sid":"${this.query.sid}"}`),this._writer.write(c).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&se(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const An={websocket:Bn,webtransport:Ln,polling:Cn},Rn=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,On=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function ke(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=Rn.exec(n||""),o={},c=14;for(;c--;)o[On[c]]=s[c]||"";return t!=-1&&i!=-1&&(o.source=e,o.host=o.host.substring(1,o.host.length-1).replace(/;/g,":"),o.authority=o.authority.replace("[","").replace("]","").replace(/;/g,":"),o.ipv6uri=!0),o.pathNames=In(o,o.path),o.queryKey=Nn(o,o.query),o}function In(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function Nn(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,o){s&&(t[s]=o)}),t}const _e=typeof addEventListener=="function"&&typeof removeEventListener=="function",te=[];_e&&addEventListener("offline",()=>{te.forEach(n=>n())},!1);class I extends m{constructor(e,t){if(super(),this.binaryType=hn,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=ke(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=ke(t.host).host);re(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=vn(this.opts.query)),_e&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},te.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=bt,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&I.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",I.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=gn(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,se(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const o={type:e,data:t,options:i};this.emitReserved("packetCreate",o),this.writeBuffer.push(o),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(I.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),_e&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=te.indexOf(this._offlineEventListener);i!==-1&&te.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}I.protocol=bt;class $n extends I{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;I.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",b=>{if(!i)if(b.type==="pong"&&b.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;I.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(g(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const _=new Error("probe error");_.transport=t.name,this.emitReserved("upgradeError",_)}}))};function o(){i||(i=!0,g(),t.close(),t=null)}const c=b=>{const _=new Error("probe error: "+b);_.transport=t.name,o(),this.emitReserved("upgradeError",_)};function p(){c("transport closed")}function l(){c("socket closed")}function x(b){t&&b.name!==t.name&&o()}const g=()=>{t.removeListener("open",s),t.removeListener("error",c),t.removeListener("close",p),this.off("close",l),this.off("upgrading",x)};t.once("open",s),t.once("error",c),t.once("close",p),this.once("close",l),this.once("upgrading",x),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Pn=class extends $n{constructor(e,t={}){const i=typeof e=="object"?e:t;(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(s=>An[s]).filter(s=>!!s)),super(e,i)}};function qn(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=ke(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const o=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+o+":"+i.port+e,i.href=i.protocol+"://"+o+(t&&t.port===i.port?"":":"+i.port),i}const zn=typeof ArrayBuffer=="function",Mn=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,_t=Object.prototype.toString,Dn=typeof Blob=="function"||typeof Blob<"u"&&_t.call(Blob)==="[object BlobConstructor]",Un=typeof File=="function"||typeof File<"u"&&_t.call(File)==="[object FileConstructor]";function Ae(n){return zn&&(n instanceof ArrayBuffer||Mn(n))||Dn&&n instanceof Blob||Un&&n instanceof File}function ne(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(ne(n[t]))return!0;return!1}if(Ae(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return ne(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&ne(n[t]))return!0;return!1}function Fn(n){const e=[],t=n.data,i=n;return i.data=Ee(t,e),i.attachments=e.length,{packet:i,buffers:e}}function Ee(n,e){if(!n)return n;if(Ae(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let i=0;i<n.length;i++)t[i]=Ee(n[i],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=Ee(n[i],e));return t}return n}function Vn(n,e){return n.data=Se(n.data,e),delete n.attachments,n}function Se(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=Se(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=Se(n[t],e));return n}const Hn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var u;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(u||(u={}));class jn{constructor(e){this.replacer=e}encode(e){return(e.type===u.EVENT||e.type===u.ACK)&&ne(e)?this.encodeAsBinary({type:e.type===u.EVENT?u.BINARY_EVENT:u.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===u.BINARY_EVENT||e.type===u.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Fn(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class Re extends m{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===u.BINARY_EVENT;i||t.type===u.BINARY_ACK?(t.type=i?u.EVENT:u.ACK,this.reconstructor=new Wn(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Ae(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(u[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===u.BINARY_EVENT||i.type===u.BINARY_ACK){const o=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const c=e.substring(o,t);if(c!=Number(c)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const p=Number(c);if(!Yn(p)||p<0)throw new Error("Illegal attachments");if(p>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=p}if(e.charAt(t+1)==="/"){const o=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(o,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const o=t+1;for(;++t;){const c=e.charAt(t);if(c==null||Number(c)!=c){--t;break}if(t===e.length)break}i.id=Number(e.substring(o,t+1))}if(e.charAt(++t)){const o=this.tryParse(e.substr(t));if(Re.isPayloadValid(i.type,o))i.data=o;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case u.CONNECT:return dt(t);case u.DISCONNECT:return t===void 0;case u.CONNECT_ERROR:return typeof t=="string"||dt(t);case u.EVENT:case u.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Hn.indexOf(t[0])===-1);case u.ACK:case u.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Wn{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Vn(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const Yn=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function dt(n){return Object.prototype.toString.call(n)==="[object Object]"}const Kn=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Re,Encoder:jn,get PacketType(){return u}},Symbol.toStringTag,{value:"Module"}));function T(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const Jn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class Et extends m{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[T(e,"open",this.onopen.bind(this)),T(e,"packet",this.onpacket.bind(this)),T(e,"error",this.onerror.bind(this)),T(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,o;if(Jn.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const c={type:u.EVENT,data:t};if(c.options={},c.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const g=this.ids++,b=t.pop();this._registerAckCallback(g,b),c.id=g}const p=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,l=this.connected&&!(!((o=this.io.engine)===null||o===void 0)&&o._hasPingExpired());return this.flags.volatile&&!p||(l?(this.notifyOutgoingListeners(c),this.packet(c)):this.sendBuffer.push(c)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const o=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let p=0;p<this.sendBuffer.length;p++)this.sendBuffer[p].id===e&&this.sendBuffer.splice(p,1);t.call(this,new Error("operation has timed out"))},s),c=(...p)=>{this.io.clearTimeoutFn(o),t.apply(this,p)};c.withError=!0,this.acks[e]=c}emitWithAck(e,...t){return new Promise((i,s)=>{const o=(c,p)=>c?s(c):i(p);o.withError=!0,t.push(o),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...o)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...o)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:u.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case u.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case u.EVENT:case u.BINARY_EVENT:this.onevent(e);break;case u.ACK:case u.BINARY_ACK:this.onack(e);break;case u.DISCONNECT:this.ondisconnect();break;case u.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:u.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:u.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function q(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}q.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};q.prototype.reset=function(){this.attempts=0};q.prototype.setMin=function(n){this.ms=n};q.prototype.setMax=function(n){this.max=n};q.prototype.setJitter=function(n){this.jitter=n};class Ce extends m{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,re(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new q({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||Kn;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Pn(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=T(t,"open",function(){i.onopen(),e&&e()}),o=p=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",p),e?e(p):this.maybeReconnectOnOpen()},c=T(t,"error",o);if(this._timeout!==!1){const p=this._timeout,l=this.setTimeoutFn(()=>{s(),o(new Error("timeout")),t.close()},p);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(s),this.subs.push(c),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(T(e,"ping",this.onping.bind(this)),T(e,"data",this.ondata.bind(this)),T(e,"error",this.onerror.bind(this)),T(e,"close",this.onclose.bind(this)),T(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){se(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new Et(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const V={};function ie(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=qn(n,e.path||"/socket.io"),i=t.source,s=t.id,o=t.path,c=V[s]&&o in V[s].nsps,p=e.forceNew||e["force new connection"]||e.multiplex===!1||c;let l;return p?l=new Ce(i,e):(V[s]||(V[s]=new Ce(i,e)),l=V[s]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(ie,{Manager:Ce,Socket:Et,io:ie,connect:ie});const Xn=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];class Qn{constructor({onTrack:e,onIceCandidate:t,onConnectionChange:i}){F(this,"pc");F(this,"localStream",null);F(this,"remoteStream",new MediaStream);F(this,"_screenTrack",null);this.pc=new RTCPeerConnection({iceServers:Xn}),this.pc.onicecandidate=({candidate:s})=>{s&&t(s)},this.pc.ontrack=({streams:s})=>{e(s[0])},this.pc.onconnectionstatechange=()=>{i(this.pc.connectionState)}}async startLocalMedia({audio:e=!0,video:t=!0}={}){try{return this.localStream=await navigator.mediaDevices.getUserMedia({audio:e,video:t}),this.localStream.getTracks().forEach(i=>{this.pc.addTrack(i,this.localStream)}),this.localStream}catch(i){throw i.name==="NotAllowedError"?new Error("Camera/mic permission denied"):i.name==="NotFoundError"?new Error("No camera or microphone found"):i}}async startScreenShare(){try{const e=await navigator.mediaDevices.getDisplayMedia({video:!0}),t=e.getVideoTracks()[0],i=this.pc.getSenders().find(s=>{var o;return((o=s.track)==null?void 0:o.kind)==="video"});return i&&await i.replaceTrack(t),t.onended=()=>this.stopScreenShare(),this._screenTrack=t,e}catch{throw new Error("Screen share cancelled or denied")}}async stopScreenShare(){if(!this._screenTrack)return;this._screenTrack.stop(),this._screenTrack=null;const t=(await navigator.mediaDevices.getUserMedia({video:!0})).getVideoTracks()[0],i=this.pc.getSenders().find(s=>{var o;return((o=s.track)==null?void 0:o.kind)==="video"});i&&await i.replaceTrack(t)}async createOffer(){const e=await this.pc.createOffer();return await this.pc.setLocalDescription(e),e}async handleOffer(e){await this.pc.setRemoteDescription(new RTCSessionDescription(e));const t=await this.pc.createAnswer();return await this.pc.setLocalDescription(t),t}async handleAnswer(e){await this.pc.setRemoteDescription(new RTCSessionDescription(e))}async addIceCandidate(e){try{await this.pc.addIceCandidate(new RTCIceCandidate(e))}catch(t){console.warn("Failed to add ICE candidate:",t)}}toggleAudio(e){var t;(t=this.localStream)==null||t.getAudioTracks().forEach(i=>i.enabled=e)}toggleVideo(e){var t;(t=this.localStream)==null||t.getVideoTracks().forEach(i=>i.enabled=e)}destroy(){var e,t;(e=this.localStream)==null||e.getTracks().forEach(i=>i.stop()),(t=this._screenTrack)==null||t.stop(),this.pc.close()}}const xe="https://codemate-server-f3es.onrender.com";function Gn(){const n=window.location.pathname.match(/\/problems\/([^/]+)/);return n?n[1]:null}function Zn(){let n=localStorage.getItem("codemate_uid");return n||(n="user_"+crypto.randomUUID().replace(/-/g,"").slice(0,12),localStorage.setItem("codemate_uid",n)),n}function ei(){return`
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .card {
        background: #282828;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 0;
        min-width: 300px;
        max-width: 340px;
        color: #eff2f6;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 13px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }

      .brand {
        font-size: 12px;
        font-weight: 700;
        color: #ffa116;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      .presence {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #1a1a1a;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 4px;
      }

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2cbb5d;
        box-shadow: 0 0 10px rgba(44, 187, 93, 0.4);
        animation: pulse 2.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.9); }
      }

      .count-wrap { display: flex; align-items: baseline; gap: 6px; }
      .count { font-size: 20px; font-weight: 700; color: #eff2f6; line-height: 1; }
      .count-label { font-size: 12px; color: #8a8a8e; }

      .divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.06);
        margin: 14px 0;
      }

      .btn {
        width: 100%;
        padding: 10px 14px;
        border-radius: 8px;
        border: none;
        background: #ffa116;
        color: #1a1a1a;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn:hover:not(:disabled) { background: #ffb84d; transform: translateY(-1px); }
      .btn:active:not(:disabled) { transform: translateY(0); }
      .btn:disabled { background: #3e3e3e; color: #8a8a8e; cursor: not-allowed; }
      
      .btn.secondary {
        background: #3e3e3e;
        color: #eff2f6;
        margin-top: 8px;
      }
      .btn.secondary:hover:not(:disabled) { background: #4a4a4a; }
      
      .btn.danger { background: #ef4743; color: #fff; margin-top: 8px; }
      .btn.danger:hover:not(:disabled) { background: #f85e5a; }

      .status {
        font-size: 11px;
        color: #8a8a8e;
        margin-top: 10px;
        text-align: center;
        min-height: 16px;
      }
      .status.success { color: #2cbb5d; }
      .status.error { color: #ef4743; }

      .incoming-banner {
        background: rgba(255, 161, 22, 0.1);
        border: 1px solid rgba(255, 161, 22, 0.2);
        border-radius: 10px;
        padding: 12px;
        margin-top: 12px;
        display: none;
      }
      .incoming-banner.visible { display: block; }
      .incoming-name { font-weight: 600; color: #ffa116; font-size: 13px; }
      .incoming-actions { display: flex; gap: 8px; margin-top: 10px; }
      .incoming-actions .btn { margin-top: 0; padding: 8px; font-size: 12px; }

      .chat-wrap { display: none; margin-top: 12px; }
      .chat-wrap.open { display: block; }

      .chat-partner {
        font-size: 11px;
        color: #8a8a8e;
        margin-bottom: 8px;
        text-align: center;
      }
      .chat-partner span { color: #ffa116; font-weight: 600; }

      .chat-box {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        padding: 10px;
        height: 180px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
        scrollbar-width: thin;
        scrollbar-color: #3e3e3e transparent;
      }

      .msg {
        font-size: 12px;
        line-height: 1.5;
        padding: 6px 12px;
        border-radius: 14px;
        max-width: 85%;
        word-break: break-word;
      }
      .msg.me {
        background: #ffa116;
        color: #1a1a1a;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .msg.them {
        background: #3e3e3e;
        color: #eff2f6;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }

      .typing-indicator {
        font-size: 11px;
        color: #8a8a8e;
        padding: 4px 10px;
        font-style: italic;
        display: none;
      }
      .typing-indicator.visible { display: block; }

      .chat-input-row {
        display: flex;
        gap: 8px;
        margin-top: 10px;
      }
      .chat-input-row input {
        flex: 1;
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 12px;
        color: #eff2f6;
        font-size: 12px;
        outline: none;
        transition: border-color 0.2s;
      }
      .chat-input-row input:focus { border-color: #ffa116; }
      .chat-input-row button {
        background: #3e3e3e;
        border: none;
        border-radius: 8px;
        padding: 8px 14px;
        color: #eff2f6;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .chat-input-row button:hover { background: #4a4a4a; }

      .minimize-btn {
        background: none;
        border: none;
        color: #8a8a8e;
        cursor: pointer;
        font-size: 18px;
        line-height: 1;
        padding: 4px;
        transition: color 0.2s;
      }
      .minimize-btn:hover { color: #eff2f6; }

      /* Call UI Styles */
      .call-wrap { display: none; margin-top: 12px; }
      .call-wrap.open { display: block; }

      .call-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1a1a1a;
        border-radius: 10px;
        padding: 10px 14px;
        margin-bottom: 10px;
      }
      .call-status { font-size: 12px; color: #8a8a8e; }
      .call-status .name { color: #ffa116; font-weight: 600; }
      .call-timer { font-size: 13px; font-weight: 700; color: #2cbb5d; font-variant-numeric: tabular-nums; }

      .videos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 10px;
      }
      .video-wrap {
        background: #1a1a1a;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        overflow: hidden;
        aspect-ratio: 4/3;
        position: relative;
      }
      .video-wrap video { width: 100%; height: 100%; object-fit: cover; }
      .video-label {
        position: absolute;
        bottom: 6px; left: 8px;
        font-size: 10px;
        color: rgba(255,255,255,0.7);
        background: rgba(0,0,0,0.6);
        padding: 2px 6px;
        border-radius: 4px;
        backdrop-filter: blur(4px);
      }
      
      .call-controls { display: flex; gap: 8px; }
      .ctrl-btn {
        flex: 1; padding: 10px 4px; border-radius: 10px; border: none;
        background: #3e3e3e; color: #eff2f6; font-size: 11px; cursor: pointer;
        transition: all 0.2s; display: flex; flex-direction: column;
        align-items: center; gap: 4px;
      }
      .ctrl-btn:hover { background: #4a4a4a; }
      .ctrl-btn.active { background: rgba(255, 161, 22, 0.15); color: #ffa116; border: 1px solid rgba(255, 161, 22, 0.3); }
      .ctrl-btn.end { background: #ef4743; color: #fff; }
      .ctrl-btn.end:hover { background: #f85e5a; }
      .ctrl-icon { font-size: 18px; }

      .incoming-call {
        background: #1d2b1d;
        border: 1px solid #2cbb5d;
        border-radius: 12px;
        padding: 14px;
        margin-top: 12px;
        display: none;
      }
      .incoming-call.visible { display: block; }
      .incoming-call-name { color: #2cbb5d; font-weight: 700; font-size: 14px; }
      .incoming-call-actions { display: flex; gap: 8px; margin-top: 10px; }

      .pill {
        display: none;
        align-items: center;
        gap: 8px;
        background: #282828;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 8px 16px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        transition: transform 0.2s;
      }
      .pill:hover { transform: scale(1.05); }
      .pill-count { font-size: 14px; font-weight: 700; color: #ffa116; }
      .pill-label { font-size: 12px; color: #8a8a8e; }

      /* ── Tab Bar ─────────────────────────────────── */
      .tab-bar {
        display: flex;
        background: #1a1a1a;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px 12px 0 0;
        overflow: hidden;
      }
      .tab-btn {
        flex: 1;
        padding: 10px 8px;
        background: none;
        border: none;
        color: #6b6b70;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.25s ease;
        position: relative;
        letter-spacing: 0.02em;
      }
      .tab-btn:hover { color: #a0a0a8; }
      .tab-btn.active {
        color: #ffa116;
        background: rgba(255, 161, 22, 0.06);
      }
      .tab-btn.active::after {
        content: '';
        position: absolute;
        bottom: 0; left: 20%; right: 20%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #ffa116, transparent);
        border-radius: 2px;
      }

      .tab-panel { display: none; padding: 16px; }
      .tab-panel.active { display: block; }

      /* ── AI Panel Styles ─────────────────────────── */
      .ai-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
      }
      .ai-title {
        font-size: 13px;
        font-weight: 700;
        color: #eff2f6;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .ai-title .sparkle { font-size: 16px; }

      .ai-lang-select {
        background: #1a1a1a;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        color: #eff2f6;
        font-size: 11px;
        padding: 5px 8px;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s;
      }
      .ai-lang-select:focus { border-color: #ffa116; }

      .ai-generate-btn {
        width: 100%;
        padding: 11px 14px;
        border-radius: 10px;
        border: none;
        background: linear-gradient(135deg, #ffa116 0%, #ff6b2b 100%);
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        letter-spacing: 0.02em;
        box-shadow: 0 4px 15px rgba(255, 161, 22, 0.2);
      }
      .ai-generate-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(255, 161, 22, 0.35);
      }
      .ai-generate-btn:active:not(:disabled) { transform: translateY(0); }
      .ai-generate-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
      }

      /* Loading skeleton */
      .ai-loading {
        display: none;
        margin-top: 14px;
      }
      .ai-loading.visible { display: block; }
      .ai-skeleton {
        height: 14px;
        background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
        border-radius: 4px;
        margin-bottom: 8px;
      }
      .ai-skeleton:nth-child(2) { width: 85%; }
      .ai-skeleton:nth-child(3) { width: 70%; }
      .ai-skeleton:nth-child(4) { width: 90%; height: 10px; }
      .ai-skeleton:nth-child(5) { width: 60%; height: 10px; }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Solution output */
      .ai-output {
        display: none;
        margin-top: 14px;
        max-height: 420px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #3e3e3e transparent;
        animation: fadeInUp 0.4s ease;
      }
      .ai-output.visible { display: block; }

      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .ai-section-title {
        font-size: 12px;
        font-weight: 700;
        color: #ffa116;
        margin: 14px 0 6px 0;
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .ai-section-title:first-child { margin-top: 0; }

      .ai-text {
        font-size: 12.5px;
        line-height: 1.7;
        color: #c8c8d0;
        word-break: break-word;
      }
      .ai-text strong { color: #eff2f6; }
      .ai-text em { color: #a78bfa; font-style: italic; }

      .ai-complexity {
        background: rgba(255, 161, 22, 0.06);
        border: 1px solid rgba(255, 161, 22, 0.12);
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 12px;
        color: #c8c8d0;
        line-height: 1.6;
      }
      .ai-complexity strong { color: #ffa116; }

      .ai-code-wrap {
        position: relative;
        margin-top: 6px;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.06);
      }
      .ai-code-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1a1a1a;
        padding: 6px 12px;
        font-size: 10px;
        color: #6b6b70;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .ai-copy-btn {
        background: none;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        color: #8a8a8e;
        font-size: 10px;
        padding: 3px 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .ai-copy-btn:hover { color: #ffa116; border-color: #ffa116; }
      .ai-code-block {
        background: #0d0d0d;
        padding: 14px;
        font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
        font-size: 12px;
        line-height: 1.7;
        color: #c8c8d0;
        overflow-x: auto;
        white-space: pre;
        tab-size: 4;
        scrollbar-width: thin;
        scrollbar-color: #3e3e3e transparent;
      }

      /* Syntax highlighting tokens */
      .tok-kw { color: #c678dd; } /* keywords */
      .tok-str { color: #98c379; } /* strings */
      .tok-num { color: #d19a66; } /* numbers */
      .tok-cm { color: #5c6370; font-style: italic; } /* comments */
      .tok-fn { color: #61afef; } /* functions */
      .tok-type { color: #e5c07b; } /* types */
      .tok-op { color: #56b6c2; } /* operators */

      .ai-error {
        background: rgba(239, 71, 67, 0.1);
        border: 1px solid rgba(239, 71, 67, 0.2);
        border-radius: 8px;
        padding: 10px 12px;
        font-size: 12px;
        color: #ef4743;
        margin-top: 12px;
        display: none;
      }
      .ai-error.visible { display: block; }

      .ai-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        color: #4b5563;
        margin-top: 10px;
      }
      .ai-badge .dot-sm {
        width: 5px; height: 5px;
        border-radius: 50%;
        background: #2cbb5d;
      }
      /* ── Board Panel Styles ──────────────────────── */
      .board-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        background: #1a1a1a;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.05);
      }
      .board-colors { display: flex; gap: 8px; }
      .board-color {
        width: 16px; height: 16px;
        border-radius: 50%;
        cursor: pointer;
        border: 2px solid transparent;
        transition: transform 0.2s;
      }
      .board-color:hover { transform: scale(1.1); }
      .board-color.active { border-color: #fff; transform: scale(1.1); }
      .board-clear {
        background: none; border: none; color: #ef4743; font-size: 11px; font-weight: 600; cursor: pointer;
        padding: 4px 8px; border-radius: 4px; transition: background 0.2s;
      }
      .board-clear:hover { background: rgba(239, 71, 67, 0.1); }
      .board-canvas-wrap {
        background: #0d0d0d;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
        overflow: hidden;
        cursor: crosshair;
        touch-action: none;
        display: flex;
        justify-content: center;
      }
      .board-canvas {
        background: #0d0d0d;
        width: 300px;
        height: 350px;
      }
    </style>

    <div class="pill" id="cm-pill">
      <div class="dot"></div>
      <span class="pill-count" id="cm-pill-count">--</span>
      <span class="pill-label">solving</span>
    </div>

    <div class="card" id="cm-card">
      <!-- Tab Bar -->
      <div class="tab-bar">
        <button class="tab-btn active" id="cm-tab-main">👥 Collab</button>
        <button class="tab-btn" id="cm-tab-ai">✨ AI Sol</button>
        <button class="tab-btn" id="cm-tab-board">🎨 Board</button>
      </div>

      <!-- Main Tab Panel -->
      <div class="tab-panel active" id="cm-panel-main">
        <div class="header">
          <span class="brand">CodeMate</span>
          <button class="minimize-btn" id="cm-minimize" title="Minimize">−</button>
        </div>

        <div class="presence">
          <div class="dot"></div>
          <div class="count-wrap">
            <span class="count" id="cm-count">--</span>
            <span class="count-label">people solving this</span>
          </div>
        </div>

        <div class="divider"></div>

        <div id="cm-signin-wrap" style="display:none; flex-direction:column; gap:8px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:4px">Enter your name to join</div>
          <input type="text" id="cm-name-input" placeholder="Your display name..." maxlength="20" style="background:#0d0d1a;border:1px solid #2a2a40;border-radius:6px;padding:9px 12px;color:#e2e2f0;font-size:13px;outline:none;width:100%" />
          <button class="btn" id="cm-signin-btn">Join CodeMate</button>
        </div>

        <button class="btn" id="cm-match-btn" style="display:none">Find a partner</button>
        <div class="status" id="cm-status"></div>

        <div class="incoming-banner" id="cm-incoming">
          <div class="incoming-name" id="cm-incoming-name"></div>
          <div style="font-size:11px;color:#9ca3af;margin-top:2px">wants to solve this with you</div>
          <div class="incoming-actions">
            <button class="btn" id="cm-accept-btn" style="background:#15803d">Accept</button>
            <button class="btn secondary" id="cm-decline-btn">Decline</button>
          </div>
        </div>

        <div class="chat-wrap" id="cm-chat-wrap">
          <div class="chat-partner">Paired with <span id="cm-partner-name">partner</span></div>
          <div class="chat-box" id="cm-chat-box"></div>
          <div class="typing-indicator" id="cm-typing">Partner is typing...</div>
          <div class="chat-input-row">
            <input type="text" id="cm-msg-input" placeholder="Message your partner..." maxlength="500" />
            <button id="cm-send-btn">Send</button>
          </div>
          
          <div class="divider"></div>
          
          <button class="btn" id="cm-start-call-btn" style="background:#0f6e56;margin-bottom:6px;display:none">
            Start video call
          </button>
          
          <button class="btn danger" id="cm-end-btn">End session</button>

          <div class="call-wrap" id="cm-call-wrap">
            <div class="call-bar">
              <div class="call-status">Call with <span class="name" id="cm-call-partner">partner</span></div>
              <div class="call-timer" id="cm-call-timer">00:00</div>
            </div>
            <div class="videos">
              <div class="video-wrap">
                <video id="cm-local-video" autoplay muted playsinline></video>
                <div class="video-label">You</div>
              </div>
              <div class="video-wrap">
                <video id="cm-remote-video" autoplay playsinline></video>
                <div class="video-label" id="cm-remote-label">Partner</div>
              </div>
            </div>
            <div class="call-controls">
              <button class="ctrl-btn active" id="cm-mic-btn">
                <span class="ctrl-icon">🎙</span><span>Mic</span>
              </button>
              <button class="ctrl-btn active" id="cm-cam-btn">
                <span class="ctrl-icon">📷</span><span>Cam</span>
              </button>
              <button class="ctrl-btn" id="cm-screen-btn">
                <span class="ctrl-icon">🖥</span><span>Screen</span>
              </button>
              <button class="ctrl-btn end" id="cm-hangup-btn">
                <span class="ctrl-icon">📵</span><span>End</span>
              </button>
            </div>
          </div>

          <div class="incoming-call" id="cm-incoming-call">
            <div class="incoming-call-name" id="cm-caller-name">Someone</div>
            <div style="font-size:11px;color:#6b7280;margin-top:2px">is calling you...</div>
            <div class="incoming-call-actions">
              <button class="btn" id="cm-answer-btn" style="background:#15803d;margin-top:0;padding:7px">Answer</button>
              <button class="btn secondary" id="cm-reject-btn" style="margin-top:0;padding:7px">Decline</button>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Solution Tab Panel -->
      <div class="tab-panel" id="cm-panel-ai">
        <div class="ai-header">
          <div class="ai-title">
            <span class="sparkle">✨</span> AI Solution
          </div>
          <select class="ai-lang-select" id="cm-ai-lang">
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
          </select>
        </div>

        <button class="ai-generate-btn" id="cm-ai-generate">
          <span>⚡</span> Generate Solution
        </button>
        <button class="ai-generate-btn" id="cm-ai-analyze" style="background:#3e3e3e;margin-top:8px;box-shadow:none;color:#eff2f6;">
          <span>🐞</span> Analyze My Code
        </button>

        <div class="ai-loading" id="cm-ai-loading">
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
          <div class="ai-skeleton"></div>
        </div>

        <div class="ai-error" id="cm-ai-error"></div>

        <div class="ai-output" id="cm-ai-output"></div>

        <div class="ai-badge" id="cm-ai-badge" style="display:none">
          <span class="dot-sm"></span>
          Powered by Gemini Flash
        </div>
      </div>

      <!-- Board Tab Panel -->
      <div class="tab-panel" id="cm-panel-board">
        <div class="board-toolbar">
          <div class="board-colors">
            <div class="board-color active" style="background:#ffa116" data-color="#ffa116"></div>
            <div class="board-color" style="background:#2cbb5d" data-color="#2cbb5d"></div>
            <div class="board-color" style="background:#ef4743" data-color="#ef4743"></div>
            <div class="board-color" style="background:#61afef" data-color="#61afef"></div>
            <div class="board-color" style="background:#e2e2f0" data-color="#e2e2f0"></div>
          </div>
          <button class="board-clear" id="cm-board-clear">Clear 🗑</button>
        </div>
        <div class="board-canvas-wrap">
          <canvas id="cm-canvas" class="board-canvas" width="300" height="350"></canvas>
        </div>
      </div>
    </div>
  `}function ti(n){if(document.getElementById("codemate-root"))return;const e=document.createElement("div");e.id="codemate-root",e.style.cssText=`
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 2147483647;
  `;const t=e.attachShadow({mode:"open"});t.innerHTML=ei(),document.body.appendChild(e),ni(t,n)}function ni(n,e){const t=ie(xe,{transports:["websocket"],autoConnect:!1}),i=Zn();let s=localStorage.getItem("codemate_username")||"",o=null,c=null,p=null,l=null,x=null,g=0,b=!0,_=!0,z=!1;const St=n.getElementById("cm-count"),Ct=n.getElementById("cm-pill-count"),j=n.getElementById("cm-status"),A=n.getElementById("cm-match-btn"),ae=n.getElementById("cm-incoming"),Tt=n.getElementById("cm-incoming-name"),Bt=n.getElementById("cm-accept-btn"),Lt=n.getElementById("cm-decline-btn"),Oe=n.getElementById("cm-chat-wrap"),N=n.getElementById("cm-chat-box"),Ie=n.getElementById("cm-typing"),W=n.getElementById("cm-msg-input"),At=n.getElementById("cm-send-btn"),Rt=n.getElementById("cm-end-btn"),ce=n.getElementById("cm-partner-name"),Ot=n.getElementById("cm-minimize"),Ne=n.getElementById("cm-card"),le=n.getElementById("cm-pill"),$e=n.getElementById("cm-signin-wrap"),It=n.getElementById("cm-name-input"),Nt=n.getElementById("cm-signin-btn");function Pe(){$e.style.display="none",A.style.display="block",t.connect()}s?Pe():($e.style.display="flex",A.style.display="none"),Nt.addEventListener("click",()=>{const r=It.value.trim();r&&(s=r,localStorage.setItem("codemate_username",s),Pe())});const M=n.getElementById("cm-start-call-btn"),qe=n.getElementById("cm-call-wrap"),$t=n.getElementById("cm-call-partner"),ze=n.getElementById("cm-call-timer"),de=n.getElementById("cm-local-video"),Me=n.getElementById("cm-remote-video"),De=n.getElementById("cm-mic-btn"),Ue=n.getElementById("cm-cam-btn"),Fe=n.getElementById("cm-screen-btn"),Pt=n.getElementById("cm-hangup-btn"),pe=n.getElementById("cm-incoming-call"),qt=n.getElementById("cm-caller-name"),zt=n.getElementById("cm-answer-btn"),Mt=n.getElementById("cm-reject-btn"),Ve=n.getElementById("cm-tab-main"),He=n.getElementById("cm-tab-ai"),Dt=n.getElementById("cm-panel-main"),Ut=n.getElementById("cm-panel-ai"),Ft=n.getElementById("cm-ai-lang"),D=n.getElementById("cm-ai-generate"),Y=n.getElementById("cm-ai-loading"),S=n.getElementById("cm-ai-error"),O=n.getElementById("cm-ai-output"),K=n.getElementById("cm-ai-badge"),U=n.getElementById("cm-ai-analyze"),je=n.getElementById("cm-tab-board"),Vt=n.getElementById("cm-panel-board"),We=n.querySelectorAll(".board-color"),Ht=n.getElementById("cm-board-clear"),E=n.getElementById("cm-canvas");function he(r){Ve.classList.toggle("active",r==="main"),He.classList.toggle("active",r==="ai"),je.classList.toggle("active",r==="board"),Dt.classList.toggle("active",r==="main"),Ut.classList.toggle("active",r==="ai"),Vt.classList.toggle("active",r==="board")}Ve.addEventListener("click",()=>he("main")),He.addEventListener("click",()=>he("ai")),je.addEventListener("click",()=>he("board"));function Ye(){var f,y;const r=document.querySelector('[data-cy="question-title"]')||document.querySelector(".text-title-large")||document.querySelector('div[class*="title"] a')||document.querySelector('h4[class*="title"]')||document.querySelector('[class*="flexlayout__tab"] [class*="title"]');let a=((f=r==null?void 0:r.textContent)==null?void 0:f.trim())||"";!a&&e&&(a=e.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" "));const d=document.querySelector('[data-track-load="description_content"]')||document.querySelector('div[class*="elfjS"]')||document.querySelector(".question-content")||document.querySelector('[class*="_1l1MA"]');let h=((y=d==null?void 0:d.textContent)==null?void 0:y.trim())||"";if(!h){const w=document.querySelector('meta[name="description"]');h=(w==null?void 0:w.getAttribute("content"))||""}return!a&&!h?null:(h.length>3e3&&(h=h.substring(0,3e3)+"..."),{title:a,description:h})}function jt(){const r=document.querySelectorAll(".view-line");return!r||r.length===0?null:Array.from(r).map(a=>a.textContent).join(`
`)}function Wt(r,a){let d=r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");d=d.replace(/(\/\/.*$|#.*$)/gm,'<span class="tok-cm">$1</span>'),d=d.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="tok-cm">$1</span>'),d=d.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g,'<span class="tok-str">$1</span>'),d=d.replace(/\b(\d+\.?\d*)\b/g,'<span class="tok-num">$1</span>');const h={python:"def|class|return|if|elif|else|for|while|in|not|and|or|True|False|None|import|from|as|with|try|except|finally|raise|yield|lambda|pass|break|continue|self",javascript:"const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false",typescript:"const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|interface|type|enum|readonly|abstract|implements|extends",java:"public|private|protected|class|interface|extends|implements|return|if|else|for|while|do|switch|case|break|continue|new|this|super|static|final|void|int|long|double|float|boolean|char|String|null|true|false|try|catch|finally|throw|throws|import|package",cpp:"int|long|double|float|char|bool|void|string|vector|map|set|class|struct|return|if|else|for|while|do|switch|case|break|continue|new|delete|this|nullptr|true|false|const|auto|using|namespace|include|template|typename|public|private|protected|virtual|override|static",go:"func|return|if|else|for|range|switch|case|break|continue|var|const|type|struct|interface|map|chan|go|defer|select|package|import|nil|true|false|string|int|int64|float64|bool|error|make|append|len",rust:"fn|let|mut|return|if|else|for|while|loop|match|break|continue|struct|enum|impl|trait|pub|use|mod|self|Self|true|false|None|Some|Ok|Err|String|Vec|Box|Option|Result|i32|i64|f64|bool|usize|async|await|move|ref|where"},f=a.toLowerCase().replace("c++","cpp"),y=h[f]||h.python;return d=d.replace(new RegExp(`\\b(${y})\\b`,"g"),'<span class="tok-kw">$1</span>'),d=d.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g,'<span class="tok-fn">$1</span>'),d}function Ke(r){let a="";const d=r.split(`
`);let h=!1,f="",y="",w=0;for(const k of d){if(k.trim().startsWith("```")&&!h){h=!0,y=k.trim().replace("```","").trim()||"text",f="";continue}if(k.trim().startsWith("```")&&h){h=!1;const P=Wt(f.trimEnd(),y),Q=`cm-code-${w++}`;a+=`<div class="ai-code-wrap">
          <div class="ai-code-header">
            <span>${y}</span>
            <button class="ai-copy-btn" data-code-id="${Q}">Copy</button>
          </div>
          <pre class="ai-code-block" id="${Q}">${P}</pre>
        </div>`;continue}if(h){f+=k+`
`;continue}if(k.startsWith("## ")||k.startsWith("**")&&k.endsWith("**")){const P=k.replace(/^#+\s*/,"").replace(/\*\*/g,""),Q=P.toLowerCase().includes("intuition")?"💡":P.toLowerCase().includes("approach")?"🎯":P.toLowerCase().includes("complexity")?"📊":P.toLowerCase().includes("code")?"💻":"📌";a+=`<div class="ai-section-title">${Q} ${P}</div>`;continue}if(k.startsWith("# "))continue;let $=k.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,'<code style="background:#1a1a1a;padding:1px 5px;border-radius:3px;font-size:11px;color:#ffa116">$1</code>').replace(/^- (.+)/,"• $1");$.trim()?$.toLowerCase().includes("time complexity")||$.toLowerCase().includes("space complexity")?a+=`<div class="ai-complexity">${$}</div>`:a+=`<div class="ai-text">${$}</div>`:a+='<div style="height:6px"></div>'}return a}async function Yt(){const r=Ye();if(!r){S.textContent="Could not read the problem from this page. Please make sure you are on a LeetCode problem page.",S.classList.add("visible");return}const a=Ft.value;S.classList.remove("visible"),O.classList.remove("visible"),K.style.display="none",Y.classList.add("visible"),D.disabled=!0,D.innerHTML="<span>⏳</span> Generating...";try{const d=await fetch(`${xe}/ai/solve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:e,title:r.title,description:r.description,language:a})}),h=await d.json();if(!d.ok)throw new Error(h.error||"Failed to generate solution");O.innerHTML=Ke(h.solution),O.classList.add("visible"),K.style.display="inline-flex",O.querySelectorAll(".ai-copy-btn").forEach(f=>{f.addEventListener("click",()=>{const y=f.dataset.codeId;if(!y)return;const w=n.getElementById(y);if(!w)return;const k=w.textContent||"";navigator.clipboard.writeText(k).then(()=>{const $=f.textContent;f.textContent="Copied!",f.style.color="#2cbb5d",f.style.borderColor="#2cbb5d",setTimeout(()=>{f.textContent=$,f.style.color="",f.style.borderColor=""},2e3)})})})}catch(d){S.textContent=d.message||"Something went wrong. Please try again.",S.classList.add("visible")}finally{Y.classList.remove("visible"),D.disabled=!1,D.innerHTML="<span>⚡</span> Generate Solution"}}async function Kt(){const r=Ye(),a=jt();if(!r){S.textContent="Could not read the problem description from this page.",S.classList.add("visible");return}if(!a||a.trim()===""){S.textContent="Could not find any code in the editor to analyze. Make sure you have written some code.",S.classList.add("visible");return}S.classList.remove("visible"),O.classList.remove("visible"),K.style.display="none",Y.classList.add("visible"),U.disabled=!0,U.innerHTML="<span>⏳</span> Analyzing...";try{const d=await fetch(`${xe}/ai/analyze`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:r.title,description:r.description,code:a})}),h=await d.json();if(!d.ok)throw new Error(h.error||"Failed to analyze code");O.innerHTML=Ke(h.analysis),O.classList.add("visible"),K.style.display="inline-flex",O.querySelectorAll(".ai-copy-btn").forEach(f=>{f.addEventListener("click",()=>{const y=f.dataset.codeId;if(!y)return;const w=n.getElementById(y);w&&navigator.clipboard.writeText(w.textContent||"").then(()=>{const k=f.textContent;f.textContent="Copied!",f.style.color="#2cbb5d",setTimeout(()=>{f.textContent=k,f.style.color=""},2e3)})})})}catch(d){S.textContent=d.message||"Something went wrong. Please try again.",S.classList.add("visible")}finally{Y.classList.remove("visible"),U.disabled=!1,U.innerHTML="<span>🐞</span> Analyze My Code"}}D.addEventListener("click",Yt),U.addEventListener("click",Kt);const v=E.getContext("2d");let ue=!1,Je="#ffa116",fe=0,me=0;We.forEach(r=>{r.addEventListener("click",()=>{We.forEach(a=>a.classList.remove("active")),r.classList.add("active"),Je=r.dataset.color||"#ffa116"})}),Ht.addEventListener("click",()=>{v==null||v.clearRect(0,0,E.width,E.height),o&&t.emit("board:clear",{sessionRoom:o})});function Xe(r,a,d,h,f,y){v&&(v.beginPath(),v.moveTo(r,a),v.lineTo(d,h),v.strokeStyle=f,v.lineWidth=3,v.lineCap="round",v.stroke(),v.closePath(),!(!y||!o)&&t.emit("board:draw",{sessionRoom:o,x0:r,y0:a,x1:d,y1:h,color:f}))}function Qe(r){const a=E.getBoundingClientRect();let d,h;return window.TouchEvent&&r instanceof TouchEvent?(d=r.touches[0].clientX,h=r.touches[0].clientY):(d=r.clientX,h=r.clientY),{x:d-a.left,y:h-a.top}}function Ge(r){ue=!0;const a=Qe(r);fe=a.x,me=a.y}function Ze(r){if(!ue)return;r.preventDefault();const a=Qe(r);Xe(fe,me,a.x,a.y,Je,!0),fe=a.x,me=a.y}function ge(){ue=!1}E.addEventListener("mousedown",Ge),E.addEventListener("mousemove",Ze),E.addEventListener("mouseup",ge),E.addEventListener("mouseout",ge),E.addEventListener("touchstart",Ge),E.addEventListener("touchmove",Ze),E.addEventListener("touchend",ge),Ot.addEventListener("click",()=>{Ne.style.display="none",le.style.display="flex"}),le.addEventListener("click",()=>{Ne.style.display="block",le.style.display="none"}),t.on("connect",()=>{t.emit("join:question",{questionSlug:e,userId:i,displayName:s})}),t.on("connect_error",()=>{R("Cannot connect to server","error")});function et(r){St.textContent=String(r),Ct.textContent=String(r),chrome.runtime.sendMessage({type:"update_badge",count:r})}t.on("join:confirmed",({count:r})=>et(r)),t.on("presence:update",({count:r})=>et(r)),A.addEventListener("click",()=>{R("Looking for a partner..."),A.disabled=!0,t.emit("match:request",{questionSlug:e,userId:i})}),t.on("match:none",({message:r})=>{R(r,"error"),A.disabled=!1}),t.on("match:found",({partnerSocketId:r,partnerName:a})=>{c=r,R(`Found ${a||"someone"}! Sending request...`),t.emit("match:accept",{fromSocketId:r})}),t.on("match:incoming",({fromSocketId:r,fromName:a})=>{c=r,Tt.textContent=a||"Someone",ae.classList.add("visible")}),Bt.addEventListener("click",()=>{ae.classList.remove("visible"),t.emit("match:accept",{fromSocketId:c})}),Lt.addEventListener("click",()=>{ae.classList.remove("visible"),t.emit("match:decline",{fromSocketId:c}),c=null}),t.on("match:declined",({message:r})=>{R(r,"error"),A.disabled=!1}),t.on("match:accepted",({sessionRoom:r,partnerSocketId:a,partnerName:d})=>{o=r,c=a,ce.textContent=d||"your partner",A.style.display="none",j.style.display="none",Oe.classList.add("open"),M.style.display="block",rt("Session started! Say hello 👋")});function tt(){const r=W.value.trim();!r||!o||(t.emit("chat:message",{sessionRoom:o,message:r}),st(r,!0),W.value="")}At.addEventListener("click",tt),W.addEventListener("keydown",r=>{r.key==="Enter"&&tt()}),W.addEventListener("input",()=>{o&&(t.emit("chat:typing",{sessionRoom:o,isTyping:!0}),clearTimeout(p),p=setTimeout(()=>{t.emit("chat:typing",{sessionRoom:o,isTyping:!1})},1500))}),t.on("chat:message",({from:r,message:a,displayName:d})=>{r!==t.id&&(Ie.classList.remove("visible"),st(a,!1,d))}),t.on("chat:typing",({from:r,isTyping:a})=>{r!==t.id&&Ie.classList.toggle("visible",a)}),t.on("board:draw",r=>{Xe(r.x0,r.y0,r.x1,r.y1,r.color,!1)}),t.on("board:clear",()=>{v==null||v.clearRect(0,0,E.width,E.height)});function nt(r){return l=new Qn({onTrack:a=>{Me.srcObject=a},onIceCandidate:a=>{t.emit("webrtc:ice",{to:r,candidate:a})},onConnectionChange:a=>{a==="connected"&&Gt(),(a==="disconnected"||a==="failed")&&J()}}),l}async function Jt(r){o&&(t.emit("call:start",{to:r,sessionRoom:o}),R("Calling partner..."))}async function Xt(r){if(!o||l)return;const a=nt(r),d=await a.startLocalMedia();de.srcObject=d;const h=await a.createOffer();t.emit("webrtc:offer",{to:r,offer:h}),it(ce.textContent||"partner")}async function Qt(r){if(!o)return;const d=await nt(r).startLocalMedia();de.srcObject=d,t.emit("call:accept",{to:r,sessionRoom:o}),it(ce.textContent||"partner")}function J(r=!0){r&&c&&o&&t.emit("call:end",{to:c,sessionRoom:o}),l==null||l.destroy(),l=null,Zt(),qe.classList.remove("open"),de.srcObject=null,Me.srcObject=null,M.style.display="block",b=!0,_=!0,z=!1,X()}function it(r){$t.textContent=r,qe.classList.add("open"),M.style.display="none"}M.addEventListener("click",()=>{c&&Jt(c)}),De.addEventListener("click",()=>{b=!b,l==null||l.toggleAudio(b),t.emit("call:media",{to:c,audio:b,video:_}),X()}),Ue.addEventListener("click",()=>{_=!_,l==null||l.toggleVideo(_),t.emit("call:media",{to:c,audio:b,video:_}),X()}),Fe.addEventListener("click",async()=>{if(l){if(z)await l.stopScreenShare(),z=!1;else try{await l.startScreenShare(),z=!0}catch(r){R(r.message,"error")}X()}}),Pt.addEventListener("click",()=>J(!0)),t.on("call:incoming",({from:r,fromName:a})=>{qt.textContent=a||"Someone",pe.classList.add("visible"),zt.onclick=()=>{pe.classList.remove("visible"),Qt(r)},Mt.onclick=()=>{pe.classList.remove("visible"),t.emit("call:reject",{to:r})}}),t.on("call:accepted",({from:r})=>{Xt(r)}),t.on("webrtc:offer",async({from:r,offer:a})=>{if(!l)return;const d=await l.handleOffer(a);t.emit("webrtc:answer",{to:r,answer:d})}),t.on("webrtc:answer",async({answer:r})=>{l&&await l.handleAnswer(r)}),t.on("webrtc:ice",async({candidate:r})=>{l&&await l.addIceCandidate(r)}),t.on("call:ended",()=>{J(!1),rt("Call ended.")}),t.on("call:rejected",()=>{R("Call declined.","error"),M.style.display="block"}),Rt.addEventListener("click",()=>{J(!0),o=null,c=null,Oe.classList.remove("open"),A.style.display="block",A.disabled=!1,j.style.display="block",R("Session ended."),N.innerHTML=""}),setInterval(()=>t.emit("heartbeat"),6e4);function R(r,a=""){j.textContent=r,j.className="status"+(a?" "+a:"")}function st(r,a,d){const h=document.createElement("div");h.className="msg "+(a?"me":"them"),h.textContent=(a?"You":d||"Partner")+": "+r,N.appendChild(h),N.scrollTop=N.scrollHeight}function rt(r){const a=document.createElement("div");a.style.cssText="font-size:11px;color:#4b5563;text-align:center;padding:4px 0;",a.textContent=r,N.appendChild(a),N.scrollTop=N.scrollHeight}function X(){De.classList.toggle("active",b),Ue.classList.toggle("active",_),Fe.classList.toggle("active",z)}function Gt(){g=0,x=setInterval(()=>{g++;const r=String(Math.floor(g/60)).padStart(2,"0"),a=String(g%60).padStart(2,"0");ze.textContent=`${r}:${a}`},1e3)}function Zt(){x&&clearInterval(x),x=null,ze.textContent="00:00"}}let pt=null;function oe(){const n=Gn();if(n&&n!==pt){const e=document.getElementById("codemate-root");e&&e.remove(),pt=n,ti(n)}}const ii=new MutationObserver(oe);ii.observe(document.body,{childList:!0,subtree:!0});const si=history.pushState.bind(history);history.pushState=function(...n){si(...n),setTimeout(oe,500)};window.addEventListener("popstate",()=>setTimeout(oe,500));oe();
