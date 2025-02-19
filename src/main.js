import "./styles.css";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./fa-icons/css/all.css";
import {createTodo, todoFromForm, submitForm} from "./todo.js";
import * as storageFunct from "./storage-functions.js";
import * as domManip from "./DOM-manip.js";

//initialize todoList
let todoList = [];
console.log(localStorage.length)
//initiate local storage and get objects in storage
if (storageFunct.storageAvailable("localStorage")){
    localStorage.length > 0 
        ? todoList = storageFunct.retrieveObjFromStorage(todoList)
        : todoList = [];
} else {
    todoList = [];
}

let uiFilter = "all";

domManip.updateUI(todoList, uiFilter);

const formTodo = document.querySelector('#nav-new-task-form');
submitForm(formTodo, "todo", todoList);
domManip.toggleShow(formTodo, "close", "submit");

const formProj = document.querySelector('#nav-new-proj-form');
submitForm(formProj, "project", todoList, uiFilter);
domManip.toggleShow(formProj, "close", "submit");

//add expand listener to all expand buttons
const expandBtns = document.querySelectorAll('.form-expand-btn');
expandBtns.forEach(expandBtn => {
    domManip.toggleShow(expandBtn, "open", "click");
})

//add close listener to all close buttons
const closeBtns = document.querySelectorAll('.sidenav  .close-btn');
closeBtns.forEach(closeBtn => {
    domManip.toggleShow(closeBtn, "close", "click");
})

//add "show all tasks" ability to All Tasks button
const allBtn = document.querySelector('#all-tasks');
allBtn.addEventListener("click", () => {
    domManip.changeFilter("all");
})

//add ability to filter by date conditions to date filtering buttons
const todayBtn = document.querySelector('#today-btn');
todayBtn.addEventListener("click", () => {
    domManip.changeFilter("today");
})
