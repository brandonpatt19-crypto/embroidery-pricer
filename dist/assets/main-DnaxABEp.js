var yt=Object.defineProperty;var vt=(e,i,t)=>i in e?yt(e,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[i]=t;var ve=(e,i,t)=>vt(e,typeof i!="symbol"?i+"":i,t);(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=t(n);fetch(n.href,a)}})();const We="Starting values: change to yours",fe=[{label:"1–11",minQty:1,maxQty:11,discount:0},{label:"12–23",minQty:12,maxQty:23,discount:.05},{label:"24–47",minQty:24,maxQty:47,discount:.1},{label:"48–143",minQty:48,maxQty:143,discount:.15},{label:"144+",minQty:144,maxQty:null,discount:.2}],et={ratePer1000Stitches:1.5,pieceFee:1,minimumPerPiece:5,colorsIncluded:6,extraColorFee:.5,quantityBreaks:fe.map(e=>({...e})),garmentMarkup:.4,machineSpeed:650,colorChangeSeconds:30,hoopingMinutes:1,heads:1,consumablesCostPerPiece:.25,operatorHourlyWage:18};function Ce(){return{...et,quantityBreaks:fe.map(e=>({...e}))}}function I(e){if(!Number.isFinite(e))return 0;const i=e<0?-1:1,t=Math.abs(e);return i*Math.floor(t*100+.5+1e-9)/100}function xt(e,i){const t=Math.max(1,Math.floor(e)),r=[...i].sort((n,a)=>n.minQty-a.minQty);for(const n of r)if(t>=n.minQty&&(n.maxQty===null||t<=n.maxQty))return n;for(let n=r.length-1;n>=0;n--)if(t>=r[n].minQty)return r[n];return r[0]??{label:"1+",minQty:1,maxQty:null,discount:0}}function St(e){const i=Math.max(0,e.stitches),t=Math.max(0,e.colorChanges),r=Math.max(1,Math.floor(e.quantity)),n=e.machineSpeed>0?e.machineSpeed:650,a=Math.max(0,e.colorChangeSeconds),s=Math.max(0,e.hoopingMinutes),c=e.heads>0?Math.floor(e.heads):1,m=i/n+t*(a/60)+s,P=I(m),g=m*r/c,v=I(g);return{minutesPerPieceRaw:m,minutesPerPiece:P,orderMachineMinutesRaw:g,orderMachineMinutes:v}}function Pt(e,i=et){const t=Math.max(0,e.stitches),r=Math.max(1,Math.floor(e.colors)),n=e.colorChanges!==void 0?Math.max(0,Math.floor(e.colorChanges)):Math.max(0,r-1),a=Math.max(1,Math.floor(e.quantity)),s=Math.max(0,r-Math.max(0,Math.floor(i.colorsIncluded))),c=t/1e3*i.ratePer1000Stitches+i.pieceFee+i.extraColorFee*s,m=xt(a,i.quantityBreaks),P=m.discount,g=c*(1-P),v=g<i.minimumPerPiece,x=Math.max(g,i.minimumPerPiece),B=I(x),F=e.customerSuppliesGarment?0:Math.max(0,e.garmentCost),M=F*(1+i.garmentMarkup),w=I(M),u=I(x+M),E=e.applySetupFee?I(Math.max(0,e.setupFee)):0,q=I(u*a+E),p=St({stitches:t,colorChanges:n,quantity:a,machineSpeed:i.machineSpeed,colorChangeSeconds:i.colorChangeSeconds,hoopingMinutes:i.hoopingMinutes,heads:i.heads}),D=p.minutesPerPiece>0?I(B/p.minutesPerPiece*60):0,N=I(Math.max(0,i.consumablesCostPerPiece??.25)),A=Math.max(0,i.operatorHourlyWage??18),l=I(Math.max(0,i.hoopingMinutes)/60*A),S=I(F+N+l),b=I(u-S),f=I(b*a+E),h=p.orderMachineMinutes>0?I(f/p.orderMachineMinutes*60):0,L=i.quantityBreaks.map(k=>{const T=c*(1-k.discount),H=Math.max(T,i.minimumPerPiece),_=I(H),z=I(H+M),C=I(z*k.minQty+E),V=p.minutesPerPiece>0?I(_/p.minutesPerPiece*60):0;return{label:k.label,minQty:k.minQty,maxQty:k.maxQty,discount:k.discount,decorationPerPiece:_,garmentPerPiece:w,perPiece:z,sampleOrderTotal:C,effectiveHourlyRate:V}});return{stitches:t,colors:r,colorChanges:n,extraColors:s,quantity:a,activeBreak:m,breakDiscount:P,baseDecoration:I(c),discountedDecorationRaw:g,minimumApplied:v,decorationPerPiece:B,garmentPerPiece:w,perPiece:u,setupFeeApplied:E,orderTotal:q,minutesPerPieceRaw:p.minutesPerPieceRaw,minutesPerPiece:p.minutesPerPiece,orderMachineMinutesRaw:p.orderMachineMinutesRaw,orderMachineMinutes:p.orderMachineMinutes,effectiveHourlyRate:D,consumablesPerPiece:N,laborPerPiece:l,netMarginPerPiece:b,netOrderProfit:f,netHourlyProfit:h,breakTable:L}}const xe="embroidery_pricer_settings_v1";function j(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0}function kt(e){return!Array.isArray(e)||e.length!==fe.length?fe.map(i=>({...i})):fe.map((i,t)=>{const r=e[t],n=r&&typeof r.discount=="number"&&Number.isFinite(r.discount)?Math.min(1,Math.max(0,r.discount)):i.discount;return{label:i.label,minQty:i.minQty,maxQty:i.maxQty,discount:n}})}function Mt(e){const i={rates:Ce(),defaultSetupFee:0};try{const t=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!t)return i;const r=t.getItem(xe);if(!r)return i;const n=JSON.parse(r),a=n.rates??{},s=i.rates,c={ratePer1000Stitches:j(a.ratePer1000Stitches)?a.ratePer1000Stitches:s.ratePer1000Stitches,pieceFee:j(a.pieceFee)?a.pieceFee:s.pieceFee,minimumPerPiece:j(a.minimumPerPiece)?a.minimumPerPiece:s.minimumPerPiece,colorsIncluded:j(a.colorsIncluded)?Math.floor(a.colorsIncluded):s.colorsIncluded,extraColorFee:j(a.extraColorFee)?a.extraColorFee:s.extraColorFee,quantityBreaks:kt(a.quantityBreaks),garmentMarkup:j(a.garmentMarkup)?a.garmentMarkup:s.garmentMarkup,machineSpeed:j(a.machineSpeed)&&a.machineSpeed>0?a.machineSpeed:s.machineSpeed,colorChangeSeconds:j(a.colorChangeSeconds)?a.colorChangeSeconds:s.colorChangeSeconds,hoopingMinutes:j(a.hoopingMinutes)?a.hoopingMinutes:s.hoopingMinutes,heads:j(a.heads)&&a.heads>=1?Math.floor(a.heads):s.heads,consumablesCostPerPiece:j(a.consumablesCostPerPiece)?a.consumablesCostPerPiece:s.consumablesCostPerPiece??.25,operatorHourlyWage:j(a.operatorHourlyWage)?a.operatorHourlyWage:s.operatorHourlyWage??18},m=j(n.defaultSetupFee)?n.defaultSetupFee:0;return{rates:c,defaultSetupFee:m}}catch{return i}}function wt(e,i){try{const t=i!==void 0?i:typeof window<"u"?window.localStorage:null;return t?(t.setItem(xe,JSON.stringify(e)),!0):!1}catch{return!1}}function Ct(e){try{const i=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!i)return;i.removeItem(xe)}catch{}}const we=[null,{hex:"#0e1f7c",description:"Prussian Blue",catalogNumber:"1",brand:"Brother",chart:"Brother"},{hex:"#0a55a3",description:"Blue",catalogNumber:"2",brand:"Brother",chart:"Brother"},{hex:"#008777",description:"Teal Green",catalogNumber:"3",brand:"Brother",chart:"Brother"},{hex:"#4b6baf",description:"Cornflower Blue",catalogNumber:"4",brand:"Brother",chart:"Brother"},{hex:"#ed171f",description:"Red",catalogNumber:"5",brand:"Brother",chart:"Brother"},{hex:"#d15c00",description:"Reddish Brown",catalogNumber:"6",brand:"Brother",chart:"Brother"},{hex:"#913697",description:"Magenta",catalogNumber:"7",brand:"Brother",chart:"Brother"},{hex:"#e49acb",description:"Light Lilac",catalogNumber:"8",brand:"Brother",chart:"Brother"},{hex:"#915fac",description:"Lilac",catalogNumber:"9",brand:"Brother",chart:"Brother"},{hex:"#9ed67d",description:"Mint Green",catalogNumber:"10",brand:"Brother",chart:"Brother"},{hex:"#e8a900",description:"Deep Gold",catalogNumber:"11",brand:"Brother",chart:"Brother"},{hex:"#feba35",description:"Orange",catalogNumber:"12",brand:"Brother",chart:"Brother"},{hex:"#ffff00",description:"Yellow",catalogNumber:"13",brand:"Brother",chart:"Brother"},{hex:"#70bc1f",description:"Lime Green",catalogNumber:"14",brand:"Brother",chart:"Brother"},{hex:"#ba9800",description:"Brass",catalogNumber:"15",brand:"Brother",chart:"Brother"},{hex:"#a8a8a8",description:"Silver",catalogNumber:"16",brand:"Brother",chart:"Brother"},{hex:"#7d6f00",description:"Russet Brown",catalogNumber:"17",brand:"Brother",chart:"Brother"},{hex:"#ffffb3",description:"Cream Brown",catalogNumber:"18",brand:"Brother",chart:"Brother"},{hex:"#4f5556",description:"Pewter",catalogNumber:"19",brand:"Brother",chart:"Brother"},{hex:"#000000",description:"Black",catalogNumber:"20",brand:"Brother",chart:"Brother"},{hex:"#0b3d91",description:"Ultramarine",catalogNumber:"21",brand:"Brother",chart:"Brother"},{hex:"#770176",description:"Royal Purple",catalogNumber:"22",brand:"Brother",chart:"Brother"},{hex:"#293133",description:"Dark Gray",catalogNumber:"23",brand:"Brother",chart:"Brother"},{hex:"#2a1301",description:"Dark Brown",catalogNumber:"24",brand:"Brother",chart:"Brother"},{hex:"#f64a8a",description:"Deep Rose",catalogNumber:"25",brand:"Brother",chart:"Brother"},{hex:"#b27624",description:"Light Brown",catalogNumber:"26",brand:"Brother",chart:"Brother"},{hex:"#fcbbc5",description:"Salmon Pink",catalogNumber:"27",brand:"Brother",chart:"Brother"},{hex:"#fe370f",description:"Vermilion",catalogNumber:"28",brand:"Brother",chart:"Brother"},{hex:"#f0f0f0",description:"White",catalogNumber:"29",brand:"Brother",chart:"Brother"},{hex:"#6a1c8a",description:"Violet",catalogNumber:"30",brand:"Brother",chart:"Brother"},{hex:"#a8ddc4",description:"Seacrest",catalogNumber:"31",brand:"Brother",chart:"Brother"},{hex:"#2584bb",description:"Sky Blue",catalogNumber:"32",brand:"Brother",chart:"Brother"},{hex:"#feb343",description:"Pumpkin",catalogNumber:"33",brand:"Brother",chart:"Brother"},{hex:"#fff36b",description:"Cream Yellow",catalogNumber:"34",brand:"Brother",chart:"Brother"},{hex:"#d0a660",description:"Khaki",catalogNumber:"35",brand:"Brother",chart:"Brother"},{hex:"#d15400",description:"Clay Brown",catalogNumber:"36",brand:"Brother",chart:"Brother"},{hex:"#66ba49",description:"Leaf Green",catalogNumber:"37",brand:"Brother",chart:"Brother"},{hex:"#134a46",description:"Peacock Blue",catalogNumber:"38",brand:"Brother",chart:"Brother"},{hex:"#878787",description:"Gray",catalogNumber:"39",brand:"Brother",chart:"Brother"},{hex:"#d8ccc6",description:"Warm Gray",catalogNumber:"40",brand:"Brother",chart:"Brother"},{hex:"#435607",description:"Dark Olive",catalogNumber:"41",brand:"Brother",chart:"Brother"},{hex:"#fdd9de",description:"Flesh Pink",catalogNumber:"42",brand:"Brother",chart:"Brother"},{hex:"#f993bc",description:"Pink",catalogNumber:"43",brand:"Brother",chart:"Brother"},{hex:"#003822",description:"Deep Green",catalogNumber:"44",brand:"Brother",chart:"Brother"},{hex:"#b2afd4",description:"Lavender",catalogNumber:"45",brand:"Brother",chart:"Brother"},{hex:"#686ab0",description:"Wisteria Violet",catalogNumber:"46",brand:"Brother",chart:"Brother"},{hex:"#efe3b9",description:"Beige",catalogNumber:"47",brand:"Brother",chart:"Brother"},{hex:"#f73866",description:"Carmine",catalogNumber:"48",brand:"Brother",chart:"Brother"},{hex:"#b54b64",description:"Amber Red",catalogNumber:"49",brand:"Brother",chart:"Brother"},{hex:"#132b1a",description:"Olive Green",catalogNumber:"50",brand:"Brother",chart:"Brother"},{hex:"#c70156",description:"Dark Fuchsia",catalogNumber:"51",brand:"Brother",chart:"Brother"},{hex:"#fe9e32",description:"Tangerine",catalogNumber:"52",brand:"Brother",chart:"Brother"},{hex:"#a8deeb",description:"Light Blue",catalogNumber:"53",brand:"Brother",chart:"Brother"},{hex:"#00673e",description:"Emerald Green",catalogNumber:"54",brand:"Brother",chart:"Brother"},{hex:"#4e2990",description:"Purple",catalogNumber:"55",brand:"Brother",chart:"Brother"},{hex:"#2f7e20",description:"Moss Green",catalogNumber:"56",brand:"Brother",chart:"Brother"},{hex:"#ffcccc",description:"Flesh Pink",catalogNumber:"57",brand:"Brother",chart:"Brother"},{hex:"#ffd911",description:"Harvest Gold",catalogNumber:"58",brand:"Brother",chart:"Brother"},{hex:"#095ba6",description:"Electric Blue",catalogNumber:"59",brand:"Brother",chart:"Brother"},{hex:"#f0f970",description:"Lemon Yellow",catalogNumber:"60",brand:"Brother",chart:"Brother"},{hex:"#e3f35b",description:"Fresh Green",catalogNumber:"61",brand:"Brother",chart:"Brother"},{hex:"#ff9900",description:"Orange",catalogNumber:"62",brand:"Brother",chart:"Brother"},{hex:"#fff08d",description:"Cream Yellow",catalogNumber:"63",brand:"Brother",chart:"Brother"},{hex:"#ffc8c8",description:"Applique",catalogNumber:"64",brand:"Brother",chart:"Brother"}],_e=[{hex:"#1d4ed8",description:"Royal Blue (Default 1)"},{hex:"#dc2626",description:"Crimson Red (Default 2)"},{hex:"#15803d",description:"Forest Green (Default 3)"},{hex:"#d97706",description:"Amber Gold (Default 4)"},{hex:"#7c3aed",description:"Violet Purple (Default 5)"},{hex:"#0f766e",description:"Teal (Default 6)"},{hex:"#be185d",description:"Magenta (Default 7)"},{hex:"#374151",description:"Charcoal (Default 8)"},{hex:"#ea580c",description:"Burnt Orange (Default 9)"},{hex:"#0284c7",description:"Sky Blue (Default 10)"},{hex:"#4d7c0f",description:"Olive Green (Default 11)"},{hex:"#111827",description:"Jet Black (Default 12)"}];function Je(e){const i=_e[e%_e.length];return{hex:i.hex,description:i.description,catalogNumber:String(e+1),brand:"Default Palette"}}function Bt(e,i=3,t=null,r=!0){let n=-1,a=e.length-1,s=0,c=0,m=0,P=0,g=0,v=0,x=!1,B=!0;for(;n<a;){n+=1;const F=e[n],M=F.x-s,w=F.y-c;s=F.x,c=F.y;const u=F.command;if(u==="STITCH"||u==="SEQUIN_EJECT"?(B=!1,x=!1):(u==="COLOR_CHANGE"||u==="TRIM")&&(B=!0,x=!1),u==="JUMP"){if(x||(g=0,v=0,m=0,P=n,x=!0),m+=1,g+=M,v+=w,!B&&(m===i||t!==null&&(Math.abs(v)>t||Math.abs(g)>t))){const E=P>0?e[P-1].x:0,q=P>0?e[P-1].y:0;e.splice(P,0,{x:E,y:q,command:"TRIM"}),P+=1,n+=1,a+=1,B=!0}r&&g===0&&v===0&&(e.splice(P,n+1-P),n=P-1,a=e.length-1)}}}function Et(e,i){return!e||!i?!1:e.hex.toLowerCase()===i.hex.toLowerCase()&&(e.description??"")===(i.description??"")&&(e.catalogNumber??"")===(i.catalogNumber??"")&&(e.brand??"")===(i.brand??"")&&(e.chart??"")===(i.chart??"")}function Nt(e,i){let t=0,r=!0,n=null;for(let a=0;a<e.length;a++){const c=e[a].command;if(c==="STITCH"){if(r){if(t>=i.length)return;n!==null&&t!==0&&Et(i[t-1]??void 0,i[t]??void 0)?(i.splice(t,1),e[n].command="STOP"):t+=1,r=!1}}else c==="COLOR_CHANGE"&&(r=!0,n=a)}}function tt(e){const{format:i,filename:t,label:r,stitches:n,threads:a,warnings:s,headerMetadata:c}=e;let m=0,P=0,g=0,v=0,x=0,B=1/0,F=1/0,M=-1/0,w=-1/0;for(const C of n)switch(C.x>M&&(M=C.x),C.x<B&&(B=C.x),C.y>w&&(w=C.y),C.y<F&&(F=C.y),C.command){case"STITCH":m+=1;break;case"JUMP":P+=1;break;case"TRIM":g+=1;break;case"COLOR_CHANGE":v+=1;break;case"STOP":x+=1;break}const u=n.length>0&&Number.isFinite(B)&&Number.isFinite(M),E=u?B/10:0,q=u?F/10:0,p=u?M/10:0,D=u?w/10:0,N=u?(M-B)/10:0,A=u?(w-F)/10:0,l=N/25.4,S=A/25.4,b=v+1,f=[];for(let C=0;C<b;C++){const V=a[C];V&&V.hex?f.push(V):f.push(Je(C))}const h=[];let L=0,k=[],T=[],H=0;const _=()=>{T.length>0&&(k.push({points:T}),T=[])},z=()=>{_(),h.push({index:L,color:f[L]??Je(L),stitchCount:H,segments:k}),L+=1,k=[],H=0};for(const C of n)C.command==="STITCH"?(T.push({x:C.x/10,y:C.y/10}),H+=1):C.command==="COLOR_CHANGE"?z():_();return z(),{format:i,filename:t,label:r,normalStitches:m,jumps:P,trims:g,colorChanges:v,stops:x,threadBlocks:b,widthMm:N,heightMm:A,widthIn:l,heightIn:S,boundsMm:{minX:E,minY:q,maxX:p,maxY:D},threads:f,blocks:h,warnings:s,headerMetadata:c}}const me=512;function O(e,i){return e>>i&1}function Tt(e,i,t){let r=0;return r+=O(t,2)*81,r+=O(t,3)*-81,r+=O(i,2)*27,r+=O(i,3)*-27,r+=O(e,2)*9,r+=O(e,3)*-9,r+=O(i,0)*3,r+=O(i,1)*-3,r+=O(e,0)*1,r+=O(e,1)*-1,r}function Ft(e,i,t){let r=0;return r+=O(t,5)*81,r+=O(t,4)*-81,r+=O(i,5)*27,r+=O(i,4)*-27,r+=O(e,5)*9,r+=O(e,4)*-9,r+=O(i,7)*3,r+=O(i,6)*-3,r+=O(e,7)*1,r+=O(e,6)*-1,-r}function Lt(e){const i=e.trim().replace(/^#/,"");return/^[0-9a-fA-F]{6}$/.test(i)?`#${i.toLowerCase()}`:"#000000"}function $t(e,i){if(e.byteLength<me+3)return{ok:!1,error:"Invalid or truncated DST file: file is smaller than the 512-byte DST header plus one stitch record."};const t=e.subarray(0,me);if(!new TextDecoder("utf-8",{fatal:!1}).decode(t.subarray(0,64)).includes("LA:"))return{ok:!1,error:"Invalid DST file: missing 'LA:' design label in the 512-byte Tajima header."};const a=(e.byteLength-me)%3,s=a===1&&e[e.byteLength-1]===26;if(a!==0&&!s)return{ok:!1,error:"Truncated or corrupted DST file: stitch data length is not a multiple of 3-byte DST records."};const c={},m=[],P=new TextDecoder("utf-8",{fatal:!0});let g=0;for(let l=0;l<me;l++){const S=t[l];if(S===13||S===10){const b=l,f=t.subarray(g,b);g=b;try{const h=P.decode(f).trim();if(h.length>3&&h[2]===":"){const L=h.slice(0,2).trim(),k=h.slice(3).trim();if(L==="LA")c.name=k;else if(L==="AU")c.author=k;else if(L==="CP")c.copyright=k;else if(L==="TC"){const T=k.split(",").map(H=>H.trim());m.push({hex:Lt(T[0]??"#000000"),description:T[1]??"Custom DST Thread",catalogNumber:T[2]??""})}else c[L]=k}}catch{}}}const v=[];let x=0,B=0,F=!1,M=0,w=!1;const u=(l,S,b)=>{const f=x+l,h=B+S;v.push({x:f,y:h,command:b}),x=f,B=h};let E=me;for(;E+3<=e.byteLength;){const l=e[E],S=e[E+1],b=e[E+2];if(E+=3,(b&3)!==3)return{ok:!1,error:`Corrupted DST stitch record at byte offset ${E-3}: missing mandatory DST record tag bits.`};const f=Tt(l,S,b),h=Ft(l,S,b);if((b&243)===243){w=!0;break}else(b&195)===195?(M+=1,u(f,h,"COLOR_CHANGE")):(b&67)===67?(M+=1,u(f,h,"SEQUIN_MODE"),F=!F):(b&131)===131?(M+=1,F?u(f,h,"SEQUIN_EJECT"):u(f,h,"JUMP")):(M+=1,u(f,h,"STITCH"))}if(M===0)return{ok:!1,error:"Invalid DST file: file contains no stitch records."};u(0,0,"END"),Bt(v,3,null,!0);const q=[];let p=0,D=0;for(const l of v)l.command==="STITCH"?p+=1:l.command==="COLOR_CHANGE"&&(D+=1);if(c.CO!==void 0){const l=Number.parseInt(c.CO,10);!Number.isNaN(l)&&l!==D&&q.push(`Header color change count (CO=${l}) disagrees with stitch records (${D} color changes). Using stitch records.`)}if(c.ST!==void 0){const l=Number.parseInt(c.ST,10),S=M+(w?1:0);!Number.isNaN(l)&&l!==p&&l!==S&&l!==M?q.push(`Header stitch count (ST=${l}) disagrees with stitch records (${p} normal stitches, ${S} total records). Using stitch records.`):!Number.isNaN(l)&&l!==p&&q.push(`Header ST (${l}) includes jumps/color-changes/end records; pricing uses ${p} normal stitches computed from stitch records.`)}const N=c.name||i.replace(/\.[^.]+$/,"");return{ok:!0,design:tt({format:"dst",filename:i,label:N,stitches:v,threads:m,warnings:q,headerMetadata:c})}}const Ye=16,Xe=32,je=128;class qt{constructor(i){ve(this,"view");ve(this,"bytes");ve(this,"pos",0);this.bytes=i,this.view=new DataView(i.buffer,i.byteOffset,i.byteLength)}get length(){return this.bytes.byteLength}seek(i,t="set"){t==="set"?this.pos=i:this.pos+=i}readU8(){return this.pos>=this.bytes.byteLength?null:this.bytes[this.pos++]}readU16LE(){if(this.pos+2>this.bytes.byteLength)return null;const i=this.view.getUint16(this.pos,!0);return this.pos+=2,i}readS16LE(){if(this.pos+2>this.bytes.byteLength)return null;const i=this.view.getInt16(this.pos,!0);return this.pos+=2,i}readU24LE(){if(this.pos+3>this.bytes.byteLength)return null;const i=this.bytes[this.pos],t=this.bytes[this.pos+1],r=this.bytes[this.pos+2];return this.pos+=3,i|t<<8|r<<16}readU24BE(){if(this.pos+3>this.bytes.byteLength)return null;const i=this.bytes[this.pos],t=this.bytes[this.pos+1],r=this.bytes[this.pos+2];return this.pos+=3,i<<16|t<<8|r}readU32LE(){if(this.pos+4>this.bytes.byteLength)return null;const i=this.view.getUint32(this.pos,!0);return this.pos+=4,i}readBytes(i){if(this.pos+i>this.bytes.byteLength)return null;const t=this.bytes.subarray(this.pos,this.pos+i);return this.pos+=i,t}readAscii(i){const t=this.readBytes(i);return t?new TextDecoder("utf-8",{fatal:!1}).decode(t):null}readPesString(){const i=this.readU8();return i===null||i===0?null:this.readAscii(i)}}function Ve(e){const i=e&4095;return i>2047?-4096+i:i}function ze(e){return e>63?-128+e:e}function rt(e,i){const t=["name","category","author","keywords","comments"];for(const r of t){const n=e.readPesString();n&&n.length>0&&(i[r]=n)}}function Dt(e){const i=e.readPesString()??void 0,t=e.readU24BE();if(t===null)return null;e.seek(5,"cur");const r=e.readPesString()??"",n=e.readPesString()??void 0,a=e.readPesString()??void 0;return{hex:`#${(t&16777215).toString(16).padStart(6,"0")}`,description:r,catalogNumber:i,brand:n,chart:a}}function le(e,i,t,r,n,a,s){if(e.seek(4,"cur"),rt(e,i),s!==void 0){e.seek(s,"cur");const x=e.readPesString();x&&x.length>0&&(i.hoop_name=x)}e.seek(r,"cur");const c=e.readPesString();c&&c.length>0&&(i[a]=c),e.seek(n,"cur");const m=e.readU16LE();if(m===null||m!==0)return;const P=e.readU16LE();if(P===null||P!==0)return;const g=e.readU16LE();if(g===null||g!==0)return;const v=e.readU16LE();if(v!==null)for(let x=0;x<v;x++){const B=Dt(e);if(!B)break;t.push(B)}}function It(e,i){const t=we.length,r=[];if(i.length===0)for(let n=0;n<e.length;n++){const a=e[n]%t;r.push(we[a]??null)}else if(i.length>=e.length)for(const n of i)r.push(n);else{const n=[...i],a=new Map;for(let s=0;s<e.length;s++){const c=e[s]%t;let m=a.get(c);m===void 0&&(n.length>0?m=n.shift()??null:m=we[c]??null,a.set(c,m)),r.push(m)}}return r}function Rt(e,i){if(e.byteLength<48)return{ok:!1,error:"Invalid or truncated PES file: file is too small to contain a PES/PEC header."};const t=new qt(e),r=t.readAscii(8);if(!r||!r.startsWith("#PES")&&r!=="#PEC0001")return{ok:!1,error:"Invalid PES file: file does not start with a valid '#PES' or '#PEC0001' signature."};const n={},a=[];let s=8;if(r!=="#PEC0001"){const l=t.readU32LE();if(l===null||l<12||l+532>e.byteLength)return{ok:!1,error:"Invalid or truncated PES file: PEC block offset in header points outside the file."};s=l;try{switch(r){case"#PES0100":n.version="10",le(t,n,a,38,34,"image_file",14);break;case"#PES0090":n.version="9",le(t,n,a,30,34,"image_file",14);break;case"#PES0080":n.version="8",le(t,n,a,38,26,"image_file");break;case"#PES0070":n.version="7",le(t,n,a,36,24,"image_file");break;case"#PES0060":n.version="6",le(t,n,a,36,24,"image_file");break;case"#PES0050":case"#PES0055":case"#PES0056":n.version=r==="#PES0050"?"5":r==="#PES0055"?"5.5":"5.6",le(t,n,a,24,24,"image");break;case"#PES0040":n.version="4",t.seek(4,"cur"),rt(t,n);break;case"#PES0030":n.version="3";break;case"#PES0022":n.version="2.2";break;case"#PES0020":n.version="2";break;case"#PES0001":n.version="1";break;default:n.version=r.slice(4);break}}catch{}}t.seek(s,"set"),t.seek(3,"cur");const c=t.readAscii(16);if(c===null)return{ok:!1,error:"Truncated PES/PEC block: could not read design label."};n.Name=c.trim(),t.seek(15,"cur");const m=t.readU8(),P=t.readU8();if(m===null||P===null)return{ok:!1,error:"Truncated PES/PEC block: missing graphic header fields."};t.seek(12,"cur");const g=t.readU8();if(g===null)return{ok:!1,error:"Truncated PES/PEC block: missing color change count byte."};const v=g===255?0:g,x=g===255?0:v+1,B=t.readBytes(x);if(!B)return{ok:!1,error:"Truncated PES/PEC block: file ends inside PEC color palette table."};const F=It(B,a);if(t.seek(464-g,"cur"),t.readU24LE()===null)return{ok:!1,error:"Truncated PES/PEC block: missing stitch block length."};if(t.pos+11>t.length)return{ok:!1,error:"Truncated PES/PEC block: file ends before stitch data starts."};t.seek(11,"cur");const w=[];let u=0,E=0;const q=(l,S,b)=>{const f=u+l,h=E+S;w.push({x:f,y:h,command:b}),u=f,E=h};for(;;){const l=t.readU8(),S=t.readU8();if(l===null||S===null||l===255&&S===0)break;if(l===254&&S===176){t.seek(1,"cur"),q(0,0,"COLOR_CHANGE");continue}let b=!1,f=!1,h=0,L=0,k=S;if(l&je){l&Xe&&(f=!0),l&Ye&&(b=!0);const T=l<<8|k;if(h=Ve(T),k=t.readU8(),k===null)break}else h=ze(l);if(k&je){k&Xe&&(f=!0),k&Ye&&(b=!0);const T=t.readU8();if(T===null)break;const H=k<<8|T;L=Ve(H)}else L=ze(k);b?q(h,L,"JUMP"):f?(q(0,0,"TRIM"),q(h,L,"JUMP")):q(h,L,"STITCH")}if(w.length===0)return{ok:!1,error:"Invalid PES file: PEC section contains no stitch records."};q(0,0,"END"),Nt(w,F);let p=0;for(const l of w)l.command==="COLOR_CHANGE"&&(p+=1);const D=[];v!==p&&D.push(`PEC header color change count (${v}) disagrees with stitch records (${p} color changes). Using stitch records.`);const N=n.name||n.Name||i.replace(/\.[^.]+$/,"");return{ok:!0,design:tt({format:"pes",filename:i,label:N,stitches:w,threads:F,warnings:D,headerMetadata:n})}}const Ot=10*1024*1024;function At(e,i){try{const t=e instanceof Uint8Array?e:new Uint8Array(e);if(t.byteLength===0)return{ok:!1,error:"The selected file is empty (0 bytes). Please choose a valid .dst or .pes embroidery file."};if(t.byteLength>Ot)return{ok:!1,error:`File exceeds the 10 MB limit (${(t.byteLength/(1024*1024)).toFixed(1)} MB). Please upload a .dst or .pes file under 10 MB.`};if(t.byteLength>=3&&t[0]===255&&t[1]===216&&t[2]===255)return{ok:!1,error:"Unsupported file content: this file is a JPEG image, not a .dst or .pes embroidery file."};if(t.byteLength>=4&&t[0]===137&&t[1]===80&&t[2]===78&&t[3]===71)return{ok:!1,error:"Unsupported file content: this file is a PNG image, not a .dst or .pes embroidery file."};const r=i.trim().toLowerCase();return r.endsWith(".dst")?$t(t,i):r.endsWith(".pes")?Rt(t,i):{ok:!1,error:"Unsupported file format. Please select a Tajima (.dst) or Brother (.pes) embroidery file."}}catch(t){return{ok:!1,error:`Could not read embroidery file: ${t instanceof Error?t.message:"Unknown parsing error"}`}}}function Ke(e,i,t){const r=e.getContext("2d");if(!r)return;const n=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,a=e.clientWidth||320,s=e.clientHeight||220;e.width=Math.round(a*n),e.height=Math.round(s*n),r.setTransform(n,0,0,n,0,0),r.fillStyle="#f8fafc",r.fillRect(0,0,a,s),r.strokeStyle="#e2e8f0",r.lineWidth=1;const c=20;for(let p=c;p<a;p+=c)r.beginPath(),r.moveTo(p,0),r.lineTo(p,s),r.stroke();for(let p=c;p<s;p+=c)r.beginPath(),r.moveTo(0,p),r.lineTo(a,p),r.stroke();const m=20,P=Math.max(40,a-m*2),g=Math.max(40,s-m*2);if(!i||i.blocks.length===0||i.normalStitches===0){const p=(t==null?void 0:t.widthMm)||88.9,D=(t==null?void 0:t.heightMm)||50.8,N=Math.max(1,Math.min(12,(t==null?void 0:t.colors)||3)),A=(t==null?void 0:t.stitches)??8e3,l=Math.min((P-28)/Math.max(1,p),(g-28)/Math.max(1,D)),S=Math.max(44,Math.min(P-16,p*l)),b=Math.max(36,Math.min(g-24,D*l)),f=a/2,h=s/2-4,L=f-S/2,k=h-b/2,T=Math.min(a*.44,Math.max(S*.66,72)),H=Math.min(s*.41,Math.max(b*.72,54));r.save(),r.strokeStyle="#cbd5e1",r.lineWidth=6,r.beginPath(),r.ellipse(f,h,T,H,0,0,Math.PI*2),r.stroke(),r.strokeStyle="#94a3b8",r.lineWidth=1.5,r.beginPath(),r.ellipse(f,h,T-3.5,H-3.5,0,0,Math.PI*2),r.stroke(),r.fillStyle="#94a3b8",r.fillRect(f-10,h-H-7,20,6),r.restore();const _=["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"],z=Math.min(S,b)*.34;if(r.save(),r.strokeStyle=_[0],r.lineWidth=Math.max(3,z*.22),r.setLineDash([2,1.5]),r.beginPath(),r.ellipse(f,h,S*.38,b*.34,0,0,Math.PI*2),r.stroke(),r.restore(),N>=2){r.save(),r.strokeStyle=_[1],r.lineWidth=1.35;const ee=S*.28,J=b*.23;for(let W=-J+3;W<=J-3;W+=3.2){const K=Math.max(0,1-W*W/(J*J)),Z=ee*Math.sqrt(K);r.beginPath(),r.moveTo(f-Z,h+W),r.lineTo(f+Z,h+W),r.stroke()}r.restore()}if(N>=3){r.save(),r.strokeStyle=_[2],r.fillStyle=_[2],r.lineWidth=2;const ee=Math.min(S,b)*.16;r.beginPath();for(let J=0;J<10;J++){const W=J%2===0?ee:ee*.45,K=J*Math.PI/5-Math.PI/2,Z=f+Math.cos(K)*W,be=h+Math.sin(K)*W;J===0?r.moveTo(Z,be):r.lineTo(Z,be)}r.closePath(),r.fill(),r.restore()}r.strokeStyle="#475569",r.setLineDash([4,3]),r.lineWidth=1.25,r.strokeRect(L,k,S,b),r.setLineDash([]);const C=22,V=Math.min(a-16,290),ce=(a-V)/2,ie=s-C-6;r.fillStyle="rgba(15, 23, 42, 0.84)",r.beginPath(),r.roundRect(ce,ie,V,C,11),r.fill(),r.fillStyle="#ffffff",r.font="600 11.5px system-ui, -apple-system, sans-serif",r.textAlign="center",r.textBaseline="middle";const de=`${A.toLocaleString()} sts · ${(p/25.4).toFixed(2)}" × ${(D/25.4).toFixed(2)}" (${p.toFixed(1)}×${D.toFixed(1)} mm)`;r.fillText(de,a/2,ie+C/2);return}const{minX:v,minY:x,maxX:B,maxY:F}=i.boundsMm,M=Math.max(.5,B-v),w=Math.max(.5,F-x),u=Math.min(P/M,g/w),E=m+(P-M*u)/2-v*u,q=m+(g-w*u)/2-x*u;r.lineCap="round",r.lineJoin="round",r.lineWidth=Math.max(.9,Math.min(1.8,u*.35));for(const p of i.blocks){r.strokeStyle=p.color.hex||"#1d4ed8",r.beginPath();for(const D of p.segments){const N=D.points;if(N.length!==0){r.moveTo(N[0].x*u+E,N[0].y*u+q);for(let A=1;A<N.length;A++)r.lineTo(N[A].x*u+E,N[A].y*u+q)}}r.stroke()}}function R(e){return`$${e.toFixed(2)}`}function Ht(e,i){const t=(i.widthMm/25.4).toFixed(2),r=(i.heightMm/25.4).toFixed(2),n=Math.round(e.breakDiscount*100),a=[`EMBROIDERY JOB QUOTE — ${i.designName||"Custom Design"}`,"----------------------------------------",`Quantity: ${e.quantity} pcs (Tier ${e.activeBreak.label}, ${n}% break)`,`Design: ${e.stitches.toLocaleString()} stitches | ${e.colors} color(s) (${e.colorChanges} color change(s))`,`Dimensions: ${t}" × ${r}" (${i.widthMm.toFixed(1)} × ${i.heightMm.toFixed(1)} mm)`,"","PRICING BREAKDOWN",`- Decoration per piece: ${R(e.decorationPerPiece)}${e.minimumApplied?" (minimum applied)":""}`];i.customerSuppliesGarment?a.push("- Garment: Customer-supplied ($0.00)"):a.push(`- Garment per piece: ${R(e.garmentPerPiece)} (cost ${R(i.garmentCost)} + ${Math.round(i.garmentMarkup*100)}% markup)`),a.push(`- Total price per piece: ${R(e.perPiece)}`),e.setupFeeApplied>0&&a.push(`- One-time setup fee: ${R(e.setupFeeApplied)}`),a.push(`- ORDER TOTAL (${e.quantity} pcs): ${R(e.orderTotal)}`),a.push(""),a.push("QUANTITY PRICE BREAKS (Per Piece / Order Total)");for(const s of e.breakTable){const c=Math.round(s.discount*100);a.push(`  ${s.label.padEnd(7," ")} (${String(c).padStart(2," ")}% off): ${R(s.perPiece)}/pc  (${s.minQty} pcs = ${R(s.sampleOrderTotal)})`)}return a.join(`
`)}const Qt=`
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
          <span class="starting-values-tag">${We}</span>
        </summary>
        <div class="rates-body">
          <p class="rates-note">
            <strong>${We}.</strong> Changes save automatically in this browser for your next visit.
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
            <div class="field">
              <label for="rate-consumables">Consumables Cost (backing/thread $ / pc)</label>
              <input type="number" id="rate-consumables" min="0" max="50" step="0.05" value="0.25" />
            </div>
            <div class="field">
              <label for="rate-operator-wage">Operator Wage During Hooping ($ / hr)</label>
              <input type="number" id="rate-operator-wage" min="0" max="200" step="0.50" value="18.00" />
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

        <!-- Shop Production Economics & Net Contribution Margin Bar (Internal Only — Hidden on Customer Quote Print) -->
        <div class="profit-summary-bar no-print" aria-label="Shop Production Economics and Contribution Margin">
          <div class="profit-bar-item">
            <span class="profit-bar-label">Net Profit / Piece</span>
            <strong id="out-net-margin-pc" class="profit-bar-value">$11.15/pc</strong>
            <span id="out-direct-cost-sub" class="profit-bar-sub">After $0.25 supplies &amp; $0.30 hooping labor</span>
          </div>
          <div class="profit-bar-item">
            <span class="profit-bar-label">Order Contribution Profit</span>
            <strong id="out-net-order-profit" class="profit-bar-value">$267.60</strong>
            <span class="profit-bar-sub">Total kept after blank, supplies &amp; hooping</span>
          </div>
          <div class="profit-bar-item">
            <span class="profit-bar-label">Net Profit / Machine-Hr</span>
            <strong id="out-net-hourly-profit" class="profit-bar-value">$46.75/hr</strong>
            <span class="profit-bar-sub">True shop contribution per machine-hour</span>
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

        <!-- Step 8: Paid Version Waitlist (In-Page Instant Capture) -->
        <div class="waitlist-banner no-print">
          <p class="waitlist-intro">
            <strong>Want saved rate profiles ("Caps", "Left Chest"), logo PDF quotes, and quote history?</strong>
            Get early access to the Pro desktop &amp; web unlock ($19.99 one-time, no subscription):
            <a
              id="waitlist-link"
              href="#waitlist-inline-form"
            >Join the Paid Version Waitlist &darr;</a>
          </p>
          <form id="waitlist-inline-form" class="waitlist-inline-form">
            <div class="waitlist-form-row">
              <div class="field">
                <label for="waitlist-email">Your Email</label>
                <input type="email" id="waitlist-email" placeholder="shop@example.com" required />
              </div>
              <div class="field">
                <label for="waitlist-shop-type">Your Setup</label>
                <select id="waitlist-shop-type">
                  <option value="Single-head home/prosumer">Single-head home/prosumer</option>
                  <option value="Commercial multi-needle (1 head)">Commercial multi-needle (1 head)</option>
                  <option value="Commercial multi-head shop">Commercial multi-head shop</option>
                  <option value="Digitizer / Contract broker">Digitizer / Contract broker</option>
                </select>
              </div>
              <div class="field">
                <label for="waitlist-top-feature">#1 Pro Feature You Want</label>
                <select id="waitlist-top-feature">
                  <option value="Branded PDF quotes with shop logo">Branded PDF quotes with shop logo</option>
                  <option value="Saved rate profiles (Caps, Left Chest)">Saved rate profiles (Caps, Left Chest)</option>
                  <option value="Quote history & customer list">Quote history &amp; customer list</option>
                  <option value="Multi-placement orders (front + sleeve)">Multi-placement orders (front + sleeve)</option>
                  <option value="More formats (EXP, JEF, VP3, XXX)">More formats (EXP, JEF, VP3, XXX)</option>
                </select>
              </div>
            </div>
            <div class="waitlist-submit-row">
              <button type="submit" id="btn-submit-waitlist" class="btn btn-primary">
                Join $19.99 Pro Waitlist
              </button>
              <span id="waitlist-feedback" class="copy-feedback" aria-live="polite"></span>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</div>
`;function Gt(e){e.querySelector("#pricer-app-container")||(e.innerHTML=Qt);const i=e.getAttribute("data-tool-preset");let t=null;if(i)try{t=JSON.parse(i)}catch{t=null}const r=Mt();let n=r.rates,a=null,s=null;const c=e.querySelector("#drop-zone"),m=e.querySelector("#design-file-input"),P=e.querySelector("#btn-manual-mode"),g=e.querySelector("#loaded-file-badge"),v=e.querySelector("#file-error-alert"),x=e.querySelector("#file-warning-alert"),B=e.querySelector("#stitch-preview-canvas"),F=e.querySelector("#thread-swatches"),M=e.querySelector("#input-design-name"),w=e.querySelector("#input-stitches"),u=e.querySelector("#input-colors"),E=e.querySelector("#input-color-changes"),q=e.querySelector("#input-jumps"),p=e.querySelector("#input-trims"),D=e.querySelector("#input-width-in"),N=e.querySelector("#input-width-mm"),A=e.querySelector("#input-height-in"),l=e.querySelector("#input-height-mm"),S=e.querySelector("#input-minutes-override"),b=e.querySelector("#btn-reset-minutes"),f=e.querySelector("#input-quantity"),h=e.querySelector("#input-customer-garment"),L=e.querySelector("#input-garment-cost"),k=e.querySelector("#input-apply-setup"),T=e.querySelector("#input-setup-fee"),H=e.querySelector("#rate-per-1000"),_=e.querySelector("#rate-piece-fee"),z=e.querySelector("#rate-minimum"),C=e.querySelector("#rate-colors-included"),V=e.querySelector("#rate-extra-color-fee"),ce=e.querySelector("#rate-garment-markup"),ie=e.querySelector("#rate-machine-speed"),de=e.querySelector("#rate-change-seconds"),ee=e.querySelector("#rate-hooping-minutes"),J=e.querySelector("#rate-heads"),W=e.querySelector("#rate-consumables"),K=e.querySelector("#rate-operator-wage"),Z=[0,1,2,3,4].map(o=>e.querySelector(`#break-discount-${o}`)),be=e.querySelector("#btn-reset-rates"),it=e.querySelector("#storage-status-note"),nt=e.querySelector("#out-per-piece"),at=e.querySelector("#out-per-piece-sub"),ot=e.querySelector("#out-order-total"),st=e.querySelector("#out-order-total-sub"),lt=e.querySelector("#out-hourly-rate"),ct=e.querySelector("#out-machine-time"),Be=e.querySelector("#out-net-margin-pc"),Ee=e.querySelector("#out-direct-cost-sub"),Ne=e.querySelector("#out-net-order-profit"),Te=e.querySelector("#out-net-hourly-profit"),Fe=e.querySelector("#break-table-body"),ne=e.querySelector("#quote-text-output"),ge=e.querySelector("#copy-feedback"),dt=e.querySelector("#btn-copy-quote"),ut=e.querySelector("#btn-print-quote"),Se=e.querySelector("#btn-toggle-print-view"),pt=e.querySelector("#print-design-subtitle"),Le=e.querySelector("#waitlist-link"),$e=e.querySelector("#waitlist-inline-form"),ue=e.querySelector("#waitlist-email"),Pe=e.querySelector("#waitlist-shop-type"),ke=e.querySelector("#waitlist-top-feature"),ae=e.querySelector("#waitlist-feedback");function pe(o){if(!(typeof window>"u"||typeof fetch>"u")&&o!=="file_imported")try{const d=window.location.pathname||"/";fetch("/api/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:o,page:d}),keepalive:!0}).catch(()=>{})}catch{}}function qe(){H.value=n.ratePer1000Stitches.toFixed(2),_.value=n.pieceFee.toFixed(2),z.value=n.minimumPerPiece.toFixed(2),C.value=String(n.colorsIncluded),V.value=n.extraColorFee.toFixed(2),ce.value=String(Math.round(n.garmentMarkup*100)),ie.value=String(n.machineSpeed),de.value=String(n.colorChangeSeconds),ee.value=String(n.hoopingMinutes),J.value=String(n.heads),W&&(W.value=(n.consumablesCostPerPiece??.25).toFixed(2)),K&&(K.value=(n.operatorHourlyWage??18).toFixed(2)),n.quantityBreaks.forEach((o,d)=>{Z[d]&&(Z[d].value=String(Math.round(o.discount*100)))}),r.defaultSetupFee>0&&Number(T.value)===0&&(T.value=r.defaultSetupFee.toFixed(2))}function ht(){const o=($,G,Y=0)=>{if(!$)return G;const Q=Number.parseFloat($.value);return Number.isFinite(Q)&&Q>=Y?Q:G},d=Ce();return{ratePer1000Stitches:o(H,d.ratePer1000Stitches,0),pieceFee:o(_,d.pieceFee,0),minimumPerPiece:o(z,d.minimumPerPiece,0),colorsIncluded:Math.floor(o(C,d.colorsIncluded,0)),extraColorFee:o(V,d.extraColorFee,0),quantityBreaks:d.quantityBreaks.map(($,G)=>{const Y=o(Z[G],$.discount*100,0);return{...$,discount:Math.min(.95,Math.max(0,Y/100))}}),garmentMarkup:o(ce,d.garmentMarkup*100,0)/100,machineSpeed:o(ie,d.machineSpeed,1),colorChangeSeconds:o(de,d.colorChangeSeconds,0),hoopingMinutes:o(ee,d.hoopingMinutes,0),heads:Math.max(1,Math.floor(o(J,d.heads,1))),consumablesCostPerPiece:o(W,d.consumablesCostPerPiece??.25,0),operatorHourlyWage:o(K,d.operatorHourlyWage??18,0)}}function mt(){const o=Math.max(1,Math.floor(Number(u.value)||1));F.innerHTML="";for(let d=0;d<Math.min(o,24);d++){const $=a==null?void 0:a.threads[d],G=($==null?void 0:$.hex)??["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"][d%6],Y=($==null?void 0:$.description)??`Color ${d+1}`,Q=document.createElement("span");Q.className="swatch-pill",Q.title=`${d+1}. ${Y} (${G})`;const te=document.createElement("span");te.className="swatch-dot",te.style.backgroundColor=G;const re=document.createElement("span");re.textContent=`${d+1}. ${Y}`,Q.appendChild(te),Q.appendChild(re),F.appendChild(Q)}}let De;function U(){n=ht();const o=wt({rates:n,defaultSetupFee:Number.parseFloat(T.value)||0});it.textContent=o?"Settings saved locally in browser":"Browser storage blocked — using session settings",L.disabled=h.checked,T.disabled=!k.checked;const d=Math.max(0,Math.floor(Number.parseFloat(w.value)||0)),$=Math.max(1,Math.floor(Number.parseFloat(u.value)||1)),G=Math.max(0,Math.floor(Number.parseFloat(E.value)||0)),Y=Math.max(1,Math.floor(Number.parseFloat(f.value)||1)),Q=Math.max(0,Number.parseFloat(L.value)||0),te=Math.max(0,Number.parseFloat(T.value)||0),re={stitches:d,colors:$,colorChanges:G,quantity:Y,customerSuppliesGarment:h.checked,garmentCost:Q,applySetupFee:k.checked,setupFee:te},y=Pt(re,n);if(s!==null&&s>0){const X=I(s);y.minutesPerPiece=X,y.minutesPerPieceRaw=X,y.orderMachineMinutes=I(X*y.quantity/n.heads),y.effectiveHourlyRate=I(y.decorationPerPiece/X*60),y.breakTable=y.breakTable.map(se=>({...se,effectiveHourlyRate:I(se.decorationPerPiece/X*60)})),b.hidden=!1}else S.value=y.minutesPerPiece.toFixed(2),b.hidden=!0;De=y;const Me=Math.round(y.breakDiscount*100);nt.textContent=R(y.perPiece),at.textContent=`Decoration ${R(y.decorationPerPiece)}${y.minimumApplied?" (min)":""} · Garment ${R(y.garmentPerPiece)} (${Me}% break)`,ot.textContent=R(y.orderTotal),st.textContent=`${y.quantity} ${y.quantity===1?"piece":"pieces"} · ${R(y.setupFeeApplied)} setup fee`,lt.textContent=`${R(y.effectiveHourlyRate)}/hr`,ct.textContent=`${y.minutesPerPiece.toFixed(2)} min/pc · ${y.orderMachineMinutes.toFixed(2)} min order (${n.heads} head${n.heads>1?"s":""})`,Be&&(Be.textContent=`${R(y.netMarginPerPiece)}/pc`),Ee&&(Ee.textContent=`After ${R(y.consumablesPerPiece)} supplies & ${R(y.laborPerPiece)} hooping labor`),Ne&&(Ne.textContent=R(y.netOrderProfit)),Te&&(Te.textContent=`${R(y.netHourlyProfit)}/hr`),pt.textContent=`${M.value||"Custom Design"} · ${y.quantity} pcs · ${y.stitches.toLocaleString()} stitches`,Fe.innerHTML="";for(const X of y.breakTable){const se=document.createElement("tr");X.label===y.activeBreak.label&&(se.className="active-break-row");const gt=Math.round(X.discount*100);se.innerHTML=`
        <td><strong>${X.label}</strong></td>
        <td>${gt}%</td>
        <td>${R(X.decorationPerPiece)}</td>
        <td><strong>${R(X.perPiece)}</strong></td>
        <td>${R(X.sampleOrderTotal)}</td>
        <td class="no-print">${R(X.effectiveHourlyRate)}/hr</td>
      `,Fe.appendChild(se)}const ye=Math.max(.1,Number.parseFloat(N.value)||88.9),Ue=Math.max(.1,Number.parseFloat(l.value)||50.8);return Math.max(0,Math.floor(Number.parseFloat(q.value)||0)),Math.max(0,Math.floor(Number.parseFloat(p.value)||0)),ne.value=Ht(y,{designName:M.value.trim()||"Custom Design",widthMm:ye,heightMm:Ue,customerSuppliesGarment:h.checked,garmentCost:Q,garmentMarkup:n.garmentMarkup,heads:n.heads,machineSpeed:n.machineSpeed}),mt(),Ke(B,a,{widthMm:ye,heightMm:Ue,stitches:d,colors:$}),y}function Ie(o){a=o,s=null,v.hidden=!0,v.textContent="",o.warnings.length>0?(x.hidden=!1,x.textContent=o.warnings.join(" ")):(x.hidden=!0,x.textContent=""),g.textContent=`Loaded ${o.format.toUpperCase()}: ${o.filename}`,M.value=o.label||o.filename,w.value=String(o.normalStitches),u.value=String(o.threadBlocks),E.value=String(o.colorChanges),q.value=String(o.jumps),p.value=String(o.trims),N.value=o.widthMm.toFixed(1),D.value=o.widthIn.toFixed(2),l.value=o.heightMm.toFixed(1),A.value=o.heightIn.toFixed(2),U()}function Re(o){v.hidden=!1,v.textContent=o,x.hidden=!0,x.textContent=""}let oe=null,ft=0;const he=new Map;function Oe(){if(oe)return oe;if(typeof Worker>"u")return null;try{return oe=new Worker(new URL("/assets/worker-BKXLW0pr.js",import.meta.url),{type:"module"}),oe.addEventListener("message",o=>{const d=he.get(o.data.id);d&&(he.delete(o.data.id),d.resolve(o.data))}),oe.addEventListener("error",o=>{for(const[,d]of he)d.reject(o);he.clear()}),oe}catch{return null}}async function Ae(o,d){let $;if(o instanceof ArrayBuffer)$=o;else{const Q=new Uint8Array(o.byteLength);Q.set(o),$=Q.buffer}const G=Oe();if(G)try{const Q=++ft,te=$.slice(0),re=await new Promise((y,Me)=>{he.set(Q,{resolve:y,reject:Me});const ye={id:Q,filename:d,buffer:te};G.postMessage(ye,[te])});re.ok?Ie(re.design):Re(re.error);return}catch{}const Y=At($,d);Y.ok?Ie(Y.design):Re(Y.error)}async function He(o){if(!o)return;const d=await o.arrayBuffer();await Ae(d,o.name)}c.addEventListener("click",()=>{m.click()}),c.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),m.click())}),c.addEventListener("dragover",o=>{o.preventDefault(),c.classList.add("drag-over")}),c.addEventListener("dragleave",()=>{c.classList.remove("drag-over")}),c.addEventListener("drop",o=>{var $,G;o.preventDefault(),c.classList.remove("drag-over");const d=(G=($=o.dataTransfer)==null?void 0:$.files)==null?void 0:G[0];He(d)}),m.addEventListener("change",()=>{var d;const o=(d=m.files)==null?void 0:d[0];He(o),m.value=""}),P.addEventListener("click",()=>{a=null,s=null,v.hidden=!0,x.hidden=!0,g.textContent="Mode: Manual stitch count entry",w.focus(),w.select(),U()}),D.addEventListener("input",()=>{const o=Number.parseFloat(D.value);Number.isFinite(o)&&o>=0&&(N.value=(o*25.4).toFixed(1)),U()}),N.addEventListener("input",()=>{const o=Number.parseFloat(N.value);Number.isFinite(o)&&o>=0&&(D.value=(o/25.4).toFixed(2)),U()}),A.addEventListener("input",()=>{const o=Number.parseFloat(A.value);Number.isFinite(o)&&o>=0&&(l.value=(o*25.4).toFixed(1)),U()}),l.addEventListener("input",()=>{const o=Number.parseFloat(l.value);Number.isFinite(o)&&o>=0&&(A.value=(o/25.4).toFixed(2)),U()}),u.addEventListener("input",()=>{const o=Math.max(1,Math.floor(Number.parseFloat(u.value)||1));E.value=String(Math.max(0,o-1)),s=null,U()}),E.addEventListener("input",()=>{s=null,U()}),w.addEventListener("input",()=>{s=null,U()}),S.addEventListener("input",()=>{const o=Number.parseFloat(S.value);Number.isFinite(o)&&o>0?s=o:s=null,U()}),b.addEventListener("click",()=>{s=null,U()});const bt=[M,q,p,f,h,L,k,T,H,_,z,C,V,ce,ie,de,ee,J,...W?[W]:[],...K?[K]:[],...Z];let Qe=!1;for(const o of bt)o.addEventListener("input",()=>{U()}),o.addEventListener("change",()=>{Qe||(Qe=!0,pe("calculation_edited")),U()});if(be.addEventListener("click",()=>{Ct(),n=Ce(),qe(),U()}),dt.addEventListener("click",async()=>{pe("quote_copied");const o=ne.value;try{navigator.clipboard&&navigator.clipboard.writeText?await navigator.clipboard.writeText(o):(ne.focus(),ne.select(),document.execCommand("copy")),ge.textContent="Quote copied to clipboard!"}catch{ne.focus(),ne.select(),ge.textContent="Selected quote text — press Ctrl+C / Cmd+C to copy"}setTimeout(()=>{ge.textContent&&(ge.textContent="")},3e3)}),ut.addEventListener("click",()=>{pe("quote_printed"),window.print()}),Le&&Le.addEventListener("click",()=>{pe("waitlist_clicked"),ue&&setTimeout(()=>ue.focus(),50)}),$e&&ue&&ae&&$e.addEventListener("submit",async o=>{o.preventDefault();const d=ue.value.trim();if(!d||!d.includes("@")){ae.textContent="Please enter a valid email address.";return}const $=(Pe==null?void 0:Pe.value)??"Single-head home/prosumer",G=(ke==null?void 0:ke.value)??"Branded PDF quotes with shop logo";ae.textContent="Saving your spot...";try{(await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:d,shopType:$,topFeature:G,page:typeof window<"u"?window.location.pathname:"/"})})).ok?(ae.textContent="You're on the $19.99 Pro early-access list!",ue.value=""):ae.textContent="Saved locally — we'll notify you when Pro launches!"}catch{ae.textContent="Saved locally — we'll notify you when Pro launches!"}}),typeof document<"u"&&document.querySelectorAll("[data-affiliate-slot]").forEach(o=>{o.addEventListener("click",()=>{pe("supply_clicked")})}),Se.addEventListener("click",()=>{const o=document.body.classList.toggle("print-preview-mode");Se.setAttribute("aria-pressed",String(o)),Se.textContent=o?"Exit Print View":"Preview Print View"}),typeof window<"u"&&window.addEventListener("resize",()=>{Ke(B,a,{widthMm:Number.parseFloat(N.value)||88.9,heightMm:Number.parseFloat(l.value)||50.8,stitches:Number.parseFloat(w.value)||8e3,colors:Number.parseFloat(u.value)||3})}),Oe(),qe(),t&&(t.modeBadge&&(g.textContent=t.modeBadge),t.designName&&(M.value=t.designName),typeof t.stitches=="number"&&(w.value=String(t.stitches)),typeof t.colors=="number"&&(u.value=String(t.colors)),typeof t.colorChanges=="number"&&(E.value=String(t.colorChanges)),typeof t.widthIn=="number"&&(D.value=t.widthIn.toFixed(2)),typeof t.widthMm=="number"&&(N.value=t.widthMm.toFixed(1)),typeof t.heightIn=="number"&&(A.value=t.heightIn.toFixed(2)),typeof t.heightMm=="number"&&(l.value=t.heightMm.toFixed(1)),typeof t.quantity=="number"&&(f.value=String(t.quantity)),typeof t.customerSuppliesGarment=="boolean"&&(h.checked=t.customerSuppliesGarment),typeof t.garmentCost=="number"&&(L.value=t.garmentCost.toFixed(2)),typeof t.applySetupFee=="boolean"&&(k.checked=t.applySetupFee),typeof t.setupFee=="number"&&(T.value=t.setupFee.toFixed(2)),t.openRatesByDefault)){const o=e.querySelector("#rate-settings-details");o&&(o.open=!0)}U();const Ge={loadFileBuffer:Ae,getQuote:()=>De,getRates:()=>n,recalculate:U};return typeof window<"u"&&(window.__embroideryTool=Ge),Ge}function Ze(){var n;let e=!1;try{e=!!((n=window.localStorage)!=null&&n.getItem(xe))}catch{e=!1}const i=document.getElementById("embroidery-tool-root");i&&Gt(i);try{const a=window.location.pathname||"/";fetch("/api/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"page_view",page:a}),keepalive:!0}).catch(()=>{}),e&&fetch("/api/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"returning_visit",page:a}),keepalive:!0}).catch(()=>{})}catch{}const t=document.getElementById("sticky-jump-wrapper"),r=document.getElementById("btn-close-jump-pill");t&&r&&r.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),t.hidden=!0,t.style.display="none"})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ze):Ze();
