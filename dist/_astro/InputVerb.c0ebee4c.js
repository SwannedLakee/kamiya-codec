import{u as c,o as e,c as n}from"./jsxRuntime.module.5b307390.js";import{V as o}from"./godanIchidan.min.4a06ec8a.js";import{n as d}from"./Numbered.f564ea0e.js";import"./hooks.module.ee390651.js";import"./preact.module.e54f245b.js";function b(){const{verb:i,ichidan:r}=c(n);return e("p",{children:[e("label",{children:[d(1)," Here is my ",e("b",{children:"verb"}),"!"," ",e("input",{size:6,type:"text",name:"verb",value:i,onInput:t=>{const a=t.target.value;n.setKey("verb",a),n.setKey("ichidan",o(i)==="ichidan")}}),"."]})," ",e("label",{children:["And it’s an",e("ruby",{children:["一段",e("rt",{children:"ichidan"})]})," ","る-verb:"," ",e("input",{type:"checkbox",name:"ichidan",checked:r,onChange:()=>n.setKey("ichidan",!r)})]})]})}export{b as default};
