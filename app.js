if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/serviceworker/sw.js').then(function(reg) {
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
    if (isRefresh && typeof Android != "undefined") {
      console.log('Received a refresh message from service worker');
      console.log('app.js: Reloading page');
      Android.reload();
    }
  }
  
  navigator.serviceWorker.addEventListener('controllerchange', function(event) {
    console.log('A controllerchange event has happened');
  });
}
