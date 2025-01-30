import "./styles.css";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./fa-icons/css/all.css";
import {createTodo, todoFromForm, submitForm} from "./todo.js";
import * as domManip from "./DOM-manip.js";

const todoList = [];

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
