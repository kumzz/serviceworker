var CACHE = 'cache-v1';

this.addEventListener('install', function(event) {
  console.log('The service worker is being installed');
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/serviceworker/',
        '/serviceworker/index.html',
        '/serviceworker/app.js'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log('The service worker is serving the asset.');
  if (typeof Android != "undefined") {
    Android.showToast(toast);
    console.log('JS Bridge can be accessed from SW');
  }
  else {
    console.log('JS Bridge cannot be accessed from SW');
  }
   
  event.respondWith(fromCache(event.request));
  
  event.waitUntil(
    update(event.request).then(refresh)
  );
});

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: 'refresh',
        url: response.url,
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}
