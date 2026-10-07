// ============================================
// SERVICE WORKER - VERSIÓN 1
// ============================================
// IMPORTANTE: Cada vez que hagas cambios importantes en la web,
// cambia el número de versión aquí abajo (ej: de 'v1' a 'v2')
// para que el móvil actualice la caché automáticamente.
// ============================================

const VERSION = 'v1';
const CACHE_NAME = `liga-veteranos-${VERSION}`;

// Lista de archivos que se guardarán en caché
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './escudos/logo_liga.png',
  './escudos/icono_512.png'
];

// INSTALACIÓN: Guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Fuerza la activación inmediata
  );
});

// ACTIVACIÓN: Borra las cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de todas las pestañas
  );
});

// PETICIONES: Primero busca en caché, si no está lo descarga
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Devuelve desde caché
        }
        return fetch(event.request); // Si no está, lo descarga
      })
  );
});
