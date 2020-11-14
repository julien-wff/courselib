const functions = require('firebase-functions');
const admin = require('firebase-admin');


module.exports = functions
    .region('europe-west1')
    .https
    .onCall(async (data, context) => {

        require('../utils/isAuth')(context);

        // Get the user
        const userRef = admin.firestore().doc(`users/${context.auth.uid}`);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            functions.logger.error(`Unable to find user ${context.auth.uid}`);
            throw new functions.https.HttpsError('not-found', 'Impossible de trouver l\'utilisateur correspondant');
        }
        const userData = userDoc.data();

        const newCourse = await admin.firestore().collection('courses').add({
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: context.auth.uid,
            modifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            version: 0,
            school: userData.school,
            grade: userData.grade,
            way: userData.way,
            class: data.subject,
            name: data.name,
            category: data.category,
        });

        return {
            created: true,
            id: newCourse.id,
        };

    });
