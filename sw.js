'use strict';
// 每次发布修改 VERSION；新缓存完整就绪后，才提示用户更新。
const VERSION='1.1.0';
const PREFIX='ranke-shell-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION;
const FILES=['./','./index.html','./styles.css','./foods.js','./core.js','./app.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const URLS=FILES.map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(URLS.map(url=>new Request(url,{cache:'reload'})));})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url),base=new URL(self.registration.scope);if(url.origin!==base.origin)return;
if(req.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===base.pathname+'index.html')){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL('./index.html',base).href)||fetch(req);})());return;}
if(URLS.includes(url.href)){event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(url.href)||fetch(req);})());}
});
