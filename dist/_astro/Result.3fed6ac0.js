import{a}from"./kamiya.min.0366543e.js";import{u as c,o as t,b as u,a as l}from"./jsxRuntime.module.5b307390.js";import{_ as d}from"./preact.module.e54f245b.js";import"./hooks.module.ee390651.js";function p(){const{adj:r,iAdj:o,conj:i}=c(l);if(r)try{const e=a(r,i,o);return t(d,{children:[t("h3",{children:"Result"}),t("ul",{children:e.map(n=>t("li",{children:[n," ",t("button",{onClick:()=>{u.set({input:n,dictionaryForm:r,iAdj:o})},children:"Try to deconjugate"})]},n))})]})}catch(e){return t("h3",{children:["Result: (cannot conjugate ",String(e),")"]})}return t("h3",{children:"Result: (awaiting for input)"})}export{p as default};
