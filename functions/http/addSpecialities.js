const functions = require('firebase-functions');
const admin = require('firebase-admin');


module.exports = functions
    .region('europe-west1')
    .https
    .onCall(async (data, context) => {

        require('../utils/isAuth')(context);

        if (!Array.isArray(data) || data.find(e => typeof e !== 'string'))
            throw new functions.https.HttpsError('invalid-argument', 'Spécialités invalides');

        // Get the user
        const userRef = admin.firestore().doc(`users/${context.auth.uid}`);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            functions.logger.error(`Unable to find user ${context.auth.uid}`);
            throw new functions.https.HttpsError('not-found', 'Impossible de trouver l\'utilisateur correspondant');
        }

        const userData = userDoc.data();
        if (userData.registerStep !== 2)
            throw new functions.https.HttpsError('permission-denied', 'Vous avez déjà effectué cette étape');

        let spesCount = userData.grade === 'terminale' ? 2 : 3;
        if (data.length !== spesCount)
            throw new functions.https.HttpsError('invalid-argument', `Veuillez sélectionner ${spesCount} spécialités`);

        await userRef.update({
            specialities: data,
            registerStep: 3,
        });

        return {
            nextStep: true,
            action: 'nextStep',
        };

    });
