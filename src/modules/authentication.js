import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import { AuthErrorCodes } from 'firebase/auth'

import * as ui from './ui'
import {
    restoreFirestore as restoreFS,
    restoreLocalStorage as restoreLS
} from './storage'
import { updateTaskGroupCount, updateTaskList } from './todolistUI'
import { toDoList } from './app';
import { 
    resetLogInModal,
    closeLogInModal,
    updateProjectList
} from './dashboardUI';

const hideLoginError = () => {
    ui.lblLoginErrorMessage.classList.remove('active');
}

const showLoginError = (error) => {
    ui.lblLoginErrorMessage.classList.add('active')
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
        ui.lblLoginErrorMessage.innerHTML = `Invalid password. Try again.`
    } else if (error.code == AuthErrorCodes.NULL_USER) {
        ui.lblLoginErrorMessage.innerHTML = `This user doesn't exist. Try again.`
    } else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
        ui.lblLoginErrorMessage.innerHTML = `Invalid email address. Try again.`
    } else if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
        ui.lblLoginErrorMessage.innerHTML = `Password should be at least 6 characters. Try again.`
    } else if (error.code == AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
        ui.lblLoginErrorMessage.innerHTML = `User credentials already taken. Try again.`
    } else {
        ui.lblLoginErrorMessage.innerHTML = 'Try again!'
    }
}

const showLoginState = (user) => {
    ui.userGreeting.innerHTML = `Welcome ${user.email}!`;
    ui.userGreeting.classList.remove('inactive');
    ui.userGreeting.classList.add('active');

    ui.logOutBtn.classList.remove('inactive');
    ui.logOutBtn.classList.add('active');

    ui.openLogInModalBtn.classList.remove('active');
    ui.openLogInModalBtn.classList.add('inactive');
    resetLogInModal();
}

const showLogOutState = () => {
    ui.userGreeting.classList.add('inactive');
    ui.userGreeting.classList.remove('active');

    ui.logOutBtn.classList.add('inactive');
    ui.logOutBtn.classList.remove('active');

    ui.openLogInModalBtn.classList.add('active');
    ui.openLogInModalBtn.classList.remove('inactive');
    resetLogInModal();
}

let auth;
let currentUser;
let currentUserId;

export const getUser = () => currentUser;
export const getUserId = () => currentUserId;

const restartApp = () => {
    localStorage.removeItem('lastSelectedGroup');
    updateProjectList();
    updateTaskList(toDoList.list);
    updateTaskGroupCount();
}

export const monitorAuthState = () => {
    let unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
            currentUser = user;
            currentUserId = user.uid;
            showLoginState(user);
            restoreFS(user.uid)
            .then(() => {
                restartApp();
            })
            .catch((e) => {
                console.log('No storage set up yet for current user!');
            });
        } else {
            showLogOutState();
            restoreLS();
            restartApp();
        }
        console.log(toDoList.list);
    });
    unsubscribe();
}

export const loginEmailPassword = async () => {
    const loginEmail = ui.emailTxt.value;
    const loginPassword = ui.passwordTxt.value;
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, loginEmail,
            loginPassword);
        const user = userCredentials.user;
        currentUser = user;
        currentUserId = user.uid;
        ui.taskList.innerHTML = '';
        closeLogInModal();
        hideLoginError();
        monitorAuthState();
    } catch (error) {
        showLoginError(error);
    }
};

export const createAccount = async () => {
    const loginEmail = ui.emailTxt.value;
    const loginPassword = ui.passwordTxt.value;
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, loginEmail,
            loginPassword);
        const user = userCredentials.user;
        currentUser = user;
        currentUserId = user.uid;
        ui.taskList.innerHTML = ''
        closeLogInModal();
        hideLoginError();
        monitorAuthState();
    } catch (error) {
        showLoginError(error);
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        ui.taskList.innerHTML = ''
        console.log('Signed out!')
        currentUser = null;
        currentUserId = '';
        monitorAuthState();
    } catch (e) {
        console.log('No user signed in!')
    }
}

export const setUpAuth = (a) => {
    auth = a;
}