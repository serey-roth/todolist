const dayjs = require('dayjs');

export const getToday = () => {
    return dayjs().format('YYYY-MM-DD');
}

export const getThisWeekDates = () => {
    const week = [];
    const today = dayjs();

    for (let i = today.day(); i >= 0; i--) {
        week.push(today.subtract(i, 'day').format('YYYY-MM-DD'));
    } 
    for (let i = today.day(); i < 6; i++) {
        week.push(today.add(6 - i, 'day').format('YYYY-MM-DD'));
    }
    return week;
}

export class ToDoList {
    constructor() {
        this.taskList = [];
        this.taskProjects = [];
    }
    addTask(task) {
        if (!this.taskAlreadyAdded(task)) {
            this.taskList.unshift(task);
            return true;
        } else {
            return false;
        }
    }
    removeTask(taskTitle) {
        if (this.taskList) {
            this.taskList = this.taskList.filter(i =>
                i.title !== taskTitle);
            return true;
        } else {
            return false;
        }
    }
    taskAlreadyAdded(task) {
        for (let t of this.taskList) {
            if (t.title === task.title) {
                return true;
            }
        }
        return false;
    }
    indexOf(title) {
        return this.taskList.findIndex(i => i.title === title);
    }
    getTaskByTitle(title) {
        return this.taskList.find(i => i.title === title);
    }
    getTasksByCategory(category) {
        return this.taskList.filter(t => t.category === category);
    }
    setAllTasksIncomplete() {
        for (let t of this.taskList) {
            if (t.compeleteStatus) {
                t.completeStatus = false;
            }
        }
    }
    get list() {
        return this.taskList;
    }
    set list(l) {
        this.taskList = l;
    }
    getCount() {
        return this.taskList.length;
    }
    addProject(project) {
        if (this.projects.find(p => p === project)) {
            return false;
        } else {
            this.taskProjects.push(project);
            return true;
        }
        
    }
    get projects() {
        return this.taskProjects;
    }
    set projects(p) {
        this.taskProjects = p;
    }
    getProject(index) {
        return taskProjects[index];
    }
    getTodayTasks() {
        const today = getToday();
        return this.taskList.filter(t => t.dueDate === today);
    }
    getThisWeekTasks() {
        const thisWeekTasks = [];
        const thisWeekDates = getThisWeekDates();

        for (let t of this.taskList) {
            if (thisWeekDates.includes(t.dueDate)) {
                thisWeekTasks.push(t);
            }
        }

        return thisWeekTasks;
    }
    sortByPriority(order) {
        const tasks = this.taskList.map(t => t);
        if (order === 'lowhigh') {
            return tasks.sort((t1, t2) => (t1.priority === t2.priority) ? 0 : 
            (t1.priority < t2.priority ? -1 : 1));
            
        } else {
            return tasks.sort((t1, t2) => (t1.priority === t2.priority) ? 0 : 
            (t1.priority < t2.priority ? 1 : -1));
        }
    }
    sortByTitle() {
        const tasks = this.taskList.map(t => t);
        return tasks.sort((t1, t2) => (t1.title === t2.title) ? 0 : 
        (t1.title < t2.title ? -1 : 1));
    }
    sortByDueDate(order) {
        const tasks = this.taskList.map(t => t);
        if (order === 'ascending') {
            return tasks.sort((t1, t2) => (dayjs(t1.dueDate).isSame(dayjs(t2.dueDate))) ? 
                0 : (dayjs(t1.dueDate).isBefore(dayjs(t2.dueDate)) ? -1 : 1));
        } else {
            return tasks.sort((t1, t2) => (dayjs(t1.dueDate).isSame(dayjs(t2.dueDate))) ? 
            0 : (dayjs(t1.dueDate).isBefore(dayjs(t2.dueDate)) ? 1 : -1));
        }
    }
}