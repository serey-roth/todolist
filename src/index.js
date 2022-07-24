import './style.css';
import { monitorAuthState } from './modules/authentication';
import { setUpApp } from './modules/app';
import { getCurrentDate, getThisWeekDates } from './modules/todolist';

setUpApp();
monitorAuthState();

console.log(getThisWeekDates());