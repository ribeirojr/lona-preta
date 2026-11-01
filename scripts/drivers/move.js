/* Same as play.js, then open the "Move the camp" modal for the cheapest estate. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
fire(q('[data-land="0"]')); fire(q('[data-settle]'));
for(const i of [0,1,2,3]){fire(q('[data-p="'+i+'"]'));fire(q('[data-a="clear"]'))}
let best=0,bc=1e9;S.estates.forEach((l,i)=>{const c=moveCost(l);if(c<bc){bc=c;best=i}});
fire(q('[data-land="'+best+'"]')); fire(q('[data-a="move"]'));
