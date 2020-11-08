const functions = require('firebase-functions');
const admin = require('firebase-admin');


module.exports = functions
    .region('europe-west1')
    .https
    .onCall(async (data, context) => {

        require('../utils/isAuth')(context);

        const code = data.code;
        if (!code || typeof code !== 'string' || !code.match(/^[A-Z0-9]{5}$/))
            throw new functions.https.HttpsError('invalid-argument', 'Code invalide');

        // Check if the user already exists
        const userRef = admin.firestore().doc(`users/${context.auth.uid}`);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            functions.logger.error(`Unable to find user ${context.auth.uid}`);
            throw new functions.https.HttpsError('not-found', 'Impossible de trouver l\'utilisateur correspondant');
        }

        // Check if the code is expired
        const timeSinceLastVerif = Date.now() - userDoc.data().lastEmailVerif.toMillis();
        if (timeSinceLastVerif > 600 * 1000)
            throw new functions.https.HttpsError('deadline-exceeded', 'Ce code est trop vieux. Veuillez renvoyer un mail');

        // Get the verification code
        const correctCodeDoc = await admin.firestore().doc(`users/${context.auth.uid}/private/private`).get();
        if (!correctCodeDoc.exists) {
            functions.logger.error(`Unable to find private document for user ${context.auth.uid}`);
            throw new functions.https.HttpsError('not-found', 'Impossible de trouver le code correspondant');
        }

        // Check if the code is correct
        if (correctCodeDoc.data().verificationCode !== code)
            throw new functions.https.HttpsError('permission-denied', 'Code invalide');

        await userRef.update({
            registerStep: 1
        });

        return {
            nextStep: true,
            action: 'nextStep',
        };

    });
