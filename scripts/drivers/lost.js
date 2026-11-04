/* Camp 0 is a settlement, camp 1 was evicted (lost for good), camp 2 starved. Shows the lost camp's screen and the map markers. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
for(const i of [0,1,2,3,4])S.camps[0].plots[i]={s:"terra"};
Object.assign(S.camps[0],{state:"won",endT:7,cas:null});
Object.assign(S.camps[1],{state:"lost",why:"evicted",endT:5,cas:null});
Object.assign(S.camps[2],{state:"lost",why:"hunger",endT:6,cas:null,families:0});
S.camps[3].discovered=true; S.camps[3].cas={owner:30,defense:14,months:3,laudo:0};
S.cur=1; render();
