/* Work two camps (clear and plant), force a hearing in a third, then show camp 1. Tabs, map and plots all have something to show. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true})); // SVG elements have no .click()
const q=s=>document.querySelector(s);
for(const c of [0,1]){
  fire(q('[data-camp="'+c+'"]'));
  for(const i of [0,1,2,3,4]){fire(q('[data-p="'+i+'"]'));fire(q('[data-a="clear"]'))}
  for(const i of [0,1]){fire(q('[data-p="'+i+'"]'));fire(q('[data-a="plant"][data-c="feijao"]'))}
}
S.camps[2].discovered=true; S.camps[2].cas={owner:30,defense:14,months:2,laudo:0}; render();
fire(q('[data-camp="1"]'));
