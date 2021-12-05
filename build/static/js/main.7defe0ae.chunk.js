(this.webpackJsonpbmol2d=this.webpackJsonpbmol2d||[]).push([[0],{158:function(t,e,n){},161:function(t,e,n){},162:function(t,e,n){"use strict";n.r(e);var i,r=n(2),s=n.n(r),a=n(58),c=n.n(a),o=(n(158),n(61)),u=n(4),h=n(5),l=n(6),d=function(){function t(e,n,i){Object(h.a)(this,t),this.x=e,this.y=n,this.z=i,this.x=e||0,this.y=n||0,this.z=i||0}return Object(l.a)(t,[{key:"negative",value:function(){return new t(-this.x,-this.y,-this.z)}},{key:"add",value:function(e){return e instanceof t?new t(this.x+e.x,this.y+e.y,this.z+e.z):new t(this.x+e,this.y+e,this.z+e)}},{key:"subtract",value:function(e){return e instanceof t?new t(this.x-e.x,this.y-e.y,this.z-e.z):new t(this.x-e,this.y-e,this.z-e)}},{key:"multiply",value:function(e){return e instanceof t?new t(this.x*e.x,this.y*e.y,this.z*e.z):new t(this.x*e,this.y*e,this.z*e)}},{key:"divide",value:function(e){return e instanceof t?new t(this.x/e.x,this.y/e.y,this.z/e.z):new t(this.x/e,this.y/e,this.z/e)}},{key:"equals",value:function(t){return this.x==t.x&&this.y==t.y&&this.z==t.z}},{key:"dot",value:function(t){return this.x*t.x+this.y*t.y+this.z*t.z}},{key:"cross",value:function(e){return new t(this.y*e.z-this.z*e.y,this.z*e.x-this.x*e.z,this.x*e.y-this.y*e.x)}},{key:"length",value:function(){return Math.sqrt(this.dot(this))}},{key:"magnitude",value:function(){return this.length()}},{key:"unit",value:function(){return this.divide(this.length())}},{key:"min",value:function(){return Math.min(Math.min(this.x,this.y),this.z)}},{key:"max",value:function(){return Math.max(Math.max(this.x,this.y),this.z)}},{key:"toAngles",value:function(){return{theta:Math.atan2(this.z,this.x),phi:Math.asin(this.y/this.length())}}},{key:"angleTo",value:function(t){return Math.acos(this.dot(t)/(this.length()*t.length()))}},{key:"toArray",value:function(t){return[this.x,this.y,this.z].slice(0,t||3)}},{key:"clone",value:function(){return new t(this.x,this.y,this.z)}},{key:"init",value:function(t,e,n){return this.x=t,this.y=e,this.z=n,this}},{key:"normalize",value:function(){return this.unit()}}],[{key:"negative",value:function(t,e,n){return e.x=-t.x,e.y=-t.y,e.z=-t.z,e}},{key:"add",value:function(e,n,i){return n instanceof t?(i.x=e.x+n.x,i.y=e.y+n.y,i.z=e.z+n.z):(i.x=e.x+n,i.y=e.y+n,i.z=e.z+n),i}},{key:"subtract",value:function(e,n,i){return n instanceof t?(i.x=e.x-n.x,i.y=e.y-n.y,i.z=e.z-n.z):(i.x=e.x-n,i.y=e.y-n,i.z=e.z-n),i}},{key:"multiply",value:function(e,n,i){return n instanceof t?(i.x=e.x*n.x,i.y=e.y*n.y,i.z=e.z*n.z):(i.x=e.x*n,i.y=e.y*n,i.z=e.z*n),i}},{key:"divide",value:function(e,n,i){return n instanceof t?(i.x=e.x/n.x,i.y=e.y/n.y,i.z=e.z/n.z):(i.x=e.x/n,i.y=e.y/n,i.z=e.z/n),i}},{key:"cross",value:function(t,e,n){return n.x=t.y*e.z-t.z*e.y,n.y=t.z*e.x-t.x*e.z,n.z=t.x*e.y-t.y*e.x,n}},{key:"unit",value:function(t,e,n){var i=t.length();return e.x=t.x/i,e.y=t.y/i,e.z=t.z/i,e}},{key:"fromAngles",value:function(e,n){return new t(Math.cos(e)*Math.cos(n),Math.sin(n),Math.sin(e)*Math.cos(n))}},{key:"randomDirection",value:function(){return t.fromAngles(Math.random()*Math.PI*2,Math.asin(2*Math.random()-1))}},{key:"min",value:function(e,n,i){return new t(Math.min(e.x,n.x),Math.min(e.y,n.y),Math.min(e.z,n.z))}},{key:"max",value:function(e,n,i){return new t(Math.max(e.x,n.x),Math.max(e.y,n.y),Math.max(e.z,n.z))}},{key:"lerp",value:function(t,e,n){return e.subtract(t).multiply(n).add(t)}},{key:"fromArray",value:function(e){return new t(e[0],e[1],e[2])}},{key:"angleBetween",value:function(t,e,n){return t.angleTo(e)}},{key:"infinity",value:function(){return new t(1/0,1/0,1/0)}}]),t}(),f=function(){function t(e,n,i){Object(h.a)(this,t),this.x=e,this.y=n,this.z=i}return Object(l.a)(t,[{key:"toVec",value:function(){return d.fromArray(v(this))}}]),t}();function v(t){return[t.x,t.y,t.z]}!function(t){t.A="\u03b1",t.B="\u03b2",t.G="\u03b3",t.D="\u03b4",t.E="\u03b5",t.Z="\u03b6",t.H="\u03b7"}(i||(i={}));var y,m,x,p,b=function(){function t(){Object(h.a)(this,t),this.center=void 0,this.interactions=void 0,this.atoms=void 0,this.v=void 0,this.o=void 0,this.hash=void 0,this.name=void 0,this.sequenceNumber=void 0,this.polymerChainIdentifier=void 0,this.atoms=[],this.name="",this.sequenceNumber=-1,this.center=new f(-1,-1,-1),this.hash="",this.interactions=[],this.polymerChainIdentifier="",this.v=d.infinity(),this.o=d.infinity()}return Object(l.a)(t,[{key:"findAtomsByNames",value:function(t){var e=[];return this.atoms.forEach((function(n){-1!==t.indexOf(n.name)&&e.push(n)})),e.sort((function(e,n){return t.indexOf(e.name)-t.indexOf(n.name)})),e}}]),t}();!function(t){t.DA="DA",t.DG="DG",t.DC="DC",t.DT="DT"}(y||(y={})),function(t){t[t.A=0]="A",t[t.C=1]="C",t[t.G=2]="G",t[t.I=3]="I",t[t.U=4]="U"}(m||(m={})),function(t){t[t.Ala=0]="Ala",t[t.Arg=1]="Arg",t[t.Asn=2]="Asn",t[t.Asp=3]="Asp",t[t.Cys=4]="Cys",t[t.Glu=5]="Glu",t[t.Gln=6]="Gln",t[t.Gly=7]="Gly",t[t.His=8]="His",t[t.Ile=9]="Ile",t[t.Leu=10]="Leu",t[t.Lys=11]="Lys",t[t.Met=12]="Met",t[t.Phe=13]="Phe",t[t.Pro=14]="Pro",t[t.Ser=15]="Ser",t[t.Thr=16]="Thr",t[t.Trp=17]="Trp",t[t.Tyr=18]="Tyr",t[t.Val=19]="Val"}(x||(x={})),function(t){t.DNA="DNA",t.RNA="RNA",t.Protein="Protein",t.Unknown="Unknown"}(p||(p={}));var j=n(59),k=n(0),g={polymers:[],pdb:void 0,isLoading:!1,simpleStuffy:"",hashedNucleicAcidResidues:{},viz:{chain1:null,chain2:null}},z=Object(r.createContext)([g,function(){}]),O=function(t,e){var n=e.type,i=e.payload;if(!(n in t))throw new Error("".concat(n," not found in state"));return t[n]=i,Object(j.a)({},t)},w=function(t){var e=t.children,n=Object(r.useReducer)(O,g),i=Object(u.a)(n,2),s=i[0],a=i[1];return Object(k.jsx)(z.Provider,{value:[s,a],children:e})};function A(t){return t.residues.forEach((function(e,n){var i=new f(0,0,0);e.atoms.forEach((function(t){i.x+=t.coords.x,i.y+=t.coords.y,i.z+=t.coords.z})),i.x=i.x/e.atoms.length,i.y=i.y/e.atoms.length,i.z=i.z/e.atoms.length,t.residues[n].center=i})),t}function N(t,e){return Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)+Math.pow(t.z-e.z,2))}function M(t){return{sequenceNumber:t.sequenceNumber,hash:t.hash,name:t.name,polymerChainIdentifier:t.polymerChainIdentifier}}var E;!function(t){t[t.Threshold=0]="Threshold",t[t.HBond=1]="HBond"}(E||(E={}));function C(t,e){return t.name===y[y.DA]&&e.name===y[y.DT]||t.name===y[y.DT]&&e.name===y[y.DA]||t.name===y[y.DC]&&e.name===y[y.DG]||t.name===y[y.DG]&&e.name===y[y.DC]}var T=function(){function t(e,n){Object(h.a)(this,t),this.polymers=e,this.dispatch=n,this.nucleicAcids=[],this.proteins=[],this.visualization={chain1:null,chain2:null},this.prepareObjects()}return Object(l.a)(t,[{key:"watsonCrickPairs",value:function(){if(this.nucleicAcids.length<=0)throw Error("Nucleic acids are not initialized");if(!(this.nucleicAcids.length>=2&&this.nucleicAcids[0].kind===p.DNA))throw Error("Nucleic acids are not initialized");var t=this.nucleicAcids[0],e=this.nucleicAcids[1],n=this.calculateWatsonCrickPairs(t,e),i=this.calculateWatsonCrickPairs(e,t);i.reverse();var r=n;return i.forEach((function(t){if(1===t.length)r.push(t);else if(2===t.length){for(var e=!1,i=0;i<n.length;i++){var s=n[i];if(2===s.length&&s[0].hash===t[1].hash&&s[1].hash===t[0].hash){e=!0;break}}e||console.log("watsonCrickPairs: matching pair was not found ".concat(t[1].polymerChainIdentifier,":").concat(t[1].sequenceNumber).concat(t[1].name,"---").concat(t[0].polymerChainIdentifier,":").concat(t[0].sequenceNumber).concat(t[0].name),t)}})),r}},{key:"calculateWatsonCrickPairs",value:function(t,e){var n=[];return t.residues.forEach((function(t){var i,r=1/0;if(e.residues.forEach((function(e){var n=t.findAtomsByNames(["C2","C4","C6"]),s=[Math.abs(n[0].coords.toVec().subtract(e.o).dot(e.v)),Math.abs(n[1].coords.toVec().subtract(e.o).dot(e.v)),Math.abs(n[2].coords.toVec().subtract(e.o).dot(e.v))],a=e.findAtomsByNames(["C2","C4","C6"]),c=[Math.abs(a[0].coords.toVec().subtract(t.o).dot(t.v)),Math.abs(a[1].coords.toVec().subtract(t.o).dot(t.v)),Math.abs(a[2].coords.toVec().subtract(t.o).dot(t.v))],o=Math.max.apply(Math,c.concat(s));o<r&&(r=o,i=e)})),void 0!==i&&r<=1.42+Math.random()&&C(i,t)){n.push([t,i])}else n.push([t])})),n}},{key:"prepareObjects",value:function(){this.nucleicAcids=this.findNucleoAcids(),this.proteins=this.findProteins(),this.nucleicAcids.forEach((function(t){return A(t)})),this.proteins.forEach((function(t){return A(t)}))}},{key:"findProteins",value:function(){return this.polymers.filter((function(t){return-1!==[p.Protein].indexOf(t.kind)}))}},{key:"findNucleoAcids",value:function(){return this.polymers.filter((function(t){return-1!==[p.DNA,p.RNA].indexOf(t.kind)}))}},{key:"generateVisualizationScaffold",value:function(){if(this.nucleicAcids.length<=0)throw Error("Nucleic acids are not initialized");if(this.nucleicAcids.length>=2&&this.nucleicAcids[0].kind===p.DNA){this.visualization.chain1=[],this.visualization.chain2=[];var t=this.nucleicAcids[0],e=this.nucleicAcids[1],n=new Array(t.residues.length).fill(1/0);t.residues.forEach((function(t,i){e.residues.forEach((function(e,i){C(t,e)&&(n[i]=Math.min(n[i],N(t.center,e.center)))}))}));for(var i=0,r=0,s=0;s<t.residues.length;s++){for(var a=t.residues[s],c=e.residues.length-1-r;c>0;--c){var o=e.residues[c];if(!C(a,o)&&c-1>0&&0===s){var u=e.residues[c-1];C(a,u)?(this.visualization.chain2.push({index:i,residue:M(u),interactions:u.interactions}),r++):this.visualization.chain1.push({index:i,residue:M(a),interactions:a.interactions}),i++;break}if(C(a,o)){this.visualization.chain1.push({index:i,residue:M(a),interactions:a.interactions}),r<=e.residues.length&&(this.visualization.chain2.push({index:i,residue:M(o),interactions:o.interactions}),r++),i++;break}}if(r>e.residues.length){this.visualization.chain1.push({index:i,residue:M(a),interactions:a.interactions}),i++;break}}if(console.log("secondChainIncludedAmount",r,e.residues.length),r<e.residues.length)for(var h=e.residues.length-r-1;h>=0;--h)this.visualization.chain2.push({index:i,residue:M(e.residues[h]),interactions:e.residues[h].interactions}),i++,r++}else this.visualization.chain1=[],this.visualization.chain2=null;return this.visualization}},{key:"thresholdInteractions",value:function(){var t=this;this.nucleicAcids.forEach((function(e,n){e.residues.forEach((function(e,i){t.proteins.forEach((function(r){r.residues.forEach((function(s){N(e.center,s.center)<=10&&e.atoms.forEach((function(e){s.atoms.forEach((function(a){var c=N(e.coords,a.coords);c<=5&&t.nucleicAcids[n].residues[i].interactions.push({residue:M(s),type:E.Threshold,polymerKind:r.kind,meta:{distance:c}})}))}))}))}))}))}))}}]),t}(),D=n(1);function P(){var t=Object(r.useContext)(z),e=Object(u.a)(t,2),n=e[0],i=e[1],a=n.polymers,c=s.a.createRef(),h=s.a.createRef(),l=Object(r.useRef)(null),d=[];return a.filter((function(t){return-1!==[p.DNA,p.RNA].indexOf(t.kind)})).map((function(t){t.residues.map((function(t){return d.push.apply(d,Object(o.a)(t.atoms))}))})),Object(r.useEffect)((function(){if(c&&!(a.length<=0)){var t=new T(a,i),e=t.watsonCrickPairs(),n=t.nucleicAcids,r=[],s=[],o=n[0],u=n[1],h=function(t){return"".concat(t.polymerChainIdentifier,":").concat(t.name).concat(t.sequenceNumber)},d=Object.values(y);o.residues.forEach((function(t,e){r.push({id:h(t),group:d.indexOf(t.name)+1});var n=o.residues;e>0&&e<n.length&&s.push({source:h(n[e-1]),target:h(t),value:1})})),u.residues.forEach((function(t,e){r.push({id:h(t),group:d.indexOf(t.name)+1});var n=u.residues;e>0&&e<n.length&&s.push({source:h(n[e-1]),target:h(t),value:1})})),e.forEach((function(t){var e=t[0];if(2===t.length){var n=t[1];s.push({source:h(n),target:h(e),value:1})}})),console.log("Vizualization data:",r,s);var f=[l.current.offsetWidth,l.current.offsetHeight],v=f[0],m=f[1];!function(t,e){var n=t.nodes,i=t.links,r=t.svgRef,s=e.nodeId,a=void 0===s?function(t){return t.id}:s,c=e.nodeGroup,o=e.nodeGroups,u=e.nodeTitle,h=e.nodeFill,l=void 0===h?"currentColor":h,d=e.nodeStroke,f=void 0===d?"#fff":d,v=e.nodeStrokeWidth,y=void 0===v?1.5:v,m=e.nodeStrokeOpacity,x=void 0===m?1:m,p=e.nodeRadius,b=void 0===p?5:p,j=e.nodeStrength,k=e.linkSource,g=void 0===k?function(t){return t.source}:k,z=e.linkTarget,O=void 0===z?function(t){return t.target}:z,w=e.linkStroke,A=void 0===w?"#999":w,N=e.linkStrokeOpacity,M=void 0===N?.6:N,E=e.linkStrokeWidth,C=void 0===E?1.5:E,T=e.linkStrokeLinecap,P=void 0===T?"round":T,I=e.linkStrength,R=e.colors,S=void 0===R?D.h:R,q=e.width,G=void 0===q?640:q,B=e.height,L=void 0===B?400:B,V=e.invalidation,_=D.f(n,a).map(it),F=D.f(i,g).map(it),H=D.f(i,O).map(it);void 0===u&&(u=function(t,e){return _[e]});var W=null==u?null:D.f(n,u),U=null==c?null:D.f(n,c).map(it),J="function"!==typeof C?null:D.f(i,C);n=D.f(n,(function(t,e){return{id:_[e]}})),i=D.f(i,(function(t,e){return{source:F[e],target:H[e]}})),U&&void 0===o&&(o=D.j(U));var Y=null==c?null:D.g(o,S),K=D.d(),Z=D.c(i).id((function(t){var e=t.index;return _[e]}));void 0!==j&&K.strength(j),void 0!==I&&Z.strength(I);var Q,X=D.e(n).force("link",Z).force("charge",K).force("center",D.b()).on("tick",(function(){et.attr("x1",(function(t){return t.source.x})).attr("y1",(function(t){return t.source.y})).attr("x2",(function(t){return t.target.x})).attr("y2",(function(t){return t.target.y})),nt.attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y}))})),$=D.i(r).attr("width",G).attr("height",L).attr("viewBox",[-G/2,-L/2,G,L]).attr("style","max-width: 100%; height: auto; height: intrinsic;"),tt=$.append("g"),et=tt.append("g").attr("stroke",A).attr("stroke-opacity",M).attr("stroke-width","function"!==typeof C?C:null).attr("stroke-linecap",P).selectAll("line").data(i).join("line"),nt=tt.append("g").attr("fill",l).attr("stroke",f).attr("stroke-opacity",x).attr("stroke-width",y).selectAll("circle").data(n).join("circle").attr("r",b).call(function(t){return D.a().on("start",(function(e){e.active||t.alphaTarget(.3).restart(),e.subject.fx=e.subject.x,e.subject.fy=e.subject.y})).on("drag",(function(t){t.subject.fx=t.x,t.subject.fy=t.y})).on("end",(function(e){e.active||t.alphaTarget(0),e.subject.fx=null,e.subject.fy=null}))}(X));function it(t){return null!==t&&"object"===typeof t?t.valueOf():t}J&&et.attr("stroke-width",(function(t){var e=t.index;return J[e]})),U&&nt.attr("fill",(function(t){var e=t.index;return Y(U[e])})),W&&nt.append("title").text((function(t){var e=t.index;return W[e]})),null!=V&&V.then((function(){return X.stop()}));var rt=D.k().on("zoom",(function(t){tt.attr("transform",Q=t.transform),tt.style("stroke-width",3/Math.sqrt(Q.k)),nt.attr("r",3/Math.sqrt(Q.k))}));$.call(rt).call(rt.transform,D.l),Object.assign($.node(),{scales:{color:Y}})}({nodes:r,links:s,svgRef:c.current},{width:v,height:m})}}),[a]),Object(k.jsxs)(k.Fragment,{children:[Object(k.jsx)("div",{children:n.simpleStuffy}),Object(k.jsxs)("div",{className:"p-5 flex items-center flex-col h-full",ref:l,children:[Object(k.jsx)("div",{className:"min-w-full h-full",children:Object(k.jsx)("svg",{ref:c})}),Object(k.jsx)("div",{ref:h,style:{position:"absolute",opacity:0,background:"#fff"}})]})]})}var I=n(3),R=n.n(I),S=n(12),q=n(7),G=n(60),B=n.n(G),L=function(){function t(e){Object(h.a)(this,t),this.file=void 0,void 0!==e&&(this.file=e)}return Object(l.a)(t,[{key:"readData",value:function(){var t=Object(S.a)(R.a.mark((function t(){var e;return R.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(void 0!=this.file){t.next=2;break}throw Error("file not provided");case 2:return t.next=4,this.file.text();case 4:return e=t.sent,t.abrupt("return",this.format(e));case 6:case"end":return t.stop()}}),t,this)})));return function(){return t.apply(this,arguments)}}()},{key:"format",value:function(t){return{raw:this.formatText(t),polymers:this.formatPolymers(t)}}},{key:"formatText",value:function(t){return t.split("\n").map((function(t,e){return e.toString()+". "+t})).join("\n")}},{key:"formatPolymers",value:function(t){var e=[],n=function(){return{chainIdentifier:"",residues:[],kind:p.Unknown}},i=function(){return new b},r=function(){a.hash=B()(a),s.residues.push(a)},s=n(),a=i(),c=function(t){var e,n=(e={},Object(q.a)(e,p.DNA,0),Object(q.a)(e,p.RNA,0),Object(q.a)(e,p.Protein,0),e);return void 0===t?n:[n,Object.keys(t).reduce((function(e,n){return t[e]>t[n]?e:n}))]},o=c();return t.split("\n").forEach((function(t){if(t.startsWith("ATOM")||t.startsWith("HETATM")){var h=parseFloat(t.slice(30,38).trim()),l=parseFloat(t.slice(38,46).trim()),x=parseFloat(t.slice(46,54).trim()),b=t.slice(12,16).trim(),j=t.slice(17,20).trim(),k=t.slice(76,78).trim(),g=parseInt(t.slice(22,26).trim()),z=t.slice(21,22);s.chainIdentifier=z;var O={coords:new f(h,l,x),name:b,element:k,residueName:j,residueSequenceNumber:g};o[function(t){switch(!0){case t.residueName in y:return p.DNA;case t.residueName in m:return p.RNA;default:return p.Protein}}(O)]++,-1===a.sequenceNumber&&(a.name=O.residueName,a.sequenceNumber=g,a.polymerChainIdentifier=z),g!==a.sequenceNumber&&(r(),(a=i()).name=O.residueName,a.sequenceNumber=g,a.polymerChainIdentifier=z),a.atoms.push(O)}if(t.startsWith("TER")){r();var w=c(o),A=Object(u.a)(w,2),N=A[0],M=A[1];o=N,s.kind=M,s=function(t){if(-1!=[p.DNA,p.RNA].indexOf(t.kind)){var e=["C2","C4","C6"];t.residues.forEach((function(t){var n=[];if(t.findAtomsByNames(e).forEach((function(t,e){n[e]=t.coords})),3===n.length){var i=d.fromArray(v(n[0])),r=d.fromArray(v(n[1])),s=d.fromArray(v(n[2])),a=r.subtract(i).cross(s.subtract(i)).normalize(),c=i.add(r).add(s).divide(3);t.v=a,t.o=c}}))}return t}(s),e.push(s),s=n(),a=i()}})),e}}]),t}(),V=function(){var t=Object(S.a)(R.a.mark((function t(e){var n,i;return R.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("https://files.rcsb.org/download/".concat(e,".pdb"));case 2:return n=t.sent,t.next=5,n.text();case 5:return i=t.sent,t.abrupt("return",i);case 7:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();function _(){var t=Object(r.useContext)(z),e=Object(u.a)(t,2),n=e[0],i=e[1],s=function(){i({type:"isLoading",payload:!0})},a=function(){i({type:"isLoading",payload:!1})},c=function(t){i({type:"pdb",payload:t})},o=function(t){i({type:"polymers",payload:t}),new T(t,i).thresholdInteractions()};Object(r.useEffect)((function(){var t=new URLSearchParams(window.location.search).get("id");console.log("ID",t),null!==t&&Object(S.a)(R.a.mark((function e(){var n;return R.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s(),e.t0=new L,e.next=4,V(t);case 4:e.t1=e.sent,n=e.t0.format.call(e.t0,e.t1),c(n),o(n.polymers),a();case 9:case"end":return e.stop()}}),e)})))()}),[]);var h,l,d=function(){var t=Object(S.a)(R.a.mark((function t(e){var n,i,r;return R.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(null===(i=null===(n=e.target.files)||void 0===n?void 0:n.item(0))){t.next=13;break}return s(),console.time("TIME_TO_PARSE_EVERYTHING"),console.time("TIME_TO_PARSE_PDB"),t.next=7,new L(i).readData();case 7:r=t.sent,console.timeEnd("TIME_TO_PARSE_PDB"),c(r),o(r.polymers),console.timeEnd("TIME_TO_PARSE_EVERYTHING"),setTimeout(a,2e3);case 13:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();n.polymers.length>0&&(h=Object(k.jsxs)("div",{className:"mt-5",children:[Object(k.jsx)("div",{className:"mb-1",children:"Provided input file"}),Object(k.jsx)("textarea",{className:"text-sm w-full border h-96 border-blue-100",value:null===(l=n.pdb)||void 0===l?void 0:l.raw,readOnly:!0})]}));return Object(k.jsxs)("div",{className:"p-5 max-h-screen overflow-auto break-words",children:[!n.isLoading&&Object(k.jsxs)("div",{children:[void 0===n.pdb&&Object(k.jsx)("div",{className:"text-sm text-gray-600 mb-4 bg-red-200 p-2",children:"Choose a PDB file which contains DNA/RNA with Proteins"}),Object(k.jsx)("div",{children:Object(k.jsx)("input",{type:"file",onChange:d})})]}),h,n.pdb&&Object(k.jsxs)("div",{children:["Polymers from input:",n.polymers.map((function(t,e){var n=t.residues,i=t.chainIdentifier,r=t.kind;return Object(k.jsxs)("div",{className:"ml-2",children:["Chain:"," ",Object(k.jsxs)("b",{children:[i," (",r,")"]}),Object(k.jsx)("div",{className:"ml-2",children:n.map((function(t,e){return Object(k.jsxs)("span",{children:[t.name," \xa0"]},e)}))})]},e)}))]})]})}n(161);var F=function(){return Object(k.jsxs)("div",{className:"lds-roller",children:[Object(k.jsx)("div",{}),Object(k.jsx)("div",{}),Object(k.jsx)("div",{}),Object(k.jsx)("div",{}),Object(k.jsx)("div",{}),Object(k.jsx)("div",{}),Object(k.jsx)("div",{}),Object(k.jsx)("div",{})]})};function H(){var t=Object(r.useContext)(z)[0];return Object(k.jsxs)("div",{className:"w-full flex flex-row",children:[!0===t.isLoading&&Object(k.jsx)("div",{className:"fixed w-screen min-h-screen top-0 left-0 flex items-center justify-center z-50  h-full",style:{backgroundColor:"rgba(0,0,0,0.35)"},children:Object(k.jsx)(F,{})}),Object(k.jsx)("div",{className:"z-10 w-9/12 bg-indigo-300 min-h-full h-screen",children:Object(k.jsx)(P,{})}),Object(k.jsx)("div",{className:"z-10 w-3/12",children:Object(k.jsx)(_,{})})]})}function W(t){var e=t.children;return Object(k.jsx)(w,{children:e})}var U=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,163)).then((function(e){var n=e.getCLS,i=e.getFID,r=e.getFCP,s=e.getLCP,a=e.getTTFB;n(t),i(t),r(t),s(t),a(t)}))};c.a.render(Object(k.jsx)(s.a.StrictMode,{children:Object(k.jsx)(W,{children:Object(k.jsx)(H,{})})}),document.getElementById("root")),U()}},[[162,1,2]]]);
//# sourceMappingURL=main.7defe0ae.chunk.js.map