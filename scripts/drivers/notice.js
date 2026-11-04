/* Two camps get news in the same month: the notices queue up and appear one after the other. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
S.camps[1].discovered=true; S.camps[1].cas={owner:90,defense:0,months:1,laudo:0};
S.camps[2].discovered=true; S.camps[2].cas={owner:0,defense:99,months:1,laudo:0};
fire(q('[data-a="next"]'));
