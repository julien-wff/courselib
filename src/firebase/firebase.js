import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
import config from './firebase-config.json';

export const initFirebase = () => {
    firebase.initializeApp(config);
    firebase.analytics();

    return firebase;
};


export const PROVIDERS = {
    google: firebase.auth.GoogleAuthProvider,
};

