/* Force a court case in the first camp so the "Repossession suit" panel and the log show up. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
const k=S.camps[0];
k.discovered=true; k.cas={owner:30,defense:14,months:4,laudo:0}; k.money=120;
log("log.mob"); log("log.laudo",{n:k.idle}); log("ev.fox",{n:2});
render();
