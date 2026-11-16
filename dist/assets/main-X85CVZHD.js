var it=Object.defineProperty;var at=(e,r,t)=>r in e?it(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t;var ce=(e,r,t)=>at(e,typeof r!="symbol"?r+"":r,t);(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const Ne="Starting values: change to yours",ie=[{label:"1–11",minQty:1,maxQty:11,discount:0},{label:"12–23",minQty:12,maxQty:23,discount:.05},{label:"24–47",minQty:24,maxQty:47,discount:.1},{label:"48–143",minQty:48,maxQty:143,discount:.15},{label:"144+",minQty:144,maxQty:null,discount:.2}],Oe={ratePer1000Stitches:1.5,pieceFee:1,minimumPerPiece:5,colorsIncluded:6,extraColorFee:.5,quantityBreaks:ie.map(e=>({...e})),garmentMarkup:.4,machineSpeed:650,colorChangeSeconds:30,hoopingMinutes:1,heads:1};function ge(){return{...Oe,quantityBreaks:ie.map(e=>({...e}))}}function Q(e){if(!Number.isFinite(e))return 0;const r=e<0?-1:1,t=Math.abs(e);return r*Math.floor(t*100+.5+1e-9)/100}function ot(e,r){const t=Math.max(1,Math.floor(e)),i=[...r].sort((n,a)=>n.minQty-a.minQty);for(const n of i)if(t>=n.minQty&&(n.maxQty===null||t<=n.maxQty))return n;for(let n=i.length-1;n>=0;n--)if(t>=i[n].minQty)return i[n];return i[0]??{label:"1+",minQty:1,maxQty:null,discount:0}}function st(e){const r=Math.max(0,e.stitches),t=Math.max(0,e.colorChanges),i=Math.max(1,Math.floor(e.quantity)),n=e.machineSpeed>0?e.machineSpeed:650,a=Math.max(0,e.colorChangeSeconds),s=Math.max(0,e.hoopingMinutes),l=e.heads>0?Math.floor(e.heads):1,h=r/n+t*(a/60)+s,y=Q(h),f=h*i/l,b=Q(f);return{minutesPerPieceRaw:h,minutesPerPiece:y,orderMachineMinutesRaw:f,orderMachineMinutes:b}}function ct(e,r=Oe){const t=Math.max(0,e.stitches),i=Math.max(1,Math.floor(e.colors)),n=e.colorChanges!==void 0?Math.max(0,Math.floor(e.colorChanges)):Math.max(0,i-1),a=Math.max(1,Math.floor(e.quantity)),s=Math.max(0,i-Math.max(0,Math.floor(r.colorsIncluded))),l=t/1e3*r.ratePer1000Stitches+r.pieceFee+r.extraColorFee*s,h=ot(a,r.quantityBreaks),y=h.discount,f=l*(1-y),b=f<r.minimumPerPiece,g=Math.max(f,r.minimumPerPiece),B=Q(g),k=(e.customerSuppliesGarment?0:Math.max(0,e.garmentCost))*(1+r.garmentMarkup),P=Q(k),d=Q(g+k),C=e.applySetupFee?Q(Math.max(0,e.setupFee)):0,N=Q(d*a+C),u=st({stitches:t,colorChanges:n,quantity:a,machineSpeed:r.machineSpeed,colorChangeSeconds:r.colorChangeSeconds,hoopingMinutes:r.hoopingMinutes,heads:r.heads}),F=u.minutesPerPiece>0?Q(B/u.minutesPerPiece*60):0,w=r.quantityBreaks.map(E=>{const c=l*(1-E.discount),M=Math.max(c,r.minimumPerPiece),x=Q(M),v=Q(M+k),m=Q(v*E.minQty+C),L=u.minutesPerPiece>0?Q(x/u.minutesPerPiece*60):0;return{label:E.label,minQty:E.minQty,maxQty:E.maxQty,discount:E.discount,decorationPerPiece:x,garmentPerPiece:P,perPiece:v,sampleOrderTotal:m,effectiveHourlyRate:L}});return{stitches:t,colors:i,colorChanges:n,extraColors:s,quantity:a,activeBreak:h,breakDiscount:y,baseDecoration:Q(l),discountedDecorationRaw:f,minimumApplied:b,decorationPerPiece:B,garmentPerPiece:P,perPiece:d,setupFeeApplied:C,orderTotal:N,minutesPerPieceRaw:u.minutesPerPieceRaw,minutesPerPiece:u.minutesPerPiece,orderMachineMinutesRaw:u.orderMachineMinutesRaw,orderMachineMinutes:u.orderMachineMinutes,effectiveHourlyRate:F,breakTable:w}}const be=[null,{hex:"#0e1f7c",description:"Prussian Blue",catalogNumber:"1",brand:"Brother",chart:"Brother"},{hex:"#0a55a3",description:"Blue",catalogNumber:"2",brand:"Brother",chart:"Brother"},{hex:"#008777",description:"Teal Green",catalogNumber:"3",brand:"Brother",chart:"Brother"},{hex:"#4b6baf",description:"Cornflower Blue",catalogNumber:"4",brand:"Brother",chart:"Brother"},{hex:"#ed171f",description:"Red",catalogNumber:"5",brand:"Brother",chart:"Brother"},{hex:"#d15c00",description:"Reddish Brown",catalogNumber:"6",brand:"Brother",chart:"Brother"},{hex:"#913697",description:"Magenta",catalogNumber:"7",brand:"Brother",chart:"Brother"},{hex:"#e49acb",description:"Light Lilac",catalogNumber:"8",brand:"Brother",chart:"Brother"},{hex:"#915fac",description:"Lilac",catalogNumber:"9",brand:"Brother",chart:"Brother"},{hex:"#9ed67d",description:"Mint Green",catalogNumber:"10",brand:"Brother",chart:"Brother"},{hex:"#e8a900",description:"Deep Gold",catalogNumber:"11",brand:"Brother",chart:"Brother"},{hex:"#feba35",description:"Orange",catalogNumber:"12",brand:"Brother",chart:"Brother"},{hex:"#ffff00",description:"Yellow",catalogNumber:"13",brand:"Brother",chart:"Brother"},{hex:"#70bc1f",description:"Lime Green",catalogNumber:"14",brand:"Brother",chart:"Brother"},{hex:"#ba9800",description:"Brass",catalogNumber:"15",brand:"Brother",chart:"Brother"},{hex:"#a8a8a8",description:"Silver",catalogNumber:"16",brand:"Brother",chart:"Brother"},{hex:"#7d6f00",description:"Russet Brown",catalogNumber:"17",brand:"Brother",chart:"Brother"},{hex:"#ffffb3",description:"Cream Brown",catalogNumber:"18",brand:"Brother",chart:"Brother"},{hex:"#4f5556",description:"Pewter",catalogNumber:"19",brand:"Brother",chart:"Brother"},{hex:"#000000",description:"Black",catalogNumber:"20",brand:"Brother",chart:"Brother"},{hex:"#0b3d91",description:"Ultramarine",catalogNumber:"21",brand:"Brother",chart:"Brother"},{hex:"#770176",description:"Royal Purple",catalogNumber:"22",brand:"Brother",chart:"Brother"},{hex:"#293133",description:"Dark Gray",catalogNumber:"23",brand:"Brother",chart:"Brother"},{hex:"#2a1301",description:"Dark Brown",catalogNumber:"24",brand:"Brother",chart:"Brother"},{hex:"#f64a8a",description:"Deep Rose",catalogNumber:"25",brand:"Brother",chart:"Brother"},{hex:"#b27624",description:"Light Brown",catalogNumber:"26",brand:"Brother",chart:"Brother"},{hex:"#fcbbc5",description:"Salmon Pink",catalogNumber:"27",brand:"Brother",chart:"Brother"},{hex:"#fe370f",description:"Vermilion",catalogNumber:"28",brand:"Brother",chart:"Brother"},{hex:"#f0f0f0",description:"White",catalogNumber:"29",brand:"Brother",chart:"Brother"},{hex:"#6a1c8a",description:"Violet",catalogNumber:"30",brand:"Brother",chart:"Brother"},{hex:"#a8ddc4",description:"Seacrest",catalogNumber:"31",brand:"Brother",chart:"Brother"},{hex:"#2584bb",description:"Sky Blue",catalogNumber:"32",brand:"Brother",chart:"Brother"},{hex:"#feb343",description:"Pumpkin",catalogNumber:"33",brand:"Brother",chart:"Brother"},{hex:"#fff36b",description:"Cream Yellow",catalogNumber:"34",brand:"Brother",chart:"Brother"},{hex:"#d0a660",description:"Khaki",catalogNumber:"35",brand:"Brother",chart:"Brother"},{hex:"#d15400",description:"Clay Brown",catalogNumber:"36",brand:"Brother",chart:"Brother"},{hex:"#66ba49",description:"Leaf Green",catalogNumber:"37",brand:"Brother",chart:"Brother"},{hex:"#134a46",description:"Peacock Blue",catalogNumber:"38",brand:"Brother",chart:"Brother"},{hex:"#878787",description:"Gray",catalogNumber:"39",brand:"Brother",chart:"Brother"},{hex:"#d8ccc6",description:"Warm Gray",catalogNumber:"40",brand:"Brother",chart:"Brother"},{hex:"#435607",description:"Dark Olive",catalogNumber:"41",brand:"Brother",chart:"Brother"},{hex:"#fdd9de",description:"Flesh Pink",catalogNumber:"42",brand:"Brother",chart:"Brother"},{hex:"#f993bc",description:"Pink",catalogNumber:"43",brand:"Brother",chart:"Brother"},{hex:"#003822",description:"Deep Green",catalogNumber:"44",brand:"Brother",chart:"Brother"},{hex:"#b2afd4",description:"Lavender",catalogNumber:"45",brand:"Brother",chart:"Brother"},{hex:"#686ab0",description:"Wisteria Violet",catalogNumber:"46",brand:"Brother",chart:"Brother"},{hex:"#efe3b9",description:"Beige",catalogNumber:"47",brand:"Brother",chart:"Brother"},{hex:"#f73866",description:"Carmine",catalogNumber:"48",brand:"Brother",chart:"Brother"},{hex:"#b54b64",description:"Amber Red",catalogNumber:"49",brand:"Brother",chart:"Brother"},{hex:"#132b1a",description:"Olive Green",catalogNumber:"50",brand:"Brother",chart:"Brother"},{hex:"#c70156",description:"Dark Fuchsia",catalogNumber:"51",brand:"Brother",chart:"Brother"},{hex:"#fe9e32",description:"Tangerine",catalogNumber:"52",brand:"Brother",chart:"Brother"},{hex:"#a8deeb",description:"Light Blue",catalogNumber:"53",brand:"Brother",chart:"Brother"},{hex:"#00673e",description:"Emerald Green",catalogNumber:"54",brand:"Brother",chart:"Brother"},{hex:"#4e2990",description:"Purple",catalogNumber:"55",brand:"Brother",chart:"Brother"},{hex:"#2f7e20",description:"Moss Green",catalogNumber:"56",brand:"Brother",chart:"Brother"},{hex:"#ffcccc",description:"Flesh Pink",catalogNumber:"57",brand:"Brother",chart:"Brother"},{hex:"#ffd911",description:"Harvest Gold",catalogNumber:"58",brand:"Brother",chart:"Brother"},{hex:"#095ba6",description:"Electric Blue",catalogNumber:"59",brand:"Brother",chart:"Brother"},{hex:"#f0f970",description:"Lemon Yellow",catalogNumber:"60",brand:"Brother",chart:"Brother"},{hex:"#e3f35b",description:"Fresh Green",catalogNumber:"61",brand:"Brother",chart:"Brother"},{hex:"#ff9900",description:"Orange",catalogNumber:"62",brand:"Brother",chart:"Brother"},{hex:"#fff08d",description:"Cream Yellow",catalogNumber:"63",brand:"Brother",chart:"Brother"},{hex:"#ffc8c8",description:"Applique",catalogNumber:"64",brand:"Brother",chart:"Brother"}],Te=[{hex:"#1d4ed8",description:"Royal Blue (Default 1)"},{hex:"#dc2626",description:"Crimson Red (Default 2)"},{hex:"#15803d",description:"Forest Green (Default 3)"},{hex:"#d97706",description:"Amber Gold (Default 4)"},{hex:"#7c3aed",description:"Violet Purple (Default 5)"},{hex:"#0f766e",description:"Teal (Default 6)"},{hex:"#be185d",description:"Magenta (Default 7)"},{hex:"#374151",description:"Charcoal (Default 8)"},{hex:"#ea580c",description:"Burnt Orange (Default 9)"},{hex:"#0284c7",description:"Sky Blue (Default 10)"},{hex:"#4d7c0f",description:"Olive Green (Default 11)"},{hex:"#111827",description:"Jet Black (Default 12)"}];function Fe(e){const r=Te[e%Te.length];return{hex:r.hex,description:r.description,catalogNumber:String(e+1),brand:"Default Palette"}}function lt(e,r=3,t=null,i=!0){let n=-1,a=e.length-1,s=0,l=0,h=0,y=0,f=0,b=0,g=!1,B=!0;for(;n<a;){n+=1;const T=e[n],k=T.x-s,P=T.y-l;s=T.x,l=T.y;const d=T.command;if(d==="STITCH"||d==="SEQUIN_EJECT"?(B=!1,g=!1):(d==="COLOR_CHANGE"||d==="TRIM")&&(B=!0,g=!1),d==="JUMP"){if(g||(f=0,b=0,h=0,y=n,g=!0),h+=1,f+=k,b+=P,!B&&(h===r||t!==null&&(Math.abs(b)>t||Math.abs(f)>t))){const C=y>0?e[y-1].x:0,N=y>0?e[y-1].y:0;e.splice(y,0,{x:C,y:N,command:"TRIM"}),y+=1,n+=1,a+=1,B=!0}i&&f===0&&b===0&&(e.splice(y,n+1-y),n=y-1,a=e.length-1)}}}function dt(e,r){return!e||!r?!1:e.hex.toLowerCase()===r.hex.toLowerCase()&&(e.description??"")===(r.description??"")&&(e.catalogNumber??"")===(r.catalogNumber??"")&&(e.brand??"")===(r.brand??"")&&(e.chart??"")===(r.chart??"")}function ut(e,r){let t=0,i=!0,n=null;for(let a=0;a<e.length;a++){const l=e[a].command;if(l==="STITCH"){if(i){if(t>=r.length)return;n!==null&&t!==0&&dt(r[t-1]??void 0,r[t]??void 0)?(r.splice(t,1),e[n].command="STOP"):t+=1,i=!1}}else l==="COLOR_CHANGE"&&(i=!0,n=a)}}function Qe(e){const{format:r,filename:t,label:i,stitches:n,threads:a,warnings:s,headerMetadata:l}=e;let h=0,y=0,f=0,b=0,g=0,B=1/0,T=1/0,k=-1/0,P=-1/0;for(const R of n)switch(R.x>k&&(k=R.x),R.x<B&&(B=R.x),R.y>P&&(P=R.y),R.y<T&&(T=R.y),R.command){case"STITCH":h+=1;break;case"JUMP":y+=1;break;case"TRIM":f+=1;break;case"COLOR_CHANGE":b+=1;break;case"STOP":g+=1;break}const d=n.length>0&&Number.isFinite(B)&&Number.isFinite(k),C=d?B/10:0,N=d?T/10:0,u=d?k/10:0,F=d?P/10:0,w=d?(k-B)/10:0,E=d?(P-T)/10:0,c=w/25.4,M=E/25.4,x=b+1,v=[];for(let R=0;R<x;R++){const j=a[R];j&&j.hex?v.push(j):v.push(Fe(R))}const m=[];let L=0,$=[],q=[],W=0;const X=()=>{q.length>0&&($.push({points:q}),q=[])},z=()=>{X(),m.push({index:L,color:v[L]??Fe(L),stitchCount:W,segments:$}),L+=1,$=[],W=0};for(const R of n)R.command==="STITCH"?(q.push({x:R.x/10,y:R.y/10}),W+=1):R.command==="COLOR_CHANGE"?z():X();return z(),{format:r,filename:t,label:i,normalStitches:h,jumps:y,trims:f,colorChanges:b,stops:g,threadBlocks:x,widthMm:w,heightMm:E,widthIn:c,heightIn:M,boundsMm:{minX:C,minY:N,maxX:u,maxY:F},threads:v,blocks:m,warnings:s,headerMetadata:l}}const ne=512;function D(e,r){return e>>r&1}function ht(e,r,t){let i=0;return i+=D(t,2)*81,i+=D(t,3)*-81,i+=D(r,2)*27,i+=D(r,3)*-27,i+=D(e,2)*9,i+=D(e,3)*-9,i+=D(r,0)*3,i+=D(r,1)*-3,i+=D(e,0)*1,i+=D(e,1)*-1,i}function pt(e,r,t){let i=0;return i+=D(t,5)*81,i+=D(t,4)*-81,i+=D(r,5)*27,i+=D(r,4)*-27,i+=D(e,5)*9,i+=D(e,4)*-9,i+=D(r,7)*3,i+=D(r,6)*-3,i+=D(e,7)*1,i+=D(e,6)*-1,-i}function mt(e){const r=e.trim().replace(/^#/,"");return/^[0-9a-fA-F]{6}$/.test(r)?`#${r.toLowerCase()}`:"#000000"}function ft(e,r){if(e.byteLength<ne+3)return{ok:!1,error:"Invalid or truncated DST file: file is smaller than the 512-byte DST header plus one stitch record."};const t=e.subarray(0,ne);if(!new TextDecoder("utf-8",{fatal:!1}).decode(t.subarray(0,64)).includes("LA:"))return{ok:!1,error:"Invalid DST file: missing 'LA:' design label in the 512-byte Tajima header."};const a=(e.byteLength-ne)%3,s=a===1&&e[e.byteLength-1]===26;if(a!==0&&!s)return{ok:!1,error:"Truncated or corrupted DST file: stitch data length is not a multiple of 3-byte DST records."};const l={},h=[],y=new TextDecoder("utf-8",{fatal:!0});let f=0;for(let c=0;c<ne;c++){const M=t[c];if(M===13||M===10){const x=c,v=t.subarray(f,x);f=x;try{const m=y.decode(v).trim();if(m.length>3&&m[2]===":"){const L=m.slice(0,2).trim(),$=m.slice(3).trim();if(L==="LA")l.name=$;else if(L==="AU")l.author=$;else if(L==="CP")l.copyright=$;else if(L==="TC"){const q=$.split(",").map(W=>W.trim());h.push({hex:mt(q[0]??"#000000"),description:q[1]??"Custom DST Thread",catalogNumber:q[2]??""})}else l[L]=$}}catch{}}}const b=[];let g=0,B=0,T=!1,k=0,P=!1;const d=(c,M,x)=>{const v=g+c,m=B+M;b.push({x:v,y:m,command:x}),g=v,B=m};let C=ne;for(;C+3<=e.byteLength;){const c=e[C],M=e[C+1],x=e[C+2];if(C+=3,(x&3)!==3)return{ok:!1,error:`Corrupted DST stitch record at byte offset ${C-3}: missing mandatory DST record tag bits.`};const v=ht(c,M,x),m=pt(c,M,x);if((x&243)===243){P=!0;break}else(x&195)===195?(k+=1,d(v,m,"COLOR_CHANGE")):(x&67)===67?(k+=1,d(v,m,"SEQUIN_MODE"),T=!T):(x&131)===131?(k+=1,T?d(v,m,"SEQUIN_EJECT"):d(v,m,"JUMP")):(k+=1,d(v,m,"STITCH"))}if(k===0)return{ok:!1,error:"Invalid DST file: file contains no stitch records."};d(0,0,"END"),lt(b,3,null,!0);const N=[];let u=0,F=0;for(const c of b)c.command==="STITCH"?u+=1:c.command==="COLOR_CHANGE"&&(F+=1);if(l.CO!==void 0){const c=Number.parseInt(l.CO,10);!Number.isNaN(c)&&c!==F&&N.push(`Header color change count (CO=${c}) disagrees with stitch records (${F} color changes). Using stitch records.`)}if(l.ST!==void 0){const c=Number.parseInt(l.ST,10),M=k+(P?1:0);!Number.isNaN(c)&&c!==u&&c!==M&&c!==k?N.push(`Header stitch count (ST=${c}) disagrees with stitch records (${u} normal stitches, ${M} total records). Using stitch records.`):!Number.isNaN(c)&&c!==u&&N.push(`Header ST (${c}) includes jumps/color-changes/end records; pricing uses ${u} normal stitches computed from stitch records.`)}const w=l.name||r.replace(/\.[^.]+$/,"");return{ok:!0,design:Qe({format:"dst",filename:r,label:w,stitches:b,threads:h,warnings:N,headerMetadata:l})}}const Le=16,$e=32,Re=128;class bt{constructor(r){ce(this,"view");ce(this,"bytes");ce(this,"pos",0);this.bytes=r,this.view=new DataView(r.buffer,r.byteOffset,r.byteLength)}get length(){return this.bytes.byteLength}seek(r,t="set"){t==="set"?this.pos=r:this.pos+=r}readU8(){return this.pos>=this.bytes.byteLength?null:this.bytes[this.pos++]}readU16LE(){if(this.pos+2>this.bytes.byteLength)return null;const r=this.view.getUint16(this.pos,!0);return this.pos+=2,r}readS16LE(){if(this.pos+2>this.bytes.byteLength)return null;const r=this.view.getInt16(this.pos,!0);return this.pos+=2,r}readU24LE(){if(this.pos+3>this.bytes.byteLength)return null;const r=this.bytes[this.pos],t=this.bytes[this.pos+1],i=this.bytes[this.pos+2];return this.pos+=3,r|t<<8|i<<16}readU24BE(){if(this.pos+3>this.bytes.byteLength)return null;const r=this.bytes[this.pos],t=this.bytes[this.pos+1],i=this.bytes[this.pos+2];return this.pos+=3,r<<16|t<<8|i}readU32LE(){if(this.pos+4>this.bytes.byteLength)return null;const r=this.view.getUint32(this.pos,!0);return this.pos+=4,r}readBytes(r){if(this.pos+r>this.bytes.byteLength)return null;const t=this.bytes.subarray(this.pos,this.pos+r);return this.pos+=r,t}readAscii(r){const t=this.readBytes(r);return t?new TextDecoder("utf-8",{fatal:!1}).decode(t):null}readPesString(){const r=this.readU8();return r===null||r===0?null:this.readAscii(r)}}function qe(e){const r=e&4095;return r>2047?-4096+r:r}function Ie(e){return e>63?-128+e:e}function Ge(e,r){const t=["name","category","author","keywords","comments"];for(const i of t){const n=e.readPesString();n&&n.length>0&&(r[i]=n)}}function gt(e){const r=e.readPesString()??void 0,t=e.readU24BE();if(t===null)return null;e.seek(5,"cur");const i=e.readPesString()??"",n=e.readPesString()??void 0,a=e.readPesString()??void 0;return{hex:`#${(t&16777215).toString(16).padStart(6,"0")}`,description:i,catalogNumber:r,brand:n,chart:a}}function te(e,r,t,i,n,a,s){if(e.seek(4,"cur"),Ge(e,r),s!==void 0){e.seek(s,"cur");const g=e.readPesString();g&&g.length>0&&(r.hoop_name=g)}e.seek(i,"cur");const l=e.readPesString();l&&l.length>0&&(r[a]=l),e.seek(n,"cur");const h=e.readU16LE();if(h===null||h!==0)return;const y=e.readU16LE();if(y===null||y!==0)return;const f=e.readU16LE();if(f===null||f!==0)return;const b=e.readU16LE();if(b!==null)for(let g=0;g<b;g++){const B=gt(e);if(!B)break;t.push(B)}}function yt(e,r){const t=be.length,i=[];if(r.length===0)for(let n=0;n<e.length;n++){const a=e[n]%t;i.push(be[a]??null)}else if(r.length>=e.length)for(const n of r)i.push(n);else{const n=[...r],a=new Map;for(let s=0;s<e.length;s++){const l=e[s]%t;let h=a.get(l);h===void 0&&(n.length>0?h=n.shift()??null:h=be[l]??null,a.set(l,h)),i.push(h)}}return i}function vt(e,r){if(e.byteLength<48)return{ok:!1,error:"Invalid or truncated PES file: file is too small to contain a PES/PEC header."};const t=new bt(e),i=t.readAscii(8);if(!i||!i.startsWith("#PES")&&i!=="#PEC0001")return{ok:!1,error:"Invalid PES file: file does not start with a valid '#PES' or '#PEC0001' signature."};const n={},a=[];let s=8;if(i!=="#PEC0001"){const c=t.readU32LE();if(c===null||c<12||c+532>e.byteLength)return{ok:!1,error:"Invalid or truncated PES file: PEC block offset in header points outside the file."};s=c;try{switch(i){case"#PES0100":n.version="10",te(t,n,a,38,34,"image_file",14);break;case"#PES0090":n.version="9",te(t,n,a,30,34,"image_file",14);break;case"#PES0080":n.version="8",te(t,n,a,38,26,"image_file");break;case"#PES0070":n.version="7",te(t,n,a,36,24,"image_file");break;case"#PES0060":n.version="6",te(t,n,a,36,24,"image_file");break;case"#PES0050":case"#PES0055":case"#PES0056":n.version=i==="#PES0050"?"5":i==="#PES0055"?"5.5":"5.6",te(t,n,a,24,24,"image");break;case"#PES0040":n.version="4",t.seek(4,"cur"),Ge(t,n);break;case"#PES0030":n.version="3";break;case"#PES0022":n.version="2.2";break;case"#PES0020":n.version="2";break;case"#PES0001":n.version="1";break;default:n.version=i.slice(4);break}}catch{}}t.seek(s,"set"),t.seek(3,"cur");const l=t.readAscii(16);if(l===null)return{ok:!1,error:"Truncated PES/PEC block: could not read design label."};n.Name=l.trim(),t.seek(15,"cur");const h=t.readU8(),y=t.readU8();if(h===null||y===null)return{ok:!1,error:"Truncated PES/PEC block: missing graphic header fields."};t.seek(12,"cur");const f=t.readU8();if(f===null)return{ok:!1,error:"Truncated PES/PEC block: missing color change count byte."};const b=f===255?0:f,g=f===255?0:b+1,B=t.readBytes(g);if(!B)return{ok:!1,error:"Truncated PES/PEC block: file ends inside PEC color palette table."};const T=yt(B,a);if(t.seek(464-f,"cur"),t.readU24LE()===null)return{ok:!1,error:"Truncated PES/PEC block: missing stitch block length."};if(t.pos+11>t.length)return{ok:!1,error:"Truncated PES/PEC block: file ends before stitch data starts."};t.seek(11,"cur");const P=[];let d=0,C=0;const N=(c,M,x)=>{const v=d+c,m=C+M;P.push({x:v,y:m,command:x}),d=v,C=m};for(;;){const c=t.readU8(),M=t.readU8();if(c===null||M===null||c===255&&M===0)break;if(c===254&&M===176){t.seek(1,"cur"),N(0,0,"COLOR_CHANGE");continue}let x=!1,v=!1,m=0,L=0,$=M;if(c&Re){c&$e&&(v=!0),c&Le&&(x=!0);const q=c<<8|$;if(m=qe(q),$=t.readU8(),$===null)break}else m=Ie(c);if($&Re){$&$e&&(v=!0),$&Le&&(x=!0);const q=t.readU8();if(q===null)break;const W=$<<8|q;L=qe(W)}else L=Ie($);x?N(m,L,"JUMP"):v?(N(0,0,"TRIM"),N(m,L,"JUMP")):N(m,L,"STITCH")}if(P.length===0)return{ok:!1,error:"Invalid PES file: PEC section contains no stitch records."};N(0,0,"END"),ut(P,T);let u=0;for(const c of P)c.command==="COLOR_CHANGE"&&(u+=1);const F=[];b!==u&&F.push(`PEC header color change count (${b}) disagrees with stitch records (${u} color changes). Using stitch records.`);const w=n.name||n.Name||r.replace(/\.[^.]+$/,"");return{ok:!0,design:Qe({format:"pes",filename:r,label:w,stitches:P,threads:T,warnings:F,headerMetadata:n})}}const xt=10*1024*1024;function St(e,r){try{const t=e instanceof Uint8Array?e:new Uint8Array(e);if(t.byteLength===0)return{ok:!1,error:"The selected file is empty (0 bytes). Please choose a valid .dst or .pes embroidery file."};if(t.byteLength>xt)return{ok:!1,error:`File exceeds the 10 MB limit (${(t.byteLength/(1024*1024)).toFixed(1)} MB). Please upload a .dst or .pes file under 10 MB.`};if(t.byteLength>=3&&t[0]===255&&t[1]===216&&t[2]===255)return{ok:!1,error:"Unsupported file content: this file is a JPEG image, not a .dst or .pes embroidery file."};if(t.byteLength>=4&&t[0]===137&&t[1]===80&&t[2]===78&&t[3]===71)return{ok:!1,error:"Unsupported file content: this file is a PNG image, not a .dst or .pes embroidery file."};const i=r.trim().toLowerCase();return i.endsWith(".dst")?ft(t,r):i.endsWith(".pes")?vt(t,r):{ok:!1,error:"Unsupported file format. Please select a Tajima (.dst) or Brother (.pes) embroidery file."}}catch(t){return{ok:!1,error:`Could not read embroidery file: ${t instanceof Error?t.message:"Unknown parsing error"}`}}}const ye="embroidery_pricer_settings_v1";function J(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0}function kt(e){return!Array.isArray(e)||e.length!==ie.length?ie.map(r=>({...r})):ie.map((r,t)=>{const i=e[t],n=i&&typeof i.discount=="number"&&Number.isFinite(i.discount)?Math.min(1,Math.max(0,i.discount)):r.discount;return{label:r.label,minQty:r.minQty,maxQty:r.maxQty,discount:n}})}function Pt(e){const r={rates:ge(),defaultSetupFee:0};try{const t=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!t)return r;const i=t.getItem(ye);if(!i)return r;const n=JSON.parse(i),a=n.rates??{},s=r.rates,l={ratePer1000Stitches:J(a.ratePer1000Stitches)?a.ratePer1000Stitches:s.ratePer1000Stitches,pieceFee:J(a.pieceFee)?a.pieceFee:s.pieceFee,minimumPerPiece:J(a.minimumPerPiece)?a.minimumPerPiece:s.minimumPerPiece,colorsIncluded:J(a.colorsIncluded)?Math.floor(a.colorsIncluded):s.colorsIncluded,extraColorFee:J(a.extraColorFee)?a.extraColorFee:s.extraColorFee,quantityBreaks:kt(a.quantityBreaks),garmentMarkup:J(a.garmentMarkup)?a.garmentMarkup:s.garmentMarkup,machineSpeed:J(a.machineSpeed)&&a.machineSpeed>0?a.machineSpeed:s.machineSpeed,colorChangeSeconds:J(a.colorChangeSeconds)?a.colorChangeSeconds:s.colorChangeSeconds,hoopingMinutes:J(a.hoopingMinutes)?a.hoopingMinutes:s.hoopingMinutes,heads:J(a.heads)&&a.heads>=1?Math.floor(a.heads):s.heads},h=J(n.defaultSetupFee)?n.defaultSetupFee:0;return{rates:l,defaultSetupFee:h}}catch{return r}}function Mt(e,r){try{const t=r!==void 0?r:typeof window<"u"?window.localStorage:null;return t?(t.setItem(ye,JSON.stringify(e)),!0):!1}catch{return!1}}function Bt(e){try{const r=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!r)return;r.removeItem(ye)}catch{}}function De(e,r,t){const i=e.getContext("2d");if(!i)return;const n=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,a=e.clientWidth||320,s=e.clientHeight||220;e.width=Math.round(a*n),e.height=Math.round(s*n),i.setTransform(n,0,0,n,0,0),i.fillStyle="#f8fafc",i.fillRect(0,0,a,s),i.strokeStyle="#e2e8f0",i.lineWidth=1;const l=20;for(let u=l;u<a;u+=l)i.beginPath(),i.moveTo(u,0),i.lineTo(u,s),i.stroke();for(let u=l;u<s;u+=l)i.beginPath(),i.moveTo(0,u),i.lineTo(a,u),i.stroke();const h=20,y=Math.max(40,a-h*2),f=Math.max(40,s-h*2);if(!r||r.blocks.length===0||r.normalStitches===0){const u=(t==null?void 0:t.widthMm)||88.9,F=(t==null?void 0:t.heightMm)||50.8,w=Math.min(y/Math.max(1,u),f/Math.max(1,F)),E=Math.max(24,u*w),c=Math.max(24,F*w),M=(a-E)/2,x=(s-c)/2;i.strokeStyle="#475569",i.setLineDash([5,4]),i.lineWidth=1.5,i.strokeRect(M,x,E,c),i.setLineDash([]),i.fillStyle="#334155",i.font="600 13px system-ui, -apple-system, sans-serif",i.textAlign="center",i.textBaseline="middle";const v=`${((t==null?void 0:t.stitches)??8e3).toLocaleString()} stitches (manual mode)`,m=`${(u/25.4).toFixed(2)}" × ${(F/25.4).toFixed(2)}" (${u.toFixed(1)} × ${F.toFixed(1)} mm)`;i.fillText(v,a/2,s/2-10),i.font="400 12px system-ui, -apple-system, sans-serif",i.fillStyle="#64748b",i.fillText(m,a/2,s/2+12);return}const{minX:b,minY:g,maxX:B,maxY:T}=r.boundsMm,k=Math.max(.5,B-b),P=Math.max(.5,T-g),d=Math.min(y/k,f/P),C=h+(y-k*d)/2-b*d,N=h+(f-P*d)/2-g*d;i.lineCap="round",i.lineJoin="round",i.lineWidth=Math.max(.9,Math.min(1.8,d*.35));for(const u of r.blocks){i.strokeStyle=u.color.hex||"#1d4ed8",i.beginPath();for(const F of u.segments){const w=F.points;if(w.length!==0){i.moveTo(w[0].x*d+C,w[0].y*d+N);for(let E=1;E<w.length;E++)i.lineTo(w[E].x*d+C,w[E].y*d+N)}}i.stroke()}}function O(e){return`$${e.toFixed(2)}`}function Ct(e,r){const t=(r.widthMm/25.4).toFixed(2),i=(r.heightMm/25.4).toFixed(2),n=Math.round(e.breakDiscount*100),a=[`EMBROIDERY JOB QUOTE — ${r.designName||"Custom Design"}`,"----------------------------------------",`Quantity: ${e.quantity} pcs (Tier ${e.activeBreak.label}, ${n}% break)`,`Design: ${e.stitches.toLocaleString()} stitches | ${e.colors} color(s) (${e.colorChanges} color change(s))`,`Dimensions: ${t}" × ${i}" (${r.widthMm.toFixed(1)} × ${r.heightMm.toFixed(1)} mm)`,"","PRICING BREAKDOWN",`- Decoration per piece: ${O(e.decorationPerPiece)}${e.minimumApplied?" (minimum applied)":""}`];r.customerSuppliesGarment?a.push("- Garment: Customer-supplied ($0.00)"):a.push(`- Garment per piece: ${O(e.garmentPerPiece)} (cost ${O(r.garmentCost)} + ${Math.round(r.garmentMarkup*100)}% markup)`),a.push(`- Total price per piece: ${O(e.perPiece)}`),e.setupFeeApplied>0&&a.push(`- One-time setup fee: ${O(e.setupFeeApplied)}`),a.push(`- ORDER TOTAL (${e.quantity} pcs): ${O(e.orderTotal)}`),a.push(""),a.push("QUANTITY PRICE BREAKS (Per Piece / Order Total)");for(const s of e.breakTable){const l=Math.round(s.discount*100);a.push(`  ${s.label.padEnd(7," ")} (${String(l).padStart(2," ")}% off): ${O(s.perPiece)}/pc  (${s.minQty} pcs = ${O(s.sampleOrderTotal)})`)}return a.join(`
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
          <span class="starting-values-tag">${Ne}</span>
        </summary>
        <div class="rates-body">
          <p class="rates-note">
            <strong>${Ne}.</strong> Changes save automatically in this browser for your next visit.
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
`;function Et(e){e.querySelector("#pricer-app-container")||(e.innerHTML=wt);const r=e.getAttribute("data-tool-preset");let t=null;if(r)try{t=JSON.parse(r)}catch{t=null}const i=Pt();let n=i.rates,a=null,s=null;const l=e.querySelector("#drop-zone"),h=e.querySelector("#design-file-input"),y=e.querySelector("#btn-manual-mode"),f=e.querySelector("#loaded-file-badge"),b=e.querySelector("#file-error-alert"),g=e.querySelector("#file-warning-alert"),B=e.querySelector("#stitch-preview-canvas"),T=e.querySelector("#thread-swatches"),k=e.querySelector("#input-design-name"),P=e.querySelector("#input-stitches"),d=e.querySelector("#input-colors"),C=e.querySelector("#input-color-changes"),N=e.querySelector("#input-jumps"),u=e.querySelector("#input-trims"),F=e.querySelector("#input-width-in"),w=e.querySelector("#input-width-mm"),E=e.querySelector("#input-height-in"),c=e.querySelector("#input-height-mm"),M=e.querySelector("#input-minutes-override"),x=e.querySelector("#btn-reset-minutes"),v=e.querySelector("#input-quantity"),m=e.querySelector("#input-customer-garment"),L=e.querySelector("#input-garment-cost"),$=e.querySelector("#input-apply-setup"),q=e.querySelector("#input-setup-fee"),W=e.querySelector("#rate-per-1000"),X=e.querySelector("#rate-piece-fee"),z=e.querySelector("#rate-minimum"),R=e.querySelector("#rate-colors-included"),j=e.querySelector("#rate-extra-color-fee"),le=e.querySelector("#rate-garment-markup"),de=e.querySelector("#rate-machine-speed"),ue=e.querySelector("#rate-change-seconds"),he=e.querySelector("#rate-hooping-minutes"),pe=e.querySelector("#rate-heads"),ae=[0,1,2,3,4].map(o=>e.querySelector(`#break-discount-${o}`)),He=e.querySelector("#btn-reset-rates"),Ue=e.querySelector("#storage-status-note"),_e=e.querySelector("#out-per-piece"),We=e.querySelector("#out-per-piece-sub"),Je=e.querySelector("#out-order-total"),Ye=e.querySelector("#out-order-total-sub"),Ve=e.querySelector("#out-hourly-rate"),je=e.querySelector("#out-machine-time"),ve=e.querySelector("#break-table-body"),K=e.querySelector("#quote-text-output"),oe=e.querySelector("#copy-feedback"),Xe=e.querySelector("#btn-copy-quote"),ze=e.querySelector("#btn-print-quote"),me=e.querySelector("#btn-toggle-print-view"),Ke=e.querySelector("#print-design-subtitle");function xe(){W.value=n.ratePer1000Stitches.toFixed(2),X.value=n.pieceFee.toFixed(2),z.value=n.minimumPerPiece.toFixed(2),R.value=String(n.colorsIncluded),j.value=n.extraColorFee.toFixed(2),le.value=String(Math.round(n.garmentMarkup*100)),de.value=String(n.machineSpeed),ue.value=String(n.colorChangeSeconds),he.value=String(n.hoopingMinutes),pe.value=String(n.heads),n.quantityBreaks.forEach((o,p)=>{ae[p]&&(ae[p].value=String(Math.round(o.discount*100)))}),i.defaultSetupFee>0&&Number(q.value)===0&&(q.value=i.defaultSetupFee.toFixed(2))}function Ze(){const o=(I,H,_=0)=>{const A=Number.parseFloat(I.value);return Number.isFinite(A)&&A>=_?A:H},p=ge();return{ratePer1000Stitches:o(W,p.ratePer1000Stitches,0),pieceFee:o(X,p.pieceFee,0),minimumPerPiece:o(z,p.minimumPerPiece,0),colorsIncluded:Math.floor(o(R,p.colorsIncluded,0)),extraColorFee:o(j,p.extraColorFee,0),quantityBreaks:p.quantityBreaks.map((I,H)=>{const _=o(ae[H],I.discount*100,0);return{...I,discount:Math.min(.95,Math.max(0,_/100))}}),garmentMarkup:o(le,p.garmentMarkup*100,0)/100,machineSpeed:o(de,p.machineSpeed,1),colorChangeSeconds:o(ue,p.colorChangeSeconds,0),hoopingMinutes:o(he,p.hoopingMinutes,0),heads:Math.max(1,Math.floor(o(pe,p.heads,1)))}}function et(){const o=Math.max(1,Math.floor(Number(d.value)||1));T.innerHTML="";for(let p=0;p<Math.min(o,24);p++){const I=a==null?void 0:a.threads[p],H=(I==null?void 0:I.hex)??["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"][p%6],_=(I==null?void 0:I.description)??`Color ${p+1}`,A=document.createElement("span");A.className="swatch-pill",A.title=`${p+1}. ${_} (${H})`;const Y=document.createElement("span");Y.className="swatch-dot",Y.style.backgroundColor=H;const V=document.createElement("span");V.textContent=`${p+1}. ${_}`,A.appendChild(Y),A.appendChild(V),T.appendChild(A)}}let Se;function G(){n=Ze();const o=Mt({rates:n,defaultSetupFee:Number.parseFloat(q.value)||0});Ue.textContent=o?"Settings saved locally in browser":"Browser storage blocked — using session settings",L.disabled=m.checked,q.disabled=!$.checked;const p=Math.max(0,Math.floor(Number.parseFloat(P.value)||0)),I=Math.max(1,Math.floor(Number.parseFloat(d.value)||1)),H=Math.max(0,Math.floor(Number.parseFloat(C.value)||0)),_=Math.max(1,Math.floor(Number.parseFloat(v.value)||1)),A=Math.max(0,Number.parseFloat(L.value)||0),Y=Math.max(0,Number.parseFloat(q.value)||0),V={stitches:p,colors:I,colorChanges:H,quantity:_,customerSuppliesGarment:m.checked,garmentCost:A,applySetupFee:$.checked,setupFee:Y},S=ct(V,n);if(s!==null&&s>0){const U=Q(s);S.minutesPerPiece=U,S.minutesPerPieceRaw=U,S.orderMachineMinutes=Q(U*S.quantity/n.heads),S.effectiveHourlyRate=Q(S.decorationPerPiece/U*60),S.breakTable=S.breakTable.map(ee=>({...ee,effectiveHourlyRate:Q(ee.decorationPerPiece/U*60)})),x.hidden=!1}else M.value=S.minutesPerPiece.toFixed(2),x.hidden=!0;Se=S;const fe=Math.round(S.breakDiscount*100);_e.textContent=O(S.perPiece),We.textContent=`Decoration ${O(S.decorationPerPiece)}${S.minimumApplied?" (min)":""} · Garment ${O(S.garmentPerPiece)} (${fe}% break)`,Je.textContent=O(S.orderTotal),Ye.textContent=`${S.quantity} ${S.quantity===1?"piece":"pieces"} · ${O(S.setupFeeApplied)} setup fee`,Ve.textContent=`${O(S.effectiveHourlyRate)}/hr`,je.textContent=`${S.minutesPerPiece.toFixed(2)} min/pc · ${S.orderMachineMinutes.toFixed(2)} min order (${n.heads} head${n.heads>1?"s":""})`,Ke.textContent=`${k.value||"Custom Design"} · ${S.quantity} pcs · ${S.stitches.toLocaleString()} stitches`,ve.innerHTML="";for(const U of S.breakTable){const ee=document.createElement("tr");U.label===S.activeBreak.label&&(ee.className="active-break-row");const nt=Math.round(U.discount*100);ee.innerHTML=`
        <td><strong>${U.label}</strong></td>
        <td>${nt}%</td>
        <td>${O(U.decorationPerPiece)}</td>
        <td><strong>${O(U.perPiece)}</strong></td>
        <td>${O(U.sampleOrderTotal)}</td>
        <td class="no-print">${O(U.effectiveHourlyRate)}/hr</td>
      `,ve.appendChild(ee)}const se=Math.max(.1,Number.parseFloat(w.value)||88.9),Ee=Math.max(.1,Number.parseFloat(c.value)||50.8);return Math.max(0,Math.floor(Number.parseFloat(N.value)||0)),Math.max(0,Math.floor(Number.parseFloat(u.value)||0)),K.value=Ct(S,{designName:k.value.trim()||"Custom Design",widthMm:se,heightMm:Ee,customerSuppliesGarment:m.checked,garmentCost:A,garmentMarkup:n.garmentMarkup,heads:n.heads,machineSpeed:n.machineSpeed}),et(),De(B,a,{widthMm:se,heightMm:Ee,stitches:p}),S}function ke(o){a=o,s=null,b.hidden=!0,b.textContent="",o.warnings.length>0?(g.hidden=!1,g.textContent=o.warnings.join(" ")):(g.hidden=!0,g.textContent=""),f.textContent=`Loaded ${o.format.toUpperCase()}: ${o.filename}`,k.value=o.label||o.filename,P.value=String(o.normalStitches),d.value=String(o.threadBlocks),C.value=String(o.colorChanges),N.value=String(o.jumps),u.value=String(o.trims),w.value=o.widthMm.toFixed(1),F.value=o.widthIn.toFixed(2),c.value=o.heightMm.toFixed(1),E.value=o.heightIn.toFixed(2),G()}function Pe(o){b.hidden=!1,b.textContent=o,g.hidden=!0,g.textContent=""}let Z=null,tt=0;const re=new Map;function Me(){if(Z)return Z;if(typeof Worker>"u")return null;try{return Z=new Worker(new URL("/assets/worker-BKXLW0pr.js",import.meta.url),{type:"module"}),Z.addEventListener("message",o=>{const p=re.get(o.data.id);p&&(re.delete(o.data.id),p.resolve(o.data))}),Z.addEventListener("error",o=>{for(const[,p]of re)p.reject(o);re.clear()}),Z}catch{return null}}async function Be(o,p){let I;if(o instanceof ArrayBuffer)I=o;else{const A=new Uint8Array(o.byteLength);A.set(o),I=A.buffer}const H=Me();if(H)try{const A=++tt,Y=I.slice(0),V=await new Promise((S,fe)=>{re.set(A,{resolve:S,reject:fe});const se={id:A,filename:p,buffer:Y};H.postMessage(se,[Y])});V.ok?ke(V.design):Pe(V.error);return}catch{}const _=St(I,p);_.ok?ke(_.design):Pe(_.error)}async function Ce(o){if(!o)return;const p=await o.arrayBuffer();await Be(p,o.name)}l.addEventListener("click",()=>{h.click()}),l.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),h.click())}),l.addEventListener("dragover",o=>{o.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>{l.classList.remove("drag-over")}),l.addEventListener("drop",o=>{var I,H;o.preventDefault(),l.classList.remove("drag-over");const p=(H=(I=o.dataTransfer)==null?void 0:I.files)==null?void 0:H[0];Ce(p)}),h.addEventListener("change",()=>{var p;const o=(p=h.files)==null?void 0:p[0];Ce(o),h.value=""}),y.addEventListener("click",()=>{a=null,s=null,b.hidden=!0,g.hidden=!0,f.textContent="Mode: Manual stitch count entry",P.focus(),P.select(),G()}),F.addEventListener("input",()=>{const o=Number.parseFloat(F.value);Number.isFinite(o)&&o>=0&&(w.value=(o*25.4).toFixed(1)),G()}),w.addEventListener("input",()=>{const o=Number.parseFloat(w.value);Number.isFinite(o)&&o>=0&&(F.value=(o/25.4).toFixed(2)),G()}),E.addEventListener("input",()=>{const o=Number.parseFloat(E.value);Number.isFinite(o)&&o>=0&&(c.value=(o*25.4).toFixed(1)),G()}),c.addEventListener("input",()=>{const o=Number.parseFloat(c.value);Number.isFinite(o)&&o>=0&&(E.value=(o/25.4).toFixed(2)),G()}),d.addEventListener("input",()=>{const o=Math.max(1,Math.floor(Number.parseFloat(d.value)||1));C.value=String(Math.max(0,o-1)),s=null,G()}),C.addEventListener("input",()=>{s=null,G()}),P.addEventListener("input",()=>{s=null,G()}),M.addEventListener("input",()=>{const o=Number.parseFloat(M.value);Number.isFinite(o)&&o>0?s=o:s=null,G()}),x.addEventListener("click",()=>{s=null,G()});const rt=[k,N,u,v,m,L,$,q,W,X,z,R,j,le,de,ue,he,pe,...ae];for(const o of rt)o.addEventListener("input",()=>G()),o.addEventListener("change",()=>G());if(He.addEventListener("click",()=>{Bt(),n=ge(),xe(),G()}),Xe.addEventListener("click",async()=>{const o=K.value;try{navigator.clipboard&&navigator.clipboard.writeText?await navigator.clipboard.writeText(o):(K.focus(),K.select(),document.execCommand("copy")),oe.textContent="Quote copied to clipboard!"}catch{K.focus(),K.select(),oe.textContent="Selected quote text — press Ctrl+C / Cmd+C to copy"}setTimeout(()=>{oe.textContent&&(oe.textContent="")},3e3)}),ze.addEventListener("click",()=>{window.print()}),me.addEventListener("click",()=>{const o=document.body.classList.toggle("print-preview-mode");me.setAttribute("aria-pressed",String(o)),me.textContent=o?"Exit Print View":"Preview Print View"}),typeof window<"u"&&window.addEventListener("resize",()=>{De(B,a,{widthMm:Number.parseFloat(w.value)||88.9,heightMm:Number.parseFloat(c.value)||50.8,stitches:Number.parseFloat(P.value)||8e3,colors:Number.parseFloat(d.value)||3})}),Me(),xe(),t&&(t.modeBadge&&(f.textContent=t.modeBadge),t.designName&&(k.value=t.designName),typeof t.stitches=="number"&&(P.value=String(t.stitches)),typeof t.colors=="number"&&(d.value=String(t.colors)),typeof t.colorChanges=="number"&&(C.value=String(t.colorChanges)),typeof t.widthIn=="number"&&(F.value=t.widthIn.toFixed(2)),typeof t.widthMm=="number"&&(w.value=t.widthMm.toFixed(1)),typeof t.heightIn=="number"&&(E.value=t.heightIn.toFixed(2)),typeof t.heightMm=="number"&&(c.value=t.heightMm.toFixed(1)),typeof t.quantity=="number"&&(v.value=String(t.quantity)),typeof t.customerSuppliesGarment=="boolean"&&(m.checked=t.customerSuppliesGarment),typeof t.garmentCost=="number"&&(L.value=t.garmentCost.toFixed(2)),typeof t.applySetupFee=="boolean"&&($.checked=t.applySetupFee),typeof t.setupFee=="number"&&(q.value=t.setupFee.toFixed(2)),t.openRatesByDefault)){const o=e.querySelector("#rate-settings-details");o&&(o.open=!0)}G();const we={loadFileBuffer:Be,getQuote:()=>Se,getRates:()=>n,recalculate:G};return typeof window<"u"&&(window.__embroideryTool=we),we}function Ae(){const e=document.getElementById("embroidery-tool-root");e&&Et(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ae):Ae();
