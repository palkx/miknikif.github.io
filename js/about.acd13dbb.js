(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["about"],{"269a":function(t,e){t.exports=function(t,e){var i="function"===typeof t.exports?t.exports.extendOptions:t.options;for(var s in"function"===typeof t.exports&&(i.directives=t.exports.options.directives),i.directives=i.directives||{},e)i.directives[s]=i.directives[s]||e[s]}},"9d01":function(t,e,i){},b73d:function(t,e,i){"use strict";i("0481"),i("4069");var s=i("5530"),n=(i("ec29"),i("9d01"),i("fe09")),a=i("c37a"),o=i("c3f0"),c=i("0789"),r=i("490a"),l=i("80d2");e["a"]=n["a"].extend({name:"v-switch",directives:{Touch:o["a"]},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes:function(){return Object(s["a"])(Object(s["a"])({},a["a"].options.computed.classes.call(this)),{},{"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset})},attrs:function(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState:function(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData:function(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot:function(){return[this.genSwitch(),this.genLabel()]},genSwitch:function(){return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",Object(s["a"])(Object(s["a"])({},this.attrs),this.attrs$)),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",Object(s["a"])({staticClass:"v-input--switch__track"},this.switchData)),this.$createElement("div",Object(s["a"])({staticClass:"v-input--switch__thumb"},this.switchData),[this.genProgress()])])},genProgress:function(){return this.$createElement(c["b"],{},[!1===this.loading?null:this.$slots.progress||this.$createElement(r["a"],{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft:function(){this.isActive&&this.onChange()},onSwipeRight:function(){this.isActive||this.onChange()},onKeydown:function(t){(t.keyCode===l["q"].left&&this.isActive||t.keyCode===l["q"].right&&!this.isActive)&&this.onChange()}}})},f820:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"my-5"},[i("h1",[t._v("Hello")]),i("h2",[t._v("Nothing here.")]),i("h2",{directives:[{name:"ripple",rawName:"v-ripple"}],on:{click:t.click}},[t._v("I'm still learning.")]),i("br"),i("v-btn",{staticClass:"ma-2",attrs:{rounded:"",color:"primary",href:"https://github.com/nestorm001/nestorm001.github.io",target:"_blank"}},[t._v("github repo")]),i("v-btn",{staticClass:"ma-2",attrs:{outlined:"",rounded:"",color:"primary",href:"https://github.com/nestorm001/",target:"_blank"}},[t._v("my github")]),i("v-switch",{staticClass:"top-left",attrs:{label:"Dark Mode"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)},n=[],a=i("d4ec"),o=i("bee2"),c=i("262e"),r=i("2caf"),l=i("9ab4"),h=i("60a3"),u=function(t){Object(c["a"])(i,t);var e=Object(r["a"])(i);function i(){var t;return Object(a["a"])(this,i),t=e.apply(this,arguments),t.clickCount=0,t}return Object(o["a"])(i,[{key:"click",value:function(){this.clickCount++,this.clickCount>=10&&(alert("The answer is 42!!!"),this.clickCount=0)}},{key:"value",get:function(){return this.$vuetify.theme.dark},set:function(t){this.$vuetify.theme.dark=t,localStorage.themeDark=t}}]),i}(h["c"]);u=Object(l["a"])([h["a"]],u);var d=u,p=d,v=i("2877"),f=i("6544"),g=i.n(f),b=i("8336"),m=i("b73d"),w=i("269a"),k=i.n(w),C=i("5607"),y=Object(v["a"])(p,s,n,!1,null,null,null);e["default"]=y.exports;g()(y,{VBtn:b["a"],VSwitch:m["a"]}),k()(y,{Ripple:C["a"]})}}]);
//# sourceMappingURL=about.acd13dbb.js.map