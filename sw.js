var CACHE = 'cache-v1';

this.addEventListener('install', function(event) {
  console.log('The service worker is being installed');
  /*
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll([
        '/serviceworker/',
        '/serviceworker/index.html',
        '/serviceworker/app.js'
      ]);
    })
  );
  */
});

/*
this.addEventListener('fetch', function(event) {
  console.log('The service worker is serving the asset.'); 
  event.respondWith(fromCache(event.request));
});
*/

/*
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}
*/

/*
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}
*/

function displayMessage(message) {
  console.log('SW displaying message: ' + JSON.stringify(message));
}

/*
function clearCache() {
  return caches.open(CACHE).then(function(cache) {
    return cache.delete('/serviceworker/').then(function () {
      return cache.delete('/serviceworker/index.html').then(function () {
        return cache.delete('/serviceworker/app.js').then(function () {
          console.log('Cleared all cache');
          return true;
        });
      });
    }).catch(function(error) {
      console.log('Error while clearing cache: ' + error);
    });
  });
}
*/

/*
function cacheAssets() {
  return caches.open(CACHE).then(function(cache) {
    return cache.addAll([
        '/serviceworker/',
        '/serviceworker/index.html',
        '/serviceworker/app.js'
      ]);
  });
}
*/

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

/*
function triggerRefresh() {
  console.log('SW triggerRefresh called');
  clearCache().then(cacheAssets).then(refreshUrl).catch(function(e) {
    console.log('SW Error while refresh');
  });
}
*/

self.addEventListener('message', function(event) {
    var data = event.data;
    if (data.message == "reload") {
      //triggerRefresh();
      console.log('SW has received a reload message');
      
      setTimeout(function() {
        // Call a JSBridge API to clear cache and reload
        refreshUrl().then(function() {
          console.log('SW Refresh and reload has been triggered');
        })
        .catch(function() {
          console.log('SW Exception while doing refresh and reload');
        });
      }, 10000);
    }
});
