import "./styles.css";
import "../node_modules/modern-normalize/modern-normalize.css";
import "./fa-icons/css/all.css";
import {createTodo, greeting} from "./todo.js";
import * as domManip from "./DOM-manip.js";

const todoList = [];

const test = createTodo('Test', 'High', 'Now', 'Home', 'Testing');

const newTaskBtn = document.querySelector(".form-expand-btn");
const closeBtn = document.querySelector(".close-btn");
domManip.toggleShow(newTaskBtn, "open");
domManip.toggleShow(closeBtn, "close");
