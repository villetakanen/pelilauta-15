import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDgck5PNbLKHNircXyElPoZ14KqxrknUe8',
  authDomain: 'skaldbase.firebaseapp.com',
  databaseURL: 'https://skaldbase.firebaseio.com',
  projectId: 'skaldbase',
  storageBucket: 'skaldbase.appspot.com',
  messagingSenderId: '161233573033',
  appId: '1:161233573033:web:a0b3f20d4c8c4f4c22c5b8',
  measurementId: 'G-T5E33DTZGW',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
