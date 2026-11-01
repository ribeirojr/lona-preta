/* Force a court case so the "Repossession suit" panel and the log show up, then close the info modal. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
fire(q('[data-land="0"]')); fire(q('[data-settle]'));
S.discovered=true; S.cas={owner:30,defense:14,months:4,laudo:0}; S.money=120;
log("log.mob"); log("log.laudo",{n:S.land.idle}); log("ev.fox",{n:2});
render();
