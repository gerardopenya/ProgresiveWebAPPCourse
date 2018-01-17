const STATIC_CACHE_NAME   = "cacheEStatico-V1"; 
const DYNAMIC_CACHE_NAME  = "cacheDinamico-V1";


self.addEventListener('install', event => {
    console.log("[Service Worker] Installing Service Worker ...", event);
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
        .then(cache => {
            console.log("[Sevice Worker] Precaching App Shell");
            //Analizando el archivo index.html decidimos que archivos cahcear de forma estatica
            let precachingRoutes = [
                "/",
                "/index.html",

                "/src/js/app.js",
                "/src/js/feed.js",
                "/src/js/material.min.js",

                "/src/images/main-imate-lg.jpg",

                "/src/css/app.css",
                "/src/css/feed.css",

                "https://fonts.googleapis.com/css?family=Roboto:400,700",
                "https://fonts.googleapis.com/icon?family=Material+Icons",
                "https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"                
            ]

            cache.addAll(precachingRoutes)
            
        }).catch(error => console.log("fallo el cacheo", error))
    )
})



/*
if you update your code on the service wokrer you need to close any tab with the application
and then reopen it OR in the Application tab of the google developer tools click update 
or skeepWaiting to activate it
*/
self.addEventListener("activate",  event => {
    console.log('[Service Worker] Activating Service Worker ... ', event);

    event.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all( keyList.map( key =>{
                if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
                    console.log("[Service Worker] Removing old cache", key );
                    return caches.delete(key);
                }
            } ))
        })
    );


    return self.clients.claim(); //ensures that the service worker work without issues maybe this line won't be needed in the future
})



/* 
triggered when our application fetch someting like html pages that loads assets as scripts, images, or css files, 
it is triggered if whe manually send a fetch request obviouslly
*/

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
        .then( response => {
            if (response) {
                return response;
            } else {
                return fetch(event.request)
                .then( resp => {
                    return caches.open(DYNAMIC_CACHE_NAME).then( dynamicCache => {
                        dynamicCache.put(event.request.url, resp.clone());
                        return resp
                    })
                })
            }
        })
    );
})