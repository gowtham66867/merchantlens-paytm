import {test} from 'node:test';import assert from 'node:assert/strict';
import {acceptsOrigin} from '../lib/request-origin.ts';
test('Cloud Run accepts only explicit external origins despite an internal HTTP request URL',()=>{
 const old={service:process.env.K_SERVICE,origins:process.env.APP_ALLOWED_ORIGINS};
 process.env.K_SERVICE='merchantlens-test';process.env.APP_ALLOWED_ORIGINS='https://merchant.test|http://127.0.0.1:8088';
 try{
  assert(acceptsOrigin(new Request('http://internal:8080/api/interview',{headers:{Origin:'https://merchant.test'}})));
  assert(acceptsOrigin(new Request('http://internal:8080/api/interview',{headers:{Origin:'http://127.0.0.1:8088'}})));
  assert(!acceptsOrigin(new Request('http://internal:8080/api/interview',{headers:{Origin:'https://evil.test','x-forwarded-host':'evil.test','x-forwarded-proto':'https'}})));
  assert(!acceptsOrigin(new Request('http://internal:8080/api/interview',{headers:{Origin:'https://merchant.test.evil.test'}})));
  delete process.env.APP_ALLOWED_ORIGINS;assert(!acceptsOrigin(new Request('http://internal:8080/api/interview',{headers:{Origin:'https://merchant.test'}})));
 }finally{for(const [key,value] of [['K_SERVICE',old.service],['APP_ALLOWED_ORIGINS',old.origins]]){if(value===undefined)delete process.env[key!];else process.env[key!]=value;}}
});
test('Sites and local targets retain same-origin checks; server requests without Origin work',()=>{
 const old=process.env.K_SERVICE;delete process.env.K_SERVICE;try{
  assert(acceptsOrigin(new Request('https://merchant.test/api')));
  assert(acceptsOrigin(new Request('https://merchant.test/api',{headers:{Origin:'https://merchant.test'}})));
  assert(!acceptsOrigin(new Request('https://merchant.test/api',{headers:{Origin:'https://evil.test'}})));
 }finally{if(old!==undefined)process.env.K_SERVICE=old;}
});
