export const chapters=[
 {id:'before',name:'Before',at:0,art:'hero-poppy'},
 {id:'notice',name:'The other chair',at:.185,art:'hero-cafe'},
 {id:'little',name:'Little things',at:.27,art:'little-things'},
 {id:'waiting',name:'Waiting',at:.355,art:'waiting'},
 {id:'unsent',name:'Almost',at:.487,art:'unsent'},
 {id:'us',name:'The long way home',at:.58,art:'us-train'},
 {id:'distance',name:'Your side',at:.69,art:'distance'},
 {id:'trying',name:'Put it away',at:.77,art:'drawer'},
 {id:'impossible',name:'Everywhere',at:.855,art:'hero-letters'},
 {id:'love',name:'A place for them',at:1,art:'love-morning'},
];
export const boundaries=[0,.16,.23,.31,.42,.54,.65,.75,.82,.95,1.00001];
export function chapterIndex(p){return boundaries.findIndex((v,i)=>i<10&&p>=v&&p<boundaries[i+1])}

// Additional story beats share the original film timeline and do not change asset ownership.
export const narrative=[...chapters,{id:'hours',name:'After hours',at:.218},{id:'detour',name:'The detour',at:.628},{id:'light',name:'Let the light in',at:.934},{id:'pressed',name:'Between the pages',at:.298},{id:'blue',name:'Blue hour',at:.405},{id:'space',name:'The space between',at:.736}].sort((a,b)=>a.at-b.at);
