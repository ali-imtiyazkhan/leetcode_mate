var Pt=Object.defineProperty;var qt=(n,e,t)=>e in n?Pt(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var z=(n,e,t)=>qt(n,typeof e!="symbol"?e+"":e,t);const C=Object.create(null);C.open="0";C.close="1";C.ping="2";C.pong="3";C.message="4";C.upgrade="5";C.noop="6";const J=Object.create(null);Object.keys(C).forEach(n=>{J[C[n]]=n});const de={type:"error",data:"parser error"},Xe=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Qe=typeof ArrayBuffer=="function",Ge=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n&&n.buffer instanceof ArrayBuffer,ge=({type:n,data:e},t,i)=>Xe&&e instanceof Blob?t?i(e):Ve(e,i):Qe&&(e instanceof ArrayBuffer||Ge(e))?t?i(e):Ve(new Blob([e]),i):i(C[n]+(e||"")),Ve=(n,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(n)};function He(n){return n instanceof Uint8Array?n:n instanceof ArrayBuffer?new Uint8Array(n):new Uint8Array(n.buffer,n.byteOffset,n.byteLength)}let ae;function zt(n,e){if(Xe&&n.data instanceof Blob)return n.data.arrayBuffer().then(He).then(e);if(Qe&&(n.data instanceof ArrayBuffer||Ge(n.data)))return e(He(n.data));ge(n,!1,t=>{ae||(ae=new TextEncoder),e(ae.encode(t))})}const We="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",M=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let n=0;n<We.length;n++)M[We.charCodeAt(n)]=n;const Dt=n=>{let e=n.length*.75,t=n.length,i,s=0,r,a,d,c;n[n.length-1]==="="&&(e--,n[n.length-2]==="="&&e--);const b=new ArrayBuffer(e),g=new Uint8Array(b);for(i=0;i<t;i+=4)r=M[n.charCodeAt(i)],a=M[n.charCodeAt(i+1)],d=M[n.charCodeAt(i+2)],c=M[n.charCodeAt(i+3)],g[s++]=r<<2|a>>4,g[s++]=(a&15)<<4|d>>2,g[s++]=(d&3)<<6|c&63;return b},Mt=typeof ArrayBuffer=="function",ye=(n,e)=>{if(typeof n!="string")return{type:"message",data:Ze(n,e)};const t=n.charAt(0);return t==="b"?{type:"message",data:Ut(n.substring(1),e)}:J[t]?n.length>1?{type:J[t],data:n.substring(1)}:{type:J[t]}:de},Ut=(n,e)=>{if(Mt){const t=Dt(n);return Ze(t,e)}else return{base64:!0,data:n}},Ze=(n,e)=>{switch(e){case"blob":return n instanceof Blob?n:new Blob([n]);case"arraybuffer":default:return n instanceof ArrayBuffer?n:n.buffer}},et="",Ft=(n,e)=>{const t=n.length,i=new Array(t);let s=0;n.forEach((r,a)=>{ge(r,!1,d=>{i[a]=d,++s===t&&e(i.join(et))})})},Vt=(n,e)=>{const t=n.split(et),i=[];for(let s=0;s<t.length;s++){const r=ye(t[s],e);if(i.push(r),r.type==="error")break}return i};function Ht(){return new TransformStream({transform(n,e){zt(n,t=>{const i=t.length;let s;if(i<126)s=new Uint8Array(1),new DataView(s.buffer).setUint8(0,i);else if(i<65536){s=new Uint8Array(3);const r=new DataView(s.buffer);r.setUint8(0,126),r.setUint16(1,i)}else{s=new Uint8Array(9);const r=new DataView(s.buffer);r.setUint8(0,127),r.setBigUint64(1,BigInt(i))}n.data&&typeof n.data!="string"&&(s[0]|=128),e.enqueue(s),e.enqueue(t)})}})}let ce;function Y(n){return n.reduce((e,t)=>e+t.length,0)}function K(n,e){if(n[0].length===e)return n.shift();const t=new Uint8Array(e);let i=0;for(let s=0;s<e;s++)t[s]=n[0][i++],i===n[0].length&&(n.shift(),i=0);return n.length&&i<n[0].length&&(n[0]=n[0].slice(i)),t}function Wt(n,e){ce||(ce=new TextDecoder);const t=[];let i=0,s=-1,r=!1;return new TransformStream({transform(a,d){for(t.push(a);;){if(i===0){if(Y(t)<1)break;const c=K(t,1);r=(c[0]&128)===128,s=c[0]&127,s<126?i=3:s===126?i=1:i=2}else if(i===1){if(Y(t)<2)break;const c=K(t,2);s=new DataView(c.buffer,c.byteOffset,c.length).getUint16(0),i=3}else if(i===2){if(Y(t)<8)break;const c=K(t,8),b=new DataView(c.buffer,c.byteOffset,c.length),g=b.getUint32(0);if(g>Math.pow(2,21)-1){d.enqueue(de);break}s=g*Math.pow(2,32)+b.getUint32(4),i=3}else{if(Y(t)<s)break;const c=K(t,s);d.enqueue(ye(r?c:ce.decode(c),e)),i=0}if(s===0||s>n){d.enqueue(de);break}}}})}const tt=4;function f(n){if(n)return jt(n)}function jt(n){for(var e in f.prototype)n[e]=f.prototype[e];return n}f.prototype.on=f.prototype.addEventListener=function(n,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+n]=this._callbacks["$"+n]||[]).push(e),this};f.prototype.once=function(n,e){function t(){this.off(n,t),e.apply(this,arguments)}return t.fn=e,this.on(n,t),this};f.prototype.off=f.prototype.removeListener=f.prototype.removeAllListeners=f.prototype.removeEventListener=function(n,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+n];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+n],this;for(var i,s=0;s<t.length;s++)if(i=t[s],i===e||i.fn===e){t.splice(s,1);break}return t.length===0&&delete this._callbacks["$"+n],this};f.prototype.emit=function(n){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+n],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,s=t.length;i<s;++i)t[i].apply(this,e)}return this};f.prototype.emitReserved=f.prototype.emit;f.prototype.listeners=function(n){return this._callbacks=this._callbacks||{},this._callbacks["$"+n]||[]};f.prototype.hasListeners=function(n){return!!this.listeners(n).length};const Z=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),w=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),Yt="arraybuffer";function nt(n,...e){return e.reduce((t,i)=>(n.hasOwnProperty(i)&&(t[i]=n[i]),t),{})}const Kt=w.setTimeout,Jt=w.clearTimeout;function ee(n,e){e.useNativeTimers?(n.setTimeoutFn=Kt.bind(w),n.clearTimeoutFn=Jt.bind(w)):(n.setTimeoutFn=w.setTimeout.bind(w),n.clearTimeoutFn=w.clearTimeout.bind(w))}const Xt=1.33;function Qt(n){return typeof n=="string"?Gt(n):Math.ceil((n.byteLength||n.size)*Xt)}function Gt(n){let e=0,t=0;for(let i=0,s=n.length;i<s;i++)e=n.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function it(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Zt(n){let e="";for(let t in n)n.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(n[t]));return e}function en(n){let e={},t=n.split("&");for(let i=0,s=t.length;i<s;i++){let r=t[i].split("=");e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])}return e}class tn extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class be extends f{constructor(e){super(),this.writable=!1,ee(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new tn(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=ye(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Zt(e);return t.length?"?"+t:""}}class nn extends be{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Vt(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,Ft(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=it()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let st=!1;try{st=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const sn=st;function rn(){}class on extends nn{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(s,r)=>{this.onError("xhr post error",s,r)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class S extends f{constructor(e,t,i){super(),this.createRequest=e,ee(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=nt(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let s in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(s)&&i.setRequestHeader(s,this._opts.extraHeaders[s])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var s;i.readyState===3&&((s=this._opts.cookieJar)===null||s===void 0||s.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(s){this.setTimeoutFn(()=>{this._onError(s)},0);return}typeof document<"u"&&(this._index=S.requestsCount++,S.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=rn,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete S.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}S.requestsCount=0;S.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",je);else if(typeof addEventListener=="function"){const n="onpagehide"in w?"pagehide":"unload";addEventListener(n,je,!1)}}function je(){for(let n in S.requests)S.requests.hasOwnProperty(n)&&S.requests[n].abort()}const an=function(){const n=rt({xdomain:!1});return n&&n.responseType!==null}();class cn extends on{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=an&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new S(rt,this.uri(),e)}}function rt(n){const e=n.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||sn))return new XMLHttpRequest}catch{}if(!e)try{return new w[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ot=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class ln extends be{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=ot?{}:nt(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(s){return this.emitReserved("error",s)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;ge(i,this.supportsBinary,r=>{try{this.doWrite(i,r)}catch{}s&&Z(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=it()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const le=w.WebSocket||w.MozWebSocket;class dn extends ln{createSocket(e,t,i){return ot?new le(e,t,i):t?new le(e,t):new le(e)}doWrite(e,t){this.ws.send(t)}}class pn extends be{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Wt(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),s=Ht();s.readable.pipeTo(e.writable),this._writer=s.writable.getWriter();const r=()=>{i.read().then(({done:d,value:c})=>{d||(this.onPacket(c),r())}).catch(d=>{})};r();const a={type:"open"};this.query.sid&&(a.data=`{"sid":"${this.query.sid}"}`),this._writer.write(a).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],s=t===e.length-1;this._writer.write(i).then(()=>{s&&Z(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const hn={websocket:dn,webtransport:pn,polling:cn},un=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,fn=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function pe(n){if(n.length>8e3)throw"URI too long";const e=n,t=n.indexOf("["),i=n.indexOf("]");t!=-1&&i!=-1&&(n=n.substring(0,t)+n.substring(t,i).replace(/:/g,";")+n.substring(i,n.length));let s=un.exec(n||""),r={},a=14;for(;a--;)r[fn[a]]=s[a]||"";return t!=-1&&i!=-1&&(r.source=e,r.host=r.host.substring(1,r.host.length-1).replace(/;/g,":"),r.authority=r.authority.replace("[","").replace("]","").replace(/;/g,":"),r.ipv6uri=!0),r.pathNames=mn(r,r.path),r.queryKey=gn(r,r.query),r}function mn(n,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function gn(n,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,s,r){s&&(t[s]=r)}),t}const he=typeof addEventListener=="function"&&typeof removeEventListener=="function",X=[];he&&addEventListener("offline",()=>{X.forEach(n=>n())},!1);class A extends f{constructor(e,t){if(super(),this.binaryType=Yt,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=pe(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=pe(t.host).host);ee(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const s=i.prototype.name;this.transports.push(s),this._transportsByName[s]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=en(this.opts.query)),he&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},X.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=tt,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&A.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",A.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const s=this.writeBuffer[i].data;if(s&&(t+=Qt(s)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Z(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,s){if(typeof t=="function"&&(s=t,t=void 0),typeof i=="function"&&(s=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const r={type:e,data:t,options:i};this.emitReserved("packetCreate",r),this.writeBuffer.push(r),s&&this.once("flush",s),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(A.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),he&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=X.indexOf(this._offlineEventListener);i!==-1&&X.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}A.protocol=tt;class yn extends A{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;A.priorWebsocketSuccess=!1;const s=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",y=>{if(!i)if(y.type==="pong"&&y.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;A.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(g(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const v=new Error("probe error");v.transport=t.name,this.emitReserved("upgradeError",v)}}))};function r(){i||(i=!0,g(),t.close(),t=null)}const a=y=>{const v=new Error("probe error: "+y);v.transport=t.name,r(),this.emitReserved("upgradeError",v)};function d(){a("transport closed")}function c(){a("socket closed")}function b(y){t&&y.name!==t.name&&r()}const g=()=>{t.removeListener("open",s),t.removeListener("error",a),t.removeListener("close",d),this.off("close",c),this.off("upgrading",b)};t.once("open",s),t.once("error",a),t.once("close",d),this.once("close",c),this.once("upgrading",b),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let bn=class extends yn{constructor(e,t={}){const i=typeof e=="object"?e:t;(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(s=>hn[s]).filter(s=>!!s)),super(e,i)}};function vn(n,e="",t){let i=n;t=t||typeof location<"u"&&location,n==null&&(n=t.protocol+"//"+t.host),typeof n=="string"&&(n.charAt(0)==="/"&&(n.charAt(1)==="/"?n=t.protocol+n:n=t.host+n),/^(https?|wss?):\/\//.test(n)||(typeof t<"u"?n=t.protocol+"//"+n:n="https://"+n),i=pe(n)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const r=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+r+":"+i.port+e,i.href=i.protocol+"://"+r+(t&&t.port===i.port?"":":"+i.port),i}const xn=typeof ArrayBuffer=="function",wn=n=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(n):n.buffer instanceof ArrayBuffer,at=Object.prototype.toString,kn=typeof Blob=="function"||typeof Blob<"u"&&at.call(Blob)==="[object BlobConstructor]",_n=typeof File=="function"||typeof File<"u"&&at.call(File)==="[object FileConstructor]";function ve(n){return xn&&(n instanceof ArrayBuffer||wn(n))||kn&&n instanceof Blob||_n&&n instanceof File}function Q(n,e){if(!n||typeof n!="object")return!1;if(Array.isArray(n)){for(let t=0,i=n.length;t<i;t++)if(Q(n[t]))return!0;return!1}if(ve(n))return!0;if(n.toJSON&&typeof n.toJSON=="function"&&arguments.length===1)return Q(n.toJSON(),!0);for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t)&&Q(n[t]))return!0;return!1}function En(n){const e=[],t=n.data,i=n;return i.data=ue(t,e),i.attachments=e.length,{packet:i,buffers:e}}function ue(n,e){if(!n)return n;if(ve(n)){const t={_placeholder:!0,num:e.length};return e.push(n),t}else if(Array.isArray(n)){const t=new Array(n.length);for(let i=0;i<n.length;i++)t[i]=ue(n[i],e);return t}else if(typeof n=="object"&&!(n instanceof Date)){const t={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=ue(n[i],e));return t}return n}function Sn(n,e){return n.data=fe(n.data,e),delete n.attachments,n}function fe(n,e){if(!n)return n;if(n&&n._placeholder===!0){if(typeof n.num=="number"&&n.num>=0&&n.num<e.length)return e[n.num];throw new Error("illegal attachments")}else if(Array.isArray(n))for(let t=0;t<n.length;t++)n[t]=fe(n[t],e);else if(typeof n=="object")for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&(n[t]=fe(n[t],e));return n}const Cn=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var h;(function(n){n[n.CONNECT=0]="CONNECT",n[n.DISCONNECT=1]="DISCONNECT",n[n.EVENT=2]="EVENT",n[n.ACK=3]="ACK",n[n.CONNECT_ERROR=4]="CONNECT_ERROR",n[n.BINARY_EVENT=5]="BINARY_EVENT",n[n.BINARY_ACK=6]="BINARY_ACK"})(h||(h={}));class Tn{constructor(e){this.replacer=e}encode(e){return(e.type===h.EVENT||e.type===h.ACK)&&Q(e)?this.encodeAsBinary({type:e.type===h.EVENT?h.BINARY_EVENT:h.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===h.BINARY_EVENT||e.type===h.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=En(e),i=this.encodeAsString(t.packet),s=t.buffers;return s.unshift(i),s}}class xe extends f{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===h.BINARY_EVENT;i||t.type===h.BINARY_ACK?(t.type=i?h.EVENT:h.ACK,this.reconstructor=new Bn(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(ve(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(h[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===h.BINARY_EVENT||i.type===h.BINARY_ACK){const r=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const a=e.substring(r,t);if(a!=Number(a)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const d=Number(a);if(!An(d)||d<0)throw new Error("Illegal attachments");if(d>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=d}if(e.charAt(t+1)==="/"){const r=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(r,t)}else i.nsp="/";const s=e.charAt(t+1);if(s!==""&&Number(s)==s){const r=t+1;for(;++t;){const a=e.charAt(t);if(a==null||Number(a)!=a){--t;break}if(t===e.length)break}i.id=Number(e.substring(r,t+1))}if(e.charAt(++t)){const r=this.tryParse(e.substr(t));if(xe.isPayloadValid(i.type,r))i.data=r;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case h.CONNECT:return Ye(t);case h.DISCONNECT:return t===void 0;case h.CONNECT_ERROR:return typeof t=="string"||Ye(t);case h.EVENT:case h.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&Cn.indexOf(t[0])===-1);case h.ACK:case h.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class Bn{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=Sn(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const An=Number.isInteger||function(n){return typeof n=="number"&&isFinite(n)&&Math.floor(n)===n};function Ye(n){return Object.prototype.toString.call(n)==="[object Object]"}const Ln=Object.freeze(Object.defineProperty({__proto__:null,Decoder:xe,Encoder:Tn,get PacketType(){return h}},Symbol.toStringTag,{value:"Module"}));function E(n,e,t){return n.on(e,t),function(){n.off(e,t)}}const Rn=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class ct extends f{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[E(e,"open",this.onopen.bind(this)),E(e,"packet",this.onpacket.bind(this)),E(e,"error",this.onerror.bind(this)),E(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,s,r;if(Rn.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const a={type:h.EVENT,data:t};if(a.options={},a.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const g=this.ids++,y=t.pop();this._registerAckCallback(g,y),a.id=g}const d=(s=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||s===void 0?void 0:s.writable,c=this.connected&&!(!((r=this.io.engine)===null||r===void 0)&&r._hasPingExpired());return this.flags.volatile&&!d||(c?(this.notifyOutgoingListeners(a),this.packet(a)):this.sendBuffer.push(a)),this.flags={},this}_registerAckCallback(e,t){var i;const s=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(s===void 0){this.acks[e]=t;return}const r=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let d=0;d<this.sendBuffer.length;d++)this.sendBuffer[d].id===e&&this.sendBuffer.splice(d,1);t.call(this,new Error("operation has timed out"))},s),a=(...d)=>{this.io.clearTimeoutFn(r),t.apply(this,d)};a.withError=!0,this.acks[e]=a}emitWithAck(e,...t){return new Promise((i,s)=>{const r=(a,d)=>a?s(a):i(d);r.withError=!0,t.push(r),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((s,...r)=>(this._queue[0],s!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(s)):(this._queue.shift(),t&&t(null,...r)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:h.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case h.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case h.EVENT:case h.BINARY_EVENT:this.onevent(e);break;case h.ACK:case h.BINARY_ACK:this.onack(e);break;case h.DISCONNECT:this.ondisconnect();break;case h.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...s){i||(i=!0,t.packet({type:h.ACK,id:e,data:s}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:h.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function I(n){n=n||{},this.ms=n.min||100,this.max=n.max||1e4,this.factor=n.factor||2,this.jitter=n.jitter>0&&n.jitter<=1?n.jitter:0,this.attempts=0}I.prototype.duration=function(){var n=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*n);n=Math.floor(e*10)&1?n+t:n-t}return Math.min(n,this.max)|0};I.prototype.reset=function(){this.attempts=0};I.prototype.setMin=function(n){this.ms=n};I.prototype.setMax=function(n){this.max=n};I.prototype.setJitter=function(n){this.jitter=n};class me extends f{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,ee(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new I({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const s=t.parser||Ln;this.encoder=new s.Encoder,this.decoder=new s.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new bn(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const s=E(t,"open",function(){i.onopen(),e&&e()}),r=d=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",d),e?e(d):this.maybeReconnectOnOpen()},a=E(t,"error",r);if(this._timeout!==!1){const d=this._timeout,c=this.setTimeoutFn(()=>{s(),r(new Error("timeout")),t.close()},d);this.opts.autoUnref&&c.unref(),this.subs.push(()=>{this.clearTimeoutFn(c)})}return this.subs.push(s),this.subs.push(a),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(E(e,"ping",this.onping.bind(this)),E(e,"data",this.ondata.bind(this)),E(e,"error",this.onerror.bind(this)),E(e,"close",this.onclose.bind(this)),E(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Z(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new ct(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(s=>{s?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",s)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const D={};function G(n,e){typeof n=="object"&&(e=n,n=void 0),e=e||{};const t=vn(n,e.path||"/socket.io"),i=t.source,s=t.id,r=t.path,a=D[s]&&r in D[s].nsps,d=e.forceNew||e["force new connection"]||e.multiplex===!1||a;let c;return d?c=new me(i,e):(D[s]||(D[s]=new me(i,e)),c=D[s]),t.query&&!e.query&&(e.query=t.queryKey),c.socket(t.path,e)}Object.assign(G,{Manager:me,Socket:ct,io:G,connect:G});const On=[{urls:"stun:stun.l.google.com:19302"},{urls:"stun:stun1.l.google.com:19302"}];class In{constructor({onTrack:e,onIceCandidate:t,onConnectionChange:i}){z(this,"pc");z(this,"localStream",null);z(this,"remoteStream",new MediaStream);z(this,"_screenTrack",null);this.pc=new RTCPeerConnection({iceServers:On}),this.pc.onicecandidate=({candidate:s})=>{s&&t(s)},this.pc.ontrack=({streams:s})=>{e(s[0])},this.pc.onconnectionstatechange=()=>{i(this.pc.connectionState)}}async startLocalMedia({audio:e=!0,video:t=!0}={}){try{return this.localStream=await navigator.mediaDevices.getUserMedia({audio:e,video:t}),this.localStream.getTracks().forEach(i=>{this.pc.addTrack(i,this.localStream)}),this.localStream}catch(i){throw i.name==="NotAllowedError"?new Error("Camera/mic permission denied"):i.name==="NotFoundError"?new Error("No camera or microphone found"):i}}async startScreenShare(){try{const e=await navigator.mediaDevices.getDisplayMedia({video:!0}),t=e.getVideoTracks()[0],i=this.pc.getSenders().find(s=>{var r;return((r=s.track)==null?void 0:r.kind)==="video"});return i&&await i.replaceTrack(t),t.onended=()=>this.stopScreenShare(),this._screenTrack=t,e}catch{throw new Error("Screen share cancelled or denied")}}async stopScreenShare(){if(!this._screenTrack)return;this._screenTrack.stop(),this._screenTrack=null;const t=(await navigator.mediaDevices.getUserMedia({video:!0})).getVideoTracks()[0],i=this.pc.getSenders().find(s=>{var r;return((r=s.track)==null?void 0:r.kind)==="video"});i&&await i.replaceTrack(t)}async createOffer(){const e=await this.pc.createOffer();return await this.pc.setLocalDescription(e),e}async handleOffer(e){await this.pc.setRemoteDescription(new RTCSessionDescription(e));const t=await this.pc.createAnswer();return await this.pc.setLocalDescription(t),t}async handleAnswer(e){await this.pc.setRemoteDescription(new RTCSessionDescription(e))}async addIceCandidate(e){try{await this.pc.addIceCandidate(new RTCIceCandidate(e))}catch(t){console.warn("Failed to add ICE candidate:",t)}}toggleAudio(e){var t;(t=this.localStream)==null||t.getAudioTracks().forEach(i=>i.enabled=e)}toggleVideo(e){var t;(t=this.localStream)==null||t.getVideoTracks().forEach(i=>i.enabled=e)}destroy(){var e,t;(e=this.localStream)==null||e.getTracks().forEach(i=>i.stop()),(t=this._screenTrack)==null||t.stop(),this.pc.close()}}const Ke="https://codemate-server-f3es.onrender.com";function Nn(){const n=window.location.pathname.match(/\/problems\/([^/]+)/);return n?n[1]:null}function $n(){let n=localStorage.getItem("codemate_uid");return n||(n="user_"+crypto.randomUUID().replace(/-/g,"").slice(0,12),localStorage.setItem("codemate_uid",n)),n}function Pn(){return`
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
        <button class="tab-btn" id="cm-tab-ai">✨ AI Solution</button>
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
    </div>
  `}function qn(n){if(document.getElementById("codemate-root"))return;const e=document.createElement("div");e.id="codemate-root",e.style.cssText=`
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 2147483647;
  `;const t=e.attachShadow({mode:"open"});t.innerHTML=Pn(),document.body.appendChild(e),zn(t,n)}function zn(n,e){const t=G(Ke,{transports:["websocket"],autoConnect:!1}),i=$n();let s=localStorage.getItem("codemate_username")||"",r=null,a=null,d=null,c=null,b=null,g=0,y=!0,v=!0,N=!1;const lt=n.getElementById("cm-count"),dt=n.getElementById("cm-pill-count"),U=n.getElementById("cm-status"),T=n.getElementById("cm-match-btn"),ne=n.getElementById("cm-incoming"),pt=n.getElementById("cm-incoming-name"),ht=n.getElementById("cm-accept-btn"),ut=n.getElementById("cm-decline-btn"),we=n.getElementById("cm-chat-wrap"),L=n.getElementById("cm-chat-box"),ke=n.getElementById("cm-typing"),F=n.getElementById("cm-msg-input"),ft=n.getElementById("cm-send-btn"),mt=n.getElementById("cm-end-btn"),ie=n.getElementById("cm-partner-name"),gt=n.getElementById("cm-minimize"),_e=n.getElementById("cm-card"),se=n.getElementById("cm-pill"),Ee=n.getElementById("cm-signin-wrap"),yt=n.getElementById("cm-name-input"),bt=n.getElementById("cm-signin-btn");function Se(){Ee.style.display="none",T.style.display="block",t.connect()}s?Se():(Ee.style.display="flex",T.style.display="none"),bt.addEventListener("click",()=>{const o=yt.value.trim();o&&(s=o,localStorage.setItem("codemate_username",s),Se())});const $=n.getElementById("cm-start-call-btn"),Ce=n.getElementById("cm-call-wrap"),vt=n.getElementById("cm-call-partner"),Te=n.getElementById("cm-call-timer"),re=n.getElementById("cm-local-video"),Be=n.getElementById("cm-remote-video"),Ae=n.getElementById("cm-mic-btn"),Le=n.getElementById("cm-cam-btn"),Re=n.getElementById("cm-screen-btn"),xt=n.getElementById("cm-hangup-btn"),oe=n.getElementById("cm-incoming-call"),wt=n.getElementById("cm-caller-name"),kt=n.getElementById("cm-answer-btn"),_t=n.getElementById("cm-reject-btn"),Oe=n.getElementById("cm-tab-main"),Ie=n.getElementById("cm-tab-ai"),Et=n.getElementById("cm-panel-main"),St=n.getElementById("cm-panel-ai"),Ct=n.getElementById("cm-ai-lang"),P=n.getElementById("cm-ai-generate"),Ne=n.getElementById("cm-ai-loading"),q=n.getElementById("cm-ai-error"),V=n.getElementById("cm-ai-output"),$e=n.getElementById("cm-ai-badge");function Pe(o){Oe.classList.toggle("active",o==="main"),Ie.classList.toggle("active",o==="ai"),Et.classList.toggle("active",o==="main"),St.classList.toggle("active",o==="ai")}Oe.addEventListener("click",()=>Pe("main")),Ie.addEventListener("click",()=>Pe("ai"));function Tt(){var m,k;const o=document.querySelector('[data-cy="question-title"]')||document.querySelector(".text-title-large")||document.querySelector('div[class*="title"] a')||document.querySelector('h4[class*="title"]')||document.querySelector('[class*="flexlayout__tab"] [class*="title"]');let l=((m=o==null?void 0:o.textContent)==null?void 0:m.trim())||"";!l&&e&&(l=e.split("-").map(_=>_.charAt(0).toUpperCase()+_.slice(1)).join(" "));const p=document.querySelector('[data-track-load="description_content"]')||document.querySelector('div[class*="elfjS"]')||document.querySelector(".question-content")||document.querySelector('[class*="_1l1MA"]');let u=((k=p==null?void 0:p.textContent)==null?void 0:k.trim())||"";if(!u){const _=document.querySelector('meta[name="description"]');u=(_==null?void 0:_.getAttribute("content"))||""}return!l&&!u?null:(u.length>3e3&&(u=u.substring(0,3e3)+"..."),{title:l,description:u})}function Bt(o,l){let p=o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");p=p.replace(/(\/\/.*$|#.*$)/gm,'<span class="tok-cm">$1</span>'),p=p.replace(/(\/\*[\s\S]*?\*\/)/g,'<span class="tok-cm">$1</span>'),p=p.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g,'<span class="tok-str">$1</span>'),p=p.replace(/\b(\d+\.?\d*)\b/g,'<span class="tok-num">$1</span>');const u={python:"def|class|return|if|elif|else|for|while|in|not|and|or|True|False|None|import|from|as|with|try|except|finally|raise|yield|lambda|pass|break|continue|self",javascript:"const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false",typescript:"const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|new|this|import|export|from|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|interface|type|enum|readonly|abstract|implements|extends",java:"public|private|protected|class|interface|extends|implements|return|if|else|for|while|do|switch|case|break|continue|new|this|super|static|final|void|int|long|double|float|boolean|char|String|null|true|false|try|catch|finally|throw|throws|import|package",cpp:"int|long|double|float|char|bool|void|string|vector|map|set|class|struct|return|if|else|for|while|do|switch|case|break|continue|new|delete|this|nullptr|true|false|const|auto|using|namespace|include|template|typename|public|private|protected|virtual|override|static",go:"func|return|if|else|for|range|switch|case|break|continue|var|const|type|struct|interface|map|chan|go|defer|select|package|import|nil|true|false|string|int|int64|float64|bool|error|make|append|len",rust:"fn|let|mut|return|if|else|for|while|loop|match|break|continue|struct|enum|impl|trait|pub|use|mod|self|Self|true|false|None|Some|Ok|Err|String|Vec|Box|Option|Result|i32|i64|f64|bool|usize|async|await|move|ref|where"},m=l.toLowerCase().replace("c++","cpp"),k=u[m]||u.python;return p=p.replace(new RegExp(`\\b(${k})\\b`,"g"),'<span class="tok-kw">$1</span>'),p=p.replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g,'<span class="tok-fn">$1</span>'),p}function At(o){let l="";const p=o.split(`
`);let u=!1,m="",k="",_=0;for(const x of p){if(x.trim().startsWith("```")&&!u){u=!0,k=x.trim().replace("```","").trim()||"text",m="";continue}if(x.trim().startsWith("```")&&u){u=!1;const O=Bt(m.trimEnd(),k),j=`cm-code-${_++}`;l+=`<div class="ai-code-wrap">
          <div class="ai-code-header">
            <span>${k}</span>
            <button class="ai-copy-btn" data-code-id="${j}">Copy</button>
          </div>
          <pre class="ai-code-block" id="${j}">${O}</pre>
        </div>`;continue}if(u){m+=x+`
`;continue}if(x.startsWith("## ")||x.startsWith("**")&&x.endsWith("**")){const O=x.replace(/^#+\s*/,"").replace(/\*\*/g,""),j=O.toLowerCase().includes("intuition")?"💡":O.toLowerCase().includes("approach")?"🎯":O.toLowerCase().includes("complexity")?"📊":O.toLowerCase().includes("code")?"💻":"📌";l+=`<div class="ai-section-title">${j} ${O}</div>`;continue}if(x.startsWith("# "))continue;let R=x.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/`([^`]+)`/g,'<code style="background:#1a1a1a;padding:1px 5px;border-radius:3px;font-size:11px;color:#ffa116">$1</code>').replace(/^- (.+)/,"• $1");R.trim()?R.toLowerCase().includes("time complexity")||R.toLowerCase().includes("space complexity")?l+=`<div class="ai-complexity">${R}</div>`:l+=`<div class="ai-text">${R}</div>`:l+='<div style="height:6px"></div>'}return l}async function Lt(){const o=Tt();if(!o){q.textContent="Could not read the problem from this page. Please make sure you are on a LeetCode problem page.",q.classList.add("visible");return}const l=Ct.value;q.classList.remove("visible"),V.classList.remove("visible"),$e.style.display="none",Ne.classList.add("visible"),P.disabled=!0,P.innerHTML="<span>⏳</span> Generating...";try{const p=await fetch(`${Ke}/ai/solve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug:e,title:o.title,description:o.description,language:l})}),u=await p.json();if(!p.ok)throw new Error(u.error||"Failed to generate solution");V.innerHTML=At(u.solution),V.classList.add("visible"),$e.style.display="inline-flex",V.querySelectorAll(".ai-copy-btn").forEach(m=>{m.addEventListener("click",()=>{const k=m.dataset.codeId;if(!k)return;const _=n.getElementById(k);if(!_)return;const x=_.textContent||"";navigator.clipboard.writeText(x).then(()=>{const R=m.textContent;m.textContent="Copied!",m.style.color="#2cbb5d",m.style.borderColor="#2cbb5d",setTimeout(()=>{m.textContent=R,m.style.color="",m.style.borderColor=""},2e3)})})})}catch(p){q.textContent=p.message||"Something went wrong. Please try again.",q.classList.add("visible")}finally{Ne.classList.remove("visible"),P.disabled=!1,P.innerHTML="<span>⚡</span> Generate Solution"}}P.addEventListener("click",Lt),gt.addEventListener("click",()=>{_e.style.display="none",se.style.display="flex"}),se.addEventListener("click",()=>{_e.style.display="block",se.style.display="none"}),t.on("connect",()=>{t.emit("join:question",{questionSlug:e,userId:i,displayName:s})}),t.on("connect_error",()=>{B("Cannot connect to server","error")});function qe(o){lt.textContent=String(o),dt.textContent=String(o),chrome.runtime.sendMessage({type:"update_badge",count:o})}t.on("join:confirmed",({count:o})=>qe(o)),t.on("presence:update",({count:o})=>qe(o)),T.addEventListener("click",()=>{B("Looking for a partner..."),T.disabled=!0,t.emit("match:request",{questionSlug:e,userId:i})}),t.on("match:none",({message:o})=>{B(o,"error"),T.disabled=!1}),t.on("match:found",({partnerSocketId:o,partnerName:l})=>{a=o,B(`Found ${l||"someone"}! Sending request...`),t.emit("match:accept",{fromSocketId:o})}),t.on("match:incoming",({fromSocketId:o,fromName:l})=>{a=o,pt.textContent=l||"Someone",ne.classList.add("visible")}),ht.addEventListener("click",()=>{ne.classList.remove("visible"),t.emit("match:accept",{fromSocketId:a})}),ut.addEventListener("click",()=>{ne.classList.remove("visible"),t.emit("match:decline",{fromSocketId:a}),a=null}),t.on("match:declined",({message:o})=>{B(o,"error"),T.disabled=!1}),t.on("match:accepted",({sessionRoom:o,partnerSocketId:l,partnerName:p})=>{r=o,a=l,ie.textContent=p||"your partner",T.style.display="none",U.style.display="none",we.classList.add("open"),$.style.display="block",Fe("Session started! Say hello 👋")});function ze(){const o=F.value.trim();!o||!r||(t.emit("chat:message",{sessionRoom:r,message:o}),Ue(o,!0),F.value="")}ft.addEventListener("click",ze),F.addEventListener("keydown",o=>{o.key==="Enter"&&ze()}),F.addEventListener("input",()=>{r&&(t.emit("chat:typing",{sessionRoom:r,isTyping:!0}),clearTimeout(d),d=setTimeout(()=>{t.emit("chat:typing",{sessionRoom:r,isTyping:!1})},1500))}),t.on("chat:message",({from:o,message:l,displayName:p})=>{o!==t.id&&(ke.classList.remove("visible"),Ue(l,!1,p))}),t.on("chat:typing",({from:o,isTyping:l})=>{o!==t.id&&ke.classList.toggle("visible",l)});function De(o){return c=new In({onTrack:l=>{Be.srcObject=l},onIceCandidate:l=>{t.emit("webrtc:ice",{to:o,candidate:l})},onConnectionChange:l=>{l==="connected"&&Nt(),(l==="disconnected"||l==="failed")&&H()}}),c}async function Rt(o){r&&(t.emit("call:start",{to:o,sessionRoom:r}),B("Calling partner..."))}async function Ot(o){if(!r||c)return;const l=De(o),p=await l.startLocalMedia();re.srcObject=p;const u=await l.createOffer();t.emit("webrtc:offer",{to:o,offer:u}),Me(ie.textContent||"partner")}async function It(o){if(!r)return;const p=await De(o).startLocalMedia();re.srcObject=p,t.emit("call:accept",{to:o,sessionRoom:r}),Me(ie.textContent||"partner")}function H(o=!0){o&&a&&r&&t.emit("call:end",{to:a,sessionRoom:r}),c==null||c.destroy(),c=null,$t(),Ce.classList.remove("open"),re.srcObject=null,Be.srcObject=null,$.style.display="block",y=!0,v=!0,N=!1,W()}function Me(o){vt.textContent=o,Ce.classList.add("open"),$.style.display="none"}$.addEventListener("click",()=>{a&&Rt(a)}),Ae.addEventListener("click",()=>{y=!y,c==null||c.toggleAudio(y),t.emit("call:media",{to:a,audio:y,video:v}),W()}),Le.addEventListener("click",()=>{v=!v,c==null||c.toggleVideo(v),t.emit("call:media",{to:a,audio:y,video:v}),W()}),Re.addEventListener("click",async()=>{if(c){if(N)await c.stopScreenShare(),N=!1;else try{await c.startScreenShare(),N=!0}catch(o){B(o.message,"error")}W()}}),xt.addEventListener("click",()=>H(!0)),t.on("call:incoming",({from:o,fromName:l})=>{wt.textContent=l||"Someone",oe.classList.add("visible"),kt.onclick=()=>{oe.classList.remove("visible"),It(o)},_t.onclick=()=>{oe.classList.remove("visible"),t.emit("call:reject",{to:o})}}),t.on("call:accepted",({from:o})=>{Ot(o)}),t.on("webrtc:offer",async({from:o,offer:l})=>{if(!c)return;const p=await c.handleOffer(l);t.emit("webrtc:answer",{to:o,answer:p})}),t.on("webrtc:answer",async({answer:o})=>{c&&await c.handleAnswer(o)}),t.on("webrtc:ice",async({candidate:o})=>{c&&await c.addIceCandidate(o)}),t.on("call:ended",()=>{H(!1),Fe("Call ended.")}),t.on("call:rejected",()=>{B("Call declined.","error"),$.style.display="block"}),mt.addEventListener("click",()=>{H(!0),r=null,a=null,we.classList.remove("open"),T.style.display="block",T.disabled=!1,U.style.display="block",B("Session ended."),L.innerHTML=""}),setInterval(()=>t.emit("heartbeat"),6e4);function B(o,l=""){U.textContent=o,U.className="status"+(l?" "+l:"")}function Ue(o,l,p){const u=document.createElement("div");u.className="msg "+(l?"me":"them"),u.textContent=(l?"You":p||"Partner")+": "+o,L.appendChild(u),L.scrollTop=L.scrollHeight}function Fe(o){const l=document.createElement("div");l.style.cssText="font-size:11px;color:#4b5563;text-align:center;padding:4px 0;",l.textContent=o,L.appendChild(l),L.scrollTop=L.scrollHeight}function W(){Ae.classList.toggle("active",y),Le.classList.toggle("active",v),Re.classList.toggle("active",N)}function Nt(){g=0,b=setInterval(()=>{g++;const o=String(Math.floor(g/60)).padStart(2,"0"),l=String(g%60).padStart(2,"0");Te.textContent=`${o}:${l}`},1e3)}function $t(){b&&clearInterval(b),b=null,Te.textContent="00:00"}}let Je=null;function te(){const n=Nn();if(n&&n!==Je){const e=document.getElementById("codemate-root");e&&e.remove(),Je=n,qn(n)}}const Dn=new MutationObserver(te);Dn.observe(document.body,{childList:!0,subtree:!0});const Mn=history.pushState.bind(history);history.pushState=function(...n){Mn(...n),setTimeout(te,500)};window.addEventListener("popstate",()=>setTimeout(te,500));te();
