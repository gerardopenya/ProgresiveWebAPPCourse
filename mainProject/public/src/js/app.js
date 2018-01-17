//Se podria importar el service worker sw.js con un link dentro de los dos index.html (el principal y el de la carpeta help)
//pero como esas paginas ya incluyen el lin al app.js es mejor aqui
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    //.register('/sw.js', {scope: '/help/'})  asi se registra si quisieramos que solo quedara registrado para la carpeta help
    .register('/sw.js')
    .then( () => console.log("Service worker registered!"));    
}


