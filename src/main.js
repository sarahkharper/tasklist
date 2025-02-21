import "./styles.css";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./fa-icons/css/all.css";
import { submitForm } from "./todo.js";
import {
  storageAvailable,
  retrieveObjFromStorage,
} from "./storage-functions.js";
import { updateUI, toggleShow, changeFilter } from "./DOM-manip.js";
import { addSubmitValidation, addTypingValidation } from "./form-validation.js";

//initialize todoList
let todoList = [];
console.log(localStorage.length);
//initiate local storage and get objects in storage
if (storageAvailable("localStorage")) {
  localStorage.length > 0
    ? (todoList = retrieveObjFromStorage(todoList))
    : (todoList = []);
} else {
  todoList = [];
}

let uiFilter = "all";

updateUI(todoList, uiFilter);

const formTodo = document.querySelector("#nav-new-task-form");
const nameInput = document.querySelector('input#nameInput');
const noteInput = document.querySelector('textarea');
addSubmitValidation(formTodo, nameInput);
addTypingValidation(formTodo, noteInput);
submitForm(formTodo, "todo", todoList);
toggleShow(formTodo, "close", "submit");

const formProj = document.querySelector("#nav-new-proj-form");
submitForm(formProj, "project", todoList, uiFilter);
toggleShow(formProj, "close", "submit");

//add expand listener to all expand buttons
const expandBtns = document.querySelectorAll(".form-expand-btn");
expandBtns.forEach((expandBtn) => {
  toggleShow(expandBtn, "open", "click");
});

//add close listener to all close buttons
const closeBtns = document.querySelectorAll(".sidenav  .close-btn");
closeBtns.forEach((closeBtn) => {
  toggleShow(closeBtn, "close", "click");
});

//add "show all tasks" ability to All Tasks button
const allBtn = document.querySelector("#all-tasks");
allBtn.addEventListener("click", () => {
  changeFilter("all");
});

//add ability to filter by date conditions to date filtering buttons
const todayBtn = document.querySelector("#today-btn");
todayBtn.addEventListener("click", () => {
  changeFilter("today");
});

const overdueBtn = document.querySelector("#overdue-btn");
overdueBtn.addEventListener("click", () => {
  changeFilter("overdue");
});

const upcomingBtn = document.querySelector("#upcoming-btn");
upcomingBtn.addEventListener("click", () => {
  changeFilter("upcoming");
});
