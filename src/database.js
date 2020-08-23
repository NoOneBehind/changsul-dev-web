import * as firebase from 'firebase/app';

import 'firebase/database';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB6rjvWYOk9TzTvN06QhEboi0yRernMMX4',
  authDomain: 'changsul-dev-web.firebaseapp.com',
  databaseURL: 'https://changsul-dev-web.firebaseio.com',
  projectId: 'changsul-dev-web',
  storageBucket: 'changsul-dev-web.appspot.com',
  messagingSenderId: '798474220213',
  appId: '1:798474220213:web:648bec424c10d7f89d44fc',
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export const readAll = () => database.ref('player').once('value').then((value) => value.val());

export const subscribe = (callback) => (
  database.ref('player').on('value', (value) => callback(value.val())));

export const write = async (playerIndex, data) => {
  const prev = await database.ref(`/player/${playerIndex}`).once('value');
  await database.ref(`/player/${playerIndex}`).set({ ...prev.val(), ...data });
};
