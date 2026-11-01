/* Occupy the first estate, clear 5 plots, plant 3, then select the cheapest estate on the map. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true})); // SVG elements have no .click()
const q=s=>document.querySelector(s);
fire(q('[data-land="0"]')); fire(q('[data-settle]'));
for(const i of [0,1,2,3,4]){fire(q('[data-p="'+i+'"]'));fire(q('[data-a="clear"]'))}
for(const i of [0,1,2]){fire(q('[data-p="'+i+'"]'));fire(q('[data-a="plant"][data-c="feijao"]'))}
let best=0,bc=1e9;S.estates.forEach((l,i)=>{const c=moveCost(l);if(c<bc){bc=c;best=i}});
fire(q('[data-land="'+best+'"]'));
