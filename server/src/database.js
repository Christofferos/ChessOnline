const path = require('path');
const { Database } = require('sqlite3').verbose();

const databasePath = path.join(__dirname, 'db.sqlite');
const db = new Database(databasePath);

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS matchHistory');
  db.run('DROP TABLE IF EXISTS liveGames');

  db.run('CREATE TABLE users (username TEXT, password TEXT)');
  db.run('CREATE TABLE matchHistory (winner TEXT, loser TEXT, nrMoves INTEGER, date TEXT)');
  db.run('CREATE TABLE liveGames (id INTEGER, currentGame TEXT, player1 TEXT, player2 TEXT)');

  db.run('DROP TABLE IF EXISTS admins');
  db.run('DROP TABLE IF EXISTS timeslots');
  db.run('CREATE TABLE timeslots (username TEXT, password TEXT)');
  db.run('CREATE TABLE admins (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');
  const statement = db.prepare('INSERT INTO users VALUES (?, ?, ?)');
  statement.run(0, 'kri', 'kri');
  statement.run(1, 'amanda', 'amanda');
  statement.run(2, 'anna', 'anna');
  statement.run(3, 'solbritt', 'solbritt');
  statement.finalize();
});

module.exports = db;

/* ------------------------------------- */

/* 
import firebase from 'firebase/app';
// import { ref, onUnmounted } from 'vue'; 

const firebaseConfig = {
  apiKey: 'AIzaSyCZZR1B2MX_vNMuH41WCez1oQkFd4A_mCE',
  authDomain: 'chessonlinepro.firebaseapp.com',
  projectId: 'chessonlinepro',
  storageBucket: 'chessonlinepro.appspot.com',
  messagingSenderId: '59988433154',
  appId: '1:59988433154:web:b43f906e670538ee548a1b',
  measurementId: 'G-DTBVHHB8X8',
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
module.exports = firebaseApp;

const dbFirebase = firebaseApp.firestore();

const usersCollection = dbFirebase.collection('users');
console.log('Initialize firebase database! UserCollection: ', usersCollection);

export const createUser = user => usersCollection.add(user);

export const getUser = async id => usersCollection.doc(id).update(user);

export const deleteUser = async id => usersCollection.doc(id).delete();
 */

/* export const useLoadUsers = () => {
  const users = ref([]);
  // Updates whenever users are changed.
  usersCollection.onSnapshot(snapshot => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  });
  onUnmounted(close);
  return users;
}; 
*/
