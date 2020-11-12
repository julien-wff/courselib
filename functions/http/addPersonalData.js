const functions = require('firebase-functions');
const admin = require('firebase-admin');
const commonClases = require('../common-classes.json');

module.exports = functions
    .region('europe-west1')
    .https
    .onCall(async (data, context) => {

        require('../utils/isAuth')(context);

        if (typeof data !== 'object' ||
            typeof data.firstName !== 'string' || !data.firstName.trim() ||
            typeof data.lastName !== 'string' || !data.lastName.trim() ||
            typeof data.school !== 'string' || !data.school.trim() ||
            typeof data.grade !== 'string' || !data.grade.trim() ||
            typeof data.way !== 'string' || !data.way.trim() ||
            typeof data.class !== 'string' || !data.class.trim()
        )
            throw new functions.https.HttpsError('invalid-argument', 'Une des données est manquante ou invalide');

        const userRef = admin.firestore().doc(`users/${context.auth.uid}`);

        const userDoc = await userRef.get();
        if (!userDoc.exists)
            throw new functions.https.HttpsError('not-found', 'Impossible de trouver l\'utilisateur correspondant');

        if (userDoc.data().registerStep !== 1)
            throw new functions.https.HttpsError('permission-denied', 'Vous avez déjà effectué cette étape');

        await userRef.update({
            ...data,
            classes: commonClases[data.way][data.grade],
            registerStep: 2,
        });

        return {
            nextStep: true,
            action: 'nextStep',
        };

    });