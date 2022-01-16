(this.webpackJsonpbmol2d=this.webpackJsonpbmol2d||[]).push([[0],{108:function(e,t,n){},116:function(e,t,n){},117:function(e,t,n){"use strict";n.r(t);var i,r=n(2),a=n.n(r),s=n(29),c=n.n(s),o=(n(108),n(12)),u=n(8),l=n(1),h=n(5),d=n(6),f=function(){function e(t,n,i){Object(h.a)(this,e),this.x=t,this.y=n,this.z=i,this.x=t||0,this.y=n||0,this.z=i||0}return Object(d.a)(e,[{key:"negative",value:function(){return new e(-this.x,-this.y,-this.z)}},{key:"add",value:function(t){return t instanceof e?new e(this.x+t.x,this.y+t.y,this.z+t.z):new e(this.x+t,this.y+t,this.z+t)}},{key:"subtract",value:function(t){return t instanceof e?new e(this.x-t.x,this.y-t.y,this.z-t.z):new e(this.x-t,this.y-t,this.z-t)}},{key:"multiply",value:function(t){return t instanceof e?new e(this.x*t.x,this.y*t.y,this.z*t.z):new e(this.x*t,this.y*t,this.z*t)}},{key:"divide",value:function(t){return t instanceof e?new e(this.x/t.x,this.y/t.y,this.z/t.z):new e(this.x/t,this.y/t,this.z/t)}},{key:"equals",value:function(e){return this.x==e.x&&this.y==e.y&&this.z==e.z}},{key:"dot",value:function(e){return this.x*e.x+this.y*e.y+this.z*e.z}},{key:"cross",value:function(t){return new e(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}},{key:"length",value:function(){return Math.sqrt(this.dot(this))}},{key:"magnitude",value:function(){return this.length()}},{key:"unit",value:function(){return this.divide(this.length())}},{key:"min",value:function(){return Math.min(Math.min(this.x,this.y),this.z)}},{key:"max",value:function(){return Math.max(Math.max(this.x,this.y),this.z)}},{key:"toAngles",value:function(){return{theta:Math.atan2(this.z,this.x),phi:Math.asin(this.y/this.length())}}},{key:"angleTo",value:function(e){return Math.acos(this.dot(e)/(this.length()*e.length()))}},{key:"toArray",value:function(e){return[this.x,this.y,this.z].slice(0,e||3)}},{key:"toCoord",value:function(){return new y(this.x,this.y,this.z)}},{key:"clone",value:function(){return new e(this.x,this.y,this.z)}},{key:"init",value:function(e,t,n){return this.x=e,this.y=t,this.z=n,this}},{key:"normalize",value:function(){return this.unit()}},{key:"setIndex",value:function(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t}}},{key:"distanceTo",value:function(e){return Math.sqrt(Math.pow(this.x-e.x,2)+Math.pow(this.y-e.y,2)+Math.pow(this.z-e.z,2))}}],[{key:"negative",value:function(e,t,n){return t.x=-e.x,t.y=-e.y,t.z=-e.z,t}},{key:"add",value:function(t,n,i){return n instanceof e?(i.x=t.x+n.x,i.y=t.y+n.y,i.z=t.z+n.z):(i.x=t.x+n,i.y=t.y+n,i.z=t.z+n),i}},{key:"subtract",value:function(t,n,i){return n instanceof e?(i.x=t.x-n.x,i.y=t.y-n.y,i.z=t.z-n.z):(i.x=t.x-n,i.y=t.y-n,i.z=t.z-n),i}},{key:"multiply",value:function(t,n,i){return n instanceof e?(i.x=t.x*n.x,i.y=t.y*n.y,i.z=t.z*n.z):(i.x=t.x*n,i.y=t.y*n,i.z=t.z*n),i}},{key:"divide",value:function(t,n,i){return n instanceof e?(i.x=t.x/n.x,i.y=t.y/n.y,i.z=t.z/n.z):(i.x=t.x/n,i.y=t.y/n,i.z=t.z/n),i}},{key:"cross",value:function(e,t,n){return n.x=e.y*t.z-e.z*t.y,n.y=e.z*t.x-e.x*t.z,n.z=e.x*t.y-e.y*t.x,n}},{key:"unit",value:function(e,t,n){var i=e.length();return t.x=e.x/i,t.y=e.y/i,t.z=e.z/i,t}},{key:"fromAngles",value:function(t,n){return new e(Math.cos(t)*Math.cos(n),Math.sin(n),Math.sin(t)*Math.cos(n))}},{key:"randomDirection",value:function(){return e.fromAngles(Math.random()*Math.PI*2,Math.asin(2*Math.random()-1))}},{key:"min",value:function(t,n,i){return new e(Math.min(t.x,n.x),Math.min(t.y,n.y),Math.min(t.z,n.z))}},{key:"max",value:function(t,n,i){return new e(Math.max(t.x,n.x),Math.max(t.y,n.y),Math.max(t.z,n.z))}},{key:"lerp",value:function(e,t,n){return t.subtract(e).multiply(n).add(e)}},{key:"fromArray",value:function(t){return new e(t[0],t[1],t[2])}},{key:"angleBetween",value:function(e,t,n){return e.angleTo(t)}},{key:"infinity",value:function(){return new e(1/0,1/0,1/0)}}]),e}(),y=function(){function e(t,n,i){Object(h.a)(this,e),this.x=t,this.y=n,this.z=i}return Object(d.a)(e,[{key:"toVec",value:function(){return f.fromArray(this.toArray())}},{key:"toArray",value:function(){return[this.x,this.y,this.z]}}]),e}();!function(e){e.A="\u03b1",e.B="\u03b2",e.G="\u03b3",e.D="\u03b4",e.E="\u03b5",e.Z="\u03b6",e.H="\u03b7"}(i||(i={}));var v,m,b,x,p=function(){function e(){Object(h.a)(this,e),this.center=void 0,this.interactions=void 0,this.atoms=void 0,this.v=void 0,this.o=void 0,this.hash=void 0,this.name=void 0,this.sequenceNumber=void 0,this.polymerChainIdentifier=void 0,this.atoms=[],this.name="",this.sequenceNumber=-1,this.center=new y(-1,-1,-1),this.hash="",this.interactions=[],this.polymerChainIdentifier="",this.v=f.infinity(),this.o=f.infinity()}return Object(d.a)(e,[{key:"findAtomsByNames",value:function(e){var t=[];return this.atoms.forEach((function(n){-1!==e.indexOf(n.name)&&t.push(n)})),t.sort((function(t,n){return e.indexOf(t.name)-e.indexOf(n.name)})),t}}]),e}();!function(e){e.DA="DA",e.DG="DG",e.DC="DC",e.DT="DT"}(v||(v={})),function(e){e.A="A",e.C="C",e.G="G",e.I="I",e.U="U"}(m||(m={})),function(e){e[e.Ala=0]="Ala",e[e.Arg=1]="Arg",e[e.Asn=2]="Asn",e[e.Asp=3]="Asp",e[e.Cys=4]="Cys",e[e.Glu=5]="Glu",e[e.Gln=6]="Gln",e[e.Gly=7]="Gly",e[e.His=8]="His",e[e.Ile=9]="Ile",e[e.Leu=10]="Leu",e[e.Lys=11]="Lys",e[e.Met=12]="Met",e[e.Phe=13]="Phe",e[e.Pro=14]="Pro",e[e.Ser=15]="Ser",e[e.Thr=16]="Thr",e[e.Trp=17]="Trp",e[e.Tyr=18]="Tyr",e[e.Val=19]="Val"}(b||(b={})),function(e){e.DNA="DNA",e.RNA="RNA",e.Protein="Protein",e.Unknown="Unknown"}(x||(x={}));var j=n(0),g={polymers:[],pdb:void 0,isLoading:!1,simpleStuffy:"",hashedNucleicAcidResidues:{},viz:{chain1:null,chain2:null},currentPDBId:"",selectedResidue:void 0,error:""},O=Object(r.createContext)([g,function(){}]),k=function(e,t){var n=t.type,i=t.payload;switch(n){case"resetState":return Object(o.a)({},g);default:if(!(n in e))throw new Error("".concat(n," not found in state"));e[n]=i}return Object(o.a)({},e)},w=function(e){var t=e.children,n=Object(r.useReducer)(k,g),i=Object(u.a)(n,2),a=i[0],s=i[1];return Object(j.jsx)(O.Provider,{value:[a,s],children:t})},A=n(15);function z(e){return e.residues.forEach((function(t,n){var i=new y(0,0,0);t.atoms.forEach((function(e){i.x+=e.coords.x,i.y+=e.coords.y,i.z+=e.coords.z})),i.x=i.x/t.atoms.length,i.y=i.y/t.atoms.length,i.z=i.z/t.atoms.length,e.residues[n].center=i})),e}function N(e,t){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2)+Math.pow(e.z-t.z,2))}var C;!function(e){e[e.Threshold=0]="Threshold",e[e.HBond=1]="HBond"}(C||(C={}));var D=function(e){if(-1!=[x.DNA,x.RNA].indexOf(e.kind)){var t=["C2","C4","C6"];e.residues.forEach((function(e){var n=[];if(e.findAtomsByNames(t).forEach((function(e,t){n[t]=e.coords})),3===n.length){var i=f.fromArray(n[0].toArray()),r=f.fromArray(n[1].toArray()),a=f.fromArray(n[2].toArray()),s=r.subtract(i).cross(a.subtract(i)).normalize(),c=i.add(r).add(a).divide(3);e.v=s,e.o=c}}))}return e};function I(e,t){for(var n=[[v.DA,v.DT],[v.DA,m.U],[v.DT,m.A],[v.DC,v.DG],[v.DC,m.G],[v.DG,v.DC],[v.DG,m.C],[m.C,m.G],[m.A,m.U]],i=0;i<n.length;i++)if(e.name===n[i][0]&&t.name===n[i][1]||e.name===n[i][1]&&t.name===n[i][0])return!0;return!1}var E,M=function(){function e(t){Object(h.a)(this,e),this.polymers=t,this.nucleicAcids=[],this.proteins=[],this.hasValidDNA=!1,this.hasValidRNA=!1,this.visualization={chain1:null,chain2:null},this.prepareObjects()}return Object(d.a)(e,[{key:"generateWatsonCrickPairs",value:function(e,t){var n=this.calculateWatsonCrickPairs(e,t),i=this.calculateWatsonCrickPairs(t,e);i.reverse();var r=n;return i.forEach((function(e){if(1===e.length)r.push(e);else if(2===e.length){for(var t=!1,i=0;i<n.length;i++){var a=n[i];if(2===a.length&&a[0].hash===e[1].hash&&a[1].hash===e[0].hash){t=!0;break}}t||console.log("watsonCrickPairs: matching pair was not found ".concat(e[1].polymerChainIdentifier,":").concat(e[1].sequenceNumber).concat(e[1].name,"---").concat(e[0].polymerChainIdentifier,":").concat(e[0].sequenceNumber).concat(e[0].name),e)}})),r}},{key:"watsonCrickPairs",value:function(){if(this.nucleicAcids.length<=0)throw Error("Nucleic acids are not initialized");for(var e=[],t=0;t<this.nucleicAcids.length;t++){for(var n=t+1;n<this.nucleicAcids.length;n++){var i=this.generateWatsonCrickPairs(this.nucleicAcids[t],this.nucleicAcids[n]);e.push.apply(e,Object(A.a)(i))}if(this.nucleicAcids[t].kind===x.RNA){var r=this.generateWatsonCrickPairs(this.nucleicAcids[t],this.nucleicAcids[t]);console.log("SIMILAR PAIRS",r),e.push.apply(e,Object(A.a)(r))}}return e}},{key:"calculateWatsonCrickPairs",value:function(e,t){var n=[];return e.residues.forEach((function(i){var r,a=1/0;if(t.residues.forEach((function(e){var t=i.findAtomsByNames(["C2","C4","C6"]),n=[Math.abs(t[0].coords.toVec().subtract(e.o).dot(e.v)),Math.abs(t[1].coords.toVec().subtract(e.o).dot(e.v)),Math.abs(t[2].coords.toVec().subtract(e.o).dot(e.v))],s=e.findAtomsByNames(["C2","C4","C6"]),c=[Math.abs(s[0].coords.toVec().subtract(i.o).dot(i.v)),Math.abs(s[1].coords.toVec().subtract(i.o).dot(i.v)),Math.abs(s[2].coords.toVec().subtract(i.o).dot(i.v))],o=Math.max.apply(Math,c.concat(n));o<a&&i.hash!==e.hash&&(a=o,r=e)})),void 0!==r&&a<=1.42+Math.random()&&I(r,i)&&i.center.toVec().distanceTo(r.center.toVec())<15){n.push([i,r]);var s=r;console.log("Smallest distance: ","".concat(e.kind,"-").concat(i.polymerChainIdentifier,":").concat(i.sequenceNumber).concat(i.name),"".concat(t.kind,"-").concat(s.polymerChainIdentifier,":").concat(s.sequenceNumber).concat(s.name),a,I(r,i))}else n.push([i]),console.log("No pair for: ".concat(e.kind," ").concat(i.polymerChainIdentifier,":").concat(i.sequenceNumber).concat(i.name,", smallest distance: ").concat(a),r)})),n}},{key:"prepareObjects",value:function(){this.nucleicAcids=this.findNucleicAcids(),this.proteins=this.findProteins(),this.nucleicAcids.forEach((function(e){return z(e)})),this.proteins.forEach((function(e){return z(e)}))}},{key:"findProteins",value:function(){return this.polymers.filter((function(e){return-1!==[x.Protein].indexOf(e.kind)}))}},{key:"findNucleicAcids",value:function(){return this.polymers.filter((function(e){return-1!==[x.DNA,x.RNA].indexOf(e.kind)}))}},{key:"thresholdInteractions",value:function(){var e=this;this.nucleicAcids.forEach((function(t,n){t.residues.forEach((function(t,i){e.proteins.forEach((function(r){r.residues.forEach((function(a){N(t.center,a.center)<=10&&t.atoms.forEach((function(t){a.atoms.forEach((function(s){var c,o=N(t.coords,s.coords);o<=5&&e.nucleicAcids[n].residues[i].interactions.push({residue:(c=a,{sequenceNumber:c.sequenceNumber,hash:c.hash,name:c.name,polymerChainIdentifier:c.polymerChainIdentifier}),type:C.Threshold,polymerKind:r.kind,meta:{distance:o}})}))}))}))}))}))}))}}]),e}(),T=n(4);!function(e){e.Pair="pair",e.Backbone="backbone"}(E||(E={}));var P,R,S=10,B=4;var G=(P={},Object(l.a)(P,v.DA,"#fcb331"),Object(l.a)(P,v.DT,"#5670fb"),Object(l.a)(P,v.DG,"#f63c37"),Object(l.a)(P,v.DC,"#03c907"),Object(l.a)(P,m.A,"#acb331"),Object(l.a)(P,m.U,"#a670fb"),Object(l.a)(P,m.G,"#a63c37"),Object(l.a)(P,m.C,"#a3c907"),Object(l.a)(P,m.I,"#a3c907"),P),q="red",V="blue",L=(R={},Object(l.a)(R,v.DA,q),Object(l.a)(R,v.DT,q),Object(l.a)(R,v.DG,V),Object(l.a)(R,v.DC,V),Object(l.a)(R,m.A,q),Object(l.a)(R,m.U,q),Object(l.a)(R,m.G,V),Object(l.a)(R,m.C,V),Object(l.a)(R,m.I,V),R);function W(){var e=Object(r.useContext)(O),t=Object(u.a)(e,2),n=t[0],i=t[1],s=n.polymers,c=a.a.createRef(),l=a.a.createRef(),h=Object(r.useRef)(null);return Object(r.useEffect)((function(){if(c&&!(s.length<=0)){console.time("Nucleic_acid_VIZ");var e,t=new M(s);try{e=t.watsonCrickPairs()}catch(f){return console.log(f),void i({type:"error",payload:f.toString()})}var n=[],r=[],a=function(e){return"".concat(e.polymerChainIdentifier,":").concat(e.name).concat(e.sequenceNumber)};t.nucleicAcids.forEach((function(e){return function(e){var t=Object.values(v);e.residues.forEach((function(i,s){n.push(Object(o.a)(Object(o.a)({},i),{},{hash:i.hash,name:i.name.toString().slice(-1),id:a(i),color:G[i.name],group:t.indexOf(i.name)+1}));var c=e.residues;s>0&&s<c.length&&r.push({source:a(c[s-1]),target:a(i),value:1,color:"#494949",linkType:E.Backbone})}))}(e)})),e.forEach((function(e){var t=e[0];if(2===e.length){var n=e[1];r.push({source:a(n),target:a(t),value:1,color:L[t.name],linkType:E.Pair})}})),console.log("Vizualization data:",n,r);var u=[h.current.offsetWidth,h.current.offsetHeight],l=u[0],d=u[1];!function(e,t){var n=e.nodes,i=e.links,r=e.svgRef,a=e.dispatch,s=t.nodeId,c=void 0===s?function(e){return e.id}:s,o=(t.nodeGroups,t.nodeTitle),u=t.nodeFill,l=void 0===u?function(e){return void 0!==e.color?e.color:"currentColor"}:u,h=t.nodeStroke,d=void 0===h?"#fff":h,f=t.nodeStrokeWidth,y=void 0===f?1.5:f,v=t.nodeStrokeOpacity,m=void 0===v?1:v,b=t.nodeRadius,x=void 0===b?10:b,p=t.nodeStrength,j=t.linkStroke,g=void 0===j?function(e){return void 0!==e.color?e.color:"#444"}:j,O=t.linkStrokeOpacity,k=void 0===O?.6:O,w=t.linkStrokeWidth,A=void 0===w?1.5:w,z=t.linkStrokeLinecap,N=void 0===z?"round":z,C=t.linkStrength,D=void 0===C?2:C,I=t.width,M=void 0===I?640:I,P=t.height,R=void 0===P?400:P,G=t.invalidation,q=n,V=i,L=T.e(n,c).map((function(e){return null!==e&&"object"===typeof e?e.valueOf():e}));void 0===o&&(o=function(e,t){return L[t]});var W="function"!==typeof A?null:T.e(i,A);n=q,i=V;var _=T.c(),F=T.b(i).id((function(e){var t=e.index;return L[t]})).distance((function(e,t){return V[t].linkType===E.Backbone?5:70})).strength((function(e,t){return V[t].linkType===E.Backbone?5e3:1}));void 0!==p&&_.strength(p),void 0!==D&&F.strength(D);var H=T.d(n).force("link",F).force("charge",_).on("tick",(function(){Z.attr("x1",(function(e){return e.source.x})).attr("y1",(function(e){return e.source.y})).attr("x2",(function(e){return e.target.x})).attr("y2",(function(e){return e.target.y})),Y.attr("transform",(function(e){return"translate(".concat(e.x,", ").concat(e.y,")")}))})),U=T.f(r).attr("width",M).attr("height",R).attr("viewBox",[-M/2,-R/2,M,R]).attr("style","max-width: 100%; height: auto; height: intrinsic;");U.html("");var K=U.append("g"),Z=K.append("g").attr("stroke-opacity",k).attr("stroke-width","function"!==typeof A?A:null).attr("stroke-linecap",N).selectAll("line").data(i).join("line").attr("stroke-dasharray",(function(e){return"pair"===e.linkType?"4":null})).attr("stroke",g),Y=K.append("g").selectAll("g").data(n).enter().append("g").call(function(e){return T.a().on("start",(function(t){t.active||e.alphaTarget(.3).restart(),t.subject.fx=t.subject.x,t.subject.fy=t.subject.y})).on("drag",(function(e){e.subject.fx=e.x,e.subject.fy=e.y})).on("end",(function(t){t.active||e.alphaTarget(0),t.subject.fx=null,t.subject.fy=null}))}(H)),J=Y.append("circle").attr("stroke",d).attr("stroke-opacity",m).attr("stroke-width",y).attr("fill",l).attr("r",x),Q=new Date;Y.on("mouseover",(function(e,t){T.f(this).select("circle").attr("r",$(2*x)),(new Date).getTime()-Q.getTime()>250&&(a({type:"selectedResidue",payload:t}),Q=new Date)})).on("mouseout",(function(e,t){T.f(this).select("circle").attr("r",$(x)),(new Date).getTime()-Q.getTime()>50&&a({type:"selectedResidue",payload:void 0})}));var X=Y.append("text").text((function(e){return e.name})).attr("text-anchor","middle").attr("font-size",S).attr("y",B).attr("class","svg-graph-text");W&&Z.attr("stroke-width",(function(e){return W[e.index]})),null!=G&&G.then((function(){return H.stop()}));var $=function(e){return te?e/te:e},ee=void 0,te=void 0,ne=T.g().on("zoom",(function(e){K.attr("transform",ee=e.transform),ee&&(te=Math.sqrt(ee.k),K.style("stroke-width",3/te),J.attr("r",x/te).attr("stroke-width",y/te),X.attr("font-size",S/te).attr("y",B/te))}));U.call(ne).call(ne.transform,T.h),Object.assign(U.node(),{scales:{color:null}})}({nodes:n,links:r,svgRef:c.current,dispatch:i},{width:l,height:d}),console.timeEnd("Nucleic_acid_VIZ")}}),[s]),Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)("div",{children:n.simpleStuffy}),Object(j.jsxs)("div",{className:"p-5 flex items-center flex-col h-full",ref:h,children:[Object(j.jsxs)("div",{className:"min-w-full h-full relative",children:[Object(j.jsx)("svg",{ref:c}),n.selectedResidue&&Object(j.jsxs)("div",{className:"\r text-xs p-4\r absolute bottom-[10px] right-[10px]\r w-[50%] h-[100px] bg-indigo-400\r overflow-auto text-white rounded-lg\r ",children:[Object(j.jsxs)("div",{children:["Chain: ",n.selectedResidue.polymerChainIdentifier]}),Object(j.jsxs)("div",{children:["Residue: ",n.selectedResidue.name,":",n.selectedResidue.sequenceNumber]}),Object(j.jsxs)("div",{children:["Interactions:"," ",n.selectedResidue.interactions.map((function(e){return Object(j.jsxs)("div",{children:[e.polymerKind," - ",e.residue]})}))]})]})]}),Object(j.jsx)("div",{ref:l,style:{position:"absolute",opacity:0,background:"#fff"}})]})]})}var _=n(3),F=n.n(_),H=n(13),U=n(30),K=n.n(U),Z=n(22),Y=n.n(Z),J=function(){function e(t){Object(h.a)(this,e),this.file=void 0,void 0!==t&&(this.file=t)}return Object(d.a)(e,[{key:"readData",value:function(){var e=Object(H.a)(F.a.mark((function e(){var t;return F.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0!=this.file){e.next=2;break}throw Error("file not provided");case 2:return e.next=4,this.file.text();case 4:return t=e.sent,e.abrupt("return",this.format(t));case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"format",value:function(e){return{raw:this.formatText(e),polymers:this.formatPolymers(e)}}},{key:"formatText",value:function(e){return e.split("\n").map((function(e,t){return t.toString()+". "+e})).join("\n")}},{key:"formatPolymers",value:function(e){var t,n=[],i=function(){return{chainIdentifier:"",residues:[],kind:x.Unknown}},r=function(){return new p},a=function(){c.hash=Y()(c),s.residues.push(c)},s=i(),c=r(),o=function(e){var t,n=(t={},Object(l.a)(t,x.DNA,0),Object(l.a)(t,x.RNA,0),Object(l.a)(t,x.Protein,0),t);return void 0===e?n:[n,Object.keys(e).reduce((function(t,n){return e[t]>e[n]?t:n}))]},h=o(),d=[],b=!1,j=function(){t={chains:[],rotations:[],translations:[f.infinity()]}};return e.split("\n").forEach((function(e){if(e.startsWith("ATOM")||e.startsWith("HETATM")){var l=parseFloat(e.slice(30,38).trim()),p=parseFloat(e.slice(38,46).trim()),g=parseFloat(e.slice(46,54).trim()),O=e.slice(12,16).trim(),k=e.slice(17,20).trim(),w=e.slice(76,78).trim(),z=parseInt(e.slice(22,26).trim()),N=e.slice(21,22);s.chainIdentifier=N;var C={coords:new y(l,p,g),name:O,element:w,residueName:k,residueSequenceNumber:z};h[function(e){switch(!0){case e.residueName in v:return x.DNA;case e.residueName in m:return x.RNA;default:return x.Protein}}(C)]++,-1===c.sequenceNumber&&(c.name=C.residueName,c.sequenceNumber=z,c.polymerChainIdentifier=N),z!==c.sequenceNumber&&(a(),(c=r()).name=C.residueName,c.sequenceNumber=z,c.polymerChainIdentifier=N),c.atoms.push(C)}if(e.startsWith("TER")){a();var I=o(h),E=Object(u.a)(I,2),M=E[0],T=E[1];h=M,s.kind=T,s=D(s),n.push(s),s=i(),c=r()}if(e.startsWith("REMARK 350")){b=!0;if(["REMARK 350 APPLY THE FOLLOWING TO CHAINS: ","REMARK 350                    AND CHAINS:"].forEach((function(n,i){if(e.startsWith(n)){var r,a=e.trim().slice(n.length-1,e.length).toString().replaceAll(" ","").split(",");if(0===i&&(j(),t.chains.length>0&&d.push(t)),a.length>0)(r=t.chains).push.apply(r,Object(A.a)(a))}})),e.startsWith("REMARK 350   BIOMT")){var P=e.replace("REMARK 350   BIOMT","").match(new RegExp(/(\d{1})\s*(\d{1})\s*([+-]?[0-9]*[.]?[0-9]+)\s*([+-]?[0-9]*[.]?[0-9]+)\s*([+-]?[0-9]*[.]?[0-9]+)\s*([+-]?[0-9]*[.]?[0-9]+)/));if(null!=P&&7===P.length){P=P.slice(1);var R=parseInt(P[1])-1,S=parseInt(P[0])-1,B=[parseFloat(P[2]),parseFloat(P[3]),parseFloat(P[4])],G=parseFloat(P[5]);"undefined"===typeof t.translations[R]&&(t.translations[R]=f.infinity()),t.translations[R].setIndex(S,G),Array.isArray(t.rotations[R])||(t.rotations[R]=[]),t.rotations[R][S]=B}}}else b&&(d.push(t),j()),b=!1})),d.forEach((function(e){var t=n.filter((function(t){return-1!==e.chains.indexOf(t.chainIdentifier)})),i=e.rotations.slice(1),r=e.translations.slice(1);i.forEach((function(e,i){t.forEach((function(t){var a=K()(t,{includeNonEnumerable:!0});a.chainIdentifier=a.chainIdentifier+(i+1).toString(),a.generatedFromTransform=!0,a.residues.forEach((function(t,n){t.polymerChainIdentifier=a.chainIdentifier,t.atoms.forEach((function(n,a){var s=n.coords.toVec(),c=f.infinity();console.log("Coorinates before:",s),c.x=s.x*e[0][0]+s.y*e[0][1]+s.z*e[0][2],c.y=s.x*e[1][0]+s.y*e[1][1]+s.z*e[1][2],c.z=s.x*e[2][0]+s.y*e[2][1]+s.z*e[2][2];var o=r[i];c=c.add(o),console.log("Coords after:",c),console.log("Distance between atoms: ",c.distanceTo(s)),n.coords=c.toCoord(),t.atoms[a]=n})),t.hash=Y()(t),a.residues[n]=t})),a=D(a),n.push(a)}))}))})),console.log("Transformations:",d),console.log("Result after translation",n),n}}]),e}(),Q=function(){var e=Object(H.a)(F.a.mark((function e(t){var n,i;return F.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://files.rcsb.org/download/".concat(t,".pdb"));case 2:return n=e.sent,e.next=5,n.text();case 5:return i=e.sent,e.abrupt("return",i);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();function X(){var e=Object(r.useContext)(O),t=Object(u.a)(e,2),n=t[0],i=t[1],a=function(){i({type:"isLoading",payload:!0})},s=function(){i({type:"isLoading",payload:!1})},c=function(e){i({type:"pdb",payload:e})},o=function(e){i({type:"currentPDBId",payload:e})},l=function(e){i({type:"polymers",payload:e})},h=function(){i({type:"resetState",payload:null})},d=function(){var e=Object(H.a)(F.a.mark((function e(t){var n;return F.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return h(),a(),e.t0=new J,e.next=5,Q(t);case 5:e.t1=e.sent,n=e.t0.format.call(e.t0,e.t1),c(n),l(n.polymers),o(t),s();case 11:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();Object(r.useEffect)((function(){var e=new URLSearchParams(window.location.search).get("id");console.log("ID",e),null!==e&&d(e)}),[]);var f,y,v=function(){var e=Object(H.a)(F.a.mark((function e(t){var n,i,r;return F.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(null===(i=null===(n=t.target.files)||void 0===n?void 0:n.item(0))){e.next=14;break}return h(),a(),console.time("TIME_TO_PARSE_EVERYTHING"),console.time("TIME_TO_PARSE_PDB"),e.next=8,new J(i).readData();case 8:r=e.sent,console.timeEnd("TIME_TO_PARSE_PDB"),c(r),l(r.polymers),console.timeEnd("TIME_TO_PARSE_EVERYTHING"),setTimeout(s,2e3);case 14:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();n.polymers.length>0&&(f=Object(j.jsxs)("div",{className:"mt-5",children:[Object(j.jsx)("div",{className:"mb-1",children:"Provided input file"}),Object(j.jsx)("textarea",{className:"text-sm w-full border h-96 border-blue-100",value:null===(y=n.pdb)||void 0===y?void 0:y.raw,readOnly:!0})]}));var m=Object(r.useRef)(null),b=function(){var e,t=null===(e=m.current)||void 0===e?void 0:e.value;t&&d(t)};return Object(j.jsxs)("div",{className:"p-5 max-h-screen overflow-auto break-words",children:[!n.isLoading&&Object(j.jsxs)("div",{children:[n.error.length>0&&Object(j.jsx)("div",{className:"mb-4",children:Object(j.jsxs)("div",{className:"text-red-700 font-bold text-lg",children:["Something went wrong: ",n.error]})}),void 0===n.pdb&&Object(j.jsx)("div",{className:"text-sm text-gray-600 mb-4 bg-red-200 p-2",children:"Choose a PDB file which contains DNA/RNA with Proteins"}),Object(j.jsxs)("div",{children:[n.currentPDBId.length>0&&Object(j.jsxs)("div",{className:"mb-4",children:["Currently selected PDB ID:",Object(j.jsx)("b",{children:n.currentPDBId.toUpperCase()})]}),Object(j.jsxs)("div",{className:"mb-4",children:[Object(j.jsxs)("div",{className:"text-normal font-bold text-gray-600 mb-2",children:["Enter PDB file ID:",Object(j.jsxs)("div",{className:"text-xs font-normal",children:["PDB file should contain ",Object(j.jsx)("b",{children:"DNA/RNA"})," structures"]})]}),Object(j.jsxs)("div",{className:"flex flex-row max-w-full",children:[Object(j.jsx)("input",{onKeyPress:function(e){"Enter"===e.key&&b()},ref:m,placeholder:"1ZS4",className:"border-r-0 outline-none ring-indigo-200 focus:ring-2 transition-all block py-1 px-2 outline-0 border border-indigo-300 rounded rounded-tr-none rounded-br-none"}),Object(j.jsx)("button",{onClick:b,className:"bg-indigo-400 border-l-0 text-white font-bold text-sm ring-indigo-200 focus:ring-2 hover:bg-indigo-600 transition-all w-[100px]  block rounded rounded-tl-none rounded-bl-none border border-indigo-300",children:"GO"})]})]}),Object(j.jsxs)("div",{className:"text-normal font-bold text-gray-600 mb-2",children:["Or choose a PDB file to display:",Object(j.jsxs)("div",{className:"text-xs font-normal",children:["PDB file should contain ",Object(j.jsx)("b",{children:"DNA/RNA"})," structures"]})]}),Object(j.jsx)("input",{type:"file",onChange:v,className:"max-w-full"})]})]}),f,n.pdb&&Object(j.jsxs)("div",{children:["Polymers from input:",n.polymers.map((function(e,t){var n=e.residues,i=e.chainIdentifier,r=e.kind;return Object(j.jsxs)("div",{className:"ml-2",children:["Chain:"," ",Object(j.jsxs)("b",{children:[i," (",r,")"]}),Object(j.jsx)("div",{className:"ml-2",children:n.map((function(e,t){return Object(j.jsxs)("span",{children:[e.name," \xa0"]},t)}))})]},t)}))]})]})}n(116);var $=function(){return Object(j.jsxs)("div",{className:"flex flex-col items-center gap-1",children:[Object(j.jsx)("div",{className:"text-white font-bold",children:"Loading"}),Object(j.jsxs)("div",{className:"lds-roller",children:[Object(j.jsx)("div",{}),Object(j.jsx)("div",{}),Object(j.jsx)("div",{}),Object(j.jsx)("div",{}),Object(j.jsx)("div",{}),Object(j.jsx)("div",{}),Object(j.jsx)("div",{}),Object(j.jsx)("div",{})]})]})};function ee(){var e=Object(r.useContext)(O)[0];return Object(j.jsxs)("div",{className:"w-full flex flex-row",children:[!0===e.isLoading&&Object(j.jsx)("div",{className:"fixed w-screen min-h-screen top-0 left-0 flex items-center justify-center z-50  h-full",style:{backgroundColor:"rgba(0,0,0,0.75)"},children:Object(j.jsx)($,{})}),Object(j.jsx)("div",{className:"z-10 w-9/12 bg-indigo-200 min-h-full h-screen",children:Object(j.jsx)(W,{})}),Object(j.jsx)("div",{className:"z-10 w-3/12",children:Object(j.jsx)(X,{})})]})}function te(e){var t=e.children;return Object(j.jsx)(w,{children:t})}var ne=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,118)).then((function(t){var n=t.getCLS,i=t.getFID,r=t.getFCP,a=t.getLCP,s=t.getTTFB;n(e),i(e),r(e),a(e),s(e)}))};c.a.render(Object(j.jsx)(a.a.StrictMode,{children:Object(j.jsx)(te,{children:Object(j.jsx)(ee,{})})}),document.getElementById("root")),ne()}},[[117,1,2]]]);
//# sourceMappingURL=main.7fc1736e.chunk.js.map