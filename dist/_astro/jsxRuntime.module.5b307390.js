import{h as v,p as _}from"./hooks.module.ee390651.js";import{l as d}from"./preact.module.e54f245b.js";let u=[],p=(s,t)=>{let l,n=[],i={lc:0,l:t||0,value:s,set(r){i.value=r,i.notify()},get(){return i.lc||i.listen(()=>{})(),i.value},notify(r){l=n;let f=!u.length;for(let e=0;e<l.length;e+=2)u.push(l[e],i.value,r,l[e+1]);if(f){for(let e=0;e<u.length;e+=4){let o=!1;for(let a=e+7;a<u.length;a+=4)if(u[a]<u[e+3]){o=!0;break}o?u.push(u[e],u[e+1],u[e+2],u[e+3]):u[e](u[e+1],u[e+2])}u.length=0}},listen(r,f){return n===l&&(n=n.slice()),i.lc=n.push(r,f||i.l)/2,()=>{n===l&&(n=n.slice());let e=n.indexOf(r);~e&&(n.splice(e,2),i.lc--,i.lc||i.off())}},subscribe(r,f){let e=i.listen(r,f);return r(i.value),e},off(){}};return i},c=(s={})=>{let t=p(s);return t.setKey=function(l,n){typeof n>"u"?l in t.value&&(t.value={...t.value},delete t.value[l],t.notify(l)):t.value[l]!==n&&(t.value={...t.value,[l]:n},t.notify(l))},t};function h(s,t,l){let n=new Set([...t,void 0]);return s.listen((i,r)=>{n.has(r)&&l(i,r)})}function g(s,t={}){let[,l]=v({});return _(()=>{let n,i,r,f=()=>{n||(n=1,i=setTimeout(()=>{n=void 0,l({})}))};return t.keys?r=h(s,t.keys,f):r=s.listen(f),()=>{r(),clearTimeout(i)}},[s,""+t.keys]),s.get()}const b=c({auxs:[],conj:"Negative",verb:"",ichidan:!1}),S=c({adj:"",iAdj:!0,conj:"Negative"}),x=c({input:"",dictionaryForm:"",ichidan:!1}),k=c({input:"",dictionaryForm:"",iAdj:!0});var j=0;function L(s,t,l,n,i,r){var f,e,o={};for(e in t)e=="ref"?f=t[e]:o[e]=t[e];var a={type:s,props:o,key:l,ref:f,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--j,__source:i,__self:r};if(typeof s=="function"&&(f=s.defaultProps))for(e in f)o[e]===void 0&&(o[e]=f[e]);return d.vnode&&d.vnode(a),a}export{S as a,k as b,b as c,L as o,g as u,x as v};
