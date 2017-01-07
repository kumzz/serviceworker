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
      //setTimeout(function() {
        if (document.hidden) {
          console.log('app.js: Webview is hidden.');
          Android.reload();
        } else {
        console.log('app.js: Webview is visible. Not reloading page');
        }
      //}, 10000);
    }
  }
  
  navigator.serviceWorker.addEventListener('controllerchange', function(event) {
    console.log('A controllerchange event has happened');
  });

  navigator.serviceWorker.ready.then(function(registration) {
    if (registration.periodicSync) {
      
      registration.periodicSync.register({
        tag: 'reload-trigger',         // default: ''
        minPeriod: 10000,
        powerState: 'auto',
        networkState: 'online'
      })
      .then(function(periodicSyncReg) {
        // success
        console.log('Periodic sync registration successful');
      })
      .catch(function(error) {
        // failure
        console.log('Error in periodic sync registration');
      })
    } else {
      console.log('app.js: Periodic sync is not supported');
    }
  });
  
  navigator.serviceWorker.ready.then(function(registration) {
    if (registration.sync) {
      registration.sync.register('reload-sync').then(function() {
        console.log('Sync registration successful');
      }, function() {
        console.log('Error in sync registration');
      });
    } else {
      console.log('app.js: Normal sync is not supported');
    }
  });
}
