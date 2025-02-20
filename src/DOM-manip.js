import {
  toggleCompletionStatus,
  toggleCheck,
  findObjIdx,
} from "./change-status";
import { getProjects } from "./project-creation";
import { getTodos, submitEdit, deleteTodo } from "./todo";
import { retrieveObjFromStorage } from "./storage-functions";

const datefns = require("date-fns");
let uiFilter = "all";

export function setUIFilter(params) {
  uiFilter = params;
}

export function getUIFilter() {
  return uiFilter;
}

//create object storing priority levels and associated colors
const priObj = {
  high: "#FF6464",
  medium: "#FFE162",
  low: "#91c483",
  none: "#EEEEEE",
};

//determine which todos will show on page load
let displayCond = "default";

//event listener to toggle 'show' class for form expand buttons

export function toggleShow(elem, type, event) {
  if (type === "open") {
    var formContainer = elem.nextElementSibling;
  } else if (type === "close") {
    var formContainer = elem.closest(".form-box");
  }
  const formRef = formContainer.querySelector("form");

  elem.addEventListener(event, () => {
    formContainer.classList.toggle("show");
    formRef.reset();
  });
}

//create divs from objects to add to UI
function makeNewElem(item) {
  const newElem = document.createElement("div");

  //add uuid as class
  const uuid = item.getUUID();
  const type = item.getType();
  newElem.classList.add(`${uuid}`, `${type}`);

  //add any non-function fields to display
  for (const key in item) {
    if (typeof item[key] !== "function") {
      //if(key === "colorInput" & key != "priority"){
      const newSpan = document.createElement("span");
      newSpan.classList.add(`${key}`);
      newElem.appendChild(newSpan);
      newSpan.textContent = item[key];
      //}
    }
  }
  return newElem;
}

//function to remove all but first child
export function clearAfterNthChild(parent, numb) {
  if (numb === 0) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  } else {
    while (parent.children.length > numb) {
      parent.removeChild(parent.lastChild);
    }
  }
}

function removeElementsByClass(className) {
  let elements = document.querySelectorAll(`.${className}`);
  for (const el of elements) {
    el.parentNode.removeChild(el);
  }
}

function removeChildBySelector(parent, selector) {
  parent.querySelector(selector).remove();
}

//function to clear variable UI
export function clearChangeableUI() {
  //remove all project buttons
  removeElementsByClass("proj-select");

  //remove all projects from drop down
  removeElementsByClass("proj-opt");

  //remove all todos
  removeElementsByClass("todo");
}

//function to set all variable UI
export function updateUI(array, uiFilter) {
  //clear all variable UI present in DOM
  clearChangeableUI();

  const projArray = getProjects(array);
  sortObjs(projArray, "timestamp");

  let todoArray = getTodos(array, uiFilter);
  sortObjs(todoArray, "timestamp");
  //console.log(todoArray);

  //set main container header based on filter
  setHeader(uiFilter, projArray);

  //add projects and todos to screen from arrays

  for (const proj of projArray) {
    addProjToScreen(proj);
  }

  for (const todo of todoArray) {
    addTodoToScreen(todo, todoArray, projArray);
  }

  //add projects to all project selection dropdowns in DOM
  //add option for each project
  const projOpts = document.querySelectorAll('optgroup[label = "Projects"]');
  projOpts.forEach((projOpt) => {
    addProjToForm(projOpt, projArray);
    filterOptgroups(projOpt);
  });

  //add event listener to all buttons that toggle visibility of todo elements
  const editBtns = document.querySelectorAll(".toggle-edit");
  editBtns.forEach((editBtn) => {
    toggleEdit(editBtn, "click");
  });

  //add event listener to forms that update todo entry on submit
  const editForms = document.querySelectorAll(".todo.form-box");
  editForms.forEach((editForm) => {
    submitEdit(editForm, todoArray);
  });

  //add event listener to todo items to delete todo
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((deleteBtn) => {
    deleteTodo(deleteBtn, todoArray, "click");
  });
}

function setHeader(uiFilter, projArray) {
  const cont = document.querySelector(".header-container");
  clearAfterNthChild(cont, 0);
  const hdr = document.createElement("h1");
  cont.appendChild(hdr);
  if (uiFilter === "all") {
    hdr.textContent = "All Tasks";
  } else if (uiFilter[0] == "project") {
    const proj = findObjIdx(uiFilter[1], projArray);
    hdr.textContent = projArray[proj].name;
  } else {
    hdr.textContent = capitalizeFirstLetter(uiFilter);
  }
}

//function to show projects in sidebar
function addProjToScreen(obj) {
  //remove color from textContent
  const elem = makeNewElem(obj);
  removeChildBySelector(elem, ".colorInput");
  removeChildBySelector(elem, ".timestamp");

  const projNav = document.querySelector(".projectNav");
  const projBtn = document.createElement("button");

  //create button to add to nav
  projBtn.className = elem.className;
  projBtn.classList.add("proj-select"); //class for all proj buttons
  projBtn.textContent = elem.textContent;
  projNav.insertBefore(projBtn, projNav.lastChild);

  //add icon to project button
  const projIcon = makeIcon(
    ["fa-solid", "fa-puzzle-piece", "nav-icons"],
    obj.colorInput,
  );
  projBtn.insertBefore(projIcon, projBtn.firstChild);

  //add event listener to filter display
  projBtn.addEventListener("click", () => {
    changeFilter(["project", obj.getUUID()]);
  });
}

export function changeFilter(newFilter) {
  let todoList = [];
  todoList = retrieveObjFromStorage(todoList);
  setUIFilter(newFilter);
  updateUI(todoList, uiFilter);
}

//function to add projects to dropdown in todo creation form
function addProjToForm(projOpt, array) {
  const projArray = getProjects(array);

  //identify if a project should be selected on default for dropdown
  const selectedProj = getSelectedProject(projOpt);

  for (let i = 0; i < projArray.length; i++) {
    const obj = projArray[i];
    const newProj = document.createElement("option"); //create option for new project
    newProj.value = obj.getUUID();
    if (newProj.value == selectedProj) {
      newProj.selected = true;
    }
    newProj.text = obj.name;
    newProj.classList.add("proj-opt");
    projOpt.appendChild(newProj);
  }
}

function getSelectedProject(elem) {
  //get all classes of element
  const classList = elem.classList.toString();
  const classArray = classList.split(" ");

  //get project uuid (first class)
  return classArray[0];
}

//function to only show project optgroup if projects have been created
function filterOptgroups(projOpt) {
  const hasChildren = projOpt.querySelectorAll("option").length > 0;
  projOpt.style.display = hasChildren ? "block" : "none";
}

//function to show tasks on screen (incl. parameters to filter by project or date)
export function addTodoToScreen(obj, array, projArray, priObj) {
  const todoContainer = document.querySelector("#todo-container");
  const itemContainer = document.createElement("div");
  itemContainer.classList.add("todo-entry");
  todoContainer.appendChild(itemContainer);
  const priColor = setColorByPriority(obj, priObj); //get color to go with object priority
  const uuid = obj.getUUID();
  const elemShowCont = document.createElement("div");
  itemContainer.appendChild(elemShowCont);

  //make new todo element and remove extraneous content
  const elem = makeNewElem(obj);
  removeChildBySelector(elem, ".priority");
  removeChildBySelector(elem, ".timestamp");
  //elem.classList.add("form-box");
  /*removeChildBySelector(elem, ".project");*/

  //create checkbox that reflects todo's priority (in color)
  const checkboxContainer = document.createElement("div");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "markComplete";
  checkbox.id = `${uuid}_check`;
  checkbox.classList.add("change-status-box");
  checkboxContainer.appendChild(checkbox);
  //set background color according to priority
  checkbox.style.backgroundColor = priColor;
  elem.insertBefore(checkboxContainer, elem.firstChild);
  //add event listeners to checkbox
  toggleCompletionStatus(checkbox, array);
  //check if todo is complete and check if complete
  toggleCheck(obj, checkbox);

  //format deadline (if present)
  if (obj.deadline.length !== 0) {
    const date = new Date(obj.deadline);
    const formattedDate = datefns.format(date, "EEE, MMM d");
    const dateElem = elem.querySelector(".deadline");
    dateElem.textContent = formattedDate;

    //add icon to deadline (if present)
    const dateIcon = makeIcon(["fa-solid", "fa-calendar"], "gray");
    dateElem.insertBefore(dateIcon, dateElem.firstChild);
  }

  //format project element
  const projElem = elem.querySelector(".project");
  projElem.textContent = "";
  //if assigned to a project, add appropriate icon
  if (obj.project !== "default") {
    const projColor = setColorByProject(obj, projArray);
    const projIcon = makeIcon(["fa-solid", "fa-puzzle-piece"], projColor);
    projElem.appendChild(projIcon);
  }

  //add edit button
  //const editBtn = document.createElement("button");
  const btnColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("--accent-color-1");
  const editIcon = makeIcon(["fa-solid", "fa-pen"], btnColor);
  editIcon.classList.add("edit-button");
  editIcon.classList.add("toggle-edit");
  elem.appendChild(editIcon);
  //add event listener to edit button to hide todo item and show form
  //toggleEdit(editIcon, "click");

  //add delete button
  const delColor = window
    .getComputedStyle(document.body)
    .getPropertyValue("--accent-color-2");
  const delIcon = makeIcon(["fa-solid", "fa-trash-can"], delColor);
  delIcon.classList.add("delete-btn");
  elem.appendChild(delIcon);

  elemShowCont.appendChild(elem);

  //add edit form to item
  const editForm = addTodoEditForm(obj, array);
  itemContainer.appendChild(editForm);
}

function addTodoEditForm(obj, array) {
  const formEdit = document.createElement("form");
  formEdit.classList.add(`${obj.getUUID()}`);
  formEdit.classList.add(`${obj.timestamp}`);
  formEdit.classList.add("todo");
  formEdit.classList.add("form-box");

  //make container for form
  const formShowCont = document.createElement("div");
  formShowCont.classList.add("hide");
  formShowCont.appendChild(formEdit);

  //make text input to edit todo name
  const nameEdit = createNewInput("text", "name", obj.name);
  formEdit.appendChild(nameEdit);

  //make date input to edit deadline
  const deadlineEdit = createNewInput("date", "deadline", obj.deadline);
  formEdit.appendChild(deadlineEdit);

  //make note input to edit notes
  const noteEdit = createNewInput("textarea", "notes", obj.notes);
  formEdit.appendChild(noteEdit);

  //make priority radio button input to edit priority
  const priorityEdit = document.createElement("fieldset"); //make fieldset wrapping buttons
  priorityEdit.classList.add("priority-radios");
  formEdit.appendChild(priorityEdit);
  //add button for each priority level
  const keys = Object.keys(priObj);
  const values = Object.values(priObj);
  for (let i = 0; i < Object.keys(priObj).length; i++) {
    let priBtn = createNewInput("radio", "priority", keys[i]);
    priBtn.style.backgroundColor = values[i];
    //set object's current priority to be selected on load
    if (keys[i] == obj.priority) {
      priBtn.checked = true;
    }
    priorityEdit.appendChild(priBtn);
  }

  //make dropdown to select project
  const projectEdit = createNewInput("select", "project", "");
  formEdit.appendChild(projectEdit);
  //add option for general tasks
  const genProj = createNewInput("option", "General", "default");
  projectEdit.appendChild(genProj);
  //add project optgroup
  const optgrp = document.createElement("optgroup");
  optgrp.setAttribute("label", "Projects");
  optgrp.classList.add(obj.project);
  projectEdit.appendChild(optgrp);
  /*//add option for each project
    const projArray = getProjects(array);
    for(let i = 0; i < projArray.length; i++){
        addProjToForm(projArray[i]);
    }*/

  //add close button
  const closeBtn = createNewInput("button", "close", "Cancel");
  closeBtn.classList.add("close-btn", "toggle-edit");
  formEdit.appendChild(closeBtn);
  //toggleEdit(closeBtn, "click");

  //add submit button
  const submitEdit = createNewInput("submit", "submit", "Save");
  submitEdit.classList.add("toggle-edit");
  formEdit.appendChild(submitEdit);
  //toggleEdit(submitEdit, "submit");

  return formShowCont;
}

function createNewInput(type, name, placeholder) {
  if ((type == "textarea") | (type == "select") | (type == "option")) {
    var newInput = document.createElement(type);
  } else {
    var newInput = document.createElement("input");
    if (type != "date") {
      newInput.setAttribute("type", type);
    } else {
      newInput.setAttribute("type", "text");
      newInput.onfocus = function () {
        this.type = "date";
      };
    }
  }
  if (type == "option") {
    newInput.textContent = name;
  } else {
    newInput.setAttribute("name", name);
  }
  const capname = capitalizeFirstLetter(name);
  if (placeholder == "") {
    newInput.setAttribute("placeholder", `Add ${capname}`);
  } else if (
    (type == "radio") |
    (type == "submit") |
    (type == "button") |
    (type == "option")
  ) {
    newInput.setAttribute("value", placeholder);
  } else {
    newInput.setAttribute("value", placeholder);
    newInput.textContent = placeholder;
  }
  newInput.classList.add(`${name}`);
  return newInput;
}

//function to capitalize letter of string
export function capitalizeFirstLetter(strng) {
  const targetLetter = strng.charAt(0).toUpperCase();
  const remainder = strng.slice(1);
  const capitalizedWord = targetLetter + remainder;
  return capitalizedWord;
}

//function to color code elements by project
function setColorByProject(obj, array) {
  //const projects = getProjects(array);
  const targetProj = array.find((project) => project.getUUID() === obj.project);
  return targetProj.colorInput;
}

//function to select color to go with priority
function setColorByPriority(obj) {
  let priColor;
  for (let [key, value] of Object.entries(priObj)) {
    if (key == obj.priority) {
      priColor = value;
    }
  }
  /*switch(obj.priority){
        case "high":
            priColor = "#FF6464";
            break;
        case "medium":
            priColor = "#FFE162";
            break;
        case "low":
            priColor = "#91c483";
            break;
        default:
            priColor = "#EEEEEE";
    }*/
  return priColor;
}

function makeIcon(iconParams, color) {
  const projIcon = document.createElement("i");
  projIcon.classList.add(...iconParams); //add classes
  projIcon.style.color = color; //make icon color match selected project color
  return projIcon;
}

function toggleEdit(editIcon, event) {
  //get parent div for all content associated with this todo (display & form)
  const todoElemCont = editIcon.closest(".todo-entry");

  //get form & display containers as children
  const todoChildren = todoElemCont.querySelectorAll(".todo-entry > *");

  //add event listener to toggle hide class for child elements
  editIcon.addEventListener(event, () => {
    todoChildren.forEach((childCont) => {
      childCont.classList.toggle("hide");
      if (childCont.nodeName == "FORM") {
        childCont.reset();
      }
    });
  });
}

//function to sort children of an element by timestamp
function sortObjs(array, property) {
  array.sort((a, b) => a[property] - b[property]);
}
