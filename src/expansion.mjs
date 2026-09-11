import {newChapters} from './three-chapters.mjs';
export const expansionBeats=[...newChapters,
 {id:'pause',name:'The pause',at:.233,range:[.225,.229,.237,.242],scroll:[.225,.242,200],title:'Nothing<br><em>urgent.</em>',caption:'For once, the world could wait.'},
 {id:'proof',name:'Small proof',at:.317,range:[.309,.313,.319,.324],scroll:[.309,.324,240],title:'Small<br><em>proof.</em>',caption:'A whole evening in a pocket.'},
 {id:'home',name:'Almost home',at:.605,range:[.598,.602,.609,.614],scroll:[.598,.614,200],title:'The longer<br><em>way.</em>',caption:'Neither of you took the shortcut.'},
 {id:'platform',name:'Between trains',at:.712,range:[.704,.708,.715,.720],scroll:[.704,.720,200],title:'One stop.<br><em>Too far.</em>',caption:'You counted the spaces between.'},
 {id:'again',name:'Again',at:.992,range:[.988,.991,.994,.997],scroll:[.988,.997,260],title:'The beginning.<br><em>Again.</em>',caption:'Some things find their way back.'},
];
export const expansionScrollTotal=expansionBeats.reduce((sum,b)=>sum+b.scroll[2],0);
