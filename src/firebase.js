import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCGuzhbS8BpOLupnKWk2rNEFKr8YRnW7Og",
    authDomain: "clone-11397.firebaseapp.com",
    databaseURL: "https://clone-11397.firebaseio.com",
    projectId: "clone-11397",
    storageBucket: "clone-11397.appspot.com",
    messagingSenderId: "650927543695",
    appId: "1:650927543695:web:52c07deecb2ae82e53e7fa",
    measurementId: "G-NLB8NESYDC"
  };


const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };