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
});

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: 'refresh',
        url: response.url,
      };
      //client.postMessage(JSON.stringify(message));
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

function send_message_to_sw(msg){
  navigator.serviceWorker.controller.postMessage("Message from service worker: '"+msg+"'");
}

function displayMessage(message) {
  console.log('SW displaying message: ' + JSON.stringify(message));
}

function clearCache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.delete('/serviceworker/').then(function () {
      return cache.delete('/serviceworker/index.html').then(function () {
        return cache.delete('/serviceworker/app.js').then(function () {
          return true;
        });
      });
    });
  });
}

function cacheAssets() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
        '/serviceworker/',
        '/serviceworker/index.html',
        '/serviceworker/app.js'
      ]);
  });
}

function refreshUrl() {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      var message = {
        type: 'refresh'
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}

function triggerRefresh() {
  console.log('SW triggerRefresh called');
  clearCache().then(cacheAssets).then(refreshUrl).catch(function(e) {
    console.log('SW Error while refresh');
  }
}

self.addEventListener('message', function(event) {
    var data = event.data;

    if (data.command == "oneWayCommunication") {
        displayMessage(data.message);
    }
  
    if (data.message == "reload") {
      triggerRefresh();
    }
});
