/* Open the feira (market) of the first camp on the Buy tab. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
fire(q('[data-a="market"]')); fire(q('[data-tab="buy"]'));
