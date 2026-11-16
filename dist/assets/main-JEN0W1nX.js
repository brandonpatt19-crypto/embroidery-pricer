var it=Object.defineProperty;var at=(e,n,t)=>n in e?it(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var be=(e,n,t)=>at(e,typeof n!="symbol"?n+"":n,t);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();const Le="Starting values: change to yours",he=[{label:"1–11",minQty:1,maxQty:11,discount:0},{label:"12–23",minQty:12,maxQty:23,discount:.05},{label:"24–47",minQty:24,maxQty:47,discount:.1},{label:"48–143",minQty:48,maxQty:143,discount:.15},{label:"144+",minQty:144,maxQty:null,discount:.2}],Ge={ratePer1000Stitches:1.5,pieceFee:1,minimumPerPiece:5,colorsIncluded:6,extraColorFee:.5,quantityBreaks:he.map(e=>({...e})),garmentMarkup:.4,machineSpeed:650,colorChangeSeconds:30,hoopingMinutes:1,heads:1};function xe(){return{...Ge,quantityBreaks:he.map(e=>({...e}))}}function Q(e){if(!Number.isFinite(e))return 0;const n=e<0?-1:1,t=Math.abs(e);return n*Math.floor(t*100+.5+1e-9)/100}function ot(e,n){const t=Math.max(1,Math.floor(e)),r=[...n].sort((i,a)=>i.minQty-a.minQty);for(const i of r)if(t>=i.minQty&&(i.maxQty===null||t<=i.maxQty))return i;for(let i=r.length-1;i>=0;i--)if(t>=r[i].minQty)return r[i];return r[0]??{label:"1+",minQty:1,maxQty:null,discount:0}}function st(e){const n=Math.max(0,e.stitches),t=Math.max(0,e.colorChanges),r=Math.max(1,Math.floor(e.quantity)),i=e.machineSpeed>0?e.machineSpeed:650,a=Math.max(0,e.colorChangeSeconds),s=Math.max(0,e.hoopingMinutes),l=e.heads>0?Math.floor(e.heads):1,p=n/i+t*(a/60)+s,S=Q(p),g=p*r/l,v=Q(g);return{minutesPerPieceRaw:p,minutesPerPiece:S,orderMachineMinutesRaw:g,orderMachineMinutes:v}}function ct(e,n=Ge){const t=Math.max(0,e.stitches),r=Math.max(1,Math.floor(e.colors)),i=e.colorChanges!==void 0?Math.max(0,Math.floor(e.colorChanges)):Math.max(0,r-1),a=Math.max(1,Math.floor(e.quantity)),s=Math.max(0,r-Math.max(0,Math.floor(n.colorsIncluded))),l=t/1e3*n.ratePer1000Stitches+n.pieceFee+n.extraColorFee*s,p=ot(a,n.quantityBreaks),S=p.discount,g=l*(1-S),v=g<n.minimumPerPiece,x=Math.max(g,n.minimumPerPiece),B=Q(x),P=(e.customerSuppliesGarment?0:Math.max(0,e.garmentCost))*(1+n.garmentMarkup),M=Q(P),d=Q(x+P),w=e.applySetupFee?Q(Math.max(0,e.setupFee)):0,F=Q(d*a+w),u=st({stitches:t,colorChanges:i,quantity:a,machineSpeed:n.machineSpeed,colorChangeSeconds:n.colorChangeSeconds,hoopingMinutes:n.hoopingMinutes,heads:n.heads}),R=u.minutesPerPiece>0?Q(B/u.minutesPerPiece*60):0,E=n.quantityBreaks.map(L=>{const c=l*(1-L.discount),y=Math.max(c,n.minimumPerPiece),b=Q(y),f=Q(y+P),h=Q(f*L.minQty+w),N=u.minutesPerPiece>0?Q(b/u.minutesPerPiece*60):0;return{label:L.label,minQty:L.minQty,maxQty:L.maxQty,discount:L.discount,decorationPerPiece:b,garmentPerPiece:M,perPiece:f,sampleOrderTotal:h,effectiveHourlyRate:N}});return{stitches:t,colors:r,colorChanges:i,extraColors:s,quantity:a,activeBreak:p,breakDiscount:S,baseDecoration:Q(l),discountedDecorationRaw:g,minimumApplied:v,decorationPerPiece:B,garmentPerPiece:M,perPiece:d,setupFeeApplied:w,orderTotal:F,minutesPerPieceRaw:u.minutesPerPieceRaw,minutesPerPiece:u.minutesPerPiece,orderMachineMinutesRaw:u.orderMachineMinutesRaw,orderMachineMinutes:u.orderMachineMinutes,effectiveHourlyRate:R,breakTable:E}}const ve=[null,{hex:"#0e1f7c",description:"Prussian Blue",catalogNumber:"1",brand:"Brother",chart:"Brother"},{hex:"#0a55a3",description:"Blue",catalogNumber:"2",brand:"Brother",chart:"Brother"},{hex:"#008777",description:"Teal Green",catalogNumber:"3",brand:"Brother",chart:"Brother"},{hex:"#4b6baf",description:"Cornflower Blue",catalogNumber:"4",brand:"Brother",chart:"Brother"},{hex:"#ed171f",description:"Red",catalogNumber:"5",brand:"Brother",chart:"Brother"},{hex:"#d15c00",description:"Reddish Brown",catalogNumber:"6",brand:"Brother",chart:"Brother"},{hex:"#913697",description:"Magenta",catalogNumber:"7",brand:"Brother",chart:"Brother"},{hex:"#e49acb",description:"Light Lilac",catalogNumber:"8",brand:"Brother",chart:"Brother"},{hex:"#915fac",description:"Lilac",catalogNumber:"9",brand:"Brother",chart:"Brother"},{hex:"#9ed67d",description:"Mint Green",catalogNumber:"10",brand:"Brother",chart:"Brother"},{hex:"#e8a900",description:"Deep Gold",catalogNumber:"11",brand:"Brother",chart:"Brother"},{hex:"#feba35",description:"Orange",catalogNumber:"12",brand:"Brother",chart:"Brother"},{hex:"#ffff00",description:"Yellow",catalogNumber:"13",brand:"Brother",chart:"Brother"},{hex:"#70bc1f",description:"Lime Green",catalogNumber:"14",brand:"Brother",chart:"Brother"},{hex:"#ba9800",description:"Brass",catalogNumber:"15",brand:"Brother",chart:"Brother"},{hex:"#a8a8a8",description:"Silver",catalogNumber:"16",brand:"Brother",chart:"Brother"},{hex:"#7d6f00",description:"Russet Brown",catalogNumber:"17",brand:"Brother",chart:"Brother"},{hex:"#ffffb3",description:"Cream Brown",catalogNumber:"18",brand:"Brother",chart:"Brother"},{hex:"#4f5556",description:"Pewter",catalogNumber:"19",brand:"Brother",chart:"Brother"},{hex:"#000000",description:"Black",catalogNumber:"20",brand:"Brother",chart:"Brother"},{hex:"#0b3d91",description:"Ultramarine",catalogNumber:"21",brand:"Brother",chart:"Brother"},{hex:"#770176",description:"Royal Purple",catalogNumber:"22",brand:"Brother",chart:"Brother"},{hex:"#293133",description:"Dark Gray",catalogNumber:"23",brand:"Brother",chart:"Brother"},{hex:"#2a1301",description:"Dark Brown",catalogNumber:"24",brand:"Brother",chart:"Brother"},{hex:"#f64a8a",description:"Deep Rose",catalogNumber:"25",brand:"Brother",chart:"Brother"},{hex:"#b27624",description:"Light Brown",catalogNumber:"26",brand:"Brother",chart:"Brother"},{hex:"#fcbbc5",description:"Salmon Pink",catalogNumber:"27",brand:"Brother",chart:"Brother"},{hex:"#fe370f",description:"Vermilion",catalogNumber:"28",brand:"Brother",chart:"Brother"},{hex:"#f0f0f0",description:"White",catalogNumber:"29",brand:"Brother",chart:"Brother"},{hex:"#6a1c8a",description:"Violet",catalogNumber:"30",brand:"Brother",chart:"Brother"},{hex:"#a8ddc4",description:"Seacrest",catalogNumber:"31",brand:"Brother",chart:"Brother"},{hex:"#2584bb",description:"Sky Blue",catalogNumber:"32",brand:"Brother",chart:"Brother"},{hex:"#feb343",description:"Pumpkin",catalogNumber:"33",brand:"Brother",chart:"Brother"},{hex:"#fff36b",description:"Cream Yellow",catalogNumber:"34",brand:"Brother",chart:"Brother"},{hex:"#d0a660",description:"Khaki",catalogNumber:"35",brand:"Brother",chart:"Brother"},{hex:"#d15400",description:"Clay Brown",catalogNumber:"36",brand:"Brother",chart:"Brother"},{hex:"#66ba49",description:"Leaf Green",catalogNumber:"37",brand:"Brother",chart:"Brother"},{hex:"#134a46",description:"Peacock Blue",catalogNumber:"38",brand:"Brother",chart:"Brother"},{hex:"#878787",description:"Gray",catalogNumber:"39",brand:"Brother",chart:"Brother"},{hex:"#d8ccc6",description:"Warm Gray",catalogNumber:"40",brand:"Brother",chart:"Brother"},{hex:"#435607",description:"Dark Olive",catalogNumber:"41",brand:"Brother",chart:"Brother"},{hex:"#fdd9de",description:"Flesh Pink",catalogNumber:"42",brand:"Brother",chart:"Brother"},{hex:"#f993bc",description:"Pink",catalogNumber:"43",brand:"Brother",chart:"Brother"},{hex:"#003822",description:"Deep Green",catalogNumber:"44",brand:"Brother",chart:"Brother"},{hex:"#b2afd4",description:"Lavender",catalogNumber:"45",brand:"Brother",chart:"Brother"},{hex:"#686ab0",description:"Wisteria Violet",catalogNumber:"46",brand:"Brother",chart:"Brother"},{hex:"#efe3b9",description:"Beige",catalogNumber:"47",brand:"Brother",chart:"Brother"},{hex:"#f73866",description:"Carmine",catalogNumber:"48",brand:"Brother",chart:"Brother"},{hex:"#b54b64",description:"Amber Red",catalogNumber:"49",brand:"Brother",chart:"Brother"},{hex:"#132b1a",description:"Olive Green",catalogNumber:"50",brand:"Brother",chart:"Brother"},{hex:"#c70156",description:"Dark Fuchsia",catalogNumber:"51",brand:"Brother",chart:"Brother"},{hex:"#fe9e32",description:"Tangerine",catalogNumber:"52",brand:"Brother",chart:"Brother"},{hex:"#a8deeb",description:"Light Blue",catalogNumber:"53",brand:"Brother",chart:"Brother"},{hex:"#00673e",description:"Emerald Green",catalogNumber:"54",brand:"Brother",chart:"Brother"},{hex:"#4e2990",description:"Purple",catalogNumber:"55",brand:"Brother",chart:"Brother"},{hex:"#2f7e20",description:"Moss Green",catalogNumber:"56",brand:"Brother",chart:"Brother"},{hex:"#ffcccc",description:"Flesh Pink",catalogNumber:"57",brand:"Brother",chart:"Brother"},{hex:"#ffd911",description:"Harvest Gold",catalogNumber:"58",brand:"Brother",chart:"Brother"},{hex:"#095ba6",description:"Electric Blue",catalogNumber:"59",brand:"Brother",chart:"Brother"},{hex:"#f0f970",description:"Lemon Yellow",catalogNumber:"60",brand:"Brother",chart:"Brother"},{hex:"#e3f35b",description:"Fresh Green",catalogNumber:"61",brand:"Brother",chart:"Brother"},{hex:"#ff9900",description:"Orange",catalogNumber:"62",brand:"Brother",chart:"Brother"},{hex:"#fff08d",description:"Cream Yellow",catalogNumber:"63",brand:"Brother",chart:"Brother"},{hex:"#ffc8c8",description:"Applique",catalogNumber:"64",brand:"Brother",chart:"Brother"}],$e=[{hex:"#1d4ed8",description:"Royal Blue (Default 1)"},{hex:"#dc2626",description:"Crimson Red (Default 2)"},{hex:"#15803d",description:"Forest Green (Default 3)"},{hex:"#d97706",description:"Amber Gold (Default 4)"},{hex:"#7c3aed",description:"Violet Purple (Default 5)"},{hex:"#0f766e",description:"Teal (Default 6)"},{hex:"#be185d",description:"Magenta (Default 7)"},{hex:"#374151",description:"Charcoal (Default 8)"},{hex:"#ea580c",description:"Burnt Orange (Default 9)"},{hex:"#0284c7",description:"Sky Blue (Default 10)"},{hex:"#4d7c0f",description:"Olive Green (Default 11)"},{hex:"#111827",description:"Jet Black (Default 12)"}];function Ie(e){const n=$e[e%$e.length];return{hex:n.hex,description:n.description,catalogNumber:String(e+1),brand:"Default Palette"}}function lt(e,n=3,t=null,r=!0){let i=-1,a=e.length-1,s=0,l=0,p=0,S=0,g=0,v=0,x=!1,B=!0;for(;i<a;){i+=1;const I=e[i],P=I.x-s,M=I.y-l;s=I.x,l=I.y;const d=I.command;if(d==="STITCH"||d==="SEQUIN_EJECT"?(B=!1,x=!1):(d==="COLOR_CHANGE"||d==="TRIM")&&(B=!0,x=!1),d==="JUMP"){if(x||(g=0,v=0,p=0,S=i,x=!0),p+=1,g+=P,v+=M,!B&&(p===n||t!==null&&(Math.abs(v)>t||Math.abs(g)>t))){const w=S>0?e[S-1].x:0,F=S>0?e[S-1].y:0;e.splice(S,0,{x:w,y:F,command:"TRIM"}),S+=1,i+=1,a+=1,B=!0}r&&g===0&&v===0&&(e.splice(S,i+1-S),i=S-1,a=e.length-1)}}}function dt(e,n){return!e||!n?!1:e.hex.toLowerCase()===n.hex.toLowerCase()&&(e.description??"")===(n.description??"")&&(e.catalogNumber??"")===(n.catalogNumber??"")&&(e.brand??"")===(n.brand??"")&&(e.chart??"")===(n.chart??"")}function ut(e,n){let t=0,r=!0,i=null;for(let a=0;a<e.length;a++){const l=e[a].command;if(l==="STITCH"){if(r){if(t>=n.length)return;i!==null&&t!==0&&dt(n[t-1]??void 0,n[t]??void 0)?(n.splice(t,1),e[i].command="STOP"):t+=1,r=!1}}else l==="COLOR_CHANGE"&&(r=!0,i=a)}}function Ue(e){const{format:n,filename:t,label:r,stitches:i,threads:a,warnings:s,headerMetadata:l}=e;let p=0,S=0,g=0,v=0,x=0,B=1/0,I=1/0,P=-1/0,M=-1/0;for(const C of i)switch(C.x>P&&(P=C.x),C.x<B&&(B=C.x),C.y>M&&(M=C.y),C.y<I&&(I=C.y),C.command){case"STITCH":p+=1;break;case"JUMP":S+=1;break;case"TRIM":g+=1;break;case"COLOR_CHANGE":v+=1;break;case"STOP":x+=1;break}const d=i.length>0&&Number.isFinite(B)&&Number.isFinite(P),w=d?B/10:0,F=d?I/10:0,u=d?P/10:0,R=d?M/10:0,E=d?(P-B)/10:0,L=d?(M-I)/10:0,c=E/25.4,y=L/25.4,b=v+1,f=[];for(let C=0;C<b;C++){const X=a[C];X&&X.hex?f.push(X):f.push(Ie(C))}const h=[];let N=0,T=[],$=[],G=0;const j=()=>{$.length>0&&(T.push({points:$}),$=[])},z=()=>{j(),h.push({index:N,color:f[N]??Ie(N),stitchCount:G,segments:T}),N+=1,T=[],G=0};for(const C of i)C.command==="STITCH"?($.push({x:C.x/10,y:C.y/10}),G+=1):C.command==="COLOR_CHANGE"?z():j();return z(),{format:n,filename:t,label:r,normalStitches:p,jumps:S,trims:g,colorChanges:v,stops:x,threadBlocks:b,widthMm:E,heightMm:L,widthIn:c,heightIn:y,boundsMm:{minX:w,minY:F,maxX:u,maxY:R},threads:f,blocks:h,warnings:s,headerMetadata:l}}const ue=512;function q(e,n){return e>>n&1}function ht(e,n,t){let r=0;return r+=q(t,2)*81,r+=q(t,3)*-81,r+=q(n,2)*27,r+=q(n,3)*-27,r+=q(e,2)*9,r+=q(e,3)*-9,r+=q(n,0)*3,r+=q(n,1)*-3,r+=q(e,0)*1,r+=q(e,1)*-1,r}function pt(e,n,t){let r=0;return r+=q(t,5)*81,r+=q(t,4)*-81,r+=q(n,5)*27,r+=q(n,4)*-27,r+=q(e,5)*9,r+=q(e,4)*-9,r+=q(n,7)*3,r+=q(n,6)*-3,r+=q(e,7)*1,r+=q(e,6)*-1,-r}function mt(e){const n=e.trim().replace(/^#/,"");return/^[0-9a-fA-F]{6}$/.test(n)?`#${n.toLowerCase()}`:"#000000"}function ft(e,n){if(e.byteLength<ue+3)return{ok:!1,error:"Invalid or truncated DST file: file is smaller than the 512-byte DST header plus one stitch record."};const t=e.subarray(0,ue);if(!new TextDecoder("utf-8",{fatal:!1}).decode(t.subarray(0,64)).includes("LA:"))return{ok:!1,error:"Invalid DST file: missing 'LA:' design label in the 512-byte Tajima header."};const a=(e.byteLength-ue)%3,s=a===1&&e[e.byteLength-1]===26;if(a!==0&&!s)return{ok:!1,error:"Truncated or corrupted DST file: stitch data length is not a multiple of 3-byte DST records."};const l={},p=[],S=new TextDecoder("utf-8",{fatal:!0});let g=0;for(let c=0;c<ue;c++){const y=t[c];if(y===13||y===10){const b=c,f=t.subarray(g,b);g=b;try{const h=S.decode(f).trim();if(h.length>3&&h[2]===":"){const N=h.slice(0,2).trim(),T=h.slice(3).trim();if(N==="LA")l.name=T;else if(N==="AU")l.author=T;else if(N==="CP")l.copyright=T;else if(N==="TC"){const $=T.split(",").map(G=>G.trim());p.push({hex:mt($[0]??"#000000"),description:$[1]??"Custom DST Thread",catalogNumber:$[2]??""})}else l[N]=T}}catch{}}}const v=[];let x=0,B=0,I=!1,P=0,M=!1;const d=(c,y,b)=>{const f=x+c,h=B+y;v.push({x:f,y:h,command:b}),x=f,B=h};let w=ue;for(;w+3<=e.byteLength;){const c=e[w],y=e[w+1],b=e[w+2];if(w+=3,(b&3)!==3)return{ok:!1,error:`Corrupted DST stitch record at byte offset ${w-3}: missing mandatory DST record tag bits.`};const f=ht(c,y,b),h=pt(c,y,b);if((b&243)===243){M=!0;break}else(b&195)===195?(P+=1,d(f,h,"COLOR_CHANGE")):(b&67)===67?(P+=1,d(f,h,"SEQUIN_MODE"),I=!I):(b&131)===131?(P+=1,I?d(f,h,"SEQUIN_EJECT"):d(f,h,"JUMP")):(P+=1,d(f,h,"STITCH"))}if(P===0)return{ok:!1,error:"Invalid DST file: file contains no stitch records."};d(0,0,"END"),lt(v,3,null,!0);const F=[];let u=0,R=0;for(const c of v)c.command==="STITCH"?u+=1:c.command==="COLOR_CHANGE"&&(R+=1);if(l.CO!==void 0){const c=Number.parseInt(l.CO,10);!Number.isNaN(c)&&c!==R&&F.push(`Header color change count (CO=${c}) disagrees with stitch records (${R} color changes). Using stitch records.`)}if(l.ST!==void 0){const c=Number.parseInt(l.ST,10),y=P+(M?1:0);!Number.isNaN(c)&&c!==u&&c!==y&&c!==P?F.push(`Header stitch count (ST=${c}) disagrees with stitch records (${u} normal stitches, ${y} total records). Using stitch records.`):!Number.isNaN(c)&&c!==u&&F.push(`Header ST (${c}) includes jumps/color-changes/end records; pricing uses ${u} normal stitches computed from stitch records.`)}const E=l.name||n.replace(/\.[^.]+$/,"");return{ok:!0,design:Ue({format:"dst",filename:n,label:E,stitches:v,threads:p,warnings:F,headerMetadata:l})}}const Re=16,De=32,qe=128;class bt{constructor(n){be(this,"view");be(this,"bytes");be(this,"pos",0);this.bytes=n,this.view=new DataView(n.buffer,n.byteOffset,n.byteLength)}get length(){return this.bytes.byteLength}seek(n,t="set"){t==="set"?this.pos=n:this.pos+=n}readU8(){return this.pos>=this.bytes.byteLength?null:this.bytes[this.pos++]}readU16LE(){if(this.pos+2>this.bytes.byteLength)return null;const n=this.view.getUint16(this.pos,!0);return this.pos+=2,n}readS16LE(){if(this.pos+2>this.bytes.byteLength)return null;const n=this.view.getInt16(this.pos,!0);return this.pos+=2,n}readU24LE(){if(this.pos+3>this.bytes.byteLength)return null;const n=this.bytes[this.pos],t=this.bytes[this.pos+1],r=this.bytes[this.pos+2];return this.pos+=3,n|t<<8|r<<16}readU24BE(){if(this.pos+3>this.bytes.byteLength)return null;const n=this.bytes[this.pos],t=this.bytes[this.pos+1],r=this.bytes[this.pos+2];return this.pos+=3,n<<16|t<<8|r}readU32LE(){if(this.pos+4>this.bytes.byteLength)return null;const n=this.view.getUint32(this.pos,!0);return this.pos+=4,n}readBytes(n){if(this.pos+n>this.bytes.byteLength)return null;const t=this.bytes.subarray(this.pos,this.pos+n);return this.pos+=n,t}readAscii(n){const t=this.readBytes(n);return t?new TextDecoder("utf-8",{fatal:!1}).decode(t):null}readPesString(){const n=this.readU8();return n===null||n===0?null:this.readAscii(n)}}function Ae(e){const n=e&4095;return n>2047?-4096+n:n}function Oe(e){return e>63?-128+e:e}function _e(e,n){const t=["name","category","author","keywords","comments"];for(const r of t){const i=e.readPesString();i&&i.length>0&&(n[r]=i)}}function gt(e){const n=e.readPesString()??void 0,t=e.readU24BE();if(t===null)return null;e.seek(5,"cur");const r=e.readPesString()??"",i=e.readPesString()??void 0,a=e.readPesString()??void 0;return{hex:`#${(t&16777215).toString(16).padStart(6,"0")}`,description:r,catalogNumber:n,brand:i,chart:a}}function se(e,n,t,r,i,a,s){if(e.seek(4,"cur"),_e(e,n),s!==void 0){e.seek(s,"cur");const x=e.readPesString();x&&x.length>0&&(n.hoop_name=x)}e.seek(r,"cur");const l=e.readPesString();l&&l.length>0&&(n[a]=l),e.seek(i,"cur");const p=e.readU16LE();if(p===null||p!==0)return;const S=e.readU16LE();if(S===null||S!==0)return;const g=e.readU16LE();if(g===null||g!==0)return;const v=e.readU16LE();if(v!==null)for(let x=0;x<v;x++){const B=gt(e);if(!B)break;t.push(B)}}function yt(e,n){const t=ve.length,r=[];if(n.length===0)for(let i=0;i<e.length;i++){const a=e[i]%t;r.push(ve[a]??null)}else if(n.length>=e.length)for(const i of n)r.push(i);else{const i=[...n],a=new Map;for(let s=0;s<e.length;s++){const l=e[s]%t;let p=a.get(l);p===void 0&&(i.length>0?p=i.shift()??null:p=ve[l]??null,a.set(l,p)),r.push(p)}}return r}function vt(e,n){if(e.byteLength<48)return{ok:!1,error:"Invalid or truncated PES file: file is too small to contain a PES/PEC header."};const t=new bt(e),r=t.readAscii(8);if(!r||!r.startsWith("#PES")&&r!=="#PEC0001")return{ok:!1,error:"Invalid PES file: file does not start with a valid '#PES' or '#PEC0001' signature."};const i={},a=[];let s=8;if(r!=="#PEC0001"){const c=t.readU32LE();if(c===null||c<12||c+532>e.byteLength)return{ok:!1,error:"Invalid or truncated PES file: PEC block offset in header points outside the file."};s=c;try{switch(r){case"#PES0100":i.version="10",se(t,i,a,38,34,"image_file",14);break;case"#PES0090":i.version="9",se(t,i,a,30,34,"image_file",14);break;case"#PES0080":i.version="8",se(t,i,a,38,26,"image_file");break;case"#PES0070":i.version="7",se(t,i,a,36,24,"image_file");break;case"#PES0060":i.version="6",se(t,i,a,36,24,"image_file");break;case"#PES0050":case"#PES0055":case"#PES0056":i.version=r==="#PES0050"?"5":r==="#PES0055"?"5.5":"5.6",se(t,i,a,24,24,"image");break;case"#PES0040":i.version="4",t.seek(4,"cur"),_e(t,i);break;case"#PES0030":i.version="3";break;case"#PES0022":i.version="2.2";break;case"#PES0020":i.version="2";break;case"#PES0001":i.version="1";break;default:i.version=r.slice(4);break}}catch{}}t.seek(s,"set"),t.seek(3,"cur");const l=t.readAscii(16);if(l===null)return{ok:!1,error:"Truncated PES/PEC block: could not read design label."};i.Name=l.trim(),t.seek(15,"cur");const p=t.readU8(),S=t.readU8();if(p===null||S===null)return{ok:!1,error:"Truncated PES/PEC block: missing graphic header fields."};t.seek(12,"cur");const g=t.readU8();if(g===null)return{ok:!1,error:"Truncated PES/PEC block: missing color change count byte."};const v=g===255?0:g,x=g===255?0:v+1,B=t.readBytes(x);if(!B)return{ok:!1,error:"Truncated PES/PEC block: file ends inside PEC color palette table."};const I=yt(B,a);if(t.seek(464-g,"cur"),t.readU24LE()===null)return{ok:!1,error:"Truncated PES/PEC block: missing stitch block length."};if(t.pos+11>t.length)return{ok:!1,error:"Truncated PES/PEC block: file ends before stitch data starts."};t.seek(11,"cur");const M=[];let d=0,w=0;const F=(c,y,b)=>{const f=d+c,h=w+y;M.push({x:f,y:h,command:b}),d=f,w=h};for(;;){const c=t.readU8(),y=t.readU8();if(c===null||y===null||c===255&&y===0)break;if(c===254&&y===176){t.seek(1,"cur"),F(0,0,"COLOR_CHANGE");continue}let b=!1,f=!1,h=0,N=0,T=y;if(c&qe){c&De&&(f=!0),c&Re&&(b=!0);const $=c<<8|T;if(h=Ae($),T=t.readU8(),T===null)break}else h=Oe(c);if(T&qe){T&De&&(f=!0),T&Re&&(b=!0);const $=t.readU8();if($===null)break;const G=T<<8|$;N=Ae(G)}else N=Oe(T);b?F(h,N,"JUMP"):f?(F(0,0,"TRIM"),F(h,N,"JUMP")):F(h,N,"STITCH")}if(M.length===0)return{ok:!1,error:"Invalid PES file: PEC section contains no stitch records."};F(0,0,"END"),ut(M,I);let u=0;for(const c of M)c.command==="COLOR_CHANGE"&&(u+=1);const R=[];v!==u&&R.push(`PEC header color change count (${v}) disagrees with stitch records (${u} color changes). Using stitch records.`);const E=i.name||i.Name||n.replace(/\.[^.]+$/,"");return{ok:!0,design:Ue({format:"pes",filename:n,label:E,stitches:M,threads:I,warnings:R,headerMetadata:i})}}const xt=10*1024*1024;function St(e,n){try{const t=e instanceof Uint8Array?e:new Uint8Array(e);if(t.byteLength===0)return{ok:!1,error:"The selected file is empty (0 bytes). Please choose a valid .dst or .pes embroidery file."};if(t.byteLength>xt)return{ok:!1,error:`File exceeds the 10 MB limit (${(t.byteLength/(1024*1024)).toFixed(1)} MB). Please upload a .dst or .pes file under 10 MB.`};if(t.byteLength>=3&&t[0]===255&&t[1]===216&&t[2]===255)return{ok:!1,error:"Unsupported file content: this file is a JPEG image, not a .dst or .pes embroidery file."};if(t.byteLength>=4&&t[0]===137&&t[1]===80&&t[2]===78&&t[3]===71)return{ok:!1,error:"Unsupported file content: this file is a PNG image, not a .dst or .pes embroidery file."};const r=n.trim().toLowerCase();return r.endsWith(".dst")?ft(t,n):r.endsWith(".pes")?vt(t,n):{ok:!1,error:"Unsupported file format. Please select a Tajima (.dst) or Brother (.pes) embroidery file."}}catch(t){return{ok:!1,error:`Could not read embroidery file: ${t instanceof Error?t.message:"Unknown parsing error"}`}}}const Se="embroidery_pricer_settings_v1";function V(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0}function kt(e){return!Array.isArray(e)||e.length!==he.length?he.map(n=>({...n})):he.map((n,t)=>{const r=e[t],i=r&&typeof r.discount=="number"&&Number.isFinite(r.discount)?Math.min(1,Math.max(0,r.discount)):n.discount;return{label:n.label,minQty:n.minQty,maxQty:n.maxQty,discount:i}})}function Pt(e){const n={rates:xe(),defaultSetupFee:0};try{const t=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!t)return n;const r=t.getItem(Se);if(!r)return n;const i=JSON.parse(r),a=i.rates??{},s=n.rates,l={ratePer1000Stitches:V(a.ratePer1000Stitches)?a.ratePer1000Stitches:s.ratePer1000Stitches,pieceFee:V(a.pieceFee)?a.pieceFee:s.pieceFee,minimumPerPiece:V(a.minimumPerPiece)?a.minimumPerPiece:s.minimumPerPiece,colorsIncluded:V(a.colorsIncluded)?Math.floor(a.colorsIncluded):s.colorsIncluded,extraColorFee:V(a.extraColorFee)?a.extraColorFee:s.extraColorFee,quantityBreaks:kt(a.quantityBreaks),garmentMarkup:V(a.garmentMarkup)?a.garmentMarkup:s.garmentMarkup,machineSpeed:V(a.machineSpeed)&&a.machineSpeed>0?a.machineSpeed:s.machineSpeed,colorChangeSeconds:V(a.colorChangeSeconds)?a.colorChangeSeconds:s.colorChangeSeconds,hoopingMinutes:V(a.hoopingMinutes)?a.hoopingMinutes:s.hoopingMinutes,heads:V(a.heads)&&a.heads>=1?Math.floor(a.heads):s.heads},p=V(i.defaultSetupFee)?i.defaultSetupFee:0;return{rates:l,defaultSetupFee:p}}catch{return n}}function Mt(e,n){try{const t=n!==void 0?n:typeof window<"u"?window.localStorage:null;return t?(t.setItem(Se,JSON.stringify(e)),!0):!1}catch{return!1}}function Bt(e){try{const n=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!n)return;n.removeItem(Se)}catch{}}function Qe(e,n,t){const r=e.getContext("2d");if(!r)return;const i=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,a=e.clientWidth||320,s=e.clientHeight||220;e.width=Math.round(a*i),e.height=Math.round(s*i),r.setTransform(i,0,0,i,0,0),r.fillStyle="#f8fafc",r.fillRect(0,0,a,s),r.strokeStyle="#e2e8f0",r.lineWidth=1;const l=20;for(let u=l;u<a;u+=l)r.beginPath(),r.moveTo(u,0),r.lineTo(u,s),r.stroke();for(let u=l;u<s;u+=l)r.beginPath(),r.moveTo(0,u),r.lineTo(a,u),r.stroke();const p=20,S=Math.max(40,a-p*2),g=Math.max(40,s-p*2);if(!n||n.blocks.length===0||n.normalStitches===0){const u=(t==null?void 0:t.widthMm)||88.9,R=(t==null?void 0:t.heightMm)||50.8,E=Math.max(1,Math.min(12,(t==null?void 0:t.colors)||3)),L=(t==null?void 0:t.stitches)??8e3,c=Math.min((S-28)/Math.max(1,u),(g-28)/Math.max(1,R)),y=Math.max(44,Math.min(S-16,u*c)),b=Math.max(36,Math.min(g-24,R*c)),f=a/2,h=s/2-4,N=f-y/2,T=h-b/2,$=Math.min(a*.44,Math.max(y*.66,72)),G=Math.min(s*.41,Math.max(b*.72,54));r.save(),r.strokeStyle="#cbd5e1",r.lineWidth=6,r.beginPath(),r.ellipse(f,h,$,G,0,0,Math.PI*2),r.stroke(),r.strokeStyle="#94a3b8",r.lineWidth=1.5,r.beginPath(),r.ellipse(f,h,$-3.5,G-3.5,0,0,Math.PI*2),r.stroke(),r.fillStyle="#94a3b8",r.fillRect(f-10,h-G-7,20,6),r.restore();const j=["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"],z=Math.min(y,b)*.34;if(r.save(),r.strokeStyle=j[0],r.lineWidth=Math.max(3,z*.22),r.setLineDash([2,1.5]),r.beginPath(),r.ellipse(f,h,y*.38,b*.34,0,0,Math.PI*2),r.stroke(),r.restore(),E>=2){r.save(),r.strokeStyle=j[1],r.lineWidth=1.35;const K=y*.28,U=b*.23;for(let _=-U+3;_<=U-3;_+=3.2){const ne=Math.max(0,1-_*_/(U*U)),te=K*Math.sqrt(ne);r.beginPath(),r.moveTo(f-te,h+_),r.lineTo(f+te,h+_),r.stroke()}r.restore()}if(E>=3){r.save(),r.strokeStyle=j[2],r.fillStyle=j[2],r.lineWidth=2;const K=Math.min(y,b)*.16;r.beginPath();for(let U=0;U<10;U++){const _=U%2===0?K:K*.45,ne=U*Math.PI/5-Math.PI/2,te=f+Math.cos(ne)*_,pe=h+Math.sin(ne)*_;U===0?r.moveTo(te,pe):r.lineTo(te,pe)}r.closePath(),r.fill(),r.restore()}r.strokeStyle="#475569",r.setLineDash([4,3]),r.lineWidth=1.25,r.strokeRect(N,T,y,b),r.setLineDash([]);const C=22,X=Math.min(a-16,290),ce=(a-X)/2,re=s-C-6;r.fillStyle="rgba(15, 23, 42, 0.84)",r.beginPath(),r.roundRect(ce,re,X,C,11),r.fill(),r.fillStyle="#ffffff",r.font="600 11.5px system-ui, -apple-system, sans-serif",r.textAlign="center",r.textBaseline="middle";const le=`${L.toLocaleString()} sts · ${(u/25.4).toFixed(2)}" × ${(R/25.4).toFixed(2)}" (${u.toFixed(1)}×${R.toFixed(1)} mm)`;r.fillText(le,a/2,re+C/2);return}const{minX:v,minY:x,maxX:B,maxY:I}=n.boundsMm,P=Math.max(.5,B-v),M=Math.max(.5,I-x),d=Math.min(S/P,g/M),w=p+(S-P*d)/2-v*d,F=p+(g-M*d)/2-x*d;r.lineCap="round",r.lineJoin="round",r.lineWidth=Math.max(.9,Math.min(1.8,d*.35));for(const u of n.blocks){r.strokeStyle=u.color.hex||"#1d4ed8",r.beginPath();for(const R of u.segments){const E=R.points;if(E.length!==0){r.moveTo(E[0].x*d+w,E[0].y*d+F);for(let L=1;L<E.length;L++)r.lineTo(E[L].x*d+w,E[L].y*d+F)}}r.stroke()}}function O(e){return`$${e.toFixed(2)}`}function Ct(e,n){const t=(n.widthMm/25.4).toFixed(2),r=(n.heightMm/25.4).toFixed(2),i=Math.round(e.breakDiscount*100),a=[`EMBROIDERY JOB QUOTE — ${n.designName||"Custom Design"}`,"----------------------------------------",`Quantity: ${e.quantity} pcs (Tier ${e.activeBreak.label}, ${i}% break)`,`Design: ${e.stitches.toLocaleString()} stitches | ${e.colors} color(s) (${e.colorChanges} color change(s))`,`Dimensions: ${t}" × ${r}" (${n.widthMm.toFixed(1)} × ${n.heightMm.toFixed(1)} mm)`,"","PRICING BREAKDOWN",`- Decoration per piece: ${O(e.decorationPerPiece)}${e.minimumApplied?" (minimum applied)":""}`];n.customerSuppliesGarment?a.push("- Garment: Customer-supplied ($0.00)"):a.push(`- Garment per piece: ${O(e.garmentPerPiece)} (cost ${O(n.garmentCost)} + ${Math.round(n.garmentMarkup*100)}% markup)`),a.push(`- Total price per piece: ${O(e.perPiece)}`),e.setupFeeApplied>0&&a.push(`- One-time setup fee: ${O(e.setupFeeApplied)}`),a.push(`- ORDER TOTAL (${e.quantity} pcs): ${O(e.orderTotal)}`),a.push(""),a.push("QUANTITY PRICE BREAKS (Per Piece / Order Total)");for(const s of e.breakTable){const l=Math.round(s.discount*100);a.push(`  ${s.label.padEnd(7," ")} (${String(l).padStart(2," ")}% off): ${O(s.perPiece)}/pc  (${s.minQty} pcs = ${O(s.sampleOrderTotal)})`)}return a.join(`
`)}const wt=`
<div class="pricer-app" id="pricer-app-container">
  <!-- Top Promise & Drop Zone (Step 1 & 2) -->
  <section class="card drop-section no-print" aria-labelledby="drop-heading">
    <div class="drop-header">
      <h2 id="drop-heading" class="section-title">1. Add Your Embroidery Design (.DST or .PES)</h2>
      <p class="privacy-badge">
        <span aria-hidden="true">&#128274;</span> Your design file never leaves your computer — read 100% locally in your browser.
      </p>
    </div>

    <div
      id="drop-zone"
      class="drop-zone"
      tabindex="0"
      role="button"
    >
      <label for="design-file-input" class="sr-only">Choose a .dst or .pes embroidery file</label>
      <input
        type="file"
        id="design-file-input"
        class="sr-only"
        accept=".dst,.pes,application/octet-stream"
      />
      <div class="drop-zone-content">
        <div class="drop-icon-badge" aria-hidden="true">
          <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="6" width="32" height="28" rx="6" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2"/>
            <circle cx="20" cy="20" r="9" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="2" stroke-dasharray="3 2"/>
            <path d="M20 14L21.8 18.2L26 20L21.8 21.8L20 26L18.2 21.8L14 20L18.2 18.2L20 14Z" fill="#DC2626"/>
            <path d="M15 6V3M25 6V3" stroke="#1D4ED8" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="drop-primary-text">
          <strong>Drop a .DST or .PES file here</strong> or <span class="link-styled">choose a file</span>
        </p>
        <p class="drop-secondary-text">
          Supports Tajima (.dst) and Brother (.pes) files up to 10 MB &middot; Instant stitch &amp; color preview
        </p>
      </div>
    </div>

    <div class="mode-actions">
      <button type="button" id="btn-manual-mode" class="btn btn-secondary">
        Enter stitch count instead (Manual mode)
      </button>
      <span id="loaded-file-badge" class="status-pill" aria-live="polite">
        Mode: Manual / Sample 8,000-stitch cap logo
      </span>
    </div>

    <div id="file-error-alert" class="alert alert-error" role="alert" hidden></div>
    <div id="file-warning-alert" class="alert alert-warning" role="status" hidden></div>
  </section>

  <!-- Main Two-Column Workspace: Left = Design & Job Inputs, Right = Answer & Quote -->
  <div class="workspace-grid">
    <div class="workspace-left no-print">
      <!-- Step 3: See the Design & Override Any Number -->
      <section class="card design-section" aria-labelledby="design-heading">
        <div class="section-header-row">
          <h2 id="design-heading" class="section-title">2. Design Details &amp; Preview</h2>
          <span class="hint-text">Every number below can be overridden</span>
        </div>

        <div class="preview-wrapper">
          <canvas
            id="stitch-preview-canvas"
            class="stitch-canvas"
            width="360"
            height="220"
            aria-label="Embroidery stitch path preview"
          ></canvas>
          <div id="thread-swatches" class="thread-swatches" aria-label="Thread color sequence"></div>
        </div>

        <div class="form-grid form-grid-2">
          <div class="field">
            <label for="input-design-name">Design / Job Name</label>
            <input type="text" id="input-design-name" value="8,000-Stitch Cap Logo" />
          </div>
          <div class="field">
            <label for="input-stitches">Normal Stitches (priced)</label>
            <input type="number" id="input-stitches" min="0" max="5000000" step="100" value="8000" />
          </div>
          <div class="field">
            <label for="input-colors">Thread Colors (Blocks)</label>
            <input type="number" id="input-colors" min="1" max="99" step="1" value="3" />
          </div>
          <div class="field">
            <label for="input-color-changes">Color Changes</label>
            <input type="number" id="input-color-changes" min="0" max="98" step="1" value="2" />
          </div>
          <div class="field">
            <label for="input-jumps">Jumps (unpriced)</label>
            <input type="number" id="input-jumps" min="0" max="500000" step="1" value="0" />
          </div>
          <div class="field">
            <label for="input-trims">Trims (unpriced)</label>
            <input type="number" id="input-trims" min="0" max="500000" step="1" value="0" />
          </div>
          <div class="field">
            <label for="input-width-in">Width (inches)</label>
            <input type="number" id="input-width-in" min="0.1" max="100" step="0.05" value="3.50" />
          </div>
          <div class="field">
            <label for="input-width-mm">Width (mm)</label>
            <input type="number" id="input-width-mm" min="1" max="2540" step="0.5" value="88.9" />
          </div>
          <div class="field">
            <label for="input-height-in">Height (inches)</label>
            <input type="number" id="input-height-in" min="0.1" max="100" step="0.05" value="2.00" />
          </div>
          <div class="field">
            <label for="input-height-mm">Height (mm)</label>
            <input type="number" id="input-height-mm" min="1" max="2540" step="0.5" value="50.8" />
          </div>
          <div class="field field-span-2">
            <div class="label-row">
              <label for="input-minutes-override">Estimated Machine Time (min / piece)</label>
              <button type="button" id="btn-reset-minutes" class="btn-inline-link" hidden>
                Reset to calculated
              </button>
            </div>
            <input
              type="number"
              id="input-minutes-override"
              min="0.1"
              max="10000"
              step="0.05"
              value="14.31"
            />
          </div>
        </div>
      </section>

      <!-- Step 4: Set the Job -->
      <section class="card job-section" aria-labelledby="job-heading">
        <h2 id="job-heading" class="section-title">3. Job &amp; Garment Details</h2>
        <div class="form-grid form-grid-2">
          <div class="field">
            <label for="input-quantity">Order Quantity (pieces)</label>
            <input type="number" id="input-quantity" min="1" max="100000" step="1" value="24" />
          </div>

          <div class="field checkbox-field">
            <label class="checkbox-label" for="input-customer-garment">
              <input type="checkbox" id="input-customer-garment" checked />
              <span>Customer supplies garment ($0 garment cost)</span>
            </label>
          </div>

          <div class="field" id="garment-cost-field-wrap">
            <label for="input-garment-cost">Blank Garment Cost ($ / piece)</label>
            <input type="number" id="input-garment-cost" min="0" max="1000" step="0.25" value="4.50" disabled />
          </div>

          <div class="field checkbox-field">
            <label class="checkbox-label" for="input-apply-setup">
              <input type="checkbox" id="input-apply-setup" />
              <span>Add one-time setup / digitizing fee</span>
            </label>
          </div>

          <div class="field" id="setup-fee-field-wrap">
            <label for="input-setup-fee">One-Time Setup Fee ($)</label>
            <input type="number" id="input-setup-fee" min="0" max="5000" step="1" value="0" disabled />
          </div>
        </div>
      </section>

      <!-- Step 5: Adjust Rates (folded away by default) -->
      <details id="rate-settings-details" class="card rates-details">
        <summary class="rates-summary">
          <span>4. Shop Rate Settings &amp; Machine Speed</span>
          <span class="starting-values-tag">${Le}</span>
        </summary>
        <div class="rates-body">
          <p class="rates-note">
            <strong>${Le}.</strong> Changes save automatically in this browser for your next visit.
          </p>

          <div class="form-grid form-grid-2">
            <div class="field">
              <label for="rate-per-1000">Rate per 1,000 Stitches ($)</label>
              <input type="number" id="rate-per-1000" min="0" max="100" step="0.05" value="1.50" />
            </div>
            <div class="field">
              <label for="rate-piece-fee">Per-Piece Fee (hooping/handling $)</label>
              <input type="number" id="rate-piece-fee" min="0" max="100" step="0.10" value="1.00" />
            </div>
            <div class="field">
              <label for="rate-minimum">Minimum Decoration per Piece ($)</label>
              <input type="number" id="rate-minimum" min="0" max="500" step="0.25" value="5.00" />
            </div>
            <div class="field">
              <label for="rate-colors-included">Colors Included in Base</label>
              <input type="number" id="rate-colors-included" min="1" max="50" step="1" value="6" />
            </div>
            <div class="field">
              <label for="rate-extra-color-fee">Fee per Extra Color ($)</label>
              <input type="number" id="rate-extra-color-fee" min="0" max="50" step="0.10" value="0.50" />
            </div>
            <div class="field">
              <label for="rate-garment-markup">Garment Markup (%)</label>
              <input type="number" id="rate-garment-markup" min="0" max="500" step="1" value="40" />
            </div>
            <div class="field">
              <label for="rate-machine-speed">Machine Speed (stitches / min)</label>
              <input type="number" id="rate-machine-speed" min="50" max="3000" step="10" value="650" />
            </div>
            <div class="field">
              <label for="rate-change-seconds">Color Change Time (seconds)</label>
              <input type="number" id="rate-change-seconds" min="0" max="600" step="5" value="30" />
            </div>
            <div class="field">
              <label for="rate-hooping-minutes">Hooping / Handling Time (min / pc)</label>
              <input type="number" id="rate-hooping-minutes" min="0" max="120" step="0.25" value="1" />
            </div>
            <div class="field">
              <label for="rate-heads">Machine Heads Running Order</label>
              <input type="number" id="rate-heads" min="1" max="64" step="1" value="1" />
            </div>
          </div>

          <fieldset class="breaks-fieldset">
            <legend>Quantity Break Discounts (% off decoration)</legend>
            <div class="breaks-grid">
              <div class="field">
                <label for="break-discount-0">1–11 pcs (%)</label>
                <input type="number" id="break-discount-0" min="0" max="90" step="1" value="0" />
              </div>
              <div class="field">
                <label for="break-discount-1">12–23 pcs (%)</label>
                <input type="number" id="break-discount-1" min="0" max="90" step="1" value="5" />
              </div>
              <div class="field">
                <label for="break-discount-2">24–47 pcs (%)</label>
                <input type="number" id="break-discount-2" min="0" max="90" step="1" value="10" />
              </div>
              <div class="field">
                <label for="break-discount-3">48–143 pcs (%)</label>
                <input type="number" id="break-discount-3" min="0" max="90" step="1" value="15" />
              </div>
              <div class="field">
                <label for="break-discount-4">144+ pcs (%)</label>
                <input type="number" id="break-discount-4" min="0" max="90" step="1" value="20" />
              </div>
            </div>
          </fieldset>

          <div class="rates-actions">
            <button type="button" id="btn-reset-rates" class="btn btn-secondary">
              Reset rates to starting defaults
            </button>
            <span id="storage-status-note" class="hint-text" aria-live="polite">
              Settings saved locally in browser
            </span>
          </div>
        </div>
      </details>
    </div>

    <!-- Right Column: Step 6, 7, 8 (Results, Quantity Table, Quote, Print View, Waitlist) -->
    <div class="workspace-right">
      <section class="card results-section" aria-labelledby="results-heading">
        <div class="print-only-header">
          <h2 class="print-quote-title">Embroidery Job Quote</h2>
          <p id="print-design-subtitle" class="print-quote-meta">8,000-Stitch Cap Logo · 24 pieces</p>
        </div>

        <h2 id="results-heading" class="section-title no-print">Per-Piece Price &amp; Order Summary</h2>

        <div class="kpi-grid">
          <div class="kpi-card kpi-primary">
            <span class="kpi-label">Price per Piece</span>
            <strong id="out-per-piece" class="kpi-value">$11.70</strong>
            <span id="out-per-piece-sub" class="kpi-sub">Decoration $11.70 · Garment $0.00 (10% break)</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Order Total</span>
            <strong id="out-order-total" class="kpi-value">$280.80</strong>
            <span id="out-order-total-sub" class="kpi-sub">24 pieces · $0.00 setup fee</span>
          </div>
          <div class="kpi-card no-print-optional">
            <span class="kpi-label">Effective Hourly Rate</span>
            <strong id="out-hourly-rate" class="kpi-value">$49.06/hr</strong>
            <span id="out-machine-time" class="kpi-sub">14.31 min/pc · 343.38 min order</span>
          </div>
        </div>

        <!-- Quantity Break Price Table -->
        <div class="table-section">
          <h3 class="subsection-title">Quantity Break Price Table</h3>
          <div class="table-responsive">
            <table class="price-table" id="break-price-table">
              <thead>
                <tr>
                  <th scope="col">Qty Tier</th>
                  <th scope="col">Break</th>
                  <th scope="col">Decoration</th>
                  <th scope="col">Per Piece</th>
                  <th scope="col">Tier Min Total</th>
                  <th scope="col" class="no-print">Hourly Rate</th>
                </tr>
              </thead>
              <tbody id="break-table-body">
                <!-- Populated dynamically and pre-rendered -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Copyable Customer Quote & Print Actions -->
        <div class="quote-box-section">
          <div class="label-row">
            <label for="quote-text-output" class="subsection-title">Customer Quote Summary</label>
            <span id="copy-feedback" class="copy-feedback" aria-live="polite"></span>
          </div>
          <textarea
            id="quote-text-output"
            class="quote-textarea"
            rows="12"
            readonly
          ></textarea>

          <div class="quote-actions no-print">
            <button type="button" id="btn-copy-quote" class="btn btn-primary">
              Copy Plain-Text Quote
            </button>
            <button type="button" id="btn-print-quote" class="btn btn-secondary">
              Print / Save as PDF
            </button>
            <button type="button" id="btn-toggle-print-view" class="btn btn-secondary" aria-pressed="false">
              Preview Print View
            </button>
          </div>
        </div>

        <!-- Step 8: Paid Version Waitlist Link -->
        <div class="waitlist-banner no-print">
          <p>
            <strong>Want saved rate profiles ("Caps", "Left Chest"), logo PDF quotes, and quote history?</strong>
            Join the waitlist for the Pro desktop &amp; web unlock ($19.99 one-time, no subscription):
            <a
              id="waitlist-link"
              href="https://docs.google.com/forms/d/e/1FAIpQLSfEmbroideryPricerProWaitlist/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >Join the Paid Version Waitlist &rarr;</a>
          </p>
        </div>
      </section>
    </div>
  </div>
</div>
`;function Et(e){e.querySelector("#pricer-app-container")||(e.innerHTML=wt);const n=e.getAttribute("data-tool-preset");let t=null;if(n)try{t=JSON.parse(n)}catch{t=null}const r=Pt();let i=r.rates,a=null,s=null;const l=e.querySelector("#drop-zone"),p=e.querySelector("#design-file-input"),S=e.querySelector("#btn-manual-mode"),g=e.querySelector("#loaded-file-badge"),v=e.querySelector("#file-error-alert"),x=e.querySelector("#file-warning-alert"),B=e.querySelector("#stitch-preview-canvas"),I=e.querySelector("#thread-swatches"),P=e.querySelector("#input-design-name"),M=e.querySelector("#input-stitches"),d=e.querySelector("#input-colors"),w=e.querySelector("#input-color-changes"),F=e.querySelector("#input-jumps"),u=e.querySelector("#input-trims"),R=e.querySelector("#input-width-in"),E=e.querySelector("#input-width-mm"),L=e.querySelector("#input-height-in"),c=e.querySelector("#input-height-mm"),y=e.querySelector("#input-minutes-override"),b=e.querySelector("#btn-reset-minutes"),f=e.querySelector("#input-quantity"),h=e.querySelector("#input-customer-garment"),N=e.querySelector("#input-garment-cost"),T=e.querySelector("#input-apply-setup"),$=e.querySelector("#input-setup-fee"),G=e.querySelector("#rate-per-1000"),j=e.querySelector("#rate-piece-fee"),z=e.querySelector("#rate-minimum"),C=e.querySelector("#rate-colors-included"),X=e.querySelector("#rate-extra-color-fee"),ce=e.querySelector("#rate-garment-markup"),re=e.querySelector("#rate-machine-speed"),le=e.querySelector("#rate-change-seconds"),K=e.querySelector("#rate-hooping-minutes"),U=e.querySelector("#rate-heads"),_=[0,1,2,3,4].map(o=>e.querySelector(`#break-discount-${o}`)),ne=e.querySelector("#btn-reset-rates"),te=e.querySelector("#storage-status-note"),pe=e.querySelector("#out-per-piece"),We=e.querySelector("#out-per-piece-sub"),Je=e.querySelector("#out-order-total"),Ye=e.querySelector("#out-order-total-sub"),je=e.querySelector("#out-hourly-rate"),Ve=e.querySelector("#out-machine-time"),ke=e.querySelector("#break-table-body"),ie=e.querySelector("#quote-text-output"),me=e.querySelector("#copy-feedback"),Xe=e.querySelector("#btn-copy-quote"),ze=e.querySelector("#btn-print-quote"),ge=e.querySelector("#btn-toggle-print-view"),Ke=e.querySelector("#print-design-subtitle");function Pe(){G.value=i.ratePer1000Stitches.toFixed(2),j.value=i.pieceFee.toFixed(2),z.value=i.minimumPerPiece.toFixed(2),C.value=String(i.colorsIncluded),X.value=i.extraColorFee.toFixed(2),ce.value=String(Math.round(i.garmentMarkup*100)),re.value=String(i.machineSpeed),le.value=String(i.colorChangeSeconds),K.value=String(i.hoopingMinutes),U.value=String(i.heads),i.quantityBreaks.forEach((o,m)=>{_[m]&&(_[m].value=String(Math.round(o.discount*100)))}),r.defaultSetupFee>0&&Number($.value)===0&&($.value=r.defaultSetupFee.toFixed(2))}function Ze(){const o=(D,W,Y=0)=>{const A=Number.parseFloat(D.value);return Number.isFinite(A)&&A>=Y?A:W},m=xe();return{ratePer1000Stitches:o(G,m.ratePer1000Stitches,0),pieceFee:o(j,m.pieceFee,0),minimumPerPiece:o(z,m.minimumPerPiece,0),colorsIncluded:Math.floor(o(C,m.colorsIncluded,0)),extraColorFee:o(X,m.extraColorFee,0),quantityBreaks:m.quantityBreaks.map((D,W)=>{const Y=o(_[W],D.discount*100,0);return{...D,discount:Math.min(.95,Math.max(0,Y/100))}}),garmentMarkup:o(ce,m.garmentMarkup*100,0)/100,machineSpeed:o(re,m.machineSpeed,1),colorChangeSeconds:o(le,m.colorChangeSeconds,0),hoopingMinutes:o(K,m.hoopingMinutes,0),heads:Math.max(1,Math.floor(o(U,m.heads,1)))}}function et(){const o=Math.max(1,Math.floor(Number(d.value)||1));I.innerHTML="";for(let m=0;m<Math.min(o,24);m++){const D=a==null?void 0:a.threads[m],W=(D==null?void 0:D.hex)??["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"][m%6],Y=(D==null?void 0:D.description)??`Color ${m+1}`,A=document.createElement("span");A.className="swatch-pill",A.title=`${m+1}. ${Y} (${W})`;const Z=document.createElement("span");Z.className="swatch-dot",Z.style.backgroundColor=W;const ee=document.createElement("span");ee.textContent=`${m+1}. ${Y}`,A.appendChild(Z),A.appendChild(ee),I.appendChild(A)}}let Me;function H(){i=Ze();const o=Mt({rates:i,defaultSetupFee:Number.parseFloat($.value)||0});te.textContent=o?"Settings saved locally in browser":"Browser storage blocked — using session settings",N.disabled=h.checked,$.disabled=!T.checked;const m=Math.max(0,Math.floor(Number.parseFloat(M.value)||0)),D=Math.max(1,Math.floor(Number.parseFloat(d.value)||1)),W=Math.max(0,Math.floor(Number.parseFloat(w.value)||0)),Y=Math.max(1,Math.floor(Number.parseFloat(f.value)||1)),A=Math.max(0,Number.parseFloat(N.value)||0),Z=Math.max(0,Number.parseFloat($.value)||0),ee={stitches:m,colors:D,colorChanges:W,quantity:Y,customerSuppliesGarment:h.checked,garmentCost:A,applySetupFee:T.checked,setupFee:Z},k=ct(ee,i);if(s!==null&&s>0){const J=Q(s);k.minutesPerPiece=J,k.minutesPerPieceRaw=J,k.orderMachineMinutes=Q(J*k.quantity/i.heads),k.effectiveHourlyRate=Q(k.decorationPerPiece/J*60),k.breakTable=k.breakTable.map(oe=>({...oe,effectiveHourlyRate:Q(oe.decorationPerPiece/J*60)})),b.hidden=!1}else y.value=k.minutesPerPiece.toFixed(2),b.hidden=!0;Me=k;const ye=Math.round(k.breakDiscount*100);pe.textContent=O(k.perPiece),We.textContent=`Decoration ${O(k.decorationPerPiece)}${k.minimumApplied?" (min)":""} · Garment ${O(k.garmentPerPiece)} (${ye}% break)`,Je.textContent=O(k.orderTotal),Ye.textContent=`${k.quantity} ${k.quantity===1?"piece":"pieces"} · ${O(k.setupFeeApplied)} setup fee`,je.textContent=`${O(k.effectiveHourlyRate)}/hr`,Ve.textContent=`${k.minutesPerPiece.toFixed(2)} min/pc · ${k.orderMachineMinutes.toFixed(2)} min order (${i.heads} head${i.heads>1?"s":""})`,Ke.textContent=`${P.value||"Custom Design"} · ${k.quantity} pcs · ${k.stitches.toLocaleString()} stitches`,ke.innerHTML="";for(const J of k.breakTable){const oe=document.createElement("tr");J.label===k.activeBreak.label&&(oe.className="active-break-row");const nt=Math.round(J.discount*100);oe.innerHTML=`
        <td><strong>${J.label}</strong></td>
        <td>${nt}%</td>
        <td>${O(J.decorationPerPiece)}</td>
        <td><strong>${O(J.perPiece)}</strong></td>
        <td>${O(J.sampleOrderTotal)}</td>
        <td class="no-print">${O(J.effectiveHourlyRate)}/hr</td>
      `,ke.appendChild(oe)}const fe=Math.max(.1,Number.parseFloat(E.value)||88.9),Fe=Math.max(.1,Number.parseFloat(c.value)||50.8);return Math.max(0,Math.floor(Number.parseFloat(F.value)||0)),Math.max(0,Math.floor(Number.parseFloat(u.value)||0)),ie.value=Ct(k,{designName:P.value.trim()||"Custom Design",widthMm:fe,heightMm:Fe,customerSuppliesGarment:h.checked,garmentCost:A,garmentMarkup:i.garmentMarkup,heads:i.heads,machineSpeed:i.machineSpeed}),et(),Qe(B,a,{widthMm:fe,heightMm:Fe,stitches:m,colors:D}),k}function Be(o){a=o,s=null,v.hidden=!0,v.textContent="",o.warnings.length>0?(x.hidden=!1,x.textContent=o.warnings.join(" ")):(x.hidden=!0,x.textContent=""),g.textContent=`Loaded ${o.format.toUpperCase()}: ${o.filename}`,P.value=o.label||o.filename,M.value=String(o.normalStitches),d.value=String(o.threadBlocks),w.value=String(o.colorChanges),F.value=String(o.jumps),u.value=String(o.trims),E.value=o.widthMm.toFixed(1),R.value=o.widthIn.toFixed(2),c.value=o.heightMm.toFixed(1),L.value=o.heightIn.toFixed(2),H()}function Ce(o){v.hidden=!1,v.textContent=o,x.hidden=!0,x.textContent=""}let ae=null,tt=0;const de=new Map;function we(){if(ae)return ae;if(typeof Worker>"u")return null;try{return ae=new Worker(new URL("/assets/worker-BKXLW0pr.js",import.meta.url),{type:"module"}),ae.addEventListener("message",o=>{const m=de.get(o.data.id);m&&(de.delete(o.data.id),m.resolve(o.data))}),ae.addEventListener("error",o=>{for(const[,m]of de)m.reject(o);de.clear()}),ae}catch{return null}}async function Ee(o,m){let D;if(o instanceof ArrayBuffer)D=o;else{const A=new Uint8Array(o.byteLength);A.set(o),D=A.buffer}const W=we();if(W)try{const A=++tt,Z=D.slice(0),ee=await new Promise((k,ye)=>{de.set(A,{resolve:k,reject:ye});const fe={id:A,filename:m,buffer:Z};W.postMessage(fe,[Z])});ee.ok?Be(ee.design):Ce(ee.error);return}catch{}const Y=St(D,m);Y.ok?Be(Y.design):Ce(Y.error)}async function Ne(o){if(!o)return;const m=await o.arrayBuffer();await Ee(m,o.name)}l.addEventListener("click",()=>{p.click()}),l.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),p.click())}),l.addEventListener("dragover",o=>{o.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>{l.classList.remove("drag-over")}),l.addEventListener("drop",o=>{var D,W;o.preventDefault(),l.classList.remove("drag-over");const m=(W=(D=o.dataTransfer)==null?void 0:D.files)==null?void 0:W[0];Ne(m)}),p.addEventListener("change",()=>{var m;const o=(m=p.files)==null?void 0:m[0];Ne(o),p.value=""}),S.addEventListener("click",()=>{a=null,s=null,v.hidden=!0,x.hidden=!0,g.textContent="Mode: Manual stitch count entry",M.focus(),M.select(),H()}),R.addEventListener("input",()=>{const o=Number.parseFloat(R.value);Number.isFinite(o)&&o>=0&&(E.value=(o*25.4).toFixed(1)),H()}),E.addEventListener("input",()=>{const o=Number.parseFloat(E.value);Number.isFinite(o)&&o>=0&&(R.value=(o/25.4).toFixed(2)),H()}),L.addEventListener("input",()=>{const o=Number.parseFloat(L.value);Number.isFinite(o)&&o>=0&&(c.value=(o*25.4).toFixed(1)),H()}),c.addEventListener("input",()=>{const o=Number.parseFloat(c.value);Number.isFinite(o)&&o>=0&&(L.value=(o/25.4).toFixed(2)),H()}),d.addEventListener("input",()=>{const o=Math.max(1,Math.floor(Number.parseFloat(d.value)||1));w.value=String(Math.max(0,o-1)),s=null,H()}),w.addEventListener("input",()=>{s=null,H()}),M.addEventListener("input",()=>{s=null,H()}),y.addEventListener("input",()=>{const o=Number.parseFloat(y.value);Number.isFinite(o)&&o>0?s=o:s=null,H()}),b.addEventListener("click",()=>{s=null,H()});const rt=[P,F,u,f,h,N,T,$,G,j,z,C,X,ce,re,le,K,U,..._];for(const o of rt)o.addEventListener("input",()=>H()),o.addEventListener("change",()=>H());if(ne.addEventListener("click",()=>{Bt(),i=xe(),Pe(),H()}),Xe.addEventListener("click",async()=>{const o=ie.value;try{navigator.clipboard&&navigator.clipboard.writeText?await navigator.clipboard.writeText(o):(ie.focus(),ie.select(),document.execCommand("copy")),me.textContent="Quote copied to clipboard!"}catch{ie.focus(),ie.select(),me.textContent="Selected quote text — press Ctrl+C / Cmd+C to copy"}setTimeout(()=>{me.textContent&&(me.textContent="")},3e3)}),ze.addEventListener("click",()=>{window.print()}),ge.addEventListener("click",()=>{const o=document.body.classList.toggle("print-preview-mode");ge.setAttribute("aria-pressed",String(o)),ge.textContent=o?"Exit Print View":"Preview Print View"}),typeof window<"u"&&window.addEventListener("resize",()=>{Qe(B,a,{widthMm:Number.parseFloat(E.value)||88.9,heightMm:Number.parseFloat(c.value)||50.8,stitches:Number.parseFloat(M.value)||8e3,colors:Number.parseFloat(d.value)||3})}),we(),Pe(),t&&(t.modeBadge&&(g.textContent=t.modeBadge),t.designName&&(P.value=t.designName),typeof t.stitches=="number"&&(M.value=String(t.stitches)),typeof t.colors=="number"&&(d.value=String(t.colors)),typeof t.colorChanges=="number"&&(w.value=String(t.colorChanges)),typeof t.widthIn=="number"&&(R.value=t.widthIn.toFixed(2)),typeof t.widthMm=="number"&&(E.value=t.widthMm.toFixed(1)),typeof t.heightIn=="number"&&(L.value=t.heightIn.toFixed(2)),typeof t.heightMm=="number"&&(c.value=t.heightMm.toFixed(1)),typeof t.quantity=="number"&&(f.value=String(t.quantity)),typeof t.customerSuppliesGarment=="boolean"&&(h.checked=t.customerSuppliesGarment),typeof t.garmentCost=="number"&&(N.value=t.garmentCost.toFixed(2)),typeof t.applySetupFee=="boolean"&&(T.checked=t.applySetupFee),typeof t.setupFee=="number"&&($.value=t.setupFee.toFixed(2)),t.openRatesByDefault)){const o=e.querySelector("#rate-settings-details");o&&(o.open=!0)}H();const Te={loadFileBuffer:Ee,getQuote:()=>Me,getRates:()=>i,recalculate:H};return typeof window<"u"&&(window.__embroideryTool=Te),Te}function He(){const e=document.getElementById("embroidery-tool-root");e&&Et(e);const n=document.getElementById("sticky-jump-wrapper"),t=document.getElementById("btn-close-jump-pill");n&&t&&t.addEventListener("click",r=>{r.preventDefault(),r.stopPropagation(),n.hidden=!0,n.style.display="none"})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",He):He();
