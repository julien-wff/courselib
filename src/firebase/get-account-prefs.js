export const getAccountPrefs = async (firebase, uid) =>
    firebase.firestore()
        .doc(`users/${uid}`)
        .get()
        .then(d => d.data() || null);