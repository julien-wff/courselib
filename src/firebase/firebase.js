import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import 'firebase/functions';
import config from './firebase-config.json';

export const initFirebase = () => {
    firebase.initializeApp(config);
    firebase.analytics();
    if (process.env.NODE_ENV !== 'production')
        firebase.functions().useEmulator(window.location.hostname, 5001);

    return firebase;
};


export const PROVIDERS = {
    google: firebase.auth.GoogleAuthProvider,
    facebook: firebase.auth.FacebookAuthProvider,
};

