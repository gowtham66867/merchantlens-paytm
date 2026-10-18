import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {fileURLToPath} from 'node:url';

process.chdir(fileURLToPath(new URL('../',import.meta.url)));
const project=process.argv[2];
const publicDemo=process.argv.includes('--public-demo');
if(!project||!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(project))throw Error('Usage: node scripts/deploy-cloudrun.mjs PROJECT_ID');
const account='gowtham@texmed.us',region='asia-south1',service='merchantlens-paytm';
const identity=`merchantlens-runtime@${project}.iam.gserviceaccount.com`;
const secret='merchantlens-gemini-key';
function gc(args,{input,optional=false}={}){
 const r=spawnSync('gcloud',[...args,`--account=${account}`,`--project=${project}`,'--quiet'],{encoding:'utf8',input,maxBuffer:10*1024*1024});
 if(r.error)throw r.error;
 if(r.status!==0){if(optional)return null;throw Error(r.stderr||`gcloud ${args[0]} failed`);}
 return r.stdout.trim();
}
const data=JSON.parse(gc(['projects','describe',project,'--format=json']));
const bucket=`merchantlens-checkpoints-${data.projectNumber}`;
const local=parseEnv(readFileSync('.env.local','utf8'));
if(!local.GEMINI_API_KEY?.trim())throw Error('Set GEMINI_API_KEY in ignored .env.local before deploying.');
console.log(`Deploying ${service} to ${project}/${region} as ${account}. Access remains private.`);
gc(['services','enable','run.googleapis.com','cloudbuild.googleapis.com','artifactregistry.googleapis.com','secretmanager.googleapis.com','storage.googleapis.com']);
if(!gc(['iam','service-accounts','describe',identity,'--format=value(email)'],{optional:true}))gc(['iam','service-accounts','create','merchantlens-runtime','--display-name=MerchantLens Cloud Run runtime']);
if(!gc(['storage','buckets','describe',`gs://${bucket}`,'--format=value(name)'],{optional:true}))gc(['storage','buckets','create',`gs://${bucket}`,`--location=${region}`,'--uniform-bucket-level-access','--public-access-prevention']);
gc(['storage','buckets','add-iam-policy-binding',`gs://${bucket}`,`--member=serviceAccount:${identity}`,'--role=roles/storage.objectUser']);
if(!gc(['secrets','describe',secret,'--format=value(name)'],{optional:true}))gc(['secrets','create',secret,'--replication-policy=automatic']);
const versionName=gc(['secrets','versions','add',secret,'--data-file=-','--format=value(name)'],{input:local.GEMINI_API_KEY.trim()});
const version=versionName.split('/').at(-1);
if(!/^\d+$/.test(version||''))throw Error('Secret Manager did not return a version number.');
gc(['secrets','add-iam-policy-binding',secret,`--member=serviceAccount:${identity}`,'--role=roles/secretmanager.secretAccessor']);
// Stream build progress while keeping the API key out of command arguments.
const previousUrl=gc(['run','services','describe',service,`--region=${region}`,'--format=value(status.url)'],{optional:true});
const allowedOrigins=[previousUrl,`https://${service}-${data.projectNumber}.${region}.run.app`,'http://127.0.0.1:8088','http://localhost:8088'].filter(Boolean).join('|');
const runtimeVars=`GEMINI_MODEL=${local.GEMINI_MODEL||'gemini-3.5-flash-lite'},PUBLIC_DEMO=${publicDemo},APP_ALLOWED_ORIGINS=${allowedOrigins}`+(publicDemo?'':`,CLOUD_RUN_PRIVATE_OWNER=${account},CHECKPOINT_BUCKET=${bucket}`);
// First deploy behind existing authentication. Public access is enabled only
// after the ready revision has the public-demo checkpoint guard and config.
const deploy=['run','deploy',service,'--source=.',`--region=${region}`,`--service-account=${identity}`,'--no-allow-unauthenticated','--invoker-iam-check','--cpu=1','--memory=1Gi','--min-instances=0','--max-instances=2','--concurrency=8','--timeout=120',`--set-secrets=GEMINI_API_KEY=${secret}:${version}`,`--set-env-vars=${runtimeVars}`];
const r=spawnSync('gcloud',[...deploy,`--account=${account}`,`--project=${project}`,'--quiet'],{stdio:'inherit'});
if(r.status!==0)throw Error('Cloud Run deployment failed. Inspect build output above.');
gc(['run','services','add-iam-policy-binding',service,`--region=${region}`,`--member=user:${account}`,'--role=roles/run.invoker']);
const url=gc(['run','services','describe',service,`--region=${region}`,'--format=value(status.url)']);
if(publicDemo){
 gc(['run','services','update',service,`--region=${region}`,'--no-iap']);
 // Google's recommended public-access setting also supports projects using
 // domain-restricted sharing, without adding an allUsers IAM binding.
 gc(['run','services','update',service,`--region=${region}`,'--no-invoker-iam-check']);
 const response=await fetch(url+'/api/provider',{redirect:'manual',signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(`Public provider check failed (${response.status}).`);
 const provider=await response.json();if(!provider.publicDemo||!provider.configured)throw Error('Public demo runtime is not configured correctly.');
 for(const method of ['GET','PUT']){const checkpoint=await fetch(url+'/api/checkpoints',{method,signal:AbortSignal.timeout(30000)});if(checkpoint.status!==403)throw Error('Public demo must not expose private checkpoints.');}
 console.log(JSON.stringify({url,project,region,model:provider.model,public:true,cloudCheckpoints:false},null,2));
 process.exit(0);
}
const policy=JSON.parse(gc(['run','services','get-iam-policy',service,`--region=${region}`,'--format=json']));
if(policy.bindings?.some(b=>b.members?.some(m=>m==='allUsers'||m==='allAuthenticatedUsers')))throw Error('Service has a broader existing IAM policy; private deployment cannot be confirmed.');
const metadata=JSON.parse(gc(['run','services','describe',service,`--region=${region}`,'--format=json(metadata.annotations)']));
const iapEnabled=metadata.metadata?.annotations?.['run.googleapis.com/iap-enabled']==='true';
const publicProbe=await fetch(url+'/api/provider',{redirect:'manual',signal:AbortSignal.timeout(30000)});
if(publicProbe.ok)throw Error('Cloud Run accepted an unauthenticated invocation unexpectedly.');
if(iapEnabled){
 const location=publicProbe.headers.get('location');
 if(publicProbe.status!==302||!location||new URL(location).hostname!=='accounts.google.com')throw Error('IAP did not redirect to Google sign-in.');
 const access=JSON.parse(gc(['iap','web','get-iam-policy',`--region=${region}`,'--resource-type=cloud-run',`--service=${service}`,'--format=json']));
 if(!access.bindings?.some(b=>b.role==='roles/iap.httpsResourceAccessor'&&b.members?.includes(`user:${account}`)))throw Error('The requested account is missing IAP browser access.');
 console.log(JSON.stringify({url,project,region,private:true,browserSignIn:true,browserVerificationRequired:true},null,2));
}else{
 const token=gc(['auth','print-identity-token']);
 const status=await fetch(url+'/api/provider',{headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(30000)});
 if(!status.ok)throw Error(`Hosted provider check failed (${status.status}).`);
 const provider=await status.json();if(!provider.configured)throw Error('Hosted Gemini secret is unavailable.');
 console.log(JSON.stringify({url,project,region,model:provider.model,private:true,secretConfigured:true},null,2));
}
