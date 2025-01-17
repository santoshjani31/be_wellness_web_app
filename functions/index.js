const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} = require('firebase/firestore');
const functions = require('firebase-functions');
//const admin = require('firebase-admin');

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDGGtYs_ikvlAr2C8HZEbr5GZ5TVmwSfIA',
  authDomain: 'wellness-api-2c049.firebaseapp.com',
  projectId: 'wellness-api-2c049',
  storageBucket: 'wellness-api-2c049.firebasestorage.app',
  messagingSenderId: '823484362277',
  appId: '1:823484362277:web:1fbe48615e93c0a25859cc',
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection reference
const userCollection = collection(db, 'Users');

// Initialize Express
const appServer = express();
appServer.use(express.json());
appServer.use(cors());

// Get all users
appServer.get('/', async (req, res) => {
  try {
    const snapshot = await getDocs(userCollection);
    const userList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.send(userList);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Create a new user
appServer.post('/create', async (req, res) => {
  try {
    const data = req.body;
    await addDoc(userCollection, data);
    res.send({ msg: 'User Added' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update a user
appServer.post('/update', async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const userDoc = doc(db, 'Users', id);
    await updateDoc(userDoc, data);
    res.send({ msg: 'Updated' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Delete a user
appServer.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const userDoc = doc(db, 'Users', id);
    await deleteDoc(userDoc);
    res.send({ msg: 'Deleted' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server
//appServer.listen(4000, () => console.log('Server running on port 4000'));
exports.appServer = functions.https.onRequest(appServer);
