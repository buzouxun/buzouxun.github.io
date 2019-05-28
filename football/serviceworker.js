console.log("This is service worker talking!");

var cacheName = 'blazor-pwa-sample-v10';
var filesToCache = [
    './',
    //Html and css files
    './index.html',
    './css/site.css',
    './css/bootstrap/bootstrap.min.css',
    './css/open-iconic/font/css/open-iconic-bootstrap.min.css',
    './css/open-iconic/font/fonts/open-iconic.woff',
    //Blazor framework
    './_framework/blazor.webassembly.js',
    './_framework/blazor.boot.json',
    //Our additional files
    './manifest.json',
    './serviceworker.js',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    //The web assembly/.net dll's
    './_framework/wasm/mono.js',
    './_framework/wasm/mono.wasm',
    './_framework/_bin/HtmlAgilityPack.NetCore.dll',
    './_framework/_bin/Microsoft.AspNetCore.Blazor.dll',
    './_framework/_bin/Microsoft.AspNetCore.Components.Browser.dll',
    './_framework/_bin/Microsoft.AspNetCore.Components.dll',
    './_framework/_bin/Microsoft.Extensions.DependencyInjection.Abstractions.dll',
    './_framework/_bin/Microsoft.Extensions.DependencyInjection.dll',
    './_framework/_bin/Microsoft.JSInterop.dll',
    './_framework/_bin/Mono.Security.dll',
    './_framework/_bin/Mono.WebAssembly.Interop.dll',
    './_framework/_bin/mscorlib.dll',
    './_framework/_bin/System.ComponentModel.Annotations.dll',
    './_framework/_bin/System.Core.dll',
    './_framework/_bin/System.dll',
    './_framework/_bin/System.IO.FileSystem.Primitives.dll',
    './_framework/_bin/System.Linq.dll',
    './_framework/_bin/System.Net.Http.dll',
    './_framework/_bin/System.Text.RegularExpressions.dll',
    './_framework/_bin/System.Threading.dll',
    './_framework/_bin/System.Threading.Tasks.Extensions.dll',
    './_framework/_bin/System.System.Xml.ReaderWriter.dll',
    './_framework/_bin/System.System.Xml.XPath.dll',
    //The compiled project .dll's
    './_framework/_bin/blazor2.dll'
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        // https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim
        // self.clients.claim();
        // This ensures we have only the files we need in the cache, so we don't leave any garbage behind
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheName.indexOf(key) === -1) { return caches.delete(key); }
            }));
        }
    ));
});

self.addEventListener('fetch', function (event) {
    //event.respondWith(
    //    caches.match(event.request).then(function (r) {
    //        console.log('[Service Worker] Fetching resource: ' + event.request.url);
    //        return r || fetch(event.request).then(function (response) {
    //            return caches.open(cacheName).then(function (cache) {
    //                if (event.request.url.indexOf('http') !== -1) {
    //                    console.log('[Service Worker] Caching new resource: ' + event.request.url);
    //                    cache.put(event.request, response.clone());
    //                }
    //                return response;
    //            });
    //        });
    //    })
    //);
    event.respondWith(
        caches.match(event.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + event.request.url);
            return r || fetch(event.request);
        })
    );
});