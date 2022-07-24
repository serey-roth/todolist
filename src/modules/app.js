import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { setUpAuth } from "./authentication";
import { setUpFirestore } from "./storage";
import { ToDoList } from "./todolist";
import { initializeDashboard } from './dashboardUI'

const firebaseConfig = {
    apiKey: "AIzaSyD6jVeINfZZu_h50AkpzvbPGwaAmXhwUwo",
    authDomain: "todolist-367b7.firebaseapp.com",
    projectId: "todolist-367b7",
    storageBucket: "todolist-367b7.appspot.com",
    messagingSenderId: "308947241325",
    appId: "1:308947241325:web:d6cc5db2dd46102b5ab264"
}

export const toDoList = new ToDoList();

export const setUpApp = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    setUpFirestore(db);
    setUpAuth(auth);
    initializeDashboard();
}

