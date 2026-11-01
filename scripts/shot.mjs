#!/usr/bin/env node
/*
 * Screenshot the game in headless Chrome. No dependencies.
 *
 *   node scripts/shot.mjs <night|bandeira> <out.png> [driver.js] [width] [height]
 *
 * driver.js (optional) is a small script appended to a TEMP COPY of index.html
 * (your index.html is never modified). It runs after the game boots and can click
 * through the game. See scripts/drivers/*.js and docs/TESTING.md.
 * Set CHROME=/path/to/chrome if Chrome is not at the macOS default.
 *
 * Phone widths: headless Chrome will not make a window narrower than ~500 px, so when width < 500
 * the game is shown inside an <iframe> of exactly that width. Its media queries and layout then
 * behave like a real phone, and the image is 500 px wide with the phone on the left (grey margin).
 */
import {readFileSync,writeFileSync,mkdtempSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,dirname,resolve} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {execFileSync} from "node:child_process";

const [theme,out,driver,w="1100",h="1000"]=process.argv.slice(2);
if(!["night","bandeira"].includes(theme)||!out){console.error("usage: node scripts/shot.mjs <night|bandeira> <out.png> [driver.js] [width] [height]");process.exit(2)}
const root=join(dirname(fileURLToPath(import.meta.url)),"..");
const chrome=process.env.CHROME||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
let page=readFileSync(join(root,"index.html"),"utf8");
if(driver)page=page.replace("</body>",`<script>\n${readFileSync(resolve(driver),"utf8")}\n</script>\n</body>`);
const dir=mkdtempSync(join(tmpdir(),"lonapreta-"));
writeFileSync(join(dir,"index.html"),page);
const gameUrl=pathToFileURL(join(dir,"index.html")).href+"?theme="+theme;
let url=gameUrl,winW=+w;
if(+w<500){
  writeFileSync(join(dir,"phone.html"),`<!doctype html><body style="margin:0;background:#888"><iframe src="${gameUrl}" style="width:${+w}px;height:${+h}px;border:0;display:block"></iframe></body>`);
  url=pathToFileURL(join(dir,"phone.html")).href; winW=500;
}
// a fresh --user-data-dir means no saved game and no saved theme leak into the run
execFileSync(chrome,["--headless=new","--disable-gpu","--hide-scrollbars",`--user-data-dir=${join(dir,"profile")}`,`--window-size=${winW},${h}`,"--virtual-time-budget=4000",`--screenshot=${resolve(out)}`,url],{stdio:"ignore"});
console.log("wrote "+resolve(out));
