import * as ui from './ui'
import { toDoList } from './app'
import { 
    getUserId
} from './authentication'
import { 
    saveFirestore,
    restoreFirestore, 
    saveLocalStorage
} from './storage'
import { openAddTaskModal } from './dashboardUI'
import { Task } from './todoitem'

const priorityColors = ['green', 'yellow', 'red'];

export const getInput = () => {
    const taskDueDate = ui.taskDueDate.value;
    const taskTitle = ui.taskTitle.value;
    const taskDescription = ui.taskDescription.value;
    const taskPriority = Number.parseInt(Array.prototype.filter.call(
        ui.taskPriorities, i => i.checked)[0].value);
    let taskCategory = '';

    if (!ui.taskProjectSelect.disabled){
        taskCategory = ui.taskProjectSelect.options[ui.taskProjectSelect.selectedIndex].value;
    }
    return new Task(taskCategory, 
        taskTitle, 
        taskDescription, 
        taskDueDate, 
        false, 
        taskPriority);
}

export const addTask = () => {
    const successful = toDoList.addTask(getInput());
    if (successful) {
        saveData();

        let stored = localStorage.getItem('lastSelectedGroup');
        if (stored) {
            sortTasks(JSON.parse(stored));
        } else {
            sortTasks();
        }
        
        updateTaskGroupCount();
    }
    return successful;
}

const createTaskDisplay = (task) => {
    const taskDisplay = document.createElement('div');
    const taskCompleteStatus = document.createElement('input');
    const taskTitle = document.createElement('p');
    const taskDueDate = document.createElement('p');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    taskCompleteStatus.classList.add('task-conplete-status');
    taskTitle.classList.add('task-title');
    taskDueDate.classList.add('task-due-date');
    editBtn.classList.add('task-edit-btn');
    deleteBtn.classList.add('task-delete-btn');
    taskDisplay.classList.add('task-display');

    taskCompleteStatus.setAttribute('type', 'checkbox')
    if (task.completeStatus) {
        taskCompleteStatus.checked = true;
        taskDisplay.classList.add('complete')
    } else {
        taskCompleteStatus.checked = false;
        taskDisplay.classList.remove('complete')
    }
    if (task.title.length < 180) {
        taskTitle.textContent = task.title;
    } else {
        taskTitle.textContent = task.title.substring(0, 175) + '...';
    }
    
    taskDueDate.textContent = task.dueDate;
    editBtn.innerHTML = '<i class="fa fa-edit"></i>';
    deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';

    taskCompleteStatus.onclick = toggleTaskCompleteStatus;
    editBtn.onclick = editTask;
    deleteBtn.onclick = removeTask;
    taskDisplay.onclick = toggleDetailPanel;

    taskDisplay.appendChild(taskCompleteStatus);
    taskDisplay.appendChild(taskTitle);
    taskDisplay.appendChild(taskDueDate);
    taskDisplay.appendChild(editBtn);
    taskDisplay.appendChild(deleteBtn);

    return taskDisplay;
}

const createTaskDetailPanel = (task) => {
    const detailPanel = document.createElement('div');
    detailPanel.classList.add('detail-panel');
    detailPanel.classList.add('invisible');

    const detailPanelDescription = document.createElement('p');
    const detailPanelDueDate = document.createElement('p');
    const detailPanelPriority = document.createElement('p');
    const collapseButton = document.createElement('button');

    detailPanelDescription.textContent = `Description: ${task.description === '' 
    ? 'None' : task.description}`;
    detailPanelDueDate.textContent = `Due: ${task.dueDate}`;
    detailPanelPriority.textContent = `Priority: ${['Low', 'Medium', 'High'][task.priority]}`;
    collapseButton.textContent = 'Show Less';

    collapseButton.classList.add('collapse');
    collapseButton.onclick = toggleDetailPanel;
    collapseButton.style.color = priorityColors[task.priority];

    detailPanel.appendChild(detailPanelDescription);
    detailPanel.appendChild(detailPanelDueDate);
    detailPanel.appendChild(detailPanelPriority);
    detailPanel.appendChild(collapseButton);

    return detailPanel;
}

const createTaskCard = (task) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');
    taskCard.style.borderLeftColor = priorityColors[task.priority];

    taskCard.appendChild(createTaskDisplay(task));
    taskCard.appendChild(createTaskDetailPanel(task));

    return taskCard;
}

export const updateTaskGroupCount = () => {
    const taskGroups = document.getElementsByClassName('task-group');
    for (let task of taskGroups) {
        let groupName = task.childNodes[1].textContent;
        if (groupName === 'All Tasks') {
            task.getElementsByTagName('p')[0].textContent = toDoList.list.length;
        } else if (groupName === 'Today') {
            task.getElementsByTagName('p')[0].textContent = toDoList.getTodayTasks().length;
        } else if (groupName === 'This Week') {
            task.getElementsByTagName('p')[0].textContent = toDoList.getThisWeekTasks().length;
        } else {
            groupName = task.childNodes[0].textContent;
            task.getElementsByTagName('p')[0].textContent = toDoList.getTasksByCategory(groupName).length;
        }
    }
}

export const updateTaskCard = (taskIndex, newTask) => {
    const taskDiv = document.getElementsByClassName('task')[taskIndex];

    taskDiv.childNodes[1].textContent = newTask.title;
    taskDiv.childNodes[2].textContent = newTask.dueDate;
}

export const updateTaskList = (tasks, groupName='All Tasks') => {
    ui.taskGroupTitle.textContent = groupName;
    ui.taskList.innerHTML = '';

    if (tasks.length > 0) {
        for (let task of tasks) {
            ui.taskList.appendChild(createTaskCard(task));
        }
    }
}

const editTask = (e) => {
    const taskTitle = e.target.parentNode.parentNode.childNodes[1].innerHTML;
    const task = toDoList.getTaskByTitle(taskTitle);

    openAddTaskModal();
    ui.addTaskForm.childNodes[3].textContent = 'Edit this task:';
    ui.taskDueDate.value = task.dueDate;
    ui.taskTitle.value = task.title;
    ui.taskDescription.value = task.description;
    if (task.category !== '') {
        const index = toDoList.projects.indexOf(task.category);
        ui.taskProjectSelect.selectedIndex = index;
    }
    const priorityRB = Array.prototype.find.call(
        ui.taskPriorities, i => Number.parseInt(i.value) === task.priority);
    priorityRB.checked = true;

    ui.addTaskBtn.classList.remove('active');
    ui.addTaskBtn.classList.add('inactive');

    ui.doneBtn.classList.add('active');
    ui.doneBtn.classList.remove('inactive');

    localStorage.setItem('taskForEdit', JSON.stringify(taskTitle));
}

const removeTask = (e) => {
    const taskTitle = e.target.parentNode.parentNode.childNodes[1].innerHTML;
    toDoList.removeTask(taskTitle);
    saveData();
    updateTaskList(toDoList.list);
}

const toggleTaskCompleteStatus = (e) => {
    const taskTitle = e.target.parentNode.childNodes[1].innerHTML;
    const task = toDoList.getTaskByTitle(taskTitle);
    task.completeStatus = !task.completeStatus;
    saveData();
    updateTaskList(toDoList.list);
}

const toggleDetailPanel = (e) => {
    const div = e.target.parentNode.parentNode.childNodes[1];
    if (div.classList.contains('visible')) {
        div.classList.remove('visible');
        div.classList.add('invisible');
    } else {
        div.classList.remove('invisible');
        div.classList.add('visible');
    }
}

export const sortTasks = (groupName='All Tasks') => {
    switch(ui.sortTasksSelect.selectedIndex) {
        case 1: {
            updateTaskList(toDoList.sortByTitle(), groupName);
            break;
        }
        case 2: {
            updateTaskList(toDoList.sortByPriority('lowhigh'), groupName);
            break;
        }
        case 3: {
            updateTaskList(toDoList.sortByPriority('highlow'), groupName);
            break;
        }
        case 4: {
            updateTaskList(toDoList.sortByDueDate('ascending'), groupName);
            break;
        }
        case 5: {
            updateTaskList(toDoList.sortByDueDate('descending'), groupName);
            break;
        }
        default: {
            updateTaskList(toDoList.list, groupName);
            break;
        }
    }
}

export const saveData = () => {
    if (getUserId()) {
        restoreFirestore(getUserId())
            .catch(() => {
                console.log('No storage set up yet for current user!');
            });
        saveFirestore(getUserId());
    } else {
        saveLocalStorage();
    }
}