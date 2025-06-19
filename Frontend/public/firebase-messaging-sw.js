// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCo-0khhqb8yfqnq2byUxQ-boA_bn-nXtk",
    authDomain: "pethelp-a4e95.firebaseapp.com",
    projectId: "pethelp-a4e95",
    storageBucket: "pethelp-a4e95.firebasestorage.app",
    messagingSenderId: "775211426092",
    appId: "1:775211426092:web:30863265aa5a521c090c89"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png',
        badge: '/favicon.png',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
}); 