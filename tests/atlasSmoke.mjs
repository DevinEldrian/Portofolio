import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {chromium} from 'playwright'
await mkdir('atlas-artifacts',{recursive:true})
const browser=await chromium.launch({headless:true,args:[
  '--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader'
]})
try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
  const errors=[]
  page.on('pageerror',e=>errors.push(e.message))
  await page.goto('http://127.0.0.1:4175/',{waitUntil:'domcontentloaded',timeout:30000})
  await page.locator('.kiseki-atlas').waitFor({state:'visible',timeout:12000})
  await page.locator('.atlas-webgl canvas').waitFor({state:'visible',timeout:40000})
  assert.equal(await page.locator('.atlas-destination').count(),4)
  await page.waitForTimeout(1000)
  await page.screenshot({path:'atlas-artifacts/real-time-world-atlas-desktop.png'})
  assert.deepEqual(errors,[],'WebGL world-map page exception')
  console.log('PASS: real WebGL world atlas rendered with 4 interactive region cards')

  await page.getByRole('button',{name:/AKIHABARA.*NEON/i}).click()
  await page.locator('.canvas canvas').waitFor({state:'visible',timeout:30000})
  await page.getByRole('heading',{name:/AKIHABARA/i}).waitFor({state:'visible'})
  assert.equal(await page.locator('.error-backdrop').count(),0)
  await page.screenshot({path:'atlas-artifacts/entered-akihabara-3d.png'})
  console.log('PASS: Tokyo destination enters actual interactive Akihabara world')

  const small=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
  await small.goto('http://127.0.0.1:4175/',{waitUntil:'domcontentloaded'})
  await small.locator('.kiseki-atlas').waitFor({state:'visible'})
  await small.locator('.atlas-destination').first().waitFor({state:'visible'})
  await small.screenshot({path:'atlas-artifacts/world-atlas-mobile.png'})
  assert.equal(await small.locator('.atlas-destination').count(),4)
  console.log('PASS: responsive city selector remains accessible on mobile viewport')
  await small.close()
  console.log('ATLAS WEBGL SMOKE PASS: 3 scenarios')
}catch(e){
  console.error('ATLAS WEBGL SMOKE FAIL',e.stack||String(e))
  process.exitCode=1
}finally{
  await browser.close()
}
