var St=Object.defineProperty;var Pt=(e,i,r)=>i in e?St(e,i,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[i]=r;var ve=(e,i,r)=>Pt(e,typeof i!="symbol"?i+"":i,r);(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))t(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function r(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(n){if(n.ep)return;n.ep=!0;const a=r(n);fetch(n.href,a)}})();const Ge="Starting values: change to yours",fe=[{label:"1–11",minQty:1,maxQty:11,discount:0},{label:"12–23",minQty:12,maxQty:23,discount:.05},{label:"24–47",minQty:24,maxQty:47,discount:.1},{label:"48–143",minQty:48,maxQty:143,discount:.15},{label:"144+",minQty:144,maxQty:null,discount:.2}],it={ratePer1000Stitches:1.5,pieceFee:1,minimumPerPiece:5,colorsIncluded:6,extraColorFee:.5,quantityBreaks:fe.map(e=>({...e})),garmentMarkup:.4,machineSpeed:650,colorChangeSeconds:30,hoopingMinutes:1,heads:1,consumablesCostPerPiece:.25,operatorHourlyWage:18};function Ce(){return{...it,quantityBreaks:fe.map(e=>({...e}))}}function D(e){if(!Number.isFinite(e))return 0;const i=e<0?-1:1,r=Math.abs(e);return i*Math.floor(r*100+.5+1e-9)/100}function kt(e,i){const r=Math.max(1,Math.floor(e)),t=[...i].sort((n,a)=>n.minQty-a.minQty);for(const n of t)if(r>=n.minQty&&(n.maxQty===null||r<=n.maxQty))return n;for(let n=t.length-1;n>=0;n--)if(r>=t[n].minQty)return t[n];return t[0]??{label:"1+",minQty:1,maxQty:null,discount:0}}function wt(e){const i=Math.max(0,e.stitches),r=Math.max(0,e.colorChanges),t=Math.max(1,Math.floor(e.quantity)),n=e.machineSpeed>0?e.machineSpeed:650,a=Math.max(0,e.colorChangeSeconds),s=Math.max(0,e.hoopingMinutes),c=e.heads>0?Math.floor(e.heads):1,h=i/n+r*(a/60)+s,x=D(h),f=h*t/c,g=D(f);return{minutesPerPieceRaw:h,minutesPerPiece:x,orderMachineMinutesRaw:f,orderMachineMinutes:g}}function Mt(e,i=it){const r=Math.max(0,e.stitches),t=Math.max(1,Math.floor(e.colors)),n=e.colorChanges!==void 0?Math.max(0,Math.floor(e.colorChanges)):Math.max(0,t-1),a=Math.max(1,Math.floor(e.quantity)),s=Math.max(0,t-Math.max(0,Math.floor(i.colorsIncluded))),c=r/1e3*i.ratePer1000Stitches+i.pieceFee+i.extraColorFee*s,h=kt(a,i.quantityBreaks),x=h.discount,f=c*(1-x),g=f<i.minimumPerPiece,y=Math.max(f,i.minimumPerPiece),C=D(y),E=e.customerSuppliesGarment?0:Math.max(0,e.garmentCost),w=E*(1+i.garmentMarkup),S=D(w),u=D(y+w),N=e.applySetupFee?D(Math.max(0,e.setupFee)):0,$=D(u*a+N),p=wt({stitches:r,colorChanges:n,quantity:a,machineSpeed:i.machineSpeed,colorChangeSeconds:i.colorChangeSeconds,hoopingMinutes:i.hoopingMinutes,heads:i.heads}),q=p.minutesPerPiece>0?D(C/p.minutesPerPiece*60):0,T=D(Math.max(0,i.consumablesCostPerPiece??.25)),A=Math.max(0,i.operatorHourlyWage??18),l=D(Math.max(0,i.hoopingMinutes)/60*A),k=D(E+T+l),v=D(u-k),b=D(v*a+N),m=p.orderMachineMinutes>0?D(b/p.orderMachineMinutes*60):0,L=i.quantityBreaks.map(M=>{const F=c*(1-M.discount),_=Math.max(F,i.minimumPerPiece),W=D(_),K=D(_+w),B=D(K*M.minQty+N),j=p.minutesPerPiece>0?D(W/p.minutesPerPiece*60):0;return{label:M.label,minQty:M.minQty,maxQty:M.maxQty,discount:M.discount,decorationPerPiece:W,garmentPerPiece:S,perPiece:K,sampleOrderTotal:B,effectiveHourlyRate:j}});return{stitches:r,colors:t,colorChanges:n,extraColors:s,quantity:a,activeBreak:h,breakDiscount:x,baseDecoration:D(c),discountedDecorationRaw:f,minimumApplied:g,decorationPerPiece:C,garmentPerPiece:S,perPiece:u,setupFeeApplied:N,orderTotal:$,minutesPerPieceRaw:p.minutesPerPieceRaw,minutesPerPiece:p.minutesPerPiece,orderMachineMinutesRaw:p.orderMachineMinutesRaw,orderMachineMinutes:p.orderMachineMinutes,effectiveHourlyRate:q,consumablesPerPiece:T,laborPerPiece:l,netMarginPerPiece:v,netOrderProfit:b,netHourlyProfit:m,breakTable:L}}const xe="embroidery_pricer_settings_v1";function V(e){return typeof e=="number"&&Number.isFinite(e)&&e>=0}function Ct(e){return!Array.isArray(e)||e.length!==fe.length?fe.map(i=>({...i})):fe.map((i,r)=>{const t=e[r],n=t&&typeof t.discount=="number"&&Number.isFinite(t.discount)?Math.min(1,Math.max(0,t.discount)):i.discount;return{label:i.label,minQty:i.minQty,maxQty:i.maxQty,discount:n}})}function Bt(e){const i={rates:Ce(),defaultSetupFee:0};try{const r=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!r)return i;const t=r.getItem(xe);if(!t)return i;const n=JSON.parse(t),a=n.rates??{},s=i.rates,c={ratePer1000Stitches:V(a.ratePer1000Stitches)?a.ratePer1000Stitches:s.ratePer1000Stitches,pieceFee:V(a.pieceFee)?a.pieceFee:s.pieceFee,minimumPerPiece:V(a.minimumPerPiece)?a.minimumPerPiece:s.minimumPerPiece,colorsIncluded:V(a.colorsIncluded)?Math.floor(a.colorsIncluded):s.colorsIncluded,extraColorFee:V(a.extraColorFee)?a.extraColorFee:s.extraColorFee,quantityBreaks:Ct(a.quantityBreaks),garmentMarkup:V(a.garmentMarkup)?a.garmentMarkup:s.garmentMarkup,machineSpeed:V(a.machineSpeed)&&a.machineSpeed>0?a.machineSpeed:s.machineSpeed,colorChangeSeconds:V(a.colorChangeSeconds)?a.colorChangeSeconds:s.colorChangeSeconds,hoopingMinutes:V(a.hoopingMinutes)?a.hoopingMinutes:s.hoopingMinutes,heads:V(a.heads)&&a.heads>=1?Math.floor(a.heads):s.heads,consumablesCostPerPiece:V(a.consumablesCostPerPiece)?a.consumablesCostPerPiece:s.consumablesCostPerPiece??.25,operatorHourlyWage:V(a.operatorHourlyWage)?a.operatorHourlyWage:s.operatorHourlyWage??18},h=V(n.defaultSetupFee)?n.defaultSetupFee:0;return{rates:c,defaultSetupFee:h}}catch{return i}}function Et(e,i){try{const r=i!==void 0?i:typeof window<"u"?window.localStorage:null;return r?(r.setItem(xe,JSON.stringify(e)),!0):!1}catch{return!1}}function Nt(e){try{const i=e!==void 0?e:typeof window<"u"?window.localStorage:null;if(!i)return;i.removeItem(xe)}catch{}}const Me=[null,{hex:"#0e1f7c",description:"Prussian Blue",catalogNumber:"1",brand:"Brother",chart:"Brother"},{hex:"#0a55a3",description:"Blue",catalogNumber:"2",brand:"Brother",chart:"Brother"},{hex:"#008777",description:"Teal Green",catalogNumber:"3",brand:"Brother",chart:"Brother"},{hex:"#4b6baf",description:"Cornflower Blue",catalogNumber:"4",brand:"Brother",chart:"Brother"},{hex:"#ed171f",description:"Red",catalogNumber:"5",brand:"Brother",chart:"Brother"},{hex:"#d15c00",description:"Reddish Brown",catalogNumber:"6",brand:"Brother",chart:"Brother"},{hex:"#913697",description:"Magenta",catalogNumber:"7",brand:"Brother",chart:"Brother"},{hex:"#e49acb",description:"Light Lilac",catalogNumber:"8",brand:"Brother",chart:"Brother"},{hex:"#915fac",description:"Lilac",catalogNumber:"9",brand:"Brother",chart:"Brother"},{hex:"#9ed67d",description:"Mint Green",catalogNumber:"10",brand:"Brother",chart:"Brother"},{hex:"#e8a900",description:"Deep Gold",catalogNumber:"11",brand:"Brother",chart:"Brother"},{hex:"#feba35",description:"Orange",catalogNumber:"12",brand:"Brother",chart:"Brother"},{hex:"#ffff00",description:"Yellow",catalogNumber:"13",brand:"Brother",chart:"Brother"},{hex:"#70bc1f",description:"Lime Green",catalogNumber:"14",brand:"Brother",chart:"Brother"},{hex:"#ba9800",description:"Brass",catalogNumber:"15",brand:"Brother",chart:"Brother"},{hex:"#a8a8a8",description:"Silver",catalogNumber:"16",brand:"Brother",chart:"Brother"},{hex:"#7d6f00",description:"Russet Brown",catalogNumber:"17",brand:"Brother",chart:"Brother"},{hex:"#ffffb3",description:"Cream Brown",catalogNumber:"18",brand:"Brother",chart:"Brother"},{hex:"#4f5556",description:"Pewter",catalogNumber:"19",brand:"Brother",chart:"Brother"},{hex:"#000000",description:"Black",catalogNumber:"20",brand:"Brother",chart:"Brother"},{hex:"#0b3d91",description:"Ultramarine",catalogNumber:"21",brand:"Brother",chart:"Brother"},{hex:"#770176",description:"Royal Purple",catalogNumber:"22",brand:"Brother",chart:"Brother"},{hex:"#293133",description:"Dark Gray",catalogNumber:"23",brand:"Brother",chart:"Brother"},{hex:"#2a1301",description:"Dark Brown",catalogNumber:"24",brand:"Brother",chart:"Brother"},{hex:"#f64a8a",description:"Deep Rose",catalogNumber:"25",brand:"Brother",chart:"Brother"},{hex:"#b27624",description:"Light Brown",catalogNumber:"26",brand:"Brother",chart:"Brother"},{hex:"#fcbbc5",description:"Salmon Pink",catalogNumber:"27",brand:"Brother",chart:"Brother"},{hex:"#fe370f",description:"Vermilion",catalogNumber:"28",brand:"Brother",chart:"Brother"},{hex:"#f0f0f0",description:"White",catalogNumber:"29",brand:"Brother",chart:"Brother"},{hex:"#6a1c8a",description:"Violet",catalogNumber:"30",brand:"Brother",chart:"Brother"},{hex:"#a8ddc4",description:"Seacrest",catalogNumber:"31",brand:"Brother",chart:"Brother"},{hex:"#2584bb",description:"Sky Blue",catalogNumber:"32",brand:"Brother",chart:"Brother"},{hex:"#feb343",description:"Pumpkin",catalogNumber:"33",brand:"Brother",chart:"Brother"},{hex:"#fff36b",description:"Cream Yellow",catalogNumber:"34",brand:"Brother",chart:"Brother"},{hex:"#d0a660",description:"Khaki",catalogNumber:"35",brand:"Brother",chart:"Brother"},{hex:"#d15400",description:"Clay Brown",catalogNumber:"36",brand:"Brother",chart:"Brother"},{hex:"#66ba49",description:"Leaf Green",catalogNumber:"37",brand:"Brother",chart:"Brother"},{hex:"#134a46",description:"Peacock Blue",catalogNumber:"38",brand:"Brother",chart:"Brother"},{hex:"#878787",description:"Gray",catalogNumber:"39",brand:"Brother",chart:"Brother"},{hex:"#d8ccc6",description:"Warm Gray",catalogNumber:"40",brand:"Brother",chart:"Brother"},{hex:"#435607",description:"Dark Olive",catalogNumber:"41",brand:"Brother",chart:"Brother"},{hex:"#fdd9de",description:"Flesh Pink",catalogNumber:"42",brand:"Brother",chart:"Brother"},{hex:"#f993bc",description:"Pink",catalogNumber:"43",brand:"Brother",chart:"Brother"},{hex:"#003822",description:"Deep Green",catalogNumber:"44",brand:"Brother",chart:"Brother"},{hex:"#b2afd4",description:"Lavender",catalogNumber:"45",brand:"Brother",chart:"Brother"},{hex:"#686ab0",description:"Wisteria Violet",catalogNumber:"46",brand:"Brother",chart:"Brother"},{hex:"#efe3b9",description:"Beige",catalogNumber:"47",brand:"Brother",chart:"Brother"},{hex:"#f73866",description:"Carmine",catalogNumber:"48",brand:"Brother",chart:"Brother"},{hex:"#b54b64",description:"Amber Red",catalogNumber:"49",brand:"Brother",chart:"Brother"},{hex:"#132b1a",description:"Olive Green",catalogNumber:"50",brand:"Brother",chart:"Brother"},{hex:"#c70156",description:"Dark Fuchsia",catalogNumber:"51",brand:"Brother",chart:"Brother"},{hex:"#fe9e32",description:"Tangerine",catalogNumber:"52",brand:"Brother",chart:"Brother"},{hex:"#a8deeb",description:"Light Blue",catalogNumber:"53",brand:"Brother",chart:"Brother"},{hex:"#00673e",description:"Emerald Green",catalogNumber:"54",brand:"Brother",chart:"Brother"},{hex:"#4e2990",description:"Purple",catalogNumber:"55",brand:"Brother",chart:"Brother"},{hex:"#2f7e20",description:"Moss Green",catalogNumber:"56",brand:"Brother",chart:"Brother"},{hex:"#ffcccc",description:"Flesh Pink",catalogNumber:"57",brand:"Brother",chart:"Brother"},{hex:"#ffd911",description:"Harvest Gold",catalogNumber:"58",brand:"Brother",chart:"Brother"},{hex:"#095ba6",description:"Electric Blue",catalogNumber:"59",brand:"Brother",chart:"Brother"},{hex:"#f0f970",description:"Lemon Yellow",catalogNumber:"60",brand:"Brother",chart:"Brother"},{hex:"#e3f35b",description:"Fresh Green",catalogNumber:"61",brand:"Brother",chart:"Brother"},{hex:"#ff9900",description:"Orange",catalogNumber:"62",brand:"Brother",chart:"Brother"},{hex:"#fff08d",description:"Cream Yellow",catalogNumber:"63",brand:"Brother",chart:"Brother"},{hex:"#ffc8c8",description:"Applique",catalogNumber:"64",brand:"Brother",chart:"Brother"}],We=[{hex:"#1d4ed8",description:"Royal Blue (Default 1)"},{hex:"#dc2626",description:"Crimson Red (Default 2)"},{hex:"#15803d",description:"Forest Green (Default 3)"},{hex:"#d97706",description:"Amber Gold (Default 4)"},{hex:"#7c3aed",description:"Violet Purple (Default 5)"},{hex:"#0f766e",description:"Teal (Default 6)"},{hex:"#be185d",description:"Magenta (Default 7)"},{hex:"#374151",description:"Charcoal (Default 8)"},{hex:"#ea580c",description:"Burnt Orange (Default 9)"},{hex:"#0284c7",description:"Sky Blue (Default 10)"},{hex:"#4d7c0f",description:"Olive Green (Default 11)"},{hex:"#111827",description:"Jet Black (Default 12)"}];function Ye(e){const i=We[e%We.length];return{hex:i.hex,description:i.description,catalogNumber:String(e+1),brand:"Default Palette"}}function Tt(e,i=3,r=null,t=!0){let n=-1,a=e.length-1,s=0,c=0,h=0,x=0,f=0,g=0,y=!1,C=!0;for(;n<a;){n+=1;const E=e[n],w=E.x-s,S=E.y-c;s=E.x,c=E.y;const u=E.command;if(u==="STITCH"||u==="SEQUIN_EJECT"?(C=!1,y=!1):(u==="COLOR_CHANGE"||u==="TRIM")&&(C=!0,y=!1),u==="JUMP"){if(y||(f=0,g=0,h=0,x=n,y=!0),h+=1,f+=w,g+=S,!C&&(h===i||r!==null&&(Math.abs(g)>r||Math.abs(f)>r))){const N=x>0?e[x-1].x:0,$=x>0?e[x-1].y:0;e.splice(x,0,{x:N,y:$,command:"TRIM"}),x+=1,n+=1,a+=1,C=!0}t&&f===0&&g===0&&(e.splice(x,n+1-x),n=x-1,a=e.length-1)}}}function Ft(e,i){return!e||!i?!1:e.hex.toLowerCase()===i.hex.toLowerCase()&&(e.description??"")===(i.description??"")&&(e.catalogNumber??"")===(i.catalogNumber??"")&&(e.brand??"")===(i.brand??"")&&(e.chart??"")===(i.chart??"")}function Lt(e,i){let r=0,t=!0,n=null;for(let a=0;a<e.length;a++){const c=e[a].command;if(c==="STITCH"){if(t){if(r>=i.length)return;n!==null&&r!==0&&Ft(i[r-1]??void 0,i[r]??void 0)?(i.splice(r,1),e[n].command="STOP"):r+=1,t=!1}}else c==="COLOR_CHANGE"&&(t=!0,n=a)}}function nt(e){const{format:i,filename:r,label:t,stitches:n,threads:a,warnings:s,headerMetadata:c}=e;let h=0,x=0,f=0,g=0,y=0,C=1/0,E=1/0,w=-1/0,S=-1/0;for(const B of n)switch(B.x>w&&(w=B.x),B.x<C&&(C=B.x),B.y>S&&(S=B.y),B.y<E&&(E=B.y),B.command){case"STITCH":h+=1;break;case"JUMP":x+=1;break;case"TRIM":f+=1;break;case"COLOR_CHANGE":g+=1;break;case"STOP":y+=1;break}const u=n.length>0&&Number.isFinite(C)&&Number.isFinite(w),N=u?C/10:0,$=u?E/10:0,p=u?w/10:0,q=u?S/10:0,T=u?(w-C)/10:0,A=u?(S-E)/10:0,l=T/25.4,k=A/25.4,v=g+1,b=[];for(let B=0;B<v;B++){const j=a[B];j&&j.hex?b.push(j):b.push(Ye(B))}const m=[];let L=0,M=[],F=[],_=0;const W=()=>{F.length>0&&(M.push({points:F}),F=[])},K=()=>{W(),m.push({index:L,color:b[L]??Ye(L),stitchCount:_,segments:M}),L+=1,M=[],_=0};for(const B of n)B.command==="STITCH"?(F.push({x:B.x/10,y:B.y/10}),_+=1):B.command==="COLOR_CHANGE"?K():W();return K(),{format:i,filename:r,label:t,normalStitches:h,jumps:x,trims:f,colorChanges:g,stops:y,threadBlocks:v,widthMm:T,heightMm:A,widthIn:l,heightIn:k,boundsMm:{minX:N,minY:$,maxX:p,maxY:q},threads:b,blocks:m,warnings:s,headerMetadata:c}}const me=512;function O(e,i){return e>>i&1}function It(e,i,r){let t=0;return t+=O(r,2)*81,t+=O(r,3)*-81,t+=O(i,2)*27,t+=O(i,3)*-27,t+=O(e,2)*9,t+=O(e,3)*-9,t+=O(i,0)*3,t+=O(i,1)*-3,t+=O(e,0)*1,t+=O(e,1)*-1,t}function $t(e,i,r){let t=0;return t+=O(r,5)*81,t+=O(r,4)*-81,t+=O(i,5)*27,t+=O(i,4)*-27,t+=O(e,5)*9,t+=O(e,4)*-9,t+=O(i,7)*3,t+=O(i,6)*-3,t+=O(e,7)*1,t+=O(e,6)*-1,-t}function qt(e){const i=e.trim().replace(/^#/,"");return/^[0-9a-fA-F]{6}$/.test(i)?`#${i.toLowerCase()}`:"#000000"}function Dt(e,i){if(e.byteLength<me+3)return{ok:!1,error:"Invalid or truncated DST file: file is smaller than the 512-byte DST header plus one stitch record."};const r=e.subarray(0,me);if(!new TextDecoder("utf-8",{fatal:!1}).decode(r.subarray(0,64)).includes("LA:"))return{ok:!1,error:"Invalid DST file: missing 'LA:' design label in the 512-byte Tajima header."};const a=(e.byteLength-me)%3,s=a===1&&e[e.byteLength-1]===26;if(a!==0&&!s)return{ok:!1,error:"Truncated or corrupted DST file: stitch data length is not a multiple of 3-byte DST records."};const c={},h=[],x=new TextDecoder("utf-8",{fatal:!0});let f=0;for(let l=0;l<me;l++){const k=r[l];if(k===13||k===10){const v=l,b=r.subarray(f,v);f=v;try{const m=x.decode(b).trim();if(m.length>3&&m[2]===":"){const L=m.slice(0,2).trim(),M=m.slice(3).trim();if(L==="LA")c.name=M;else if(L==="AU")c.author=M;else if(L==="CP")c.copyright=M;else if(L==="TC"){const F=M.split(",").map(_=>_.trim());h.push({hex:qt(F[0]??"#000000"),description:F[1]??"Custom DST Thread",catalogNumber:F[2]??""})}else c[L]=M}}catch{}}}const g=[];let y=0,C=0,E=!1,w=0,S=!1;const u=(l,k,v)=>{const b=y+l,m=C+k;g.push({x:b,y:m,command:v}),y=b,C=m};let N=me;for(;N+3<=e.byteLength;){const l=e[N],k=e[N+1],v=e[N+2];if(N+=3,(v&3)!==3)return{ok:!1,error:`Corrupted DST stitch record at byte offset ${N-3}: missing mandatory DST record tag bits.`};const b=It(l,k,v),m=$t(l,k,v);if((v&243)===243){S=!0;break}else(v&195)===195?(w+=1,u(b,m,"COLOR_CHANGE")):(v&67)===67?(w+=1,u(b,m,"SEQUIN_MODE"),E=!E):(v&131)===131?(w+=1,E?u(b,m,"SEQUIN_EJECT"):u(b,m,"JUMP")):(w+=1,u(b,m,"STITCH"))}if(w===0)return{ok:!1,error:"Invalid DST file: file contains no stitch records."};u(0,0,"END"),Tt(g,3,null,!0);const $=[];let p=0,q=0;for(const l of g)l.command==="STITCH"?p+=1:l.command==="COLOR_CHANGE"&&(q+=1);if(c.CO!==void 0){const l=Number.parseInt(c.CO,10);!Number.isNaN(l)&&l!==q&&$.push(`Header color change count (CO=${l}) disagrees with stitch records (${q} color changes). Using stitch records.`)}if(c.ST!==void 0){const l=Number.parseInt(c.ST,10),k=w+(S?1:0);!Number.isNaN(l)&&l!==p&&l!==k&&l!==w?$.push(`Header stitch count (ST=${l}) disagrees with stitch records (${p} normal stitches, ${k} total records). Using stitch records.`):!Number.isNaN(l)&&l!==p&&$.push(`Header ST (${l}) includes jumps/color-changes/end records; pricing uses ${p} normal stitches computed from stitch records.`)}const T=c.name||i.replace(/\.[^.]+$/,"");return{ok:!0,design:nt({format:"dst",filename:i,label:T,stitches:g,threads:h,warnings:$,headerMetadata:c})}}const Je=16,Xe=32,Ve=128;class Rt{constructor(i){ve(this,"view");ve(this,"bytes");ve(this,"pos",0);this.bytes=i,this.view=new DataView(i.buffer,i.byteOffset,i.byteLength)}get length(){return this.bytes.byteLength}seek(i,r="set"){r==="set"?this.pos=i:this.pos+=i}readU8(){return this.pos>=this.bytes.byteLength?null:this.bytes[this.pos++]}readU16LE(){if(this.pos+2>this.bytes.byteLength)return null;const i=this.view.getUint16(this.pos,!0);return this.pos+=2,i}readS16LE(){if(this.pos+2>this.bytes.byteLength)return null;const i=this.view.getInt16(this.pos,!0);return this.pos+=2,i}readU24LE(){if(this.pos+3>this.bytes.byteLength)return null;const i=this.bytes[this.pos],r=this.bytes[this.pos+1],t=this.bytes[this.pos+2];return this.pos+=3,i|r<<8|t<<16}readU24BE(){if(this.pos+3>this.bytes.byteLength)return null;const i=this.bytes[this.pos],r=this.bytes[this.pos+1],t=this.bytes[this.pos+2];return this.pos+=3,i<<16|r<<8|t}readU32LE(){if(this.pos+4>this.bytes.byteLength)return null;const i=this.view.getUint32(this.pos,!0);return this.pos+=4,i}readBytes(i){if(this.pos+i>this.bytes.byteLength)return null;const r=this.bytes.subarray(this.pos,this.pos+i);return this.pos+=i,r}readAscii(i){const r=this.readBytes(i);return r?new TextDecoder("utf-8",{fatal:!1}).decode(r):null}readPesString(){const i=this.readU8();return i===null||i===0?null:this.readAscii(i)}}function je(e){const i=e&4095;return i>2047?-4096+i:i}function Ke(e){return e>63?-128+e:e}function at(e,i){const r=["name","category","author","keywords","comments"];for(const t of r){const n=e.readPesString();n&&n.length>0&&(i[t]=n)}}function Ot(e){const i=e.readPesString()??void 0,r=e.readU24BE();if(r===null)return null;e.seek(5,"cur");const t=e.readPesString()??"",n=e.readPesString()??void 0,a=e.readPesString()??void 0;return{hex:`#${(r&16777215).toString(16).padStart(6,"0")}`,description:t,catalogNumber:i,brand:n,chart:a}}function le(e,i,r,t,n,a,s){if(e.seek(4,"cur"),at(e,i),s!==void 0){e.seek(s,"cur");const y=e.readPesString();y&&y.length>0&&(i.hoop_name=y)}e.seek(t,"cur");const c=e.readPesString();c&&c.length>0&&(i[a]=c),e.seek(n,"cur");const h=e.readU16LE();if(h===null||h!==0)return;const x=e.readU16LE();if(x===null||x!==0)return;const f=e.readU16LE();if(f===null||f!==0)return;const g=e.readU16LE();if(g!==null)for(let y=0;y<g;y++){const C=Ot(e);if(!C)break;r.push(C)}}function At(e,i){const r=Me.length,t=[];if(i.length===0)for(let n=0;n<e.length;n++){const a=e[n]%r;t.push(Me[a]??null)}else if(i.length>=e.length)for(const n of i)t.push(n);else{const n=[...i],a=new Map;for(let s=0;s<e.length;s++){const c=e[s]%r;let h=a.get(c);h===void 0&&(n.length>0?h=n.shift()??null:h=Me[c]??null,a.set(c,h)),t.push(h)}}return t}function _t(e,i){if(e.byteLength<48)return{ok:!1,error:"Invalid or truncated PES file: file is too small to contain a PES/PEC header."};const r=new Rt(e),t=r.readAscii(8);if(!t||!t.startsWith("#PES")&&t!=="#PEC0001")return{ok:!1,error:"Invalid PES file: file does not start with a valid '#PES' or '#PEC0001' signature."};const n={},a=[];let s=8;if(t!=="#PEC0001"){const l=r.readU32LE();if(l===null||l<12||l+532>e.byteLength)return{ok:!1,error:"Invalid or truncated PES file: PEC block offset in header points outside the file."};s=l;try{switch(t){case"#PES0100":n.version="10",le(r,n,a,38,34,"image_file",14);break;case"#PES0090":n.version="9",le(r,n,a,30,34,"image_file",14);break;case"#PES0080":n.version="8",le(r,n,a,38,26,"image_file");break;case"#PES0070":n.version="7",le(r,n,a,36,24,"image_file");break;case"#PES0060":n.version="6",le(r,n,a,36,24,"image_file");break;case"#PES0050":case"#PES0055":case"#PES0056":n.version=t==="#PES0050"?"5":t==="#PES0055"?"5.5":"5.6",le(r,n,a,24,24,"image");break;case"#PES0040":n.version="4",r.seek(4,"cur"),at(r,n);break;case"#PES0030":n.version="3";break;case"#PES0022":n.version="2.2";break;case"#PES0020":n.version="2";break;case"#PES0001":n.version="1";break;default:n.version=t.slice(4);break}}catch{}}r.seek(s,"set"),r.seek(3,"cur");const c=r.readAscii(16);if(c===null)return{ok:!1,error:"Truncated PES/PEC block: could not read design label."};n.Name=c.trim(),r.seek(15,"cur");const h=r.readU8(),x=r.readU8();if(h===null||x===null)return{ok:!1,error:"Truncated PES/PEC block: missing graphic header fields."};r.seek(12,"cur");const f=r.readU8();if(f===null)return{ok:!1,error:"Truncated PES/PEC block: missing color change count byte."};const g=f===255?0:f,y=f===255?0:g+1,C=r.readBytes(y);if(!C)return{ok:!1,error:"Truncated PES/PEC block: file ends inside PEC color palette table."};const E=At(C,a);if(r.seek(464-f,"cur"),r.readU24LE()===null)return{ok:!1,error:"Truncated PES/PEC block: missing stitch block length."};if(r.pos+11>r.length)return{ok:!1,error:"Truncated PES/PEC block: file ends before stitch data starts."};r.seek(11,"cur");const S=[];let u=0,N=0;const $=(l,k,v)=>{const b=u+l,m=N+k;S.push({x:b,y:m,command:v}),u=b,N=m};for(;;){const l=r.readU8(),k=r.readU8();if(l===null||k===null||l===255&&k===0)break;if(l===254&&k===176){r.seek(1,"cur"),$(0,0,"COLOR_CHANGE");continue}let v=!1,b=!1,m=0,L=0,M=k;if(l&Ve){l&Xe&&(b=!0),l&Je&&(v=!0);const F=l<<8|M;if(m=je(F),M=r.readU8(),M===null)break}else m=Ke(l);if(M&Ve){M&Xe&&(b=!0),M&Je&&(v=!0);const F=r.readU8();if(F===null)break;const _=M<<8|F;L=je(_)}else L=Ke(M);v?$(m,L,"JUMP"):b?($(0,0,"TRIM"),$(m,L,"JUMP")):$(m,L,"STITCH")}if(S.length===0)return{ok:!1,error:"Invalid PES file: PEC section contains no stitch records."};$(0,0,"END"),Lt(S,E);let p=0;for(const l of S)l.command==="COLOR_CHANGE"&&(p+=1);const q=[];g!==p&&q.push(`PEC header color change count (${g}) disagrees with stitch records (${p} color changes). Using stitch records.`);const T=n.name||n.Name||i.replace(/\.[^.]+$/,"");return{ok:!0,design:nt({format:"pes",filename:i,label:T,stitches:S,threads:E,warnings:q,headerMetadata:n})}}const Ht=10*1024*1024;function Qt(e,i){try{const r=e instanceof Uint8Array?e:new Uint8Array(e);if(r.byteLength===0)return{ok:!1,error:"The selected file is empty (0 bytes). Please choose a valid .dst or .pes embroidery file."};if(r.byteLength>Ht)return{ok:!1,error:`File exceeds the 10 MB limit (${(r.byteLength/(1024*1024)).toFixed(1)} MB). Please upload a .dst or .pes file under 10 MB.`};if(r.byteLength>=3&&r[0]===255&&r[1]===216&&r[2]===255)return{ok:!1,error:"Unsupported file content: this file is a JPEG image, not a .dst or .pes embroidery file."};if(r.byteLength>=4&&r[0]===137&&r[1]===80&&r[2]===78&&r[3]===71)return{ok:!1,error:"Unsupported file content: this file is a PNG image, not a .dst or .pes embroidery file."};const t=i.trim().toLowerCase();return t.endsWith(".dst")?Dt(r,i):t.endsWith(".pes")?_t(r,i):{ok:!1,error:"Unsupported file format. Please select a Tajima (.dst) or Brother (.pes) embroidery file."}}catch(r){return{ok:!1,error:`Could not read embroidery file: ${r instanceof Error?r.message:"Unknown parsing error"}`}}}function ze(e,i,r){const t=e.getContext("2d");if(!t)return;const n=typeof window<"u"&&window.devicePixelRatio?window.devicePixelRatio:1,a=e.clientWidth||320,s=e.clientHeight||220;e.width=Math.round(a*n),e.height=Math.round(s*n),t.setTransform(n,0,0,n,0,0),t.fillStyle="#f8fafc",t.fillRect(0,0,a,s),t.strokeStyle="#e2e8f0",t.lineWidth=1;const c=20;for(let p=c;p<a;p+=c)t.beginPath(),t.moveTo(p,0),t.lineTo(p,s),t.stroke();for(let p=c;p<s;p+=c)t.beginPath(),t.moveTo(0,p),t.lineTo(a,p),t.stroke();const h=20,x=Math.max(40,a-h*2),f=Math.max(40,s-h*2);if(!i||i.blocks.length===0||i.normalStitches===0){const p=(r==null?void 0:r.widthMm)||88.9,q=(r==null?void 0:r.heightMm)||50.8,T=Math.max(1,Math.min(12,(r==null?void 0:r.colors)||3)),A=(r==null?void 0:r.stitches)??8e3,l=Math.min((x-28)/Math.max(1,p),(f-28)/Math.max(1,q)),k=Math.max(44,Math.min(x-16,p*l)),v=Math.max(36,Math.min(f-24,q*l)),b=a/2,m=s/2-4,L=b-k/2,M=m-v/2,F=Math.min(a*.44,Math.max(k*.66,72)),_=Math.min(s*.41,Math.max(v*.72,54));t.save(),t.strokeStyle="#cbd5e1",t.lineWidth=6,t.beginPath(),t.ellipse(b,m,F,_,0,0,Math.PI*2),t.stroke(),t.strokeStyle="#94a3b8",t.lineWidth=1.5,t.beginPath(),t.ellipse(b,m,F-3.5,_-3.5,0,0,Math.PI*2),t.stroke(),t.fillStyle="#94a3b8",t.fillRect(b-10,m-_-7,20,6),t.restore();const W=["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"],K=Math.min(k,v)*.34;if(t.save(),t.strokeStyle=W[0],t.lineWidth=Math.max(3,K*.22),t.setLineDash([2,1.5]),t.beginPath(),t.ellipse(b,m,k*.38,v*.34,0,0,Math.PI*2),t.stroke(),t.restore(),T>=2){t.save(),t.strokeStyle=W[1],t.lineWidth=1.35;const ee=k*.28,Y=v*.23;for(let G=-Y+3;G<=Y-3;G+=3.2){const z=Math.max(0,1-G*G/(Y*Y)),Z=ee*Math.sqrt(z);t.beginPath(),t.moveTo(b-Z,m+G),t.lineTo(b+Z,m+G),t.stroke()}t.restore()}if(T>=3){t.save(),t.strokeStyle=W[2],t.fillStyle=W[2],t.lineWidth=2;const ee=Math.min(k,v)*.16;t.beginPath();for(let Y=0;Y<10;Y++){const G=Y%2===0?ee:ee*.45,z=Y*Math.PI/5-Math.PI/2,Z=b+Math.cos(z)*G,be=m+Math.sin(z)*G;Y===0?t.moveTo(Z,be):t.lineTo(Z,be)}t.closePath(),t.fill(),t.restore()}t.strokeStyle="#475569",t.setLineDash([4,3]),t.lineWidth=1.25,t.strokeRect(L,M,k,v),t.setLineDash([]);const B=22,j=Math.min(a-16,290),ce=(a-j)/2,ie=s-B-6;t.fillStyle="rgba(15, 23, 42, 0.84)",t.beginPath(),t.roundRect(ce,ie,j,B,11),t.fill(),t.fillStyle="#ffffff",t.font="600 11.5px system-ui, -apple-system, sans-serif",t.textAlign="center",t.textBaseline="middle";const de=`${A.toLocaleString()} sts · ${(p/25.4).toFixed(2)}" × ${(q/25.4).toFixed(2)}" (${p.toFixed(1)}×${q.toFixed(1)} mm)`;t.fillText(de,a/2,ie+B/2);return}const{minX:g,minY:y,maxX:C,maxY:E}=i.boundsMm,w=Math.max(.5,C-g),S=Math.max(.5,E-y),u=Math.min(x/w,f/S),N=h+(x-w*u)/2-g*u,$=h+(f-S*u)/2-y*u;t.lineCap="round",t.lineJoin="round",t.lineWidth=Math.max(.9,Math.min(1.8,u*.35));for(const p of i.blocks){t.strokeStyle=p.color.hex||"#1d4ed8",t.beginPath();for(const q of p.segments){const T=q.points;if(T.length!==0){t.moveTo(T[0].x*u+N,T[0].y*u+$);for(let A=1;A<T.length;A++)t.lineTo(T[A].x*u+N,T[A].y*u+$)}}t.stroke()}}function R(e){return`$${e.toFixed(2)}`}function Ut(e,i){const r=(i.widthMm/25.4).toFixed(2),t=(i.heightMm/25.4).toFixed(2),n=Math.round(e.breakDiscount*100),a=[`EMBROIDERY JOB QUOTE — ${i.designName||"Custom Design"}`,"----------------------------------------",`Quantity: ${e.quantity} pcs (Tier ${e.activeBreak.label}, ${n}% break)`,`Design: ${e.stitches.toLocaleString()} stitches | ${e.colors} color(s) (${e.colorChanges} color change(s))`,`Dimensions: ${r}" × ${t}" (${i.widthMm.toFixed(1)} × ${i.heightMm.toFixed(1)} mm)`,"","PRICING BREAKDOWN",`- Decoration per piece: ${R(e.decorationPerPiece)}${e.minimumApplied?" (minimum applied)":""}`];i.customerSuppliesGarment?a.push("- Garment: Customer-supplied ($0.00)"):a.push(`- Garment per piece: ${R(e.garmentPerPiece)} (cost ${R(i.garmentCost)} + ${Math.round(i.garmentMarkup*100)}% markup)`),a.push(`- Total price per piece: ${R(e.perPiece)}`),e.setupFeeApplied>0&&a.push(`- One-time setup fee: ${R(e.setupFeeApplied)}`),a.push(`- ORDER TOTAL (${e.quantity} pcs): ${R(e.orderTotal)}`),a.push(""),a.push("QUANTITY PRICE BREAKS (Per Piece / Order Total)");for(const s of e.breakTable){const c=Math.round(s.discount*100);a.push(`  ${s.label.padEnd(7," ")} (${String(c).padStart(2," ")}% off): ${R(s.perPiece)}/pc  (${s.minQty} pcs = ${R(s.sampleOrderTotal)})`)}return a.join(`
`)}const Gt=`
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
          <span class="starting-values-tag">${Ge}</span>
        </summary>
        <div class="rates-body">
          <p class="rates-note">
            <strong>${Ge}.</strong> Changes save automatically in this browser for your next visit.
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

        <!-- Shop Production Economics & Estimated Contribution Margin Bar (Internal Only — Hidden on Customer Quote Print) -->
        <div class="profit-summary-bar no-print" aria-label="Shop Production Economics and Estimated Contribution Margin">
          <div class="profit-bar-item">
            <span class="profit-bar-label">Est. Contribution Margin / Pc</span>
            <strong id="out-net-margin-pc" class="profit-bar-value">$11.15/pc</strong>
            <span id="out-direct-cost-sub" class="profit-bar-sub">After $0.25 supplies &amp; $0.30 hooping labor</span>
          </div>
          <div class="profit-bar-item">
            <span class="profit-bar-label">Est. Order Contribution Margin</span>
            <strong id="out-net-order-profit" class="profit-bar-value">$267.60</strong>
            <span class="profit-bar-sub">Before fixed overhead, depreciation &amp; setup labor</span>
          </div>
          <div class="profit-bar-item">
            <span class="profit-bar-label">Est. Margin / Machine-Hr</span>
            <strong id="out-net-hourly-profit" class="profit-bar-value">$46.76/hr</strong>
            <span class="profit-bar-sub">Estimated contribution per machine-hour</span>
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
`;function Wt(e){e.querySelector("#pricer-app-container")||(e.innerHTML=Gt);const i=e.getAttribute("data-tool-preset");let r=null;if(i)try{r=JSON.parse(i)}catch{r=null}const t=Bt();let n=t.rates,a=null,s=null;const c=e.querySelector("#drop-zone"),h=e.querySelector("#design-file-input"),x=e.querySelector("#btn-manual-mode"),f=e.querySelector("#loaded-file-badge"),g=e.querySelector("#file-error-alert"),y=e.querySelector("#file-warning-alert"),C=e.querySelector("#stitch-preview-canvas"),E=e.querySelector("#thread-swatches"),w=e.querySelector("#input-design-name"),S=e.querySelector("#input-stitches"),u=e.querySelector("#input-colors"),N=e.querySelector("#input-color-changes"),$=e.querySelector("#input-jumps"),p=e.querySelector("#input-trims"),q=e.querySelector("#input-width-in"),T=e.querySelector("#input-width-mm"),A=e.querySelector("#input-height-in"),l=e.querySelector("#input-height-mm"),k=e.querySelector("#input-minutes-override"),v=e.querySelector("#btn-reset-minutes"),b=e.querySelector("#input-quantity"),m=e.querySelector("#input-customer-garment"),L=e.querySelector("#input-garment-cost"),M=e.querySelector("#input-apply-setup"),F=e.querySelector("#input-setup-fee"),_=e.querySelector("#rate-per-1000"),W=e.querySelector("#rate-piece-fee"),K=e.querySelector("#rate-minimum"),B=e.querySelector("#rate-colors-included"),j=e.querySelector("#rate-extra-color-fee"),ce=e.querySelector("#rate-garment-markup"),ie=e.querySelector("#rate-machine-speed"),de=e.querySelector("#rate-change-seconds"),ee=e.querySelector("#rate-hooping-minutes"),Y=e.querySelector("#rate-heads"),G=e.querySelector("#rate-consumables"),z=e.querySelector("#rate-operator-wage"),Z=[0,1,2,3,4].map(o=>e.querySelector(`#break-discount-${o}`)),be=e.querySelector("#btn-reset-rates"),ot=e.querySelector("#storage-status-note"),st=e.querySelector("#out-per-piece"),lt=e.querySelector("#out-per-piece-sub"),ct=e.querySelector("#out-order-total"),dt=e.querySelector("#out-order-total-sub"),ut=e.querySelector("#out-hourly-rate"),pt=e.querySelector("#out-machine-time"),Be=e.querySelector("#out-net-margin-pc"),Ee=e.querySelector("#out-direct-cost-sub"),Ne=e.querySelector("#out-net-order-profit"),Te=e.querySelector("#out-net-hourly-profit"),Fe=e.querySelector("#break-table-body"),ne=e.querySelector("#quote-text-output"),ge=e.querySelector("#copy-feedback"),ht=e.querySelector("#btn-copy-quote"),mt=e.querySelector("#btn-print-quote"),Se=e.querySelector("#btn-toggle-print-view"),ft=e.querySelector("#print-design-subtitle"),Le=e.querySelector("#waitlist-link"),Ie=e.querySelector("#waitlist-inline-form"),ue=e.querySelector("#waitlist-email"),Pe=e.querySelector("#waitlist-shop-type"),ke=e.querySelector("#waitlist-top-feature"),ae=e.querySelector("#waitlist-feedback");function pe(o){if(!(typeof window>"u"||typeof fetch>"u")&&o!=="file_imported")try{const d=window.location.pathname||"/";fetch("/api/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:o,page:d}),keepalive:!0}).catch(()=>{})}catch{}}function $e(){_.value=n.ratePer1000Stitches.toFixed(2),W.value=n.pieceFee.toFixed(2),K.value=n.minimumPerPiece.toFixed(2),B.value=String(n.colorsIncluded),j.value=n.extraColorFee.toFixed(2),ce.value=String(Math.round(n.garmentMarkup*100)),ie.value=String(n.machineSpeed),de.value=String(n.colorChangeSeconds),ee.value=String(n.hoopingMinutes),Y.value=String(n.heads),G&&(G.value=(n.consumablesCostPerPiece??.25).toFixed(2)),z&&(z.value=(n.operatorHourlyWage??18).toFixed(2)),n.quantityBreaks.forEach((o,d)=>{Z[d]&&(Z[d].value=String(Math.round(o.discount*100)))}),t.defaultSetupFee>0&&Number(F.value)===0&&(F.value=t.defaultSetupFee.toFixed(2))}function bt(){const o=(I,Q,J=0)=>{if(!I)return Q;const H=Number.parseFloat(I.value);return Number.isFinite(H)&&H>=J?H:Q},d=Ce();return{ratePer1000Stitches:o(_,d.ratePer1000Stitches,0),pieceFee:o(W,d.pieceFee,0),minimumPerPiece:o(K,d.minimumPerPiece,0),colorsIncluded:Math.floor(o(B,d.colorsIncluded,0)),extraColorFee:o(j,d.extraColorFee,0),quantityBreaks:d.quantityBreaks.map((I,Q)=>{const J=o(Z[Q],I.discount*100,0);return{...I,discount:Math.min(.95,Math.max(0,J/100))}}),garmentMarkup:o(ce,d.garmentMarkup*100,0)/100,machineSpeed:o(ie,d.machineSpeed,1),colorChangeSeconds:o(de,d.colorChangeSeconds,0),hoopingMinutes:o(ee,d.hoopingMinutes,0),heads:Math.max(1,Math.floor(o(Y,d.heads,1))),consumablesCostPerPiece:o(G,d.consumablesCostPerPiece??.25,0),operatorHourlyWage:o(z,d.operatorHourlyWage??18,0)}}function gt(){const o=Math.max(1,Math.floor(Number(u.value)||1));E.innerHTML="";for(let d=0;d<Math.min(o,24);d++){const I=a==null?void 0:a.threads[d],Q=(I==null?void 0:I.hex)??["#1d4ed8","#dc2626","#15803d","#d97706","#7c3aed","#0f766e"][d%6],J=(I==null?void 0:I.description)??`Color ${d+1}`,H=document.createElement("span");H.className="swatch-pill",H.title=`${d+1}. ${J} (${Q})`;const te=document.createElement("span");te.className="swatch-dot",te.style.backgroundColor=Q;const re=document.createElement("span");re.textContent=`${d+1}. ${J}`,H.appendChild(te),H.appendChild(re),E.appendChild(H)}}let qe;function U(){n=bt();const o=Et({rates:n,defaultSetupFee:Number.parseFloat(F.value)||0});ot.textContent=o?"Settings saved locally in browser":"Browser storage blocked — using session settings",L.disabled=m.checked,F.disabled=!M.checked;const d=Math.max(0,Math.floor(Number.parseFloat(S.value)||0)),I=Math.max(1,Math.floor(Number.parseFloat(u.value)||1)),Q=Math.max(0,Math.floor(Number.parseFloat(N.value)||0)),J=Math.max(1,Math.floor(Number.parseFloat(b.value)||1)),H=Math.max(0,Number.parseFloat(L.value)||0),te=Math.max(0,Number.parseFloat(F.value)||0),re={stitches:d,colors:I,colorChanges:Q,quantity:J,customerSuppliesGarment:m.checked,garmentCost:H,applySetupFee:M.checked,setupFee:te},P=Mt(re,n);if(s!==null&&s>0){const X=D(s);P.minutesPerPiece=X,P.minutesPerPieceRaw=X,P.orderMachineMinutes=D(X*P.quantity/n.heads),P.effectiveHourlyRate=D(P.decorationPerPiece/X*60),P.breakTable=P.breakTable.map(se=>({...se,effectiveHourlyRate:D(se.decorationPerPiece/X*60)})),v.hidden=!1}else k.value=P.minutesPerPiece.toFixed(2),v.hidden=!0;qe=P;const we=Math.round(P.breakDiscount*100);st.textContent=R(P.perPiece),lt.textContent=`Decoration ${R(P.decorationPerPiece)}${P.minimumApplied?" (min)":""} · Garment ${R(P.garmentPerPiece)} (${we}% break)`,ct.textContent=R(P.orderTotal),dt.textContent=`${P.quantity} ${P.quantity===1?"piece":"pieces"} · ${R(P.setupFeeApplied)} setup fee`,ut.textContent=`${R(P.effectiveHourlyRate)}/hr`,pt.textContent=`${P.minutesPerPiece.toFixed(2)} min/pc · ${P.orderMachineMinutes.toFixed(2)} min order (${n.heads} head${n.heads>1?"s":""})`,Be&&(Be.textContent=`${R(P.netMarginPerPiece)}/pc`),Ee&&(Ee.textContent=`After ${R(P.consumablesPerPiece)} supplies & ${R(P.laborPerPiece)} hooping labor`),Ne&&(Ne.textContent=R(P.netOrderProfit)),Te&&(Te.textContent=`${R(P.netHourlyProfit)}/hr`),ft.textContent=`${w.value||"Custom Design"} · ${P.quantity} pcs · ${P.stitches.toLocaleString()} stitches`,Fe.innerHTML="";for(const X of P.breakTable){const se=document.createElement("tr");X.label===P.activeBreak.label&&(se.className="active-break-row");const xt=Math.round(X.discount*100);se.innerHTML=`
        <td><strong>${X.label}</strong></td>
        <td>${xt}%</td>
        <td>${R(X.decorationPerPiece)}</td>
        <td><strong>${R(X.perPiece)}</strong></td>
        <td>${R(X.sampleOrderTotal)}</td>
        <td class="no-print">${R(X.effectiveHourlyRate)}/hr</td>
      `,Fe.appendChild(se)}const ye=Math.max(.1,Number.parseFloat(T.value)||88.9),Ue=Math.max(.1,Number.parseFloat(l.value)||50.8);return Math.max(0,Math.floor(Number.parseFloat($.value)||0)),Math.max(0,Math.floor(Number.parseFloat(p.value)||0)),ne.value=Ut(P,{designName:w.value.trim()||"Custom Design",widthMm:ye,heightMm:Ue,customerSuppliesGarment:m.checked,garmentCost:H,garmentMarkup:n.garmentMarkup,heads:n.heads,machineSpeed:n.machineSpeed}),gt(),ze(C,a,{widthMm:ye,heightMm:Ue,stitches:d,colors:I}),P}function De(o){a=o,s=null,g.hidden=!0,g.textContent="",o.warnings.length>0?(y.hidden=!1,y.textContent=o.warnings.join(" ")):(y.hidden=!0,y.textContent=""),f.textContent=`Loaded ${o.format.toUpperCase()}: ${o.filename}`,w.value=o.label||o.filename,S.value=String(o.normalStitches),u.value=String(o.threadBlocks),N.value=String(o.colorChanges),$.value=String(o.jumps),p.value=String(o.trims),T.value=o.widthMm.toFixed(1),q.value=o.widthIn.toFixed(2),l.value=o.heightMm.toFixed(1),A.value=o.heightIn.toFixed(2),U()}function Re(o){g.hidden=!1,g.textContent=o,y.hidden=!0,y.textContent=""}let oe=null,yt=0;const he=new Map;function Oe(){if(oe)return oe;if(typeof Worker>"u")return null;try{return oe=new Worker(new URL("/assets/worker-BKXLW0pr.js",import.meta.url),{type:"module"}),oe.addEventListener("message",o=>{const d=he.get(o.data.id);d&&(he.delete(o.data.id),d.resolve(o.data))}),oe.addEventListener("error",o=>{for(const[,d]of he)d.reject(o);he.clear()}),oe}catch{return null}}async function Ae(o,d){let I;if(o instanceof ArrayBuffer)I=o;else{const H=new Uint8Array(o.byteLength);H.set(o),I=H.buffer}const Q=Oe();if(Q)try{const H=++yt,te=I.slice(0),re=await new Promise((P,we)=>{he.set(H,{resolve:P,reject:we});const ye={id:H,filename:d,buffer:te};Q.postMessage(ye,[te])});re.ok?De(re.design):Re(re.error);return}catch{}const J=Qt(I,d);J.ok?De(J.design):Re(J.error)}async function _e(o){if(!o)return;const d=await o.arrayBuffer();await Ae(d,o.name)}c.addEventListener("click",()=>{h.click()}),c.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),h.click())}),c.addEventListener("dragover",o=>{o.preventDefault(),c.classList.add("drag-over")}),c.addEventListener("dragleave",()=>{c.classList.remove("drag-over")}),c.addEventListener("drop",o=>{var I,Q;o.preventDefault(),c.classList.remove("drag-over");const d=(Q=(I=o.dataTransfer)==null?void 0:I.files)==null?void 0:Q[0];_e(d)}),h.addEventListener("change",()=>{var d;const o=(d=h.files)==null?void 0:d[0];_e(o),h.value=""}),x.addEventListener("click",()=>{a=null,s=null,g.hidden=!0,y.hidden=!0,f.textContent="Mode: Manual stitch count entry",S.focus(),S.select(),U()}),q.addEventListener("input",()=>{const o=Number.parseFloat(q.value);Number.isFinite(o)&&o>=0&&(T.value=(o*25.4).toFixed(1)),U()}),T.addEventListener("input",()=>{const o=Number.parseFloat(T.value);Number.isFinite(o)&&o>=0&&(q.value=(o/25.4).toFixed(2)),U()}),A.addEventListener("input",()=>{const o=Number.parseFloat(A.value);Number.isFinite(o)&&o>=0&&(l.value=(o*25.4).toFixed(1)),U()}),l.addEventListener("input",()=>{const o=Number.parseFloat(l.value);Number.isFinite(o)&&o>=0&&(A.value=(o/25.4).toFixed(2)),U()}),u.addEventListener("input",()=>{const o=Math.max(1,Math.floor(Number.parseFloat(u.value)||1));N.value=String(Math.max(0,o-1)),s=null,U()}),N.addEventListener("input",()=>{s=null,U()}),S.addEventListener("input",()=>{s=null,U()}),k.addEventListener("input",()=>{const o=Number.parseFloat(k.value);Number.isFinite(o)&&o>0?s=o:s=null,U()}),v.addEventListener("click",()=>{s=null,U()});const vt=[w,$,p,b,m,L,M,F,_,W,K,B,j,ce,ie,de,ee,Y,...G?[G]:[],...z?[z]:[],...Z];let He=!1;for(const o of vt)o.addEventListener("input",()=>{U()}),o.addEventListener("change",()=>{He||(He=!0,pe("calculation_edited")),U()});if(be.addEventListener("click",()=>{Nt(),n=Ce(),$e(),U()}),ht.addEventListener("click",async()=>{pe("quote_copied");const o=ne.value;try{navigator.clipboard&&navigator.clipboard.writeText?await navigator.clipboard.writeText(o):(ne.focus(),ne.select(),document.execCommand("copy")),ge.textContent="Quote copied to clipboard!"}catch{ne.focus(),ne.select(),ge.textContent="Selected quote text — press Ctrl+C / Cmd+C to copy"}setTimeout(()=>{ge.textContent&&(ge.textContent="")},3e3)}),mt.addEventListener("click",()=>{pe("quote_printed"),window.print()}),Le&&Le.addEventListener("click",()=>{pe("waitlist_clicked"),ue&&setTimeout(()=>ue.focus(),50)}),Ie&&ue&&ae&&Ie.addEventListener("submit",async o=>{o.preventDefault();const d=ue.value.trim();if(!d||!d.includes("@")){ae.textContent="Please enter a valid email address.";return}const I=(Pe==null?void 0:Pe.value)??"Single-head home/prosumer",Q=(ke==null?void 0:ke.value)??"Branded PDF quotes with shop logo";ae.textContent="Saving your spot...";try{(await fetch("/api/waitlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:d,shopType:I,topFeature:Q,page:typeof window<"u"?window.location.pathname:"/"})})).ok?(ae.textContent="You're on the $19.99 Pro early-access list!",ue.value=""):ae.textContent="Saved locally — we'll notify you when Pro launches!"}catch{ae.textContent="Saved locally — we'll notify you when Pro launches!"}}),typeof document<"u"&&document.querySelectorAll("[data-affiliate-slot]").forEach(o=>{o.addEventListener("click",()=>{pe("supply_clicked")})}),Se.addEventListener("click",()=>{const o=document.body.classList.toggle("print-preview-mode");Se.setAttribute("aria-pressed",String(o)),Se.textContent=o?"Exit Print View":"Preview Print View"}),typeof window<"u"&&window.addEventListener("resize",()=>{ze(C,a,{widthMm:Number.parseFloat(T.value)||88.9,heightMm:Number.parseFloat(l.value)||50.8,stitches:Number.parseFloat(S.value)||8e3,colors:Number.parseFloat(u.value)||3})}),Oe(),$e(),r&&(r.modeBadge&&(f.textContent=r.modeBadge),r.designName&&(w.value=r.designName),typeof r.stitches=="number"&&(S.value=String(r.stitches)),typeof r.colors=="number"&&(u.value=String(r.colors)),typeof r.colorChanges=="number"&&(N.value=String(r.colorChanges)),typeof r.widthIn=="number"&&(q.value=r.widthIn.toFixed(2)),typeof r.widthMm=="number"&&(T.value=r.widthMm.toFixed(1)),typeof r.heightIn=="number"&&(A.value=r.heightIn.toFixed(2)),typeof r.heightMm=="number"&&(l.value=r.heightMm.toFixed(1)),typeof r.quantity=="number"&&(b.value=String(r.quantity)),typeof r.customerSuppliesGarment=="boolean"&&(m.checked=r.customerSuppliesGarment),typeof r.garmentCost=="number"&&(L.value=r.garmentCost.toFixed(2)),typeof r.applySetupFee=="boolean"&&(M.checked=r.applySetupFee),typeof r.setupFee=="number"&&(F.value=r.setupFee.toFixed(2)),r.openRatesByDefault)){const o=e.querySelector("#rate-settings-details");o&&(o.open=!0)}U();const Qe={loadFileBuffer:Ae,getQuote:()=>qe,getRates:()=>n,recalculate:U};return typeof window<"u"&&(window.__embroideryTool=Qe),Qe}const Ze="embroidery_pricer_first_visit_day_v1",et="embroidery_pricer_last_return_day_v1",tt="embroidery_pricer_session_v1";function Yt(e,i){if(e.length!==0)try{fetch("/api/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({events:e,page:i}),keepalive:!0}).catch(()=>{})}catch{}}function rt(){var x,f,g,y,C,E,w;let e=!1,i=!1,r=!1;const t=new Date().toISOString().slice(0,10);try{e=!!((x=window.localStorage)!=null&&x.getItem(xe));const S=(f=window.localStorage)==null?void 0:f.getItem(Ze);S?S!==t&&((y=window.localStorage)==null?void 0:y.getItem(et))!==t&&(i=!0,(C=window.localStorage)==null||C.setItem(et,t)):(g=window.localStorage)==null||g.setItem(Ze,t),(E=window.sessionStorage)!=null&&E.getItem(tt)||(r=!0,(w=window.sessionStorage)==null||w.setItem(tt,"1"))}catch{e=!1}const n=document.getElementById("embroidery-tool-root");n&&Wt(n);const a=typeof window<"u"&&window.location.pathname||"/",s=["page_view"];r&&s.push("unique_session"),e&&s.push("returning_visit"),i&&s.push("return_session_separate_day"),Yt(s,a);const c=document.getElementById("sticky-jump-wrapper"),h=document.getElementById("btn-close-jump-pill");c&&h&&h.addEventListener("click",S=>{S.preventDefault(),S.stopPropagation(),c.hidden=!0,c.style.display="none"})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",rt):rt();
