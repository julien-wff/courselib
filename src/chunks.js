// ----- COMPONENTS -----

export const getRegisterSteps = () => import(/* webpackChunkName: "registerSteps" */ './pages/logged-in/RegisterSteps.svelte')
    .then(c => c.default);

export const getLoggedInRouter = () => import(/* webpackChunkName: "loggedInRouter" */'./pages/logged-in/LoggedInRouter.svelte')
    .then(c => c.default);

export const getLoggedOutRouter = () => import(/* webpackChunkName: "loggedOutRouter" */'./pages/logged-out/LoggedOutRouter.svelte')
    .then(c => c.default);

// ----- MODULES -----

export const getFirebase = () => import(/* webpackChunkName: "firebase" */ './firebase/firebase');