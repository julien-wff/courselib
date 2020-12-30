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
            school: userData.school,
            way: userData.way,
            grade: userData.grade,
            class: data.subject,
            name: data.name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            createdBy: context.auth.uid,
            modifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            modifiedBy: context.auth.uid,
            version: 0,
            category: data.category || null,
            index: data.index,
        });

        return {
            created: true,
            id: newCourse.id,
        };

    });
