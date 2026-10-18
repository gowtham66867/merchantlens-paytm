import {test} from 'node:test';import assert from 'node:assert/strict';
import {VoiceActivity} from '../lib/voice-activity.ts';
test('silence never becomes speech and expires without uploading',()=>{const v=new VoiceActivity(0);for(let t=0;t<10000;t+=50)assert.equal(v.sample(.002,t),'waiting');assert.equal(v.sample(.002,10000),'empty');});
test('brief clicks do not trigger speech; a sustained voice then pause ends',()=>{const v=new VoiceActivity(0,2000);assert.equal(v.sample(.1,0),'waiting');assert.equal(v.sample(.002,50),'waiting');for(let t=100;t<=400;t+=50)v.sample(.08,t);assert.equal(v.sample(.002,1500),'pause');assert.equal(v.sample(.002,2400),'stop');});
test('a thinking pause can resume and extended-pause mode waits longer',()=>{const v=new VoiceActivity(0,3500);for(let t=0;t<=300;t+=50)v.sample(.06,t);assert.equal(v.sample(.002,2300),'pause');assert.equal(v.sample(.07,2400),'speech');assert.equal(v.sample(.002,5800),'pause');assert.equal(v.sample(.002,5900),'stop');});
