if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker/sw.js', { scope: '/serviceworker/' }).then(function(reg) {
    
    if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }
    
  }).catch(function(error) {
    console.log('Registration failed with ' + error);
  });
  
  navigator.serviceWorker.onmessage = function (event) {
    var message = JSON.parse(event.data);
    
    var isRefresh = message.type === 'refresh';
    if (isRefresh) {
      console.log('Received a message from service worker');
    }
    var isAsset = message.url.includes('asset');
    console.log('Reloading page');
    location.reload();
  }
  
  navigator.serviceWorker.addEventListener('controllerchange', function(event) {
    console.log('A controllerchange event has happened');
  });
    
  navigator.serviceWorker.controller.addEventListener('statechange', function() {
      console.log('A statechange has occured');
  });
}

