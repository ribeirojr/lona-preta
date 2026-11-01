/* Occupy the first estate and open the feira (market) on the Buy tab. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
fire(q('[data-land="0"]')); fire(q('[data-settle]'));
fire(q('[data-a="market"]')); fire(q('[data-tab="buy"]'));
