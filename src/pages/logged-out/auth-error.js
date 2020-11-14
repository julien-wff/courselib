export function authError(err) {
    switch (err.code) {
        case 'auth/popup-closed-by-user':
            return false;
        case 'auth/wrong-password':
            return 'Le mot de passe est invalide, ou une autre méthode de connexion à été utilisée.';
        case 'auth/user-not-found':
            return 'Impossible de trouver un compte correspondant à cet email. Essayez de créer un compte.';
        case 'auth/email-already-in-use':
            return 'Cet email est déjà utilisé par un autre compte.';
        default:
            console.error(err);
            return err.message;
    }
}