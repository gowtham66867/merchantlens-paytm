// Cloud Run terminates HTTPS before forwarding to Node. Its internal request
// URL therefore isn't the browser's origin. Use an explicit runtime allowlist;
// never trust caller-controlled forwarded host/protocol headers for this check.
export function acceptsOrigin(request:Request):boolean {
 const origin=request.headers.get('origin');if(!origin)return true;
 if(process.env.K_SERVICE){
  return (process.env.APP_ALLOWED_ORIGINS||'').split('|').filter(Boolean).includes(origin);
 }
 return origin===new URL(request.url).origin;
}
