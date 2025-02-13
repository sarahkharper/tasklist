import "./styles.css";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./fa-icons/css/all.css";
import {createTodo, todoFromForm, submitForm} from "./todo.js";
import * as storageFunct from "./storage-functions.js";
import * as domManip from "./DOM-manip.js";

//initialize todoList
let todoList;

//initiate local storage and get objects in storage
if (storageFunct.storageAvailable("localStorage")){
    localStorage.length > 0 
        ? todoList = storageFunct.retrieveObjFromStorage(todoList)
        : todoList = [];
} else {
    todoList = [];
}

domManip.updateUI(todoList);

const formTodo = document.querySelector('#nav-new-task-form');
submitForm(formTodo, "todo", todoList);
domManip.toggleShow(formTodo, "close", "submit");

const formProj = document.querySelector('#nav-new-proj-form');
submitForm(formProj, "project", todoList);
domManip.toggleShow(formProj, "close", "submit");

//add expand listener to all expand buttons
const expandBtns = document.querySelectorAll('.form-expand-btn');
expandBtns.forEach(expandBtn => {
    domManip.toggleShow(expandBtn, "open", "click");
})

//add close listener to all close buttons
const closeBtns = document.querySelectorAll('.close-btn');
closeBtns.forEach(closeBtn => {
    domManip.toggleShow(closeBtn, "close", "click");
})

//add completion status modifier to all checkboxes
//const checkboxes = document.querySelectorAll(".change-status-box");
//checkboxes.forEach(checkbox => {
    //toggleCompletionStatus(checkbox, todoList);
   
//});
