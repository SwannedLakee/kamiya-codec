import{Q as c}from"./kamiya.min.0366543e.js";import{u as a,o as t,v as l}from"./jsxRuntime.module.5b307390.js";import{_ as s}from"./preact.module.e54f245b.js";import"./hooks.module.ee390651.js";function f(){const{input:e,dictionaryForm:i,ichidan:o}=a(l);if(e&&i)try{const r=c(e,i,o);return t(s,{children:[t("h3",{children:"Results"}),t("ul",{children:r.map((n,u)=>t("li",{children:[i," + (",n.auxiliaries.join("+"),") +"," ",n.conjugation," = ",n.result.join("・")]},u))})]})}catch(r){return t("h3",{children:["Result: (cannot deconjugate ",String(r),")"]})}return t("h3",{children:"Result: (awaiting for input)"})}export{f as default};
