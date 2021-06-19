importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');
var firebaseConfig = {
    apiKey: "AIzaSyC1GQBp_QhQ8TanN0oswUO0Jj0rX6peZPo",
    authDomain: "mlkitapp-14798.firebaseapp.com",
    databaseURL: "https://mlkitapp-14798.firebaseio.com",
    projectId: "mlkitapp-14798",
    storageBucket: "mlkitapp-14798.appspot.com",
    messagingSenderId: "553540043269",
    appId: "1:553540043269:web:6db87ed5abc6af3f8f126c"
  };

  
firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});