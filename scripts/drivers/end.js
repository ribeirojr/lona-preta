/* Show the "settlement won" end screen. */
const fire=el=>el&&!el.disabled&&el.dispatchEvent(new MouseEvent("click",{bubbles:true}));
const q=s=>document.querySelector(s);
fire(q('[data-land="0"]')); fire(q('[data-settle]'));
S.phase="won"; render(); openEnd();
