#!/usr/bin/env node
/*
 * Static checks for Lona Preta. No dependencies: `node scripts/check.mjs`
 * Exit code 0 = all good, 1 = at least one error. Read docs/TESTING.md.
 *
 * What it verifies
 *   1. The game script has valid JavaScript syntax.
 *   2. I18N: `en` and `pt` have exactly the same keys, the same {placeholders},
 *      the same <b>/<em> tags, and every "key_1" plural has a base "key".
 *   3. Every dictionary key written as a string literal in the code exists
 *      (catches typos such as tr("map.titel")).
 *   4. THEMES: every colour variable in :root is redefined in the bandeira
 *      theme (unless listed as constant), and every var(--x) used is defined.
 * Unused keys are only warnings.
 */
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,join} from "node:path";
import vm from "node:vm";

const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const html=readFileSync(join(root,"index.html"),"utf8");
const errors=[],warnings=[];
const err=m=>errors.push(m), warn=m=>warnings.push(m);

/* ---- split the page into CSS and JS ---- */
const css=(html.match(/<style>([\s\S]*?)<\/style>/)||[])[1];
const js=(html.match(/<script>([\s\S]*?)<\/script>/)||[])[1];
if(!css)err("Could not find the <style> block in index.html");
if(!js)err("Could not find the <script> block in index.html");
if(!css||!js)finish();

/* ---- 1. syntax ---- */
try{new vm.Script(js,{filename:"index.html <script>"})}
catch(e){err("JavaScript syntax error: "+e.message)}

/* ---- 2. i18n parity ---- */
const block=(js.match(/\/\* i18n:begin \*\/([\s\S]*?)\/\* i18n:end \*\//)||[])[1];
let I18N=null;
if(!block)err("i18n markers `/* i18n:begin */` and `/* i18n:end */` not found");
else{
  try{I18N=vm.runInNewContext("("+block.trim().replace(/^const I18N=/,"").replace(/;$/,"")+")")}
  catch(e){err("Could not evaluate the I18N block: "+e.message)}
}
const placeholders=s=>[...s.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort().join(",");
const tags=s=>[...s.matchAll(/<\/?(\w+)>/g)].map(m=>m[0]).sort().join("");
if(I18N){
  const en=Object.keys(I18N.en),pt=Object.keys(I18N.pt);
  for(const k of en)if(!(k in I18N.pt))err(`i18n: key "${k}" is in en but missing in pt`);
  for(const k of pt)if(!(k in I18N.en))err(`i18n: key "${k}" is in pt but missing in en`);
  for(const k of en){
    if(!(k in I18N.pt))continue;
    const a=I18N.en[k],b=I18N.pt[k];
    if(typeof a!=="string"||typeof b!=="string"){err(`i18n: "${k}" must be a string in both languages`);continue}
    if(placeholders(a)!==placeholders(b))err(`i18n: "${k}" uses different {placeholders}: en [${placeholders(a)}] vs pt [${placeholders(b)}]`);
    if(tags(a)!==tags(b))err(`i18n: "${k}" uses different HTML tags in en and pt`);
    if(/<(?!\/?(b|em)>)/.test(a+b))err(`i18n: "${k}" contains HTML other than <b> and <em>`);
    if(k.endsWith("_1")&&!(k.slice(0,-2) in I18N.en))err(`i18n: plural "${k}" has no base key "${k.slice(0,-2)}"`);
  }

  /* ---- 3. keys referenced in code exist ---- */
  const prefixes=new Set(en.map(k=>k.split(".")[0]));
  const used=new Set();
  const code=js.replace(block,"");                       // do not scan the dictionary itself
  for(const m of code.matchAll(/["']([a-z]+\.[A-Za-z0-9_.]*[A-Za-z0-9_])["']/g)){
    const key=m[1];
    if(!prefixes.has(key.split(".")[0]))continue;        // not a dictionary key (e.g. "p.s")
    used.add(key);
    if(!(key in I18N.en))err(`code uses i18n key "${key}" which does not exist`);
  }
  /* keys built dynamically in code: tr("month."+n), tr("shop."+k), tr("crop."+k+".gloss"), tr("howto."+i) */
  const dynamic=["month.","shop.","crop.","howto."];
  for(const k of en){
    const base=k.endsWith("_1")?k.slice(0,-2):k;
    if(!used.has(base)&&!dynamic.some(p=>k.startsWith(p)))warn(`i18n: key "${k}" is never referenced in the code`);
  }
}

/* ---- 4. theme variables ---- */
const varsIn=body=>new Set([...body.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
const night=(css.match(/:root\{([\s\S]*?)\n\}/)||[])[1];
const band=(css.match(/:root\[data-theme="bandeira"\]\{([\s\S]*?)\n\}/)||[])[1];
if(!night)err("Could not find the `:root{...}` (night) theme block");
if(!band)err('Could not find the `:root[data-theme="bandeira"]{...}` theme block');
if(night&&band){
  const N=varsIn(night),B=varsIn(band);
  /* Variables that are the same in both themes on purpose (see docs/THEMES.md). */
  const constant=v=>/^--(soil|soil-2|soil-line|art-[\w-]+|on-dark|display|body)$/.test(v);
  for(const v of N)if(!B.has(v)&&!constant(v))err(`theme: ${v} is defined for night but not overridden in bandeira (add it, or add it to the constant list in scripts/check.mjs and docs/THEMES.md)`);
  for(const v of B)if(!N.has(v))err(`theme: ${v} is defined in bandeira but not in :root`);
  const defined=N;
  const usedVars=new Set([...(css+js).matchAll(/var\((--[\w-]+)/g)].map(m=>m[1]));
  for(const v of usedVars)if(!defined.has(v))err(`theme: var(${v}) is used but never defined in :root`);
}

finish();
function finish(){
  for(const w of warnings)console.log("warn  "+w);
  for(const e of errors)console.log("ERROR "+e);
  if(errors.length){console.log(`\n${errors.length} error(s). Fix them, then run again.`);process.exit(1)}
  console.log(`OK: syntax, i18n (${I18N?Object.keys(I18N.en).length:0} keys x 2 languages) and theme variables all check out`+(warnings.length?` (${warnings.length} warning(s))`:""));
}
