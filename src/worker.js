import server from '@astrojs/cloudflare/entrypoints/server';
const HOST='philaetemples.com';
export async function route(request,env,context,delegate=server){
 const url=new URL(request.url),head=request.method==='HEAD';
 if((url.hostname===HOST&&url.protocol==='http:')||url.hostname==='www.'+HOST){url.protocol='https:';url.hostname=HOST;url.port='';return new Response(null,{status:308,headers:{Location:url.href}});}
 const aliases={'/index':'/','/index.html':'/','/en':'/en/','/en/index':'/en/','/en/index.html':'/en/'};
 if(['GET','HEAD'].includes(request.method)&&Object.hasOwn(aliases,url.pathname)){url.pathname=aliases[url.pathname];return new Response(null,{status:308,headers:{Location:url.href}});}
 const errorAlias=/^\/(?:en\/)?404(?:\/|\.html)?$/.test(url.pathname),errorPath=url.pathname.startsWith('/en/')?'/en/404':'/404';
 let response=await delegate.fetch(errorAlias?new Request(new URL(errorPath,url),{method:'GET'}):request,env,context);
 if(errorAlias||response.status===404){if(!errorAlias)response=await delegate.fetch(new Request(new URL(errorPath,url),{method:'GET'}),env,context);const headers=new Headers(response.headers);headers.delete('Location');headers.set('X-Robots-Tag','noindex');headers.set('Cache-Control','no-store');response=new Response(head?null:response.body,{status:404,headers});}
 const headers=new Headers(response.headers);headers.set('X-Content-Type-Options','nosniff');headers.set('X-Frame-Options','DENY');headers.set('Referrer-Policy','strict-origin-when-cross-origin');headers.set('Permissions-Policy','geolocation=(), microphone=(), camera=()');headers.set('Strict-Transport-Security','max-age=63072000; includeSubDomains; preload');
 headers.set('Content-Security-Policy',"default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://cloudflareinsights.com; frame-src https://www.google.com");
 if(headers.get('Content-Type')?.includes('text/html'))headers.set('Cache-Control','no-store');
 return new Response(head?null:response.body,{status:response.status,statusText:response.statusText,headers});
}
export default {fetch:route};
