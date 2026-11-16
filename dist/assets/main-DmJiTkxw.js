var rt=Object.defineProperty;var nt=(e,t,r)=>t in e?rt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var ce=(e,t,r)=>nt(e,typeof t!="symbol"?t+"":t,r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=r(i);fetch(i.href,a)}})();const we="Starting values: change to yours",ie=[{label:"1–11",minQty:1,maxQty:11,discount:0},{label:"12–23",minQty:12,maxQty:23,discount:.05},{label:"24–47",minQty:24,maxQty:47,discount:.1},{label:"48–143",minQty:48,maxQty:143,discount:.15},{label:"144+",minQty:144,maxQty:null,discount:.2}],Ie={ratePer1000Stitches:1.5,pieceFee:1,minimumPerPiece:5,colorsIncluded:6,extraColorFee:.5,quantityBreaks:ie.map(e=>({...e})),garmentMarkup:.4,machineSpeed:650,colorChangeSeconds:30,hoopingMinutes:1,heads:1};function fe(){return{...Ie,quantityBreaks:ie.map(e=>({...e}))}}function Q(e){if(!Number.isFinite(e))return 0;const t=e<0?-1:1,r=Math.abs(e);return t*Math.floor(r*100+.5+1e-9)/100}function it(e,t){const r=Math.max(1,Math.floor(e)),n=[...t].sort((i,a)=>i.minQty-a.minQty);for(const i of n)if(r>=i.minQty&&(i.maxQty===null||r<=i.maxQty))return i;for(let i=n.length-1;i>=0;i--)if(r>=n[i].minQty)return n[i];return n[0]??{label:"1+",minQty:1,maxQty:null,discount:0}}function at(e){const t=Math.max(0,e.stitches),r=Math.max(0,e.colorChanges),n=Math.max(1,Math.floor(e.quantity)),i=e.machineSpeed>0?e.machineSpeed:650,a=Math.max(0,e.colorChangeSeconds),s=Math.max(0,e.hoopingMinutes),l=e.heads>0?Math.floor(e.heads):1,m=t/i+r*(a/60)+s,f=Q(m),p=m*n/l,v=Q(p);return{minutesPerPieceRaw:m,minutesPerPiece:f,orderMachineMinutesRaw:p,orderMachineMinutes:v}}function ot(e,t=Ie){const r=Math.max(0,e.stitches),n=Math.max(1,Math.floor(e.colors)),i=e.colorChanges!==void 0?Math.max(0,Math.floor(e.colorChanges)):Math.max(0,n-1),a=Math.max(1,Math.floor(e.quantity)),s=Math.max(0,n-Math.max(0,Math.floor(t.colorsIncluded))),l=r/1e3*t.ratePer1000Stitches+t.pieceFee+t.extraColorFee*s,m=it(a,t.quantityBreaks),f=m.discount,p=l*(1-f),v=p<t.minimumPerPiece,k=Math.max(p,t.minimumPerPiece),P=Q(k),x=(e.customerSuppliesGarment?0:Math.max(0,e.garmentCost))*(1+t.garmentMarkup),C=Q(x),h=Q(k+x),T=e.applySetupFee?Q(Math.max(0,e.setupFee)):0,w=Q(h*a+T),d=at({stitches:r,colorChanges:i,quantity:a,machineSpeed:t.machineSpeed,colorChangeSeconds:t.colorChangeSeconds,hoopingMinutes:t.hoopingMinutes,heads:t.heads}),$=d.minutesPerPiece>0?Q(P/d.minutesPerPiece*60):0,E=t.quantityBreaks.map(F=>{const c=l*(1-F.discount),M=Math.max(c,t.minimumPerPiece),g=Q(M),y=Q(M+x),b=Q(y*F.minQty+T),N=d.minutesPerPiece>0?Q(g/d.minutesPerPiece*60):0;return{label:F.label,minQty:F.minQty,maxQty:F.maxQty,discount:F.discount,decorationPerPiece:g,garmentPerPiece:C,perPiece:y,sampleOrderTotal:b,effectiveHourlyRate:N}});return{stitches:r,colors:n,colorChanges:i,extraColors:s,quantity:a,activeBreak:m,breakDiscount:f,baseDecoration:Q(l),discountedDecorationRaw:p,minimumApplied:v,decorationPerPiece:P,garmentPerPiece:C,perPiece:h,setupFeeApplied:T,orderTotal:w,minutesPerPieceRaw:d.minutesPerPieceRaw,minutesPerPiece:d.minutesPerPiece,orderMachineMinutesRaw:d.orderMachineMinutesRaw,orderMachineMinutes:d.orderMachineMinutes,effectiveHourlyRate:$,breakTable:E}}const me=[null,{hex:"#0e1f7c",description:"Prussian Blue",catalogNumber:"1",brand:"Brother",chart:"Brother"},{hex:"#0a55a3",description:"Blue",catalogNumber:"2",brand:"Brother",chart:"Brother"},{hex:"#008777",description:"Teal Green",catalogNumber:"3",brand:"Brother",chart:"Brother"},{hex:"#4b6baf",description:"Cornflower Blue",catalogNumber:"4",brand:"Brother",chart:"Brother"},{hex:"#ed171f",description:"Red",catalogNumber:"5",brand:"Brother",chart:"Brother"},{hex:"#d15c00",description:"Reddish Brown",catalogNumber:"6",brand:"Brother",chart:"Brother"},{hex:"#913697",description:"Magenta",catalogNumber:"7",brand:"Brother",chart:"Brother"},{hex:"#e49acb",description:"Light Lilac",catalogNumber:"8",brand:"Brother",chart:"Brother"},{hex:"#915fac",description:"Lilac",catalogNumber:"9",brand:"Brother",chart:"Brother"},{hex:"#9ed67d",description:"Mint Green",catalogNumber:"10",brand:"Brother",chart:"Brother"},{hex:"#e8a900",description:"Deep Gold",catalogNumber:"11",brand:"Brother",chart:"Brother"},{hex:"#feba35",description:"Orange",catalogNumber:"12",brand:"Brother",chart:"Brother"},{hex:"#ffff00",description:"Yellow",catalogNumber:"13",brand:"Brother",chart:"Brother"},{hex:"#70bc1f",description:"Lime Green",catalogNumber:"14",brand:"Brother",chart:"Brother"},{hex:"#ba9800",description:"Brass",catalogNumber:"15",brand:"Brother",chart:"Brother"},{hex:"#a8a8a8",description:"Silver",catalogNumber:"16",brand:"Brother",chart:"Brother"},{hex:"#7d6f00",description:"Russet Brown",catalogNumber:"17",brand:"Brother",chart:"Brother"},{hex:"#ffffb3",description:"Cream Brown",catalogNumber:"18",brand:"Brother",chart:"Brother"},{hex:"#4f5556",description:"Pewter",catalogNumber:"19",brand:"Brother",chart:"Brother"},{hex:"#000000",description:"Black",catalogNumber:"20",brand:"Brother",chart:"Brother"},{hex:"#0b3d91",description:"Ultramarine",catalogNumber:"21",brand:"Brother",chart:"Brother"},{hex:"#770176",description:"Royal Purple",catalogNumber:"22",brand:"Brother",chart:"Brother"},{hex:"#293133",description:"Dark Gray",catalogNumber:"23",brand:"Brother",chart:"Brother"},{hex:"#2a1301",description:"Dark Brown",catalogNumber:"24",brand:"Brother",chart:"Brother"},{hex:"#f64a8a",description:"Deep Rose",catalogNumber:"25",brand:"Brother",chart:"Brother"},{hex:"#b27624",description:"Light Brown",catalogNumber:"26",brand:"Brother",chart:"Brother"},{hex:"#fcbbc5",description:"Salmon Pink",catalogNumber:"27",brand:"Brother",chart:"Brother"},{hex:"#fe370f",description:"Vermilion",catalogNumber:"28",brand:"Brother",chart:"Brother"},{hex:"#f0f0f0",description:"White",catalogNumber:"29",brand:"Brother",chart:"Brother"},{hex:"#6a1c8a",description:"Violet",catalogNumber:"30",brand:"Brother",chart:"Brother"},{hex:"#a8ddc4",description:"Seacrest",catalogNumber:"31",brand:"Brother",chart:"Brother"},{hex:"#2584bb",description:"Sky Blue",catalogNumber:"32",brand:"Brother",chart:"Brother"},{hex:"#feb343",description:"Pumpkin",catalogNumber:"33",brand:"Brother",chart:"Brother"},{hex:"#fff36b",description:"Cream Yellow",catalogNumber:"34",brand:"Brother",chart:"Brother"},{hex:"#d0a660",description:"Khaki",catalogNumber:"35",brand:"Brother",chart:"Brother"},{hex:"#d15400",description:"Clay Brown",catalogNumber:"36",brand:"Brother",chart:"Brother"},{hex:"#66ba49",description:"Leaf Green",catalogNumber:"37",brand:"Brother",chart:"Brother"},{hex:"#134a46",description:"Peacock Blue",catalogNumber:"38",brand:"Brother",chart:"Brother"},{hex:"#878787",description:"Gray",catalogNumber:"39",brand:"Brother",chart:"Brother"},{hex:"#d8ccc6",description:"Warm Gray",catalogNumber:"40",brand:"Brother",chart:"Brother"},{hex:"#435607",description:"Dark Olive",catalogNumber:"41",brand:"Brother",chart:"Brother"},{hex:"#fdd9de",description:"Flesh Pink",catalogNumber:"42",brand:"Brother",chart:"Brother"},{hex:"#f993bc",description:"Pink",catalogNumber:"43",brand:"Brother",chart:"Brother"},{hex:"#003822",description:"Deep Green",catalogNumber:"44",brand:"Brother",chart:"Brother"},{hex:"#b2afd4",description:"Lavender",catalogNumber:"45",brand:"Brother",chart:"Brother"},{hex:"#686ab0",description:"Wisteria Violet",catalogNumber:"46",brand:"Brother",chart:"Brother"},{hex:"#efe3b9",description:"Beige",catalogNumber:"47",brand:"Brother",chart:"Brother"},{hex:"#f73866",description:"Carmine",catalogNumber:"48",brand:"Brother",chart:"Brother"},{hex:"#b54b64",description:"Amber Red",catalogNumber:"49",brand:"Brother",chart:"Brother"},{hex:"#132b1a",description:"Olive Green",catalogNumber:"50",brand:"Brother",chart:"Brother"},{hex:"#c70156",description:"Dark Fuchsia",catalogNumber:"51",brand:"Brother",chart:"Brother"},{hex:"#fe9e32",description:"Tangerine",catalogNumber:"52",brand:"Brother",chart:"Brother"},{hex:"#a8deeb",description:"Light Blue",catalogNumber:"53",brand:"Brother",chart:"Brother"},{hex:"#00673e",description:"Emerald Green",catalogNumber:"54",brand:"Brother",chart:"Brother"},{hex:"#4e2990",description:"Purple",catalogNumber:"55",brand:"Brother",chart:"Brother"},{hex:"#2f7e20",description:"Moss Green",catalogNumber:"56",brand:"Brother",chart:"Brother"},{hex:"#ffcccc",description:"Flesh Pink",catalogNumber:"57",brand:"Brother",chart:"Brother"},{hex:"#ffd911",description:"Harvest Gold",catalogNumber:"58",brand:"Brother",chart:"Brother"},{hex:"#095ba6",description:"Electric Blue",catalogNumber:"59",brand:"Brother",chart:"Brother"},{hex:"#f0f970",description:"Lemon Yellow",catalogNumber:"60",brand:"Brother",chart:"Brother"},{hex:"#e3f35b",description:"Fresh Green",catalogNumber:"61",brand:"Brother",chart:"Brother"},{hex:"#ff9900",description:"Orange",catalogNumber:"62",brand:"Brother",chart:"Brother"},{hex:"#fff08d",description:"Cream Yellow",catalogNumber:"63",brand:"Brother",chart:"Brother"},{hex:"#ffc8c8",description:"Applique",catalogNumber:"64",brand:"Brother",chart:"Brother"}],Ee=[{hex:"#1d4ed8",description:"Royal Blue (Default 1)"},{hex:"#dc2626",description:"Crimson Red (Default 2)"},{hex:"#15803d",description:"Forest Green (Default 3)"},{hex:"#d97706",description:"Amber Gold (Default 4)"},{hex:"#7c3aed",description:"Violet Purple (Default 5)"},{hex:"#0f766e",description:"Teal (Default 6)"},{hex:"#be185d",description:"Magenta (Default 7)"},{hex:"#374151",description:"Charcoal (Default 8)"},{hex:"#ea580c",description:"Burnt Orange (Default 9)"},{hex:"#0284c7",description:"Sky Blue (Default 10)"},{hex:"#4d7c0f",description:"Olive Green (Default 11)"},{hex:"#111827",description:"Jet Black (Default 12)"}];function Ne(e){const t=Ee[e%Ee.length];return{hex:t.hex,description:t.description,catalogNumber:String(e+1),brand:"Default Palette"}}function st(e,t=3,r=null,n=!0){let i=-1,a=e.length-1,s=0,l=0,m=0,f=0,p=0,v=0,k=!1,P=!0;for(;i<a;){i+=1;const B=e[i],x=B.x-s,C=B.y-l;s=B.x,l=B.y;const h=B.command;if(h==="STITCH"||h==="SEQUIN_EJECT"?(P=!1,k=!1):(h==="COLOR_CHANGE"||h==="TRIM")&&(P=!0,k=!1),h==="JUMP"){if(k||(p=0,v=0,m=0,f=i,k=!0),m+=1,p+=x,v+=C,!P&&(m===t||r!==null&&(Math.abs(v)>r||Math.abs(p)>r))){const T=f>0?e[f-1].x:0,w=f>0?e[f-1].y:0;e.splice(f,0,{x:T,y:w,command:"TRIM"}),f+=1,i+=1,a+=1,P=!0}n&&p===0&&v===0&&(e.splice(f,i+1-f),i=f-1,a=e.length-1)}}}function ct(e,t){return!e||!t?!1:e.hex.toLowerCase()===t.hex.toLowerCase()&&(e.description??"")===(t.description??"")&&(e.catalogNumber??"")===(t.catalogNumber??"")&&(e.brand??"")===(t.brand??"")&&(e.chart??"")===(t.chart??"")}function lt(e,t){let r=0,n=!0,i=null;for(let a=0;a<e.length;a++){const l=e[a].command;if(l==="STITCH"){if(n){if(r>=t.length)return;i!==null&&r!==0&&ct(t[r-1]??void 0,t[r]??void 0)?(t.splice(r,1),e[i].command="STOP"):r+=1,n=!1}}else l==="COLOR_CHANGE"&&(n=!0,i=a)}}function Ae(e){const{format:t,filename:r,label:n,stitches:i,threads:a,warnings:s,headerMetadata:l}=e;let m=0,f=0,p=0,v=0,k=0,P=1/0,B=1/0,x=-1/0,C=-1/0;for(const L of i)switch(L.x>x&&(x=L.x),L.x<P&&(P=L.x),L.y>C&&(C=L.y),L.y<B&&(B=L.y),L.command){case"STITCH":m+=1;break;case"JUMP":f+=1;break;case"TRIM":p+=1;break;case"COLOR_CHANGE":v+=1;break;case"STOP":k+=1;break}const h=i.length>0&&Number.isFinite(P)&&Number.isFinite(x),T=h?P/10:0,w=h?B/10:0,d=h?x/10:0,$=h?C/10:0,E=h?(x-P)/10:0,F=h?(C-B)/10:0,c=E/25.4,M=F/25.4,g=v+1,y=[];for(let L=0;L<g;L++){const j=a[L];j&&j.hex?y.push(j):y.push(Ne(L))}const b=[];let N=0,R=[],O=[],W=0;const X=()=>{O.length>0&&(R.push({points:O}),O=[])},z=()=>{X(),b.push({index:N,color:y[N]??Ne(N),stitchCount:W,segments:R}),N+=1,R=[],W=0};for(const L of i)L.command==="STITCH"?(O.push({x:L.x/10,y:L.y/10}),W+=1):L.command==="COLOR_CHANGE"?z():X();return z(),{format:t,filename:r,label:n,normalStitches:m,jumps:f,trims:p,colorChanges:v,stops:k,threadBlocks:g,widthMm:E,heightMm:F,widthIn:c,heightIn:M,boundsMm:{minX:T,minY:w,maxX:d,maxY:$},threads:y,blocks:b,warnings:s,headerMetadata:l}}const ne=512;function D(e,t){return e>>t&1}function dt(e,t,r){let n=0;return n+=D(r,2)*81,n+=D(r,3)*-81,n+=D(t,2)*27,n+=D(t,3)*-27,n+=D(e,2)*9,n+=D(e,3)*-9,n+=D(t,0)*3,n+=D(t,1)*-3,n+=D(e,0)*1,n+=D(e,1)*-1,n}function ut(e,t,r){let n=0;return n+=D(r,5)*81,n+=D(r,4)*-81,n+=D(t,5)*27,n+=D(t,4)*-27,n+=D(e,5)*9,n+=D(e,4)*-9,n+=D(t,7)*3,n+=D(t,6)*-3,n+=D(e,7)*1,n+=D(e,6)*-1,-n}function ht(e){const t=e.trim().replace(/^#/,"");return/^[0-9a-fA-F]{6}$/.test(t)?`#${t.toLowerCase()}`:"#000000"}function pt(e,t){if(e.byteLength<ne+3)return{ok:!1,error:"Invalid or truncated DST file: file is smaller than the 512-byte DST header plus one stitch record."};const r=e.subarray(0,ne);if(!new TextDecoder("utf-8",{fatal:!1}).decode(r.subarray(0,64)).includes("LA:"))return{ok:!1,error:"Invalid DST file: missing 'LA:' design label in the 512-byte Tajima header."};const a=(e.byteLength-ne)%3,s=a===1&&e[e.byteLength-1]===26;if(a!==0&&!s)return{ok:!1,error:"Truncated or corrupted DST file: stitch data length is not a multiple of 3-byte DST records."};const l={},m=[],f=new TextDecoder("utf-8",{fatal:!0});let p=0;for(let c=0;c<ne;c++){const M=r[c];if(M===13||M===10){const g=c,y=r.subarray(p,g);p=g;try{const b=f.decode(y).trim();if(b.length>3&&b[2]===":"){const N=b.slice(0,2).trim(),R=b.slice(3).trim();if(N==="LA")l.name=R;else if(N==="AU")l.author=R;else if(N==="CP")l.copyright=R;else if(N==="TC"){const O=R.split(",").map(W=>W.trim());m.push({hex:ht(O[0]??"#000000"),description:O[1]??"Custom DST Thread",catalogNumber:O[2]??""})}else l[N]=R}}catch{}}}const v=[];let k=0,P=0,B=!1,x=0,C=!1;const h=(c,M,g)=>{const y=k+c,b=P+M;v.push({x:y,y:b,command:g}),k=y,P=b};let T=ne;for(;T+3<=e.byteLength;){const c=e[T],M=e[T+1],g=e[T+2];if(T+=3,(g&3)!==3)return{ok:!1,error:`Corrupted DST stitch record at byte offset ${T-3}: missing mandatory DST record tag bits.`};const y=dt(c,M,g),b=ut(c,M,g);if((g&243)===243){C=!0;break}else(g&195)===195?(x+=1,h(y,b,"COLOR_CHANGE")):(g&67)===67?(x+=1,h(y,b,"SEQUIN_MODE"),B=!B):(g&131)===131?(x+=1,B?h(y,b,"SEQUIN_EJECT"):h(y,b,"JUMP")):(x+=1,h(y,b,"STITCH"))}if(x===0)return{ok:!1,error:"Invalid DST file: file contains no stitch records."};h(0,0,"END"),st(v,3,null,!0);const w=[];let d=0,$=0;for(const c of v)c.command==="STITCH"?d+=1:c.command==="COLOR_CHANGE"&&($+=1);if(l.CO!==void 0){const c=Number.parseInt(l.CO,10);!Number.isNaN(c)&&c!==$&&w.push(`Header color change count (CO=${c}) disagrees with stitch records (${$} color changes). Using stitch records.`)}if(l.ST!==void 0){const c=Number.parseInt(l.ST,10),M=x+(C?1:0);!Number.isNaN(c)&&c!==d&&c!==M&&c!==x?w.push(`Header stitch count (ST=${c}) disagrees with stitch records (${d} normal stitches, ${M} total records). Using stitch records.`):!Number.isNaN(c)&&c!==d&&w.push(`Header ST (${c}) includes jumps/color-changes/end records; pricing uses ${d} normal stitches computed from stitch records.`)}const E=l.name||t.replace(/\.[^.]+$/,"");return{ok:!0,design:Ae({format:"dst",filename:t,label:E,stitches:v,threads:m,warnings:w,headerMetadata:l})}}const Te=16,Fe=32,Le=128;class mt{constructor(t){ce(this,"view");ce(this,"bytes");ce(this,"pos",0);this.bytes=t,this.view=new DataView(t.buffer,t.byteOffset,t.byteLength)}get length(){return this.bytes.byteLength}seek(t,r="set"){r==="set"?this.pos=t:this.pos+=t}readU8(){return this.pos>=this.bytes.byteLength?null:this.bytes[this.pos++]}readU16LE(){if(this.pos+2>this.bytes.byteLength)return null;const t=this.view.getUint16(this.pos,!0);return this.pos+=2,t}readS16LE(){if(this.pos+2>this.bytes.byteLength)return null;const t=this.view.getInt16(this.pos,!0);return this.pos+=2,t}readU24LE(){if(this.pos+3>this.bytes.byteLength)return null;const t=this.bytes[this.pos],r=this.bytes[this.pos+1],n=this.bytes[this.pos+2];return this.pos+=3,t|r<<8|n<<16}readU24BE(){if(this.pos+3>this.bytes.byteLength)return null;const t=this.bytes[this.pos],r=this.bytes[this.pos+1],n=this.bytes[this.pos+2];return this.pos+=3,t<<16|r<<8|n}readU32LE(){if(this.pos+4>this.bytes.byteLength)return null;const t=this.view.getUint32(this.pos,!0);return this.pos+=4,t}readBytes(t){if(this.pos+t>this.bytes.byteLength)return null;const r=this.bytes.subarray(this.pos,this.pos+t);return this.pos+=t,r}readAscii(t){const r=this.readBytes(t);return r?new TextDecoder("utf-8",{fatal:!1}).decode(r):null}readPesString(){const t=this.readU8();return t===null||t===0?null:this.readAscii(t)}}function $e(e){const t=e&4095;return t>2047?-4096+t:t}function Re(e){return e>63?-128+e:e}function Oe(e,t){const r=["name","category","author","keywords","comments"];for(const n of r){const i=e.readPesString();i&&i.length>0&&(t[n]=i)}}function ft(e){const t=e.readPesString()??void 0,r=e.readU24BE();if(r===null)return null;e.seek(5,"cur");const n=e.readPesString()??"",i=e.readPesString()??void 0,a=e.readPesString()??void 0;return{hex:`#${(r&16777215).toString(16).padStart(6,"0")}`,description:n,catalogNumber:t,brand:i,chart:a}}function te(e,t,r,n,i,a,s){if(e.seek(4,"cur"),Oe(e,t),s!==void 0){e.seek(s,"cur");const k=e.readPesString();k&&k.length>0&&(t.hoop_name=k)}e.seek(n,"cur");const l=e.readPesString();l&&l.length>0&&(t[a]=l),e.seek(i,"cur");const m=e.readU16LE();if(m===null||m!==0)return;const f=e.readU16LE();if(f===null||f!==0)return;const p=e.readU16LE();if(p===null||p!==0)return;const v=e.readU16LE();if(v!==null)for(let k=0;k<v;k++){const P=ft(e);if(!P)break;r.push(P)}}function bt(e,t){const r=me.length,n=[];if(t.length===0)for(let i=0;i<e.length;i++){const a=e[i]%r;n.push(me[a]??null)}else if(t.length>=e.length)for(const i of t)n.push(i);else{const i=[...t],a=new Map;for(let s=0;s<e.length;s++){const l=e[s]%r;let m=a.get(l);m===void 0&&(i.length>0?m=i.shift()??null:m=me[l]??null,a.set(l,m)),n.push(m)}}return n}function gt(e,t){if(e.byteLength<48)return{ok:!1,error:"Invalid or truncated PES file: file is too small to contain a PES/PEC header."};const r=new mt(e),n=r.readAscii(8);if(!n||!n.startsWith("#PES")&&n!=="#PEC0001")return{ok:!1,error:"Invalid PES file: file does not start with a valid '#PES' or '#PEC0001' signature."};const i={},a=[];let s=8;if(n!=="#PEC0001"){const c=r.readU32LE();if(c===null||c<12||c+532>e.byteLength)return{ok:!1,error:"Invalid or truncated PES file: PEC block offset in header points outside the file."};s=c;try{switch(n){case"#PES0100":i.version="10",te(r,i,a,38,34,"image_file",14);break;case"#PES0090":i.version="9",te(r,i,a,30,34,"image_file",14);break;case"#PES0080":i.version="8",te(r,i,a,38,26,"image_file");break;case"#PES0070":i.version="7",te(r,i,a,36,24,"image_file");break;case"#PES0060":i.version="6",te(r,i,a,36,24,"image_file");break;case"#PES0050":case"#PES0055":case"#PES0056":i.version=n==="#PES0050"?"5":n==="#PES0055"?"5.5":"5.6",te(r,i,a,24,24,"image");break;case"#PES0040":i.version="4",r.seek(4,"cur"),Oe(r,i);break;case"#PES0030":i.version="3";break;case"#PES0022":i.version="2.2";break;case"#PES0020":i.version="2";break;case"#PES0001":i.version="1";break;default:i.version=n.slice(4);break}}catch{}}r.seek(s,"set"),r.seek(3,"cur");const l=r.readAscii(16);if(l===null)return{ok:!1,error:"Truncated PES/PEC block: could not read design label."};i.Name=l.trim(),r.seek(15,"cur");const m=r.readU8(),f=r.readU8();if(m===null||f===null)return{ok:!1,error:"Truncated PES/PEC block: missing graphic header fields."};r.seek(12,"cur");const p=r.readU8();if(p===null)return{ok:!1,error:"Truncated PES/PEC block: missing color change count byte."};const v=p===255?0:p,k=p===255?0:v+1,P=r.readBytes(k);if(!P)return{ok:!1,error:"Truncated PES/PEC block: file ends inside PEC color palette table."};const B=bt(P,a);if(r.seek(464-p,"cur"),r.readU24LE()===null)return{ok:!1,error:"Truncated PES/PEC block: missing stitch block length."};if(r.pos+11>r.length)return{ok:!1,error:"Truncated PES/PEC block: file ends before stitch data starts."};r.seek(11,"cur");const C=[];let h=0,T=0;const w=(c,M,g)=>{const y=h+c,b=T+M;C.push({x:y,y:b,command:g}),h=y,T=b};for(;;){const c=r.readU8(),M=r.readU8();if(c===null||M===null||c===255&&M===0)break;if(c===254&&M===176){r.seek(1,"cur"),w(0,0,"COLOR_CHANGE");continue}let g=!1,y=!1,b=0,N=0,R=M;if(c&Le){c&Fe&&(y=!0),c&Te&&(g=!0);const O=c<<8|R;if(b=$e(O),R=r.readU8(),R===null)break}else b=Re(c);if(R&Le){R&Fe&&(y=!0),R&Te&&(g=!0);const O=r.readU8();if(O===null)break;const W=R<<8|O;N=$e(W)}else N=Re(R);g?w(b,N,"JUMP"):y?(w(0,0,"TRIM"),w(b,N,"JUMP")):w(b,N,"STITCH")}if(C.length===0)return{ok:!1,error:"Invalid PES file: PEC section contains no stitch records."};w(0,0,"END"),lt(C,B);let d=0;for(const c of C)c.command==="COLOR_CHANGE"&&(d+=1);const $=[];v!==d&&$.push(`PEC header color change count (${v}) disagrees with stitch records (${d} color changes). Using stitch records.`);const E=i.name||i.Name||t.replace(/\.[^.]+$/,"");return{ok:!0,design:Ae({format:"pes",filename:t,label:E,stitches:C,threads:B,warnings:$,headerMetadata:i})}}const yt=10*1024*1024;function vt(e,t){try{const r=e instanceof Uint8Array?e:new Uint8Array(e);if(r.byteLength===0)return{ok:!1,error:"The selected file is empty (0 bytes). Please choose a valid .dst or .pes embroidery file."};if(r.byteLength>yt)return{ok:!1,error:`File exceeds the 10 MB limit (${(r.byteLength/(1024*1024)).toFixed(1)} MB). Please upload a .dst or .pes file under 10 MB.`};if(r.byteLength>=3&&r[0]===255&&r[1]===216&&r[2]===255)return{ok:!1,error:"Unsupported file content: this file is a JPEG image, not a .dst or .pes embroidery file."};if(r.byteLength>=4&&r[0]===137&&r[1]===80&&r[2]===78&&r[3]===71)return{ok:!1,error:"Unsupported file content: this file is a PNG image, not a .dst or .pes embroidery file."};const n=t.trim().toLowerCase();return n.endsWith(".dst")?pt(r,t):n.endsWith(".pes")?gt(r,t):{ok:!1,error:"Unsupported file format. Please select a Tajima (.dst) or Brother (.pes) embroidery file."}}catch(r){return{ok:!1,error:`Could not read embroidery file: ${r instanceof Error?r.message:"Unknown parsing error"}`}}}const be="embroidery_pricer_settings_v1";function J(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0}function xt(e){return!Array.isArray(e)||e.length!==ie.length?ie.map(t=>({...t})):ie.map((t,r)=>{const n=e[r],i=n&&typeof n.discount=="number"&&Number.isFinite(n.discount)?Math.min(1,Math.max(0,n.discount)):t.discount;return{label:t.label,minQty:t.minQty,maxQty:t.maxQty,discount:i}})}function St(e){const t={rates:fe(),defaultSetupFee:0};try{const r=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!r)return t;const n=r.getItem(be);if(!n)return t;const i=JSON.parse(n),a=i.rates??{},s=t.rates,l={ratePer1000Stitches:J(a.ratePer1000Stitches)?a.ratePer1000Stitches:s.ratePer1000Stitches,pieceFee:J(a.pieceFee)?a.pieceFee:s.pieceFee,minimumPerPiece:J(a.minimumPerPiece)?a.minimumPerPiece:s.minimumPerPiece,colorsIncluded:J(a.colorsIncluded)?Math.floor(a.colorsIncluded):s.colorsIncluded,extraColorFee:J(a.extraColorFee)?a.extraColorFee:s.extraColorFee,quantityBreaks:xt(a.quantityBreaks),garmentMarkup:J(a.garmentMarkup)?a.garmentMarkup:s.garmentMarkup,machineSpeed:J(a.machineSpeed)&&a.machineSpeed>0?a.machineSpeed:s.machineSpeed,colorChangeSeconds:J(a.colorChangeSeconds)?a.colorChangeSeconds:s.colorChangeSeconds,hoopingMinutes:J(a.hoopingMinutes)?a.hoopingMinutes:s.hoopingMinutes,heads:J(a.heads)&&a.heads>=1?Math.floor(a.heads):s.heads},m=J(i.defaultSetupFee)?i.defaultSetupFee:0;return{rates:l,defaultSetupFee:m}}catch{return t}}function Pt(e,t){try{const r=t!==void 0?t:typeof window<"u"?window.localStorage:null;return r?(r.setItem(be,JSON.stringify(e)),!0):!1}catch{return!1}}function kt(e){try{const t=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!t)return;t.removeItem(be)}catch{}}function qe(e,t,r){const n=e.getContext("2d");if(!n)return;const i=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,a=e.clientWidth||320,s=e.clientHeight||220;e.width=Math.round(a*i),e.height=Math.round(s*i),n.setTransform(i,0,0,i,0,0),n.fillStyle="#f8fafc",n.fillRect(0,0,a,s),n.strokeStyle="#e2e8f0",n.lineWidth=1;const l=20;for(let d=l;d<a;d+=l)n.beginPath(),n.moveTo(d,0),n.lineTo(d,s),n.stroke();for(let d=l;d<s;d+=l)n.beginPath(),n.moveTo(0,d),n.lineTo(a,d),n.stroke();const m=20,f=Math.max(40,a-m*2),p=Math.max(40,s-m*2);if(!t||t.blocks.length===0||t.normalStitches===0){const d=(r==null?void 0:r.widthMm)||88.9,$=(r==null?void 0:r.heightMm)||50.8,E=Math.min(f/Math.max(1,d),p/Math.max(1,$)),F=Math.max(24,d*E),c=Math.max(24,$*E),M=(a-F)/2,g=(s-c)/2;n.strokeStyle="#475569",n.setLineDash([5,4]),n.lineWidth=1.5,n.strokeRect(M,g,F,c),n.setLineDash([]),n.fillStyle="#334155",n.font="600 13px system-ui, -apple-system, sans-serif",n.textAlign="center",n.textBaseline="middle";const y=`${((r==null?void 0:r.stitches)??8e3).toLocaleString()} stitches (manual mode)`,b=`${(d/25.4).toFixed(2)}" × ${($/25.4).toFixed(2)}" (${d.toFixed(1)} × ${$.toFixed(1)} mm)`;n.fillText(y,a/2,s/2-10),n.font="400 12px system-ui, -apple-system, sans-serif",n.fillStyle="#64748b",n.fillText(b,a/2,s/2+12);return}const{minX:v,minY:k,maxX:P,maxY:B}=t.boundsMm,x=Math.max(.5,P-v),C=Math.max(.5,B-k),h=Math.min(f/x,p/C),T=m+(f-x*h)/2-v*h,w=m+(p-C*h)/2-k*h;n.lineCap="round",n.lineJoin="round",n.lineWidth=Math.max(.9,Math.min(1.8,h*.35));for(const d of t.blocks){n.strokeStyle=d.color.hex||"#1d4ed8",n.beginPath();for(const $ of d.segments){const E=$.points;if(E.length!==0){n.moveTo(E[0].x*h+T,E[0].y*h+w);for(let F=1;F<E.length;F++)n.lineTo(E[F].x*h+T,E[F].y*h+w)}}n.stroke()}}function A(e){return`$${e.toFixed(2)}`}function Bt(e,t){const r=(t.widthMm/25.4).toFixed(2),n=(t.heightMm/25.4).toFixed(2),i=Math.round(e.breakDiscount*100),a=[`EMBROIDERY JOB QUOTE — ${t.designName||"Custom Design"}`,"----------------------------------------",`Quantity: ${e.quantity} pcs (Tier ${e.activeBreak.label}, ${i}% break)`,`Design: ${e.stitches.toLocaleString()} stitches | ${e.colors} color(s) (${e.colorChanges} color change(s))`,`Dimensions: ${r}" × ${n}" (${t.widthMm.toFixed(1)} × ${t.heightMm.toFixed(1)} mm)`,"","PRICING BREAKDOWN",`- Decoration per piece: ${A(e.decorationPerPiece)}${e.minimumApplied?" (minimum applied)":""}`];t.customerSuppliesGarment?a.push("- Garment: Customer-supplied ($0.00)"):a.push(`- Garment per piece: ${A(e.garmentPerPiece)} (cost ${A(t.garmentCost)} + ${Math.round(t.garmentMarkup*100)}% markup)`),a.push(`- Total price per piece: ${A(e.perPiece)}`),e.setupFeeApplied>0&&a.push(`- One-time setup fee: ${A(e.setupFeeApplied)}`),a.push(`- ORDER TOTAL (${e.quantity} pcs): ${A(e.orderTotal)}`),a.push(""),a.push("QUANTITY PRICE BREAKS (Per Piece / Order Total)");for(const s of e.breakTable){const l=Math.round(s.discount*100);a.push(`  ${s.label.padEnd(7," ")} (${String(l).padStart(2," ")}% off): ${A(s.perPiece)}/pc  (${s.minQty} pcs = ${A(s.sampleOrderTotal)})`)}return a.join(`
`)}const Mt=`
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
        <p class="drop-primary-text">
          <strong>Drop a .DST or .PES file here</strong> or <span class="link-styled">choose a file</span>
        </p>
        <p class="drop-secondary-text">
          Supports Tajima (.dst) and Brother (.pes) files up to 10 MB
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
          <span class="starting-values-tag">${we}</span>
        </summary>
        <div class="rates-body">
          <p class="rates-note">
            <strong>${we}.</strong> Changes save automatically in this browser for your next visit.
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
`;function Ct(e){e.querySelector("#pricer-app-container")||(e.innerHTML=Mt);const t=St();let r=t.rates,n=null,i=null;const a=e.querySelector("#drop-zone"),s=e.querySelector("#design-file-input"),l=e.querySelector("#btn-manual-mode"),m=e.querySelector("#loaded-file-badge"),f=e.querySelector("#file-error-alert"),p=e.querySelector("#file-warning-alert"),v=e.querySelector("#stitch-preview-canvas"),k=e.querySelector("#thread-swatches"),P=e.querySelector("#input-design-name"),B=e.querySelector("#input-stitches"),x=e.querySelector("#input-colors"),C=e.querySelector("#input-color-changes"),h=e.querySelector("#input-jumps"),T=e.querySelector("#input-trims"),w=e.querySelector("#input-width-in"),d=e.querySelector("#input-width-mm"),$=e.querySelector("#input-height-in"),E=e.querySelector("#input-height-mm"),F=e.querySelector("#input-minutes-override"),c=e.querySelector("#btn-reset-minutes"),M=e.querySelector("#input-quantity"),g=e.querySelector("#input-customer-garment"),y=e.querySelector("#input-garment-cost"),b=e.querySelector("#input-apply-setup"),N=e.querySelector("#input-setup-fee"),R=e.querySelector("#rate-per-1000"),O=e.querySelector("#rate-piece-fee"),W=e.querySelector("#rate-minimum"),X=e.querySelector("#rate-colors-included"),z=e.querySelector("#rate-extra-color-fee"),L=e.querySelector("#rate-garment-markup"),j=e.querySelector("#rate-machine-speed"),le=e.querySelector("#rate-change-seconds"),de=e.querySelector("#rate-hooping-minutes"),ue=e.querySelector("#rate-heads"),ae=[0,1,2,3,4].map(o=>e.querySelector(`#break-discount-${o}`)),Qe=e.querySelector("#btn-reset-rates"),He=e.querySelector("#storage-status-note"),Ue=e.querySelector("#out-per-piece"),Ge=e.querySelector("#out-per-piece-sub"),_e=e.querySelector("#out-order-total"),We=e.querySelector("#out-order-total-sub"),Je=e.querySelector("#out-hourly-rate"),Ye=e.querySelector("#out-machine-time"),ge=e.querySelector("#break-table-body"),K=e.querySelector("#quote-text-output"),oe=e.querySelector("#copy-feedback"),Ve=e.querySelector("#btn-copy-quote"),je=e.querySelector("#btn-print-quote"),he=e.querySelector("#btn-toggle-print-view"),Xe=e.querySelector("#print-design-subtitle");function ye(){R.value=r.ratePer1000Stitches.toFixed(2),O.value=r.pieceFee.toFixed(2),W.value=r.minimumPerPiece.toFixed(2),X.value=String(r.colorsIncluded),z.value=r.extraColorFee.toFixed(2),L.value=String(Math.round(r.garmentMarkup*100)),j.value=String(r.machineSpeed),le.value=String(r.colorChangeSeconds),de.value=String(r.hoopingMinutes),ue.value=String(r.heads),r.quantityBreaks.forEach((o,u)=>{ae[u]&&(ae[u].value=String(Math.round(o.discount*100)))}),t.defaultSetupFee>0&&Number(N.value)===0&&(N.value=t.defaultSetupFee.toFixed(2))}function ze(){const o=(q,U,_=0)=>{const I=Number.parseFloat(q.value);return Number.isFinite(I)&&I>=_?I:U},u=fe();return{ratePer1000Stitches:o(R,u.ratePer1000Stitches,0),pieceFee:o(O,u.pieceFee,0),minimumPerPiece:o(W,u.minimumPerPiece,0),colorsIncluded:Math.floor(o(X,u.colorsIncluded,0)),extraColorFee:o(z,u.extraColorFee,0),quantityBreaks:u.quantityBreaks.map((q,U)=>{const _=o(ae[U],q.discount*100,0);return{...q,discount:Math.min(.95,Math.max(0,_/100))}}),garmentMarkup:o(L,u.garmentMarkup*100,0)/100,machineSpeed:o(j,u.machineSpeed,1),colorChangeSeconds:o(le,u.colorChangeSeconds,0),hoopingMinutes:o(de,u.hoopingMinutes,0),heads:Math.max(1,Math.floor(o(ue,u.heads,1)))}}function Ke(){const o=Math.max(1,Math.floor(Number(x.value)||1));k.innerHTML="";for(let u=0;u<Math.min(o,24);u++){const q=n==null?void 0:n.threads[u],U=(q==null?void 0:q.hex)??["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"][u%6],_=(q==null?void 0:q.description)??`Color ${u+1}`,I=document.createElement("span");I.className="swatch-pill",I.title=`${u+1}. ${_} (${U})`;const Y=document.createElement("span");Y.className="swatch-dot",Y.style.backgroundColor=U;const V=document.createElement("span");V.textContent=`${u+1}. ${_}`,I.appendChild(Y),I.appendChild(V),k.appendChild(I)}}let ve;function H(){r=ze();const o=Pt({rates:r,defaultSetupFee:Number.parseFloat(N.value)||0});He.textContent=o?"Settings saved locally in browser":"Browser storage blocked — using session settings",y.disabled=g.checked,N.disabled=!b.checked;const u=Math.max(0,Math.floor(Number.parseFloat(B.value)||0)),q=Math.max(1,Math.floor(Number.parseFloat(x.value)||1)),U=Math.max(0,Math.floor(Number.parseFloat(C.value)||0)),_=Math.max(1,Math.floor(Number.parseFloat(M.value)||1)),I=Math.max(0,Number.parseFloat(y.value)||0),Y=Math.max(0,Number.parseFloat(N.value)||0),V={stitches:u,colors:q,colorChanges:U,quantity:_,customerSuppliesGarment:g.checked,garmentCost:I,applySetupFee:b.checked,setupFee:Y},S=ot(V,r);if(i!==null&&i>0){const G=Q(i);S.minutesPerPiece=G,S.minutesPerPieceRaw=G,S.orderMachineMinutes=Q(G*S.quantity/r.heads),S.effectiveHourlyRate=Q(S.decorationPerPiece/G*60),S.breakTable=S.breakTable.map(ee=>({...ee,effectiveHourlyRate:Q(ee.decorationPerPiece/G*60)})),c.hidden=!1}else F.value=S.minutesPerPiece.toFixed(2),c.hidden=!0;ve=S;const pe=Math.round(S.breakDiscount*100);Ue.textContent=A(S.perPiece),Ge.textContent=`Decoration ${A(S.decorationPerPiece)}${S.minimumApplied?" (min)":""} · Garment ${A(S.garmentPerPiece)} (${pe}% break)`,_e.textContent=A(S.orderTotal),We.textContent=`${S.quantity} ${S.quantity===1?"piece":"pieces"} · ${A(S.setupFeeApplied)} setup fee`,Je.textContent=`${A(S.effectiveHourlyRate)}/hr`,Ye.textContent=`${S.minutesPerPiece.toFixed(2)} min/pc · ${S.orderMachineMinutes.toFixed(2)} min order (${r.heads} head${r.heads>1?"s":""})`,Xe.textContent=`${P.value||"Custom Design"} · ${S.quantity} pcs · ${S.stitches.toLocaleString()} stitches`,ge.innerHTML="";for(const G of S.breakTable){const ee=document.createElement("tr");G.label===S.activeBreak.label&&(ee.className="active-break-row");const tt=Math.round(G.discount*100);ee.innerHTML=`
        <td><strong>${G.label}</strong></td>
        <td>${tt}%</td>
        <td>${A(G.decorationPerPiece)}</td>
        <td><strong>${A(G.perPiece)}</strong></td>
        <td>${A(G.sampleOrderTotal)}</td>
        <td class="no-print">${A(G.effectiveHourlyRate)}/hr</td>
      `,ge.appendChild(ee)}const se=Math.max(.1,Number.parseFloat(d.value)||88.9),Ce=Math.max(.1,Number.parseFloat(E.value)||50.8);return Math.max(0,Math.floor(Number.parseFloat(h.value)||0)),Math.max(0,Math.floor(Number.parseFloat(T.value)||0)),K.value=Bt(S,{designName:P.value.trim()||"Custom Design",widthMm:se,heightMm:Ce,customerSuppliesGarment:g.checked,garmentCost:I,garmentMarkup:r.garmentMarkup,heads:r.heads,machineSpeed:r.machineSpeed}),Ke(),qe(v,n,{widthMm:se,heightMm:Ce,stitches:u}),S}function xe(o){n=o,i=null,f.hidden=!0,f.textContent="",o.warnings.length>0?(p.hidden=!1,p.textContent=o.warnings.join(" ")):(p.hidden=!0,p.textContent=""),m.textContent=`Loaded ${o.format.toUpperCase()}: ${o.filename}`,P.value=o.label||o.filename,B.value=String(o.normalStitches),x.value=String(o.threadBlocks),C.value=String(o.colorChanges),h.value=String(o.jumps),T.value=String(o.trims),d.value=o.widthMm.toFixed(1),w.value=o.widthIn.toFixed(2),E.value=o.heightMm.toFixed(1),$.value=o.heightIn.toFixed(2),H()}function Se(o){f.hidden=!1,f.textContent=o,p.hidden=!0,p.textContent=""}let Z=null,Ze=0;const re=new Map;function Pe(){if(Z)return Z;if(typeof Worker>"u")return null;try{return Z=new Worker(new URL("/assets/worker-BKXLW0pr.js",import.meta.url),{type:"module"}),Z.addEventListener("message",o=>{const u=re.get(o.data.id);u&&(re.delete(o.data.id),u.resolve(o.data))}),Z.addEventListener("error",o=>{for(const[,u]of re)u.reject(o);re.clear()}),Z}catch{return null}}async function ke(o,u){let q;if(o instanceof ArrayBuffer)q=o;else{const I=new Uint8Array(o.byteLength);I.set(o),q=I.buffer}const U=Pe();if(U)try{const I=++Ze,Y=q.slice(0),V=await new Promise((S,pe)=>{re.set(I,{resolve:S,reject:pe});const se={id:I,filename:u,buffer:Y};U.postMessage(se,[Y])});V.ok?xe(V.design):Se(V.error);return}catch{}const _=vt(q,u);_.ok?xe(_.design):Se(_.error)}async function Be(o){if(!o)return;const u=await o.arrayBuffer();await ke(u,o.name)}a.addEventListener("click",()=>{s.click()}),a.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),s.click())}),a.addEventListener("dragover",o=>{o.preventDefault(),a.classList.add("drag-over")}),a.addEventListener("dragleave",()=>{a.classList.remove("drag-over")}),a.addEventListener("drop",o=>{var q,U;o.preventDefault(),a.classList.remove("drag-over");const u=(U=(q=o.dataTransfer)==null?void 0:q.files)==null?void 0:U[0];Be(u)}),s.addEventListener("change",()=>{var u;const o=(u=s.files)==null?void 0:u[0];Be(o),s.value=""}),l.addEventListener("click",()=>{n=null,i=null,f.hidden=!0,p.hidden=!0,m.textContent="Mode: Manual stitch count entry",B.focus(),B.select(),H()}),w.addEventListener("input",()=>{const o=Number.parseFloat(w.value);Number.isFinite(o)&&o>=0&&(d.value=(o*25.4).toFixed(1)),H()}),d.addEventListener("input",()=>{const o=Number.parseFloat(d.value);Number.isFinite(o)&&o>=0&&(w.value=(o/25.4).toFixed(2)),H()}),$.addEventListener("input",()=>{const o=Number.parseFloat($.value);Number.isFinite(o)&&o>=0&&(E.value=(o*25.4).toFixed(1)),H()}),E.addEventListener("input",()=>{const o=Number.parseFloat(E.value);Number.isFinite(o)&&o>=0&&($.value=(o/25.4).toFixed(2)),H()}),x.addEventListener("input",()=>{const o=Math.max(1,Math.floor(Number.parseFloat(x.value)||1));C.value=String(Math.max(0,o-1)),i=null,H()}),C.addEventListener("input",()=>{i=null,H()}),B.addEventListener("input",()=>{i=null,H()}),F.addEventListener("input",()=>{const o=Number.parseFloat(F.value);Number.isFinite(o)&&o>0?i=o:i=null,H()}),c.addEventListener("click",()=>{i=null,H()});const et=[P,h,T,M,g,y,b,N,R,O,W,X,z,L,j,le,de,ue,...ae];for(const o of et)o.addEventListener("input",()=>H()),o.addEventListener("change",()=>H());Qe.addEventListener("click",()=>{kt(),r=fe(),ye(),H()}),Ve.addEventListener("click",async()=>{const o=K.value;try{navigator.clipboard&&navigator.clipboard.writeText?await navigator.clipboard.writeText(o):(K.focus(),K.select(),document.execCommand("copy")),oe.textContent="Quote copied to clipboard!"}catch{K.focus(),K.select(),oe.textContent="Selected quote text — press Ctrl+C / Cmd+C to copy"}setTimeout(()=>{oe.textContent&&(oe.textContent="")},3e3)}),je.addEventListener("click",()=>{window.print()}),he.addEventListener("click",()=>{const o=document.body.classList.toggle("print-preview-mode");he.setAttribute("aria-pressed",String(o)),he.textContent=o?"Exit Print View":"Preview Print View"}),typeof window<"u"&&window.addEventListener("resize",()=>{qe(v,n,{widthMm:Number.parseFloat(d.value)||88.9,heightMm:Number.parseFloat(E.value)||50.8,stitches:Number.parseFloat(B.value)||8e3,colors:Number.parseFloat(x.value)||3})}),Pe(),ye(),H();const Me={loadFileBuffer:ke,getQuote:()=>ve,getRates:()=>r,recalculate:H};return typeof window<"u"&&(window.__embroideryTool=Me),Me}function De(){const e=document.getElementById("embroidery-tool-root");e&&Ct(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",De):De();
