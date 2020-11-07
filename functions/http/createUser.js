const functions = require('firebase-functions');
const admin = require('firebase-admin');
const createAccessCode = require('../utils/createAccessCode');


module.exports = functions
    .region('europe-west1')
    .https
    .onCall(async (data, context) => {

        require('../utils/isAuth')(context);


        const email = data.email;
        if (!email || typeof email !== 'string' || !email.endsWith('@monbureaunumerique.fr'))
            throw new functions.https.HttpsError('invalid-argument', 'Mail fourni invalide');


        // Check if the user already exists
        const existingUser = await admin.firestore().doc(`users/${context.auth.uid}`).get();


        if (existingUser.exists) {

            const userData = existingUser.data();

            if (userData.registerStep !== 0)
                throw new functions.https.HttpsError('permission-denied', 'Vous avez déjà effectué cette étape');

            const timeSinceLastVerif = Date.now() - userData.lastEmailVerif.toMillis();
            if (timeSinceLastVerif < 120 * 1000)
                throw new functions.https.HttpsError('permission-denied', 'Vous devez attendre 2 minutes avant de pouvoir renvoyer un mail');

        } else {

            // Check if another user already used this email
            const existingEmailUser = await admin
                .firestore()
                .collection('users')
                .where('mbnMail', '==', email)
                .limit(1)
                .get();
            if (!existingEmailUser.empty)
                throw new functions.https.HttpsError('already-exists', 'Impossible de créer cet email, il est déjà attribué à un utilisateur');

        }


        // Create an user with its access code in the DB
        const verificationCode = createAccessCode();
        await admin.firestore().doc(`users/${context.auth.uid}`).set({
            mbnMail: email,
            lastEmailVerif: admin.firestore.FieldValue.serverTimestamp(),
            registerStep: 0
        });
        await admin.firestore().doc(`users/${context.auth.uid}/private/private`).set({
            verificationCode,
        });

        return {
            nextStep: false,
            action: 'verif',
        };
    });
