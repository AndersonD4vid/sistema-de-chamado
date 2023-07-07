import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
//import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
   apiKey: "AIzaSyD6gPOjg3cec7DV3oKLfMcOYe3TQEy_LGM",
   authDomain: "sistema-de-chamado-dev.firebaseapp.com",
   databaseURL: "https://sistema-de-chamado-dev-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "sistema-de-chamado-dev",
   storageBucket: "sistema-de-chamado-dev.appspot.com",
   messagingSenderId: "846333746525",
   appId: "1:846333746525:web:4e48f0fa54b91c049e1cb4",
   measurementId: "G-VRGWPE70S2"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
//const analytics = getAnalytics(app);

export { auth, db, storage };
