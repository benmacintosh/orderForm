import * as firebase from 'firebase'

import { FirebaseConfig } from "../config/dev";
firebase.initializeApp(FirebaseConfig);

const databaseRef = firebase.database().ref();
export const listRef = databaseRef.child("list");