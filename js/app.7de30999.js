(function(t){function e(e){for(var a,n,u=e[0],c=e[1],i=e[2],p=0,d=[];p<u.length;p++)n=u[p],Object.prototype.hasOwnProperty.call(r,n)&&r[n]&&d.push(r[n][0]),r[n]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(t[a]=c[a]);l&&l(e);while(d.length)d.shift()();return s.push.apply(s,i||[]),o()}function o(){for(var t,e=0;e<s.length;e++){for(var o=s[e],a=!0,n=1;n<o.length;n++){var u=o[n];0!==r[u]&&(a=!1)}a&&(s.splice(e--,1),t=c(c.s=o[0]))}return t}var a={},n={app:0},r={app:0},s=[];function u(t){return c.p+"js/"+({2048:"2048","2048~about~posts~snake~todo":"2048~about~posts~snake~todo","2048~about~todo":"2048~about~todo",about:"about","2048~posts~todo":"2048~posts~todo","2048~posts":"2048~posts",todo:"todo",posts:"posts",snake:"snake"}[t]||t)+"."+{2048:"9853926d","2048~about~posts~snake~todo":"cd004d40","2048~about~todo":"ab59a20f",about:"acd13dbb","2048~posts~todo":"75d2d7c0","2048~posts":"09ccb43c",todo:"acd4ed30",posts:"fd47c943",snake:"7c7c80c7"}[t]+".js"}function c(e){if(a[e])return a[e].exports;var o=a[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,c),o.l=!0,o.exports}c.e=function(t){var e=[],o={2048:1,"2048~about~todo":1,about:1,"2048~posts~todo":1,"2048~posts":1,todo:1,posts:1,snake:1};n[t]?e.push(n[t]):0!==n[t]&&o[t]&&e.push(n[t]=new Promise((function(e,o){for(var a="css/"+({2048:"2048","2048~about~posts~snake~todo":"2048~about~posts~snake~todo","2048~about~todo":"2048~about~todo",about:"about","2048~posts~todo":"2048~posts~todo","2048~posts":"2048~posts",todo:"todo",posts:"posts",snake:"snake"}[t]||t)+"."+{2048:"c3dbb041","2048~about~posts~snake~todo":"31d6cfe0","2048~about~todo":"cfc1f1e3",about:"559607c5","2048~posts~todo":"09af3917","2048~posts":"28811d88",todo:"91a92dd3",posts:"77b714e8",snake:"72328342"}[t]+".css",r=c.p+a,s=document.getElementsByTagName("link"),u=0;u<s.length;u++){var i=s[u],p=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(p===a||p===r))return e()}var d=document.getElementsByTagName("style");for(u=0;u<d.length;u++){i=d[u],p=i.getAttribute("data-href");if(p===a||p===r)return e()}var l=document.createElement("link");l.rel="stylesheet",l.type="text/css",l.onload=e,l.onerror=function(e){var a=e&&e.target&&e.target.src||r,s=new Error("Loading CSS chunk "+t+" failed.\n("+a+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=a,delete n[t],l.parentNode.removeChild(l),o(s)},l.href=r;var f=document.getElementsByTagName("head")[0];f.appendChild(l)})).then((function(){n[t]=0})));var a=r[t];if(0!==a)if(a)e.push(a[2]);else{var s=new Promise((function(e,o){a=r[t]=[e,o]}));e.push(a[2]=s);var i,p=document.createElement("script");p.charset="utf-8",p.timeout=120,c.nc&&p.setAttribute("nonce",c.nc),p.src=u(t);var d=new Error;i=function(e){p.onerror=p.onload=null,clearTimeout(l);var o=r[t];if(0!==o){if(o){var a=e&&("load"===e.type?"missing":e.type),n=e&&e.target&&e.target.src;d.message="Loading chunk "+t+" failed.\n("+a+": "+n+")",d.name="ChunkLoadError",d.type=a,d.request=n,o[1](d)}r[t]=void 0}};var l=setTimeout((function(){i({type:"timeout",target:p})}),12e4);p.onerror=p.onload=i,document.head.appendChild(p)}return Promise.all(e)},c.m=t,c.c=a,c.d=function(t,e,o){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(c.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)c.d(o,a,function(e){return t[e]}.bind(null,a));return o},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="/",c.oe=function(t){throw console.error(t),t};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],p=i.push.bind(i);i.push=e,i=i.slice();for(var d=0;d<i.length;d++)e(i[d]);var l=p;s.push([0,"chunk-vendors"]),o()})({0:function(t,e,o){t.exports=o("cd49")},"5c0b":function(t,e,o){"use strict";var a=o("9c0c"),n=o.n(a);n.a},"9c0c":function(t,e,o){},cd49:function(t,e,o){"use strict";o.r(e);o("e260"),o("e6cf"),o("cca6"),o("a79d");var a=o("2b0e"),n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-app",[o("v-app-bar",{attrs:{app:"",color:"primary",light:"","hide-on-scroll":""}},[o("v-tabs",{attrs:{color:"white"},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[t._l(t.tabs,(function(e){return o("v-tab",{key:e.name,staticClass:"white--text",attrs:{to:e.route}},[t._v(" "+t._s(e.name)+" ")])})),o("v-spacer"),o("v-tab",{staticClass:"white--text",attrs:{to:t.last.route}},[t._v(" "+t._s(t.last.name)+" ")])],2)],1),o("v-content",[o("keep-alive",[o("router-view")],1)],1)],1)},r=[],s=a["a"].extend({name:"App",mounted:function(){var t=localStorage.themeDark;"true"===t&&(this.$vuetify.theme.dark=!0)},data:function(){return{activeTab:"/",tabs:[{name:"2048",route:"/"},{name:"Todo",route:"/todo"},{name:"Posts",route:"/posts"},{name:"Snake",route:"/snake"}],last:{name:"About",route:"/about"}}}}),u=s,c=(o("5c0b"),o("2877")),i=o("6544"),p=o.n(i),d=o("7496"),l=o("40dc"),f=o("a75b"),b=o("2fa4"),m=o("71a3"),h=o("fe57"),v=Object(c["a"])(u,n,r,!1,null,null,null),k=v.exports;p()(v,{VApp:d["a"],VAppBar:l["a"],VContent:f["a"],VSpacer:b["a"],VTab:m["a"],VTabs:h["a"]});o("d3b7");var g=o("8c4f");a["a"].use(g["a"]);var y=[{path:"/",name:"2048",component:function(){return Promise.all([o.e("2048~about~posts~snake~todo"),o.e("2048~posts~todo"),o.e("2048~about~todo"),o.e("2048~posts"),o.e("2048")]).then(o.bind(null,"135a"))}},{path:"/about",name:"About",component:function(){return Promise.all([o.e("2048~about~posts~snake~todo"),o.e("2048~about~todo"),o.e("about")]).then(o.bind(null,"f820"))}},{path:"/todo",name:"todo",component:function(){return Promise.all([o.e("2048~about~posts~snake~todo"),o.e("2048~posts~todo"),o.e("2048~about~todo"),o.e("todo")]).then(o.bind(null,"a3b3"))}},{path:"/posts",name:"posts",component:function(){return Promise.all([o.e("2048~about~posts~snake~todo"),o.e("2048~posts~todo"),o.e("2048~posts"),o.e("posts")]).then(o.bind(null,"17c3"))}},{path:"/snake",name:"snake",component:function(){return Promise.all([o.e("2048~about~posts~snake~todo"),o.e("snake")]).then(o.bind(null,"61ea"))}}],w=new g["a"]({mode:"hash",base:"/",routes:y}),P=w,_=o("2f62");a["a"].use(_["a"]);var T=new _["a"].Store({state:{},mutations:{},actions:{},modules:{}}),O=o("f309");a["a"].use(O["a"]);var S=new O["a"]({theme:{themes:{light:{primary:"#1eba74",accent:"#ffab91",black:"#333333",white:"#f7f7f7"},dark:{primary:"#008948",accent:"#c97b63",black:"#f7f7f7",white:"#333333"}},options:{customProperties:!0}},icons:{iconfont:"mdi"}});a["a"].config.productionTip=!1,new a["a"]({router:P,store:T,vuetify:S,render:function(t){return t(k)}}).$mount("#app")}});
//# sourceMappingURL=app.7de30999.js.map