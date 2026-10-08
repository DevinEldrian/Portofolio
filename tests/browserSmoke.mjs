import assert from 'node:assert/strict'
import {mkdir} from 'node:fs/promises'
import {chromium} from 'playwright'

const url='http://127.0.0.1:4175'
await mkdir('artifacts',{recursive:true})
const browser=await chromium.launch({
  headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--enable-unsafe-swiftshader']
})
let passes=0
let page
try{
  page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'})
  const errors=[]
  page.on('pageerror',err=>errors.push(String(err.message)))
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000})
  await page.locator('.canvas canvas').waitFor({state:'visible',timeout:25000})
  await page.waitForTimeout(900)
  assert.equal(await page.locator('.error-backdrop').count(),0,'WebGL error overlay appeared')
  const size=await page.locator('.canvas canvas').evaluate(el=>[el.width,el.height])
  assert.ok(size[0]>=600&&size[1]>=350,'canvas dimensions too small')
  await page.screenshot({path:'artifacts/kyoto-desktop.png',fullPage:false})
  console.log('PASS: browser launched an actual WebGL Kyoto frame');passes++

  // Use a *real focusable* canvas container and observe the world-space pose,
  // not only a HUD icon updated once every eight render frames.
  await page.locator('.canvas').focus()
  const read=()=>page.evaluate(()=>window.__KISEKI_QA__?.snapshot())
  const before=await read()
  assert.ok(before,'development QA snapshot was not installed')
  await page.keyboard.down('w')
  await page.waitForTimeout(1600)
  const held=await read()
  await page.keyboard.up('w')
  await page.waitForTimeout(150)
  const after=await read()
  console.log('W INPUT DIAGNOSTICS:',JSON.stringify({before,held,after}))
  assert.ok(after.frameCount>before.frameCount,'WebGL frames stalled during W test')
  assert.ok(after.z<before.z-.2,'W key failed to move avatar forward')
  assert.equal(await page.locator('.error-backdrop').count(),0,'W caused a blank screen/error')
  console.log('PASS: W movement, camera render and finite world frame');passes++
  // Return near the shop CV kiosk for the story test.
  await page.keyboard.down('s')
  await page.waitForTimeout(1600)
  await page.keyboard.up('s')
  await page.waitForTimeout(200)

  await page.getByRole('button',{name:'LIGHT DRIZZLE'}).click()
  assert.equal(await page.getByRole('button',{name:'LIGHT DRIZZLE'}).getAttribute('aria-pressed'),'true')
  await page.getByRole('button',{name:'GOLDEN HOUR'}).click()
  console.log('PASS: Kyoto weather mode controls');passes++

  const story=page.getByRole('button',{name:/READ CV STORY/i})
  await story.waitFor({state:'visible',timeout:6000})
  await story.click()
  await page.getByRole('dialog',{name:/E-Claim/i}).waitFor({state:'visible'})
  await page.keyboard.press('Escape')
  assert.equal(await page.getByRole('dialog',{name:/E-Claim/i}).count(),0)
  console.log('PASS: CV story can open and Escape closes panel');passes++

  await page.locator('.next-cta').click()
  await page.locator('.transit').waitFor({state:'visible'})
  await page.getByText(/Avatar boarding/i).waitFor({state:'visible'})
  await page.getByText(/Inside the cabin/i).waitFor({state:'visible',timeout:6000})
  await page.screenshot({path:'artifacts/rail-cabin.png'})
  await page.getByRole('button',{name:/SKIP TO ARRIVAL/i}).click()
  await page.getByText(/Arriving at the next platform/i).waitFor({state:'visible',timeout:2500})
  await page.getByRole('button',{name:/SKIP TO ARRIVAL/i}).click()
  await page.locator('.transit').waitFor({state:'hidden',timeout:6000})
  assert.match(await page.locator('.hero h1').innerText(),/TOKYO/i)
  console.log('PASS: rendered train window phase, skip, arrive and exit');passes++
  assert.deepEqual(errors,[],'JavaScript page exceptions in desktop smoke')

  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'})
  const mobileErrors=[]
  mobile.on('pageerror',err=>mobileErrors.push(String(err.message)))
  await mobile.goto(url,{waitUntil:'domcontentloaded',timeout:30000})
  await mobile.locator('.canvas canvas').waitFor({state:'visible',timeout:25000})
  assert.ok(await mobile.locator('.touch-key').count()>=4)
  await mobile.getByRole('button',{name:/QUICK VIEW/i}).click()
  await mobile.screenshot({path:'artifacts/kyoto-mobile-cv.png'})
  assert.equal(await mobile.locator('.error-backdrop').count(),0,'mobile WebGL context error')
  assert.deepEqual(mobileErrors,[])
  console.log('PASS: mobile touch controls and WebGL-independent Quick View');passes++
  await mobile.close()
  console.log('BROWSER SMOKE PASS: '+passes+' scenarios; screenshots in artifacts/')
}catch(error){
  if(page)await page.screenshot({path:'artifacts/browser-failure.png'}).catch(()=>{})
  console.error('BROWSER SMOKE FAIL:',error.stack||String(error))
  process.exitCode=1
}finally{await browser.close()}
