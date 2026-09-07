/** User-triggered scene toys. One shared rendering clock; nothing is sent or stored. */
export function playthings({state,wake,signal}){
 const dock=document.createElement('div');dock.className='play-dock';dock.hidden=true;
 dock.innerHTML='<button id="scatter-petals">Make it bloom ↗</button><button id="write-letter">Write what you couldn’t say ↗</button><label id="thread-control">Pull the thread <input type="range" min="0" max="100" value="0" aria-label="Pull the red thread"><span>apart</span></label>';
 document.body.append(dock);
 const dialog=document.createElement('dialog');dialog.id='letter-dialog';dialog.setAttribute('aria-label','Your unsent letter');
 dialog.innerHTML='<button class="letter-close" aria-label="Close your letter">Close ×</button><form method="dialog" class="letter-paper"><span class="letter-eyebrow">SOME WORDS NEED A PLACE.</span><h2>Almost said it.</h2><label for="your-letter">What did you wish you had said?</label><textarea id="your-letter" maxlength="600" placeholder="I wish you knew…"></textarea><p class="letter-status" aria-live="polite">Just here, just for you. This note stays in this tab.</p><button type="button" class="fold-letter">Fold it away ↗</button></form>';
 document.body.append(dialog);
 const bloom=dock.querySelector('#scatter-petals'),write=dock.querySelector('#write-letter'),control=dock.querySelector('label'),range=control.querySelector('input'),paper=dialog.querySelector('form'),fold=dialog.querySelector('.fold-letter');
 let petals=[],mode='',tension=0,returnFocus=null,burstAt=0;
 const on=(el,type,fn)=>el.addEventListener(type,fn,{signal});
 on(bloom,'click',()=>{const {w,h,still,mobile}=state();burstAt=performance.now();petals=Array.from({length:mobile?40:64},(_,i)=>({x:w*.5,y:h*.7,vx:(Math.random()-.5)*w*.85,vy:-h*(.3+Math.random()*.65),size:10+Math.random()*22,angle:Math.random()*6,speed:(Math.random()-.5)*5}));bloom.textContent='Again. All of it. ↗';if(still)petals=petals.slice(0,18);wake()});
 on(write,'click',()=>{returnFocus=write;dialog.showModal();document.body.classList.add('memory-open');dialog.querySelector('textarea').focus();wake()});
 on(dialog.querySelector('.letter-close'),'click',()=>dialog.close());
 on(dialog,'close',()=>{document.body.classList.remove('memory-open');returnFocus?.focus({preventScroll:true});wake()});
 on(fold,'click',()=>{const folded=paper.classList.toggle('folded');fold.textContent=folded?'Open it again ↗':'Fold it away ↗';dialog.querySelector('textarea').readOnly=folded;dialog.querySelector('.letter-status').textContent=folded?'Kept. Unsent. Yours.':'Just here, just for you. This note stays in this tab.'});
 on(range,'input',()=>{tension=+range.value/100;control.querySelector('span').textContent=tension>.85?'a little closer':tension>.3?'still connected':'apart';wake()});
 return {get moving(){return petals.length>0&&!state().still},close(){dialog.close()},draw(ctx){
 const {p,w,h,still}=state();const next=p<.035||p>.974?'bloom':p>.451&&p<.52?'letter':p>.68&&p<.735?'thread':'';
 if(next!==mode){mode=next;petals=[];tension=0;range.value='0';control.querySelector('span').textContent='apart';bloom.textContent='Make it bloom ↗'}
 dock.hidden=!mode;dock.dataset.mode=mode;bloom.hidden=mode!=='bloom';write.hidden=mode!=='letter';control.hidden=mode!=='thread';
 if(mode==='thread'){
 const y=h*.59,spread=w*(.35-tension*.22),sag=h*(.17-tension*.15);ctx.save();ctx.strokeStyle='#f24149';ctx.lineWidth=3;ctx.shadowColor='#fd3030';ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(w/2-spread,y);ctx.bezierCurveTo(w*.4,y+sag,w*.6,y+sag,w/2+spread,y);ctx.stroke();for(const x of [w/2-spread,w/2+spread]){ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);ctx.fillStyle='#ef4249';ctx.fill()}ctx.restore();
 }
 if(petals.length){const t=still?.65:(performance.now()-burstAt)/1000;if(t>3){petals=[];return}ctx.save();ctx.globalAlpha=still?1:Math.min(1,(3-t)*1.4);for(const a of petals){ctx.save();ctx.translate(a.x+a.vx*t,a.y+a.vy*t+h*.28*t*t);ctx.rotate(a.angle+a.speed*t);ctx.fillStyle='#ca1e36';ctx.beginPath();ctx.moveTo(0,a.size);ctx.bezierCurveTo(-a.size*1.4,-a.size*.1,-a.size,-a.size*1.4,0,-a.size*.7);ctx.bezierCurveTo(a.size,-a.size*1.4,a.size*1.4,-a.size*.1,0,a.size);ctx.fill();ctx.strokeStyle='#ff7c6c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,a.size*.7);ctx.quadraticCurveTo(-a.size*.2,0,0,-a.size*.6);ctx.stroke();ctx.restore()}ctx.restore()}
 }};
}
