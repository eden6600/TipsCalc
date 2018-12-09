import firebase from 'firebase';



const config = {
  apiKey: "AIzaSyBFA3TiAXuSDLZzqFxjZ2zFSmEbOGoH64I",
  authDomain: "react-tipscalc.firebaseapp.com",
  databaseURL: "https://react-tipscalc.firebaseio.com",
  projectId: "react-tipscalc",
  storageBucket: "react-tipscalc.appspot.com",
  messagingSenderId: "567715316662"
};
const fire = firebase.initializeApp(config);
export default fire;


export function getUser(uid) {
  const db = fire.firestore();
  return db.collection('Users').doc(uid).get();
}

export function getDoc(collection, doc) {
  const db = fire.firestore();
  return db.collection(collection).doc(doc).get();
}

export function getMonthSummary(month) {
  const db = fire.firestore();
  const startDate = new Date(new Date().getFullYear(), month, 1);
  const endDate = new Date(new Date().getFullYear(), month, 30);
  return db.collection('Shifts').where('date', '>=', startDate).where('date', '<=', endDate).get();

}