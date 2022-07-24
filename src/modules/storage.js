import {
    doc, 
    getDoc,
    setDoc
} from 'firebase/firestore'
import { Task } from './todoitem'
import { toDoList } from './app';

let db;

const convertTaskToObj = (task) => {
    return {
        taskCategory: task.category,
        taskTitle: task.title,
        taskDescription: task.description,
        taskDueDate: task.dueDate,
        taskCompleteStatus: task.completeStatus,
        taskPriority: task.priority
    };
}
const convertListForStorage = (taskList) => {
    return taskList.map(t => convertTaskToObj(t))
}

const convertStoredList = (list) => {
    return list.map(i => 
        new Task(i.taskCategory, 
            i.taskTitle, 
            i.taskDescription,
            i.taskDueDate, 
            i.taskCompleteStatus,
            i.taskPriority));
}

export const saveFirestore = async (uid) => {
    try {
        await setDoc(doc(db, 'user', uid), 
        {list: convertListForStorage(toDoList.list),
        projects: toDoList.projects})
    } catch (e) {
        console.error('Error storing task list to Firebase: ', e);
    }
}

export const restoreFirestore = async (uid) => {
    const docSnap = await getDoc(doc(db, 'user', uid));
    console.log(docSnap)
    if (docSnap.exists()) {
        toDoList.list = convertStoredList(docSnap.data().list);
        toDoList.projects = docSnap.data().projects;
    }  else {
        toDoList.list = [];
        toDoList.projects = [];
    }
}

export const saveLocalStorage = () => {
    localStorage.setItem('taskList', JSON.stringify(
        convertListForStorage(toDoList.list)));
    localStorage.setItem('taskProjects', JSON.stringify(toDoList.projects));
}

export const restoreLocalStorage = () => {
    toDoList.list = [];
    let stored = localStorage.getItem('taskList');
    if (stored) {
        toDoList.list = convertStoredList(JSON.parse(stored));
    }
    toDoList.projects = [];
    stored = localStorage.getItem('taskProjects');
    if (stored) {
        toDoList.projects = JSON.parse(stored);
    }
}

export const setUpFirestore = (fs) => {
    db = fs;
}