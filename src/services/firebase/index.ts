import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import 'firebase/storage';
import { FIREBASE_CONFIG } from '../../constants/environment';

export const app = firebase.initializeApp(JSON.parse(FIREBASE_CONFIG));

export const auth = app.auth();
export const firestore = app.firestore();
export const messaging = app.messaging();
export const storage = app.storage();

export { firebase };
