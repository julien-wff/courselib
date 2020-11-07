const admin = require('firebase-admin');
admin.initializeApp();

// Register step 0
exports.createUser = require('./http/createUser');
exports.confirmMbnCode = require('./http/confirmMbnCode');

// Register step 1
exports.addPersonalData = require('./http/addPersonalData');
