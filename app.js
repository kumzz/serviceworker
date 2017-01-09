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
  
  function isPageHidden(){
     return document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
 }
  
  navigator.serviceWorker.onmessage = function (event) {
    var message = JSON.parse(event.data);
    var isRefresh = message.type === 'refresh';
    if (isRefresh && typeof Android != "undefined") {
      console.log('Received a refresh message from service worker');
      console.log('app.js: Reloading page');
      //setTimeout(function() {
        //if (isPageHidden()) {
        if (!Android.isConnectedToNetwork()) {
          console.log('app.js: No internet connection. Not reloading');
          Android.showToast('No internet connection. Not reloading');
        } else {
          console.log('app.js: Webview is invisible. Reloading page');
          Android.reload();
          Android.showToast('Reloaded page');
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
    console.log('SW normal sync registration');
    return registration.sync.register('reload-sync');
  }).catch(function(error) {
    console.log('Error in sync registration: ' + error);
  });
  
  navigator.serviceWorker.ready.then(function(registration) {
    if (registration.pushManager) {
      console.log('registration.pushManager is available');
      registration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        console.log('push API subscription available');
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          console.log('Permission for Notifications was denied');
        } else {
          console.log('Unable to subscribe to push.', e);
        }
      });
    } else {
      console.log('Push API is not suppported');
    }
  });
}
