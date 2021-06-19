importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

// var firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_FIREBASE_DOMAIN_NAME",
//     databaseURL: "YOUR_FIREBASE_DATBASE_URL",
//     projectId: "YOUR_FIREBASE_PROJECT_ID",
//     storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET END WITH appspot.com",
//     messagingSenderId: "YOUR SENDER ID",
//     appId: "YOUR APP ID",
//     measurementId: "YOUR MEASUREMENT ID"
// };


var firebaseConfig = {
    apiKey: "AIzaSyDUe0S1yu5PdSAcMqOL2YpeBLI79CtWGVk",
    authDomain: "activity-portal-319d0.firebaseapp.com",
    projectId: "activity-portal-319d0",
    storageBucket: "activity-portal-319d0.appspot.com",
    messagingSenderId: "541265184936",
    appId: "1:541265184936:web:55fac2b1afa80ffdb99a9d",
    measurementId: "G-2R2HC0PF03"
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
