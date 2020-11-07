const functions = require('firebase-functions');


module.exports = function isAuth(context) {
    if (!context.auth)
        throw new functions.https.HttpsError('unauthenticated', 'Vous devez être authentifié pour utiliser cette fonctionnalité');
};