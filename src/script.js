import './style.css';
import {
    initializeApp
} from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import {
    doc, 
    getDoc,
    setDoc,
    getFirestore
} from 'firebase/firestore'
import {
    hideLoginError,
    openLogInModal,
    closeLogInModal,
    showLoginState,
    showLogOutState,
    showLoginError,
    logInBtn,
    signUpBtn,
    logOutBtn,
    emailTxt,
    passwordTxt
} from './ui.js';

const Task = (detail='', 
dateAdded='yyyy-mm-dd',
completed=false) => {
    let taskDetail = detail;
    let taskDate = dateAdded;
    let taskCompleteStatus = completed;

    const getDetail = () => taskDetail;
    const setDetail = (newDetail) => 
    taskDetail = newDetail;
    const getDateAdded = () => taskDate;
    const setDateAdded = (newDateAdded='yyyy-mm-dd') => 
    taskDate = newDateAdded;
    const isCompleted = () => taskCompleteStatus;
    const toggleCompleteStatus = () => 
    taskCompleteStatus = !taskCompleteStatus;

    return {
        getDetail,
        setDetail, 
        getDateAdded, 
        setDateAdded,
        isCompleted,
        toggleCompleteStatus
    }
}

const ToDoList = (() => {
    let taskList = [];

    const addTask = (detail, dateAdded, completed) => {
        let task = Task(detail, dateAdded, completed);
        if (!taskAlreadyAdded(task)) {
            taskList.unshift(task);
            return 'Task added successfully!';
        } else {
            return 'Task already added!';
        }
    }

    const removeTask = (taskDetail) => {
        if (taskList) {
            taskList = taskList.filter(i => 
                i.getDetail() !== taskDetail);
            return 'Task removed successfully!';
        } else {
            return;
        }
    }
    const removeAllTasks = () => {
        taskList = []
    }
    const taskAlreadyAdded = (task) => {
        for (let t of taskList) {
            if (t.getDetail() === task.getDetail() 
            && t.getDateAdded() === task.getDateAdded()) {
                return true;
            }
        }
        return false;
    }
    const getTasksByDate = (date) => {
        return taskList.filter(t => t.getDateAdded() === date);
    }
    const getTaskByDetail = (taskDetail) => {
        console.log(taskList);
        let task = taskList.find(t => t.getDetail() === taskDetail);
        return task;
    }
    const setAllTasksIncomplete = () => {
        for (let t of taskList) {
            if (t.isCompleted()) {
                t.toggleCompleteStatus()
            }
        }
    }
    const getToDoList = () => taskList;
    const setToDoList = (list) => {
        taskList = list;
    }
    const getCount = () => {
        return taskList.length;
    }
    return {
        addTask,
        removeTask,
        removeAllTasks,
        taskAlreadyAdded,
        getTaskByDetail,
        getToDoList,
        setToDoList,
        getTasksByDate,
        setAllTasksIncomplete,
        getCount
    }
})()

const FirebaseAuth = (() => {
    let user;
    let userId;
    const firebaseConfig = {
        apiKey: "AIzaSyD6jVeINfZZu_h50AkpzvbPGwaAmXhwUwo",
        authDomain: "todolist-367b7.firebaseapp.com",
        projectId: "todolist-367b7",
        storageBucket: "todolist-367b7.appspot.com",
        messagingSenderId: "308947241325",
        appId: "1:308947241325:web:d6cc5db2dd46102b5ab264"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const getApp = () => app;
    const getUser = () => user;
    const getUserId = () => userId;
    const loginEmailPassword = async () => {
        const loginEmail = emailTxt.value;
        const loginPassword = passwordTxt.value;

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, loginEmail, 
                loginPassword);
            user = userCredentials.user;
            userId = userCredentials.user.uid;
            closeLogInModal();
            showLoginState(user);
            hideLoginError();
        }
        catch(error) {
            showLoginError(error);
        }
    };
    const createAccount = async () => {
        const loginEmail = emailTxt.value;
        const loginPassword = passwordTxt.value;

        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, loginEmail, 
                loginPassword);
            user = userCredentials.user;
            userId = userCredentials.user.uid;
            closeLogInModal();
            showLoginState(user);
            hideLoginError();
        }
        catch(error) {
            showLoginError(error);
        }
    };
    const logout = async () => {
        try {
            await signOut(auth);
            showLogOutState();
            console.log('Signed out!')
        } catch(e) {
            console.log('No user signed in!')
        }
    }
    hideLoginError();
    return {
        getApp,
        getUser,
        getUserId,
        loginEmailPassword,
        createAccount,
        logout
    }
})()

const ConverterForStorage = (() => {
    const convertTaskToObj = (task) => {
        return {
            taskDetail: task.getDetail(),
            taskDate: task.getDateAdded(),
            taskCompleteStatus: task.isCompleted()
        };
    }
    const convertListForStorage = (taskList) => {
        return taskList.map(t => convertTaskToObj(t))
    }
    const convertStoredList = (list) => {
        return list.map(i => 
            Task(i.taskDetail, i.taskDate, i.taskCompleteStatus));
    }
    return {
        convertTaskToObj,
        convertListForStorage,
        convertStoredList
    }
})()

const FirebaseStorage = (() => {
    const db = getFirestore(FirebaseAuth.getApp());
    const saveToDoListToFirebase = async (taskList, uid) => {
        try {
            await setDoc(doc(db, 'user', uid), 
            {list: ConverterForStorage.convertListForStorage(taskList)})
        } catch (e) {
            console.error('Error storing task list to Firebase: ', e);
        }
    }
    const getToDoListFromFirebase = async (uid) => {
        ToDoList.removeAllTasks();
        const docSnap = await getDoc(doc(db, 'user', uid));
        console.log(docSnap)
        if (docSnap.exists()) {
            ToDoList.setToDoList(ConverterForStorage.convertStoredList(docSnap.data().list));
        }  else {
            throw `Document doesn't exist`;
        }
    }
    return {
        saveToDoListToFirebase,
        getToDoListFromFirebase
    }
})()

const LocalStorage = (() => {
    const saveToLocalStorage = () => {
        localStorage.setItem('taskList', JSON.stringify(
            ConverterForStorage.convertListForStorage(ToDoList.getToDoList())));
    }
    const restoreFromLocalStorage = () => {
        ToDoList.removeAllTasks();
        let stored = localStorage.getItem('taskList');
        if (stored) {
            ToDoList.setToDoList(ConverterForStorage.convertStoredList(JSON.parse(stored)));
        }
    }
    return {
        saveToLocalStorage,
        restoreFromLocalStorage
    }
})()

const ToDoListApp = (() => {
    const openLogInModalBtn = document.getElementById('openLogInModalBtn');
    const closeLogInModalBtn = document.getElementById('closeLogInModalBtn');
    const userInput = document.getElementById('userInput');
    const taskList = document.getElementById('taskList');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskDateCalendar = document.getElementById('taskDate');

    const addTask = (e) => {
        e.preventDefault();
        const taskDate = document.getElementById('taskDate').value;
        const taskDetail = document.getElementById('taskDetail').value;

        ToDoList.addTask(taskDetail, taskDate, false);
        resetAddTaskForm();
        saveData();
        monitorAuthState();
    }
    const createTaskCard = (task) => {
        const taskDiv = document.createElement('div');
        const taskDate = document.createElement('p');
        const taskDetail = document.createElement('p');
        const completedChkBx = document.createElement('input');
        const deleteBtn = document.createElement('button');

        taskDate.classList.add('task-date');
        taskDetail.classList.add('task-detail');
        completedChkBx.classList.add('task-complete-chkbx');
        deleteBtn.classList.add('task-delete-btn')
        taskDiv.classList.add('task');

        taskDate.textContent = task.getDateAdded();
        if (task.getDetail().length < 180) {
            taskDetail.textContent = task.getDetail();
        } else {
            taskDetail.textContent = task.getDetail().substring(0, 175) + '...';
        }
        completedChkBx.setAttribute('type', 'checkbox')
        if (task.isCompleted()) {
            completedChkBx.checked = true;
            taskDiv.classList.add('complete')
        } else {
            completedChkBx.checked = false;
            taskDiv.classList.add('incomplete')
        }
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i>'

        completedChkBx.onclick = toggleTaskCompleteStatus;
        deleteBtn.onclick = removeTask;

        taskDiv.appendChild(taskDate);
        taskDiv.appendChild(taskDetail);
        taskDiv.appendChild(completedChkBx);
        taskDiv.appendChild(deleteBtn);

        return taskDiv;
    }
    const updateTaskList = (tasks) => {
        taskList.innerHTML = '';
        if (tasks.length > 0) {
            taskList.classList.add('active');
            userInput.style.flexGrow = 1;
            taskList.style.flexGrow = tasks.length * 2;
            let title = document.createElement('h3');
            title.textContent = `Here's your list. Now, go get 'em tiger!`;
            taskList.appendChild(title);
            for (let task of tasks) {
                taskList.appendChild(createTaskCard(task));
            }
        } else {
            taskList.classList.remove('active');
            userInput.style.flexGrow = 10;
            taskList.style.flexGrow = 1;
        }
        taskDateCalendar.value = getCurrentDate();
    } 
    const removeTask = (e) => {
        const taskDetail = e.target.parentNode.parentNode.childNodes[1].innerHTML;
        ToDoList.removeTask(taskDetail);
        saveData();
        monitorAuthState();
    }
    const clearAllTasks = () => {
        ToDoList.removeAllTasks();
        saveData();
        monitorAuthState();
    }
    const toggleTaskCompleteStatus = (e) => {
        const taskDetail = e.target.parentNode.childNodes[1].innerHTML;
        ToDoList.getTaskByDetail(taskDetail).toggleCompleteStatus();
        saveData();
        monitorAuthState();
    }
    function getCurrentDate() {
        let today = new Date(Date.now());
        let date = today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`
        let month = today.getMonth() < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`
        return `${today.getFullYear()}` + "-" + month + "-" + date;
    }
    const resetAddTaskForm = () => {
        document.getElementById('taskDate').value = getCurrentDate();
        document.getElementById('taskDetail').value = '';
    }
    const saveData = () => {
        if (FirebaseAuth.getUserId()) {
            FirebaseStorage.getToDoListFromFirebase(FirebaseAuth.getUserId())
            .catch(() => {
                console.log('No storage set up yet for current user!');
            });
            FirebaseStorage.saveToDoListToFirebase(ToDoList.getToDoList(), 
            FirebaseAuth.getUserId());
        } else {
            LocalStorage.saveToLocalStorage();
        }
    }
    const monitorAuthState = () => {
        let unsubscribe = onAuthStateChanged(getAuth(FirebaseAuth.getApp()), user => {
            if (user) {
                FirebaseStorage.getToDoListFromFirebase(user.uid)
                .then(() => {
                    updateTaskList(ToDoList.getToDoList());
                })
                .catch((e) => {
                    console.log('No storage set up yet for current user!');
                });
            } else {
                LocalStorage.restoreFromLocalStorage();
                updateTaskList(ToDoList.getToDoList());
            }
            console.log(ToDoList.getToDoList());
        });
        unsubscribe();
    }
    const login = () => {
        FirebaseAuth.loginEmailPassword()
        .then(() => monitorAuthState());
    }
    const logout = () => {
        FirebaseAuth.logout()
        .then(() => monitorAuthState());
    }
    const signUp = () => {
        FirebaseAuth.createAccount()
        .then(() => monitorAuthState());
    }
    const _init_ = (() => {
        FirebaseAuth.logout();
        openLogInModalBtn.onclick = openLogInModal;
        closeLogInModalBtn.onclick = closeLogInModal;
        addTaskForm.onsubmit = addTask;
        logInBtn.onclick = login;
        signUpBtn.onclick = signUp;
        logOutBtn.onclick = logout;
        taskDateCalendar.setAttribute('min', getCurrentDate());
    })()
    return {
        monitorAuthState
    }
})()

ToDoListApp.monitorAuthState();