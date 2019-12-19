import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const config = {
     apiKey: "AIzaSyCrFcJKgD7jJGZH-f10Oj_DbycoWjY3tOk",
    authDomain: "ecom-db-bacf8.firebaseapp.com",
    databaseURL: "https://ecom-db-bacf8.firebaseio.com",
    projectId: "ecom-db-bacf8",
    storageBucket: "ecom-db-bacf8.appspot.com",
    messagingSenderId: "96611603926",
    appId: "1:96611603926:web:5b660038c46baf3fcc4077",
    measurementId: "G-V711LE996V"     
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    console.log(snapShot);

    if(!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,

                ...additionalData
            })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);


export default firebase;