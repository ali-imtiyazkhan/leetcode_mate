var lt=Object.defineProperty;var ht=(n,e,t)=>e in n?lt(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var R=(n,e,t)=>ht(n,typeof e!="symbol"?e+"":e,t);const w=Object.create(null);w.open="0";w.close="1";w.ping="2";w.pong="3";w.message="4";w.upgrade="5";w.noop="6";const M=Object.create(null);Object.keys(w).forEach(n=>{M[w[n]]=n});const ee={type:"error",data:"parser error"},Le=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Ne=typeof ArrayBuffer=="function",Ie=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,oe=({type:n,data:e},t,s)=>Le&&e instanceof Blob?t?s(e):Te(e,s):Ne&&(e instanceof ArrayBuffer||Ie(e))?t?s(e):Te(new Blob([e]),s):s(w[n]+(e||"")),Te=(n,e)=>{const t=new FileReader;return t.onload=function(){const s=t.result.split(",")[1];e("b"+(s||""))},t.readAsDataURL(n)};function Ce(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let Q;function dt(n,e){if(Le&&n.data instanceof Blob)return n.data.arrayBuffer().then(Ce).then(e);if(Ne&&(n.data instanceof ArrayBuffer||Ie(n.data)))return e(Ce(n.data));oe(n,!1,t=>{Q||(Q=new TextEncoder),e(Q.encode(t))})}const Be="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",L=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<Be.length;n++)L[Be.charCodeAt(n)]=n;const ut=n=>{let e=n.length*.75,t=n.length,s,i=0,r,a,l,c;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const m=new ArrayBuffer(e),p=new Uint8Array(m);for(s=0;s<t;s+=4)r=L[n.charCodeAt(s)],a=L[n.charCodeAt(s+1)],l=L[n.charCodeAt(s+2)],c=L[n.charCodeAt(s+3)],p[i++]=r<<2|a>>4,p[i++]=(a&15)<<4|l>>2,p[i++]=(l&3)<<6|c&63;return m},pt=typeof ArrayBuffer=="function",ae=(n,e)=>{if(typeof n!="string")return{type:"message",data:Pe(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:ft(n.substring(1),e)}:M[t]?n.length>1?{type:M[t],data:n.substring(1)}:{type:M[t]}:ee},ft=(n,e)=>{if(pt){const t=ut(n);return Pe(t,e)}else return{base64:!0,data:n}},Pe=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},qe="",mt=(n,e)=>{const t=n.length,s=new Array(t);let i=0;n.forEach((r,a)=>{oe(r,!1,l=>{s[a]=l,++i===t&&e(s.join(qe))})})},gt=(n,e)=>{const t=n.split(qe),s=[];for(let i=0;i<t.length;i++){const r=ae(t[i],e);if(s.push(r),r.type==="error")break}return s};function yt(){return new TransformStream({transform(n,e){dt(n,t=>{const s=t.length;let i;if(s<126)i=new Uint8Array(1),new DataView(i.buffer).setUint8(0,s);else if(s<65536){i=new Uint8Array(3);const r=new DataView(i.buffer);r.setUint8(0,126),r.setUint16(1,s)}else{i=new Uint8Array(9);const r=new DataView(i.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(s))}n.data&&typeof n.data!="string"&&(i[0]|=128),e.enqueue(i),e.enqueue(t)})}})}let G;function D(n){return n.reduce((e,t)=>e+t.length,0)}function U(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let s=0;for(let i=0;i<e;i++)t[i]=n[0][s++],s===n[0].length&&(n.shift(),s=0);return n.length&&s<n[0].length&&(n[0]=n[0].slice(s)),t}function bt(n,e){G||(G=new TextDecoder);const t=[];let s=0,i=-1,r=!1;return new TransformStream({transform(a,l){for(t.push(a);;){if(s===0){if(D(t)<1)break;const c=U(t,1);r=(c[0]&128)===128,i=c[0]&127,i<126?s=3:i===126?s=1:s=2}else if(s===1){if(D(t)<2)break;const c=U(t,2);i=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),s=3}else if(s===2){if(D(t)<8)break;const c=U(t,8),m=new DataView(c.buffer,c.byteOffset,c.length),p=m.getUint32(0);if(p>Math.pow(2,21)-1){l.enqueue(ee);break}i=p*Math.pow(2,32)+m.getUint32(4),s=3}else{if(D(t)<i)break;const c=U(t,i);l.enqueue(ae(r?c:G.decode(c),e)),s=0}if(i===0||i>n){l.enqueue(ee);break}}}})}const De=4;function u(n){if(n)return vt(n)}function vt(n){for(var e in u.prototype)n[e]=u.prototype[e];return n}u.prototype.on=u.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};u.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};u.prototype.off=u.prototype.removeListener=u.prototype.removeAllListeners=u.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var s,i=0;i<t.length;i++)if(s=t[i],s===e||s.fn===e){t.splice(i,1);break}return t.length===0&&delete this._callbacks["$"+n],this};u.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],s=1;s<arguments.length;s++)e[s-1]=arguments[s];if(t){t=t.slice(0);for(var s=0,i=t.length;s<i;++s)t[s].apply(this,e)}return this};u.prototype.emitReserved=u.prototype.emit;u.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};u.prototype.hasListeners=function(n){return!!this.listeners(n).length};const F=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),y=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),_t="arraybuffer";function Ue(n,...e){return e.reduce((t,s)=>(n.hasOwnProperty(s)&&(t[s]=n[s]),t),{})}const wt=y.setTimeout,xt=y.clearTimeout;function H(n,e){e.useNativeTimers?(n.setTimeoutFn=wt.bind(y),n.clearTimeoutFn=xt.bind(y)):(n.setTimeoutFn=y.setTimeout.bind(y),n.clearTimeoutFn=y.clearTimeout.bind(y))}const kt=1.33;function Et(n){return typeof n=="string"?St(n):Math.ceil((n.byteLength||n.size)*kt)}function St(n){let e=0,t=0;for(let s=0,i=n.length;s<i;s++)e=n.charCodeAt(s),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(s++,t+=4);return t}function Me(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Tt(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function Ct(n){let e={},t=n.split("&");for(let s=0,i=t.length;s<i;s++){let r=t[s].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class Bt extends Error{constructor(e,t,s){super(e),this.description=t,this.context=s,this.type="TransportError"}}class ce extends u{constructor(e){super(),this.writable=!1,H(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,s){return super.emitReserved("error",new Bt(e,t,s)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=ae(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Tt(e);return t.length?"?"+t:""}}class At extends ce{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let s=0;this._polling&&(s++,this.once("pollComplete",function(){--s||t()})),this.writable||(s++,this.once("drain",function(){--s||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=s=>{if(this.readyState==="opening"&&s.type==="open"&&this.onOpen(),s.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(s)};gt(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,mt(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=Me()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let $e=!1;try{$e=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const Rt=$e;function Ot(){}class Lt extends At{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let s=location.port;s||(s=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||s!==e.port}}doWrite(e,t){const s=this.request({method:"POST",data:e});s.on("success",t),s.on("error",(i,r)=>{this.onError("xhr post error",i,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,s)=>{this.onError("xhr poll error",t,s)}),this.pollXhr=e}}class _ extends u{constructor(e,t,s){super(),this.createRequest=e,H(this,s),this._opts=s,this._method=s.method||"GET",this._uri=t,this._data=s.data!==void 0?s.data:null,this._create()}_create(){var e;const t=Ue(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const s=this._xhr=this.createRequest(t);try{s.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){s.setDisableHeaderCheck&&s.setDisableHeaderCheck(!0);for(let i in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(i)&&s.setRequestHeader(i,this._opts.extraHeaders[i])}}catch{}if(this._method==="POST")try{s.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{s.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(s),"withCredentials"in s&&(s.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(s.timeout=this._opts.requestTimeout),s.onreadystatechange=()=>{var i;s.readyState===3&&((i=this._opts.cookieJar)===null||i===void 0||i.parseCookies(s.getResponseHeader("set-cookie"))),s.readyState===4&&(s.status===200||s.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof s.status=="number"?s.status:0)},0))},s.send(this._data)}catch(i){this.setTimeoutFn(()=>{this._onError(i)},0);return}typeof document<"u"&&(this._index=_.requestsCount++,_.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Ot,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete _.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}_.requestsCount=0;_.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",Ae);else if(typeof addEventListener=="function"){const n="onpagehide"in y?"pagehide":"unload";addEventListener(n,Ae,!1)}}function Ae(){for(let n in _.requests)_.requests.hasOwnProperty(n)&&_.requests[n].abort()}const Nt=function(){const n=ze({xdomain:!1});return n&&n.responseType!==null}();class It extends Lt{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Nt&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new _(ze,this.uri(),e)}}function ze(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||Rt))return new XMLHttpRequest}catch{}if(!e)try{return new y[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const Ve=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Pt extends ce{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,s=Ve?{}:Ue(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(s.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,s)}catch(i){return this.emitReserved("error",i)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;oe(s,this.supportsBinary,r=>{try{this.doWrite(s,r)}catch{}i&&F(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=Me()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Z=y.WebSocket||y.MozWebSocket;class qt extends Pt{createSocket(e,t,s){return Ve?new Z(e,t,s):t?new Z(e,t):new Z(e)}doWrite(e,t){this.ws.send(t)}}class Dt extends ce{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=bt(Number.MAX_SAFE_INTEGER,this.socket.binaryType),s=e.readable.pipeThrough(t).getReader(),i=yt();i.readable.pipeTo(e.writable),this._writer=i.writable.getWriter();const r=()=>{s.read().then(({done:l,value:c})=>{l||(this.onPacket(c),r())}).catch(l=>{})};r();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const s=e[t],i=t===e.length-1;this._writer.write(s).then(()=>{i&&F(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Ut={websocket:qt,webtransport:Dt,polling:It},Mt=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,$t=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function te(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),s=n.indexOf("]");t!=-1&&s!=-1&&(n=n.substring(0,t)+n.substring(t,s).replace(/:/g,";")+n.substring(s,n.length));let i=Mt.exec(n||""),r={},a=14;for(;a--;)r[$t[a]]=i[a]||"";return t!=-1&&s!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=zt(r,r.path),r.queryKey=Vt(r,r.query),r}function zt(n,e){const t=/\/{2,9}/g,s=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&s.splice(0,1),e.slice(-1)=="/"&&s.splice(s.length-1,1),s}function Vt(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(s,i,r){i&&(t[i]=r)}),t}const ne=typeof addEventListener=="function"&&typeof removeEventListener=="function",$=[];ne&&addEventListener("offline",()=>{$.forEach(n=>n())},!1);class k extends u{constructor(e,t){if(super(),this.binaryType=_t,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const s=te(e);t.hostname=s.host,t.secure=s.protocol==="https"||s.protocol==="wss",t.port=s.port,s.query&&(t.query=s.query)}else t.host&&(t.hostname=te(t.host).host);H(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(s=>{const i=s.prototype.name;this.transports.push(i),this._transportsByName[i]=s}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Ct(this.opts.query)),ne&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},$.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=De,t.transport=e,this.id&&(t.sid=this.id);const s=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](s)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&k.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",k.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let s=0;s<this.writeBuffer.length;s++){const i=this.writeBuffer[s].data;if(i&&(t+=Et(i)),s>0&&t>this._maxPayload)return this.writeBuffer.slice(0,s);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,F(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,s){return this._sendPacket("message",e,t,s),this}send(e,t,s){return this._sendPacket("message",e,t,s),this}_sendPacket(e,t,s,i){if(typeof t=="function"&&(i=t,t=void 0),typeof s=="function"&&(i=s,s=null),this.readyState==="closing"||this.readyState==="closed")return;s=s||{},s.compress=s.compress!==!1;const r={type:e,data:t,options:s};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),i&&this.once("flush",i),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},s=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?s():e()}):this.upgrading?s():e()),this}_onError(e){if(k.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ne&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const s=$.indexOf(this._offlineEventListener);s!==-1&&$.splice(s,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}k.protocol=De;class Ft extends k{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),s=!1;k.priorWebsocketSuccess=!1;const i=()=>{s||(t.send([{type:"ping",data:"probe"}]),t.once("packet",f=>{if(!s)if(f.type==="pong"&&f.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;k.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{s||this.readyState!=="closed"&&(p(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const g=new Error("probe error");g.transport=t.name,this.emitReserved("upgradeError",g)}}))};function r(){s||(s=!0,p(),t.close(),t=null)}const a=f=>{const g=new Error("probe error: "+f);g.transport=t.name,r(),this.emitReserved("upgradeError",g)};function l(){a("transport closed")}function c(){a("socket closed")}function m(f){t&&f.name!==t.name&&r()}const p=()=>{t.removeListener("open",i),t.removeListener("error",a),t.removeListener("close",l),this.off("close",c),this.off("upgrading",m)};t.once("open",i),t.once("error",a),t.once("close",l),this.once("close",c),this.once("upgrading",m),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{s||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let s=0;s<e.length;s++)~this.transports.indexOf(e[s])&&t.push(e[s]);return t}}let Ht=class extends Ft{constructor(e,t={}){const s=typeof e=="object"?e:t;(!s.transports||s.transports&&typeof s.transports[0]=="string")&&(s.transports=(s.transports||["polling","websocket","webtransport"]).map(i=>Ut[i]).filter(i=>!!i)),super(e,s)}};function Wt(n,e="",t){let s=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),s=te(n)),s.port||(/^(http|ws)$/.test(s.protocol)?s.port="80":/^(http|ws)s$/.test(s.protocol)&&(s.port="443")),s.path=s.path||"/";const r=s.host.indexOf(":")!==-1?"["+s.host+"]":s.host;return s.id=s.protocol+"://"+r+":"+s.port+e,s.href=s.protocol+"://"+r+(t&&t.port===s.port?"":":"+s.port),s}const Kt=typeof ArrayBuffer=="function",jt=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,Fe=Object.prototype.toString,Yt=typeof Blob=="function"||typeof Blob<"u"&&Fe.call(Blob)==="[object BlobConstructor]",Jt=typeof File=="function"||typeof File<"u"&&Fe.call(File)==="[object FileConstructor]";function le(n){return Kt&&(n instanceof ArrayBuffer||jt(n))||Yt&&n instanceof Blob||Jt&&n instanceof File}function z(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,s=n.length;t<s;t++)if(z(n[t]))return!0;return!1}if(le(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return z(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&z(n[t]))return!0;return!1}function Xt(n){const e=[],t=n.data,s=n;return s.data=se(t,e),s.attachments=e.length,{packet:s,buffers:e}}function se(n,e){if(!n)return n;if(le(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let s=0;s<n.length;s++)t[s]=se(n[s],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=se(n[s],e));return t}return n}function Qt(n,e){return n.data=ie(n.data,e),delete n.attachments,n}function ie(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=ie(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=ie(n[t],e));return n}const Gt=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var d;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(d||(d={}));class Zt{constructor(e){this.replacer=e}encode(e){return(e.type===d.EVENT||e.type===d.ACK)&&z(e)?this.encodeAsBinary({type:e.type===d.EVENT?d.BINARY_EVENT:d.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===d.BINARY_EVENT||e.type===d.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=Xt(e),s=this.encodeAsString(t.packet),i=t.buffers;return i.unshift(s),i}}class he extends u{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const s=t.type===d.BINARY_EVENT;s||t.type===d.BINARY_ACK?(t.type=s?d.EVENT:d.ACK,this.reconstructor=new en(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(le(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const s={type:Number(e.charAt(0))};if(d[s.type]===void 0)throw new Error("unknown packet type "+s.type);if(s.type===d.BINARY_EVENT||s.type===d.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(r,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const l=Number(a);if(!tn(l)||l<0)throw new Error("Illegal attachments");if(l>this.opts.maxAttachments)throw new Error("too many attachments");s.attachments=l}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););s.nsp=e.substring(r,t)}else s.nsp="/";const i=e.charAt(t+1);if(i!==""&&Number(i)==i){const r=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}s.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(he.isPayloadValid(s.type,r))s.data=r;else throw new Error("invalid payload")}return s}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case d.CONNECT:return Re(t);case d.DISCONNECT:return t===void 0;case d.CONNECT_ERROR:return typeof t=="string"||Re(t);case d.EVENT:case d.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Gt.indexOf(t[0])===-1);case d.ACK:case d.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class en{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Qt(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const tn=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function Re(n){return Object.prototype.toString.call(n)==="[object Object]"}const nn=Object.freeze(Object.defineProperty({__proto__:null,Decoder:he,Encoder:Zt,get PacketType(){return d}},Symbol.toStringTag,{value:"Module"}));function v(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const sn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class He extends u{constructor(e,t,s){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,s&&s.auth&&(this.auth=s.auth),this._opts=Object.assign({},s),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[v(e,"open",this.onopen.bind(this)),v(e,"packet",this.onpacket.bind(this)),v(e,"error",this.onerror.bind(this)),v(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var s,i,r;if(sn.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:d.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const p=this.ids++,f=t.pop();this._registerAckCallback(p,f),a.id=p}const l=(i=(s=this.io.engine)===null||s===void 0?void 0:s.transport)===null||i===void 0?void 0:i.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!l||(c?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var s;const i=(s=this.flags.timeout)!==null&&s!==void 0?s:this._opts.ackTimeout;if(i===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let l=0;l<this.sendBuffer.length;l++)this.sendBuffer[l].id===e&&this.sendBuffer.splice(l,1);t.call(this,new Error("operation has timed out"))},i),a=(...l)=>{this.io.clearTimeoutFn(r),t.apply(this,l)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((s,i)=>{const r=(a,l)=>a?i(a):s(l);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const s={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((i,...r)=>(this._queue[0],i!==null?s.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(i)):(this._queue.shift(),t&&t(null,...r)),s.pending=!1,this._drainQueue())),this._queue.push(s),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:d.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(s=>String(s.id)===e)){const s=this.acks[e];delete this.acks[e],s.withError&&s.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case d.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case d.EVENT:case d.BINARY_EVENT:this.onevent(e);break;case d.ACK:case d.BINARY_ACK:this.onack(e);break;case d.DISCONNECT:this.ondisconnect();break;case d.CONNECT_ERROR:this.destroy();const s=new Error(e.data.message);s.data=e.data.data,this.emitReserved("connect_error",s);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const s of t)s.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let s=!1;return function(...i){s||(s=!0,t.packet({type:d.ACK,id:e,data:i}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:d.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let s=0;s<t.length;s++)if(e===t[s])return t.splice(s,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const s of t)s.apply(this,e.data)}}}function T(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}T.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};T.prototype.reset=function(){this.attempts=0};T.prototype.setMin=function(n){this.ms=n};T.prototype.setMax=function(n){this.max=n};T.prototype.setJitter=function(n){this.jitter=n};class re extends u{constructor(e,t){var s;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,H(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((s=t.randomizationFactor)!==null&&s!==void 0?s:.5),this.backoff=new T({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const i=t.parser||nn;this.encoder=new i.Encoder,this.decoder=new i.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Ht(this.uri,this.opts);const t=this.engine,s=this;this._readyState="opening",this.skipReconnect=!1;const i=v(t,"open",function(){s.onopen(),e&&e()}),r=l=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",l),e?e(l):this.maybeReconnectOnOpen()},a=v(t,"error",r);if(this._timeout!==!1){const l=this._timeout,c=this.setTimeoutFn(()=>{i(),r(new Error("timeout")),t.close()},l);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(i),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(v(e,"ping",this.onping.bind(this)),v(e,"data",this.ondata.bind(this)),v(e,"error",this.onerror.bind(this)),v(e,"close",this.onclose.bind(this)),v(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){F(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let s=this.nsps[e];return s?this._autoConnect&&!s.active&&s.connect():(s=new He(this,e,t),this.nsps[e]=s),s}_destroy(e){const t=Object.keys(this.nsps);for(const s of t)if(this.nsps[s].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let s=0;s<t.length;s++)this.engine.write(t[s],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var s;this.cleanup(),(s=this.engine)===null||s===void 0||s.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const s=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(i=>{i?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",i)):e.onreconnect()}))},t);this.opts.autoUnref&&s.unref(),this.subs.push(()=>{this.clearTimeoutFn(s)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const O={};function V(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=Wt(n,e.path||"/socket.io"),s=t.source,i=t.id,r=t.path,a=O[i]&&r in O[i].nsps,l=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let c;return l?c=new re(s,e):(O[i]||(O[i]=new re(s,e)),c=O[i]),t.query&&!e.query&&(e.query=t.queryKey),c.socket(t.path,e)}Object.assign(V,{Manager:re,Socket:He,io:V,connect:V});const rn=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];class on{constructor({onTrack:e,onIceCandidate:t,onConnectionChange:s}){R(this,"pc");R(this,"localStream",null);R(this,"remoteStream",new MediaStream);R(this,"_screenTrack",null);this.pc=new RTCPeerConnection({iceServers:rn}),this.pc.onicecandidate=({candidate:i})=>{i&&t(i)},this.pc.ontrack=({streams:i})=>{e(i[0])},this.pc.onconnectionstatechange=()=>{s(this.pc.connectionState)}}async startLocalMedia({audio:e=!0,video:t=!0}={}){try{return this.localStream=await navigator.mediaDevices.getUserMedia({audio:e,video:t}),this.localStream.getTracks().forEach(s=>{this.pc.addTrack(s,this.localStream)}),this.localStream}catch(s){throw s.name==="NotAllowedError"?new Error("Camera/mic permission denied"):s.name==="NotFoundError"?new Error("No camera or microphone found"):s}}async startScreenShare(){try{const e=await navigator.mediaDevices.getDisplayMedia({video:!0}),t=e.getVideoTracks()[0],s=this.pc.getSenders().find(i=>{var r;return((r=i.track)==null?void 0:r.kind)==="video"});return s&&await s.replaceTrack(t),t.onended=()=>this.stopScreenShare(),this._screenTrack=t,e}catch{throw new Error("Screen share cancelled or denied")}}async stopScreenShare(){if(!this._screenTrack)return;this._screenTrack.stop(),this._screenTrack=null;const t=(await navigator.mediaDevices.getUserMedia({video:!0})).getVideoTracks()[0],s=this.pc.getSenders().find(i=>{var r;return((r=i.track)==null?void 0:r.kind)==="video"});s&&await s.replaceTrack(t)}async createOffer(){const e=await this.pc.createOffer();return await this.pc.setLocalDescription(e),e}async handleOffer(e){await this.pc.setRemoteDescription(new RTCSessionDescription(e));const t=await this.pc.createAnswer();return await this.pc.setLocalDescription(t),t}async handleAnswer(e){await this.pc.setRemoteDescription(new RTCSessionDescription(e))}async addIceCandidate(e){try{await this.pc.addIceCandidate(new RTCIceCandidate(e))}catch(t){console.warn("Failed to add ICE candidate:",t)}}toggleAudio(e){var t;(t=this.localStream)==null||t.getAudioTracks().forEach(s=>s.enabled=e)}toggleVideo(e){var t;(t=this.localStream)==null||t.getVideoTracks().forEach(s=>s.enabled=e)}destroy(){var e,t;(e=this.localStream)==null||e.getTracks().forEach(s=>s.stop()),(t=this._screenTrack)==null||t.stop(),this.pc.close()}}const an="https://codemate-server-f3es.onrender.com";function cn(){const n=window.location.pathname.match(/\/problems\/([^/]+)/);return n?n[1]:null}function ln(){let n=localStorage.getItem("codemate_uid");return n||(n="user_"+crypto.randomUUID().replace(/-/g,"").slice(0,12),localStorage.setItem("codemate_uid",n)),n}function hn(){return`
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .card {
        background: #0f0f1a;
        border: 1px solid #2a2a40;
        border-radius: 14px;
        padding: 14px 16px;
        min-width: 240px;
        max-width: 280px;
        color: #e2e2f0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 13px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .brand {
        font-size: 11px;
        font-weight: 600;
        color: #7c3aed;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .presence {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #22c55e;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }

      .count-wrap { display: flex; align-items: baseline; gap: 4px; }
      .count { font-size: 24px; font-weight: 700; color: #a78bfa; line-height: 1; }
      .count-label { font-size: 12px; color: #6b7280; }

      .divider {
        height: 1px;
        background: #1e1e2e;
        margin: 10px 0;
      }

      .btn {
        width: 100%;
        padding: 9px 12px;
        border-radius: 8px;
        border: none;
        background: #7c3aed;
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s, opacity 0.2s;
        letter-spacing: 0.02em;
      }
      .btn:hover:not(:disabled) { background: #6d28d9; }
      .btn:disabled { background: #1e1e2e; color: #4b5563; cursor: default; }
      .btn.secondary {
        background: transparent;
        border: 1px solid #374151;
        color: #9ca3af;
        margin-top: 6px;
      }
      .btn.secondary:hover:not(:disabled) { border-color: #6b7280; color: #e2e2f0; }
      .btn.danger { background: #7f1d1d; color: #fca5a5; margin-top: 6px; }
      .btn.danger:hover:not(:disabled) { background: #991b1b; }

      .status {
        font-size: 11px;
        color: #6b7280;
        margin-top: 8px;
        text-align: center;
        min-height: 16px;
      }
      .status.success { color: #4ade80; }
      .status.error { color: #f87171; }

      .incoming-banner {
        background: #1a1040;
        border: 1px solid #4c1d95;
        border-radius: 8px;
        padding: 10px 12px;
        margin-top: 10px;
        display: none;
      }
      .incoming-banner.visible { display: block; }
      .incoming-name { font-weight: 600; color: #c4b5fd; font-size: 12px; }
      .incoming-actions { display: flex; gap: 6px; margin-top: 8px; }
      .incoming-actions .btn { margin-top: 0; padding: 6px; font-size: 12px; }

      .chat-wrap { display: none; margin-top: 10px; }
      .chat-wrap.open { display: block; }

      .chat-partner {
        font-size: 11px;
        color: #6b7280;
        margin-bottom: 6px;
        text-align: center;
      }
      .chat-partner span { color: #a78bfa; font-weight: 600; }

      .chat-box {
        background: #080810;
        border-radius: 8px;
        padding: 8px;
        height: 150px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        scrollbar-width: thin;
        scrollbar-color: #2a2a40 transparent;
      }

      .msg {
        font-size: 12px;
        line-height: 1.4;
        padding: 4px 8px;
        border-radius: 6px;
        max-width: 90%;
        word-break: break-word;
      }
      .msg.me {
        background: #2e1a5e;
        color: #c4b5fd;
        align-self: flex-end;
      }
      .msg.them {
        background: #1a1a2a;
        color: #d1d5db;
        align-self: flex-start;
      }

      .typing-indicator {
        font-size: 11px;
        color: #4b5563;
        padding: 2px 8px;
        font-style: italic;
        display: none;
      }
      .typing-indicator.visible { display: block; }

      .chat-input-row {
        display: flex;
        gap: 6px;
        margin-top: 8px;
      }
      .chat-input-row input {
        flex: 1;
        background: #0d0d1a;
        border: 1px solid #2a2a40;
        border-radius: 6px;
        padding: 7px 10px;
        color: #e2e2f0;
        font-size: 12px;
        outline: none;
        transition: border-color 0.2s;
      }
      .chat-input-row input:focus { border-color: #7c3aed; }
      .chat-input-row button {
        background: #7c3aed;
        border: none;
        border-radius: 6px;
        padding: 7px 12px;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
        white-space: nowrap;
      }
      .chat-input-row button:hover { background: #6d28d9; }

      .minimize-btn {
        background: none;
        border: none;
        color: #4b5563;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        padding: 0 2px;
        transition: color 0.2s;
      }
      .minimize-btn:hover { color: #9ca3af; }

      /* Call UI Styles */
      .call-wrap { display: none; margin-top: 10px; }
      .call-wrap.open { display: block; }

      .call-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #080810;
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 8px;
      }
      .call-status { font-size: 12px; color: #9ca3af; }
      .call-status .name { color: #a78bfa; font-weight: 600; }
      .call-timer { font-size: 13px; font-weight: 700; color: #4ade80; font-variant-numeric: tabular-nums; }

      .videos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        margin-bottom: 8px;
      }
      .video-wrap {
        background: #080810;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 4/3;
        position: relative;
      }
      .video-wrap video { width: 100%; height: 100%; object-fit: cover; }
      .video-label {
        position: absolute;
        bottom: 4px; left: 6px;
        font-size: 10px;
        color: rgba(255,255,255,0.7);
        background: rgba(0,0,0,0.4);
        padding: 1px 5px;
        border-radius: 4px;
      }
      
      .call-controls { display: flex; gap: 6px; }
      .ctrl-btn {
        flex: 1; padding: 8px 4px; border-radius: 8px; border: none;
        background: #1e1e30; color: #e2e2f0; font-size: 11px; cursor: pointer;
        transition: background 0.15s; display: flex; flex-direction: column;
        align-items: center; gap: 3px;
      }
      .ctrl-btn:hover { background: #2a2a44; }
      .ctrl-btn.active { background: #2e1065; color: #a78bfa; }
      .ctrl-btn.end { background: #7f1d1d; color: #fca5a5; }
      .ctrl-btn.end:hover { background: #991b1b; }
      .ctrl-icon { font-size: 16px; }

      .incoming-call {
        background: #0d1f0d;
        border: 1px solid #14532d;
        border-radius: 10px;
        padding: 12px;
        margin-top: 10px;
        display: none;
      }
      .incoming-call.visible { display: block; }
      .incoming-call-name { color: #4ade80; font-weight: 600; font-size: 13px; }
      .incoming-call-actions { display: flex; gap: 6px; margin-top: 8px; }

      .pill {
        display: none;
        align-items: center;
        gap: 6px;
        background: #0f0f1a;
        border: 1px solid #2a2a40;
        border-radius: 20px;
        padding: 6px 12px;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }
      .pill-count { font-size: 13px; font-weight: 700; color: #a78bfa; }
      .pill-label { font-size: 11px; color: #6b7280; }
    </style>

    <div class="pill" id="cm-pill">
      <div class="dot"></div>
      <span class="pill-count" id="cm-pill-count">--</span>
      <span class="pill-label">solving</span>
    </div>

    <div class="card" id="cm-card">
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

      <button class="btn" id="cm-match-btn">Find a partner</button>
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
  `}function dn(n){if(document.getElementById("codemate-root"))return;const e=document.createElement("div");e.id="codemate-root",e.style.cssText=`
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 2147483647;
  `;const t=e.attachShadow({mode:"open"});t.innerHTML=hn(),document.body.appendChild(e),un(t,n)}function un(n,e){const t=V(an,{transports:["websocket"]}),s=ln(),i="Coder_"+s.slice(-5);let r=null,a=null,l=null,c=null,m=null,p=0,f=!0,g=!0,C=!1;const We=n.getElementById("cm-count"),Ke=n.getElementById("cm-pill-count"),N=n.getElementById("cm-status"),E=n.getElementById("cm-match-btn"),K=n.getElementById("cm-incoming"),je=n.getElementById("cm-incoming-name"),Ye=n.getElementById("cm-accept-btn"),Je=n.getElementById("cm-decline-btn"),de=n.getElementById("cm-chat-wrap"),S=n.getElementById("cm-chat-box"),ue=n.getElementById("cm-typing"),I=n.getElementById("cm-msg-input"),Xe=n.getElementById("cm-send-btn"),Qe=n.getElementById("cm-end-btn"),j=n.getElementById("cm-partner-name"),Ge=n.getElementById("cm-minimize"),pe=n.getElementById("cm-card"),Y=n.getElementById("cm-pill"),B=n.getElementById("cm-start-call-btn"),fe=n.getElementById("cm-call-wrap"),Ze=n.getElementById("cm-call-partner"),me=n.getElementById("cm-call-timer"),J=n.getElementById("cm-local-video"),ge=n.getElementById("cm-remote-video"),ye=n.getElementById("cm-mic-btn"),be=n.getElementById("cm-cam-btn"),ve=n.getElementById("cm-screen-btn"),et=n.getElementById("cm-hangup-btn"),X=n.getElementById("cm-incoming-call"),tt=n.getElementById("cm-caller-name"),nt=n.getElementById("cm-answer-btn"),st=n.getElementById("cm-reject-btn");Ge.addEventListener("click",()=>{pe.style.display="none",Y.style.display="flex"}),Y.addEventListener("click",()=>{pe.style.display="block",Y.style.display="none"}),t.on("connect",()=>{t.emit("join:question",{questionSlug:e,userId:s,displayName:i})}),t.on("connect_error",()=>{x("Cannot connect to server","error")});function _e(o){We.textContent=String(o),Ke.textContent=String(o),chrome.runtime.sendMessage({type:"update_badge",count:o})}t.on("join:confirmed",({count:o})=>_e(o)),t.on("presence:update",({count:o})=>_e(o)),E.addEventListener("click",()=>{x("Looking for a partner..."),E.disabled=!0,t.emit("match:request",{questionSlug:e,userId:s})}),t.on("match:none",({message:o})=>{x(o,"error"),E.disabled=!1}),t.on("match:found",({partnerSocketId:o,partnerName:h})=>{a=o,x(`Found ${h||"someone"}! Sending request...`),t.emit("match:accept",{fromSocketId:o})}),t.on("match:incoming",({fromSocketId:o,fromName:h})=>{a=o,je.textContent=h||"Someone",K.classList.add("visible")}),Ye.addEventListener("click",()=>{K.classList.remove("visible"),t.emit("match:accept",{fromSocketId:a})}),Je.addEventListener("click",()=>{K.classList.remove("visible"),t.emit("match:decline",{fromSocketId:a}),a=null}),t.on("match:declined",({message:o})=>{x(o,"error"),E.disabled=!1}),t.on("match:accepted",({sessionRoom:o,partnerSocketId:h,partnerName:b})=>{r=o,a=h,j.textContent=b||"your partner",E.style.display="none",N.style.display="none",de.classList.add("open"),B.style.display="block",Se("Session started! Say hello 👋")});function we(){const o=I.value.trim();!o||!r||(t.emit("chat:message",{sessionRoom:r,message:o}),Ee(o,!0),I.value="")}Xe.addEventListener("click",we),I.addEventListener("keydown",o=>{o.key==="Enter"&&we()}),I.addEventListener("input",()=>{r&&(t.emit("chat:typing",{sessionRoom:r,isTyping:!0}),clearTimeout(l),l=setTimeout(()=>{t.emit("chat:typing",{sessionRoom:r,isTyping:!1})},1500))}),t.on("chat:message",({from:o,message:h,displayName:b})=>{o!==t.id&&(ue.classList.remove("visible"),Ee(h,!1,b))}),t.on("chat:typing",({from:o,isTyping:h})=>{o!==t.id&&ue.classList.toggle("visible",h)});function xe(o){return c=new on({onTrack:h=>{ge.srcObject=h},onIceCandidate:h=>{t.emit("webrtc:ice",{to:o,candidate:h})},onConnectionChange:h=>{h==="connected"&&at(),(h==="disconnected"||h==="failed")&&P()}}),c}async function it(o){r&&(t.emit("call:start",{to:o,sessionRoom:r}),x("Calling partner..."))}async function rt(o){if(!r||c)return;const h=xe(o),b=await h.startLocalMedia();J.srcObject=b;const A=await h.createOffer();t.emit("webrtc:offer",{to:o,offer:A}),ke(j.textContent||"partner")}async function ot(o){if(!r)return;const b=await xe(o).startLocalMedia();J.srcObject=b,t.emit("call:accept",{to:o,sessionRoom:r}),ke(j.textContent||"partner")}function P(o=!0){o&&a&&r&&t.emit("call:end",{to:a,sessionRoom:r}),c==null||c.destroy(),c=null,ct(),fe.classList.remove("open"),J.srcObject=null,ge.srcObject=null,B.style.display="block",f=!0,g=!0,C=!1,q()}function ke(o){Ze.textContent=o,fe.classList.add("open"),B.style.display="none"}B.addEventListener("click",()=>{a&&it(a)}),ye.addEventListener("click",()=>{f=!f,c==null||c.toggleAudio(f),t.emit("call:media",{to:a,audio:f,video:g}),q()}),be.addEventListener("click",()=>{g=!g,c==null||c.toggleVideo(g),t.emit("call:media",{to:a,audio:f,video:g}),q()}),ve.addEventListener("click",async()=>{if(c){if(C)await c.stopScreenShare(),C=!1;else try{await c.startScreenShare(),C=!0}catch(o){x(o.message,"error")}q()}}),et.addEventListener("click",()=>P(!0)),t.on("call:incoming",({from:o,fromName:h})=>{tt.textContent=h||"Someone",X.classList.add("visible"),nt.onclick=()=>{X.classList.remove("visible"),ot(o)},st.onclick=()=>{X.classList.remove("visible"),t.emit("call:reject",{to:o})}}),t.on("call:accepted",({from:o})=>{rt(o)}),t.on("webrtc:offer",async({from:o,offer:h})=>{if(!c)return;const b=await c.handleOffer(h);t.emit("webrtc:answer",{to:o,answer:b})}),t.on("webrtc:answer",async({answer:o})=>{c&&await c.handleAnswer(o)}),t.on("webrtc:ice",async({candidate:o})=>{c&&await c.addIceCandidate(o)}),t.on("call:ended",()=>{P(!1),Se("Call ended.")}),t.on("call:rejected",()=>{x("Call declined.","error"),B.style.display="block"}),Qe.addEventListener("click",()=>{P(!0),r=null,a=null,de.classList.remove("open"),E.style.display="block",E.disabled=!1,N.style.display="block",x("Session ended."),S.innerHTML=""}),setInterval(()=>t.emit("heartbeat"),6e4);function x(o,h=""){N.textContent=o,N.className="status"+(h?" "+h:"")}function Ee(o,h,b){const A=document.createElement("div");A.className="msg "+(h?"me":"them"),A.textContent=(h?"You":b||"Partner")+": "+o,S.appendChild(A),S.scrollTop=S.scrollHeight}function Se(o){const h=document.createElement("div");h.style.cssText="font-size:11px;color:#4b5563;text-align:center;padding:4px 0;",h.textContent=o,S.appendChild(h),S.scrollTop=S.scrollHeight}function q(){ye.classList.toggle("active",f),be.classList.toggle("active",g),ve.classList.toggle("active",C)}function at(){p=0,m=setInterval(()=>{p++;const o=String(Math.floor(p/60)).padStart(2,"0"),h=String(p%60).padStart(2,"0");me.textContent=`${o}:${h}`},1e3)}function ct(){m&&clearInterval(m),m=null,me.textContent="00:00"}}let Oe=null;function W(){const n=cn();if(n&&n!==Oe){const e=document.getElementById("codemate-root");e&&e.remove(),Oe=n,dn(n)}}const pn=new MutationObserver(W);pn.observe(document.body,{childList:!0,subtree:!0});const fn=history.pushState.bind(history);history.pushState=function(...n){fn(...n),setTimeout(W,500)};window.addEventListener("popstate",()=>setTimeout(W,500));W();
