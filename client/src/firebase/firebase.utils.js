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

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);
    // const collectionRef =firestore.collection('users');

    const snapShot = await userRef.get();
    // const collectionSnapshot = await collectionRef.get();

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
            });
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

export const addCollectionAndDocuments = async ( 
    collectionKey, 
    objectsToAdd
) => {
    const collectionRef = firestore.collection(collectionKey);
    
    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc();
        batch.set(newDocRef, obj);
    });

    return await batch.commit();
};



export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(docSnapshot => {
        const { title, items } = docSnapshot.data();

        return {
            routeName: encodeURI(title.toLowerCase()),
            id: docSnapshot.id,
            title,
            items
        };
    });

    return transformedCollection.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {});
};

export const getCurrentUser = () => {
    return Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe();
            resolve(userAuth);
        }, reject)
    });
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);


export default firebase;





