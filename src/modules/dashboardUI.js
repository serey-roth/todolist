import * as ui from './ui'
import {
    loginEmailPassword as logIn,
    createAccount as signUp,
    logOut
} from './authentication'
import { 
    addTask, 
    getInput, 
    saveData, 
    sortTasks, 
    updateTaskCard, 
    updateTaskList } from './todolistUI';
import { toDoList } from './app';
import { getToday } from './todolist';

const toggleDashboard = () => {
    if (ui.dashBoard.classList.contains('active')) {
        ui.dashBoard.classList.remove('active');
        ui.dashBoard.classList.add('inactive');
    } else {
        ui.dashBoard.classList.remove('inactive');
        ui.dashBoard.classList.add('active');
    }
}

export const resetLogInModal = () => {
    ui.emailTxt.textContent = '';
    ui.passwordTxt.textContent = '';
}

export const openLogInModal = () => {
  ui.overlay.classList.remove('inactive');
  ui.logInModal.classList.remove('inactive')

  ui.overlay.classList.add('active');
  ui.logInModal.classList.add('active');
  resetLogInModal();
}

export const closeLogInModal = () => {
  ui.overlay.classList.remove('active');
  ui.logInModal.classList.remove('active')

  ui.overlay.classList.add('inactive');
  ui.logInModal.classList.add('inactive');
}

const toggleTaskProjectPanel = () => {
    ui.taskProjectSelect.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'None';
    option.textContent = 'None';
    ui.taskProjectSelect.appendChild(option)
    toDoList.projects.map(i => {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        ui.taskProjectSelect.appendChild(option);
    });
}

const resetAddTaskModal = () => {
    ui.taskDueDate.innerHTML = "";
    ui.taskTitle.innerHTML = "";
    ui.taskDescription.innerHTML = "";
    ui.taskPriorities[0].checked = true;
    toggleTaskProjectPanel();
    
    ui.doneBtn.classList.remove('active');
    ui.doneBtn.classList.add('inactive');

    ui.addTaskBtn.classList.add('active');
    ui.addTaskBtn.classList.remove('inactive');

    ui.addTaskForm.childNodes[3].textContent = 'Create a new task:';
}

export const openAddTaskModal = () => {
  ui.overlay.classList.remove('inactive');
  ui.addTaskModal.classList.remove('inactive')

  ui.overlay.classList.add('active');
  ui.addTaskModal.classList.add('active');
  resetAddTaskModal();
}

const closeAddTaskModal = () => {
  ui.overlay.classList.remove('active');
  ui.addTaskModal.classList.remove('active')

  ui.overlay.classList.add('inactive');
  ui.addTaskModal.classList.add('inactive');
}

const openAddProjectForm = () => {
  ui.addProjectForm.classList.remove('inactive');
  ui.addProjectForm.classList.add('active');
}

const closeAddProjectForm = () => {
  ui.addProjectForm.classList.remove('active');
  ui.addProjectForm.classList.add('inactive');
}

const createNewProjectElement = (name) => {
    let div = document.createElement('div');
    div.classList.add('task-group');
    div.onclick = showTasksForSelectedGroup;

    let projectName = document.createElement('h5');
    projectName.textContent = name;

    const count = document.createElement('p');
    count.textContent = 0;

    div.appendChild(projectName);
    div.appendChild(count);
    ui.projectList.appendChild(div);

    ui.collapseBtn.style.pointerEvents = 'all';
}

const addNewProject = (e) => {
    e.preventDefault();
    const successful = toDoList.addProject(ui.projectName.value);
    if (successful) {
        saveData();
        createNewProjectElement(ui.projectName.value);
        closeAddProjectForm();
    } else {
        alert('Project already exists!');
    }
}

const addNewTask = (e) => {
    e.preventDefault();
    const successful = addTask();
    if (successful) {
        closeAddTaskModal();
    } else {
        alert('Task with this title already exist!');
    }
}

const updateTask = (e) => {
    e.preventDefault();

    let stored = localStorage.getItem('taskForEdit');
    if (stored) {
        const task = toDoList.getTaskByTitle(JSON.parse(stored));
        const index = toDoList.indexOf(JSON.parse(stored));
        const newTask = getInput();

        task.update(newTask);
        updateTaskCard(index, task);
    }

    closeAddTaskModal();
}

export const updateProjectList = () => {
    ui.projectList.innerHTML = '';
    for (let p of toDoList.projects) {
        createNewProjectElement(p);
    }
    if (toDoList.projects.length === 0) {
        ui.collapseBtn.style.pointerEvents = 'none';
    } else {
        ui.collapseBtn.style.pointerEvents = 'all';
    }
}

const toggleProjectList = () => {
    if (ui.projectList.classList.contains('active')) {
        ui.projectList.classList.remove('active');
        ui.projectList.classList.add('inactive');
    } else {
        ui.projectList.classList.remove('inactive');
        ui.projectList.classList.add('active');
    }
}

const showTasksByGroupName = (groupName) => {
    if (groupName === 'All Tasks') {
        updateTaskList(toDoList.list, groupName);
    } else if (groupName === 'Today') {
        updateTaskList(toDoList.getTodayTasks(), groupName);
    } else if (groupName === 'This Week') {
        updateTaskList(toDoList.getThisWeekTasks(), groupName);
    } else {
        updateTaskList(toDoList.getTasksByCategory(groupName), groupName);
    }
}

function highLightSelectedGroup(taskDiv) {
    return new Promise(resolve => {
        setTimeout(() => {
            taskDiv.classList.add('selected');
            resolve('resolved');
        }, 500);
    })
}

const showTasksForSelectedGroup = (e) => {
    const groupName = e.target.textContent;
    let taskDiv = Array.prototype.filter.call(ui.taskGroups, 
        i => i.classList.contains('selected'));

    if (taskDiv.length != 0) {
        taskDiv[0].classList.remove('selected');
    }    
    
    taskDiv = e.target.parentNode;
    highLightSelectedGroup(taskDiv)
    .then(() => showTasksByGroupName(groupName));

    localStorage.setItem('lastSelectedGroup', JSON.stringify(groupName));
}

const sortTaskCards = () => sortTasks();

export const initializeDashboard = () => {
    ui.toggleDashboardBtn.onclick = toggleDashboard;

    ui.openLogInModalBtn.onclick = openLogInModal;
    ui.closeLogInModalBtn.onclick = closeLogInModal;
    ui.logInBtn.onclick = logIn;
    ui.logOutBtn.onclick = logOut;
    ui.signUpBtn.onclick = signUp;

    ui.openAddProjectFormBtn.onclick = openAddProjectForm;
    ui.closeAddProjectFormBtn.onclick = closeAddProjectForm;
    ui.addProjectForm.onsubmit = addNewProject;
    ui.collapseBtn.onclick = toggleProjectList;
    Array.prototype.map.call(ui.taskGroups, 
        i => i.onclick = showTasksForSelectedGroup);

    ui.openAddTaskModalBtn.onclick = openAddTaskModal;
    ui.closeAddTaskModalBtn.onclick = closeAddTaskModal;
    ui.taskDueDate.setAttribute('min', getToday());
    ui.addTaskForm.onsubmit = addNewTask;
    ui.doneBtn.onclick = updateTask;
    ui.cancelAddTaskBtn.onclick = closeAddTaskModal;

    ui.sortTasksSelect.onchange = sortTaskCards;
}