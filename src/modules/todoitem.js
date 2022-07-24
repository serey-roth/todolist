export class Task {
    constructor(category = '',
    title = '',
    description = '',
    date = 'yyyy-mm-dd',
    completeStatus = false,
    priority = 0){
        this.taskCategory = category;
        this.taskTitle = title;
        this.taskDescription = description;
        this.taskDueDate = date;
        this.taskCompleteStatus = completeStatus;
        this.taskPriority = priority;
    }
    get category() {
        return this.taskCategory;
    }
    set category(newCategory) {
        this.taskCategory = newCategory;
    }
    get title() {
        return this.taskTitle;
    }
    set title(newTitle) {
        this.title = newTitle;
    }
    get description() {
        return this.taskDescription;
    }
    set description(newDescription) {
        this.taskDescription = newDescription;
    }
    get dueDate() {
        return this.taskDueDate;
    }
    set dueDate(newDueDate) {
        this.taskDueDate = newDueDate;
    }
    get completeStatus() {
        return this.taskCompleteStatus;
    }
    set completeStatus(completeStatus) {
        this.taskCompleteStatus = completeStatus;
    }
    get priority() {
        return this.taskPriority;
    }
    set priority(newPriority) {
        this.taskPriority = newPriority;
    }
    update(newTask) {
        this.taskCategory = newTask.category;
        this.taskTitle = newTask.title;
        this.taskDescription = newTask.description;
        this.taskDueDate = newTask.dueDate;
        this.taskCompleteStatus = newTask.completeStatus;
        this.taskPriority = newTask.priority;
    }
}