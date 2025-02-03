import { toggleCompletionStatus, toggleCheck } from './change-status';

const datefns = require('date-fns');

//determine which todos will show on page load
let displayCond = "default";

//event listener to toggle 'show' class for form expand buttons

export function toggleShow(elem, type, event){
    if (type === "open"){
        var formContainer = elem.nextElementSibling;
    } else if (type === "close"){
        var formContainer = elem.closest(".form-box");
    }
    const formRef = formContainer.querySelector("form");

    elem.addEventListener(event, () => {
        formContainer.classList.toggle("show");
        formRef.reset();
    })
}

//create divs from objects to add to UI
function makeNewElem(item){
    const newElem = document.createElement("div");
    
    //add uuid as class 
    const uuid = item.getUUID();
    const type = item.getType();
    newElem.classList.add(`${uuid}`, `${type}`);

    //add any non-function fields to display
    for(const key in item){
        if(typeof item[key] !== 'function'){
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
export function clearAfterNthChild(parent, numb){
    if (numb === 0){
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
          }
    } else {
        while (parent.children.length > numb) {
            parent.removeChild(parent.lastChild);
        }
    } 
}

function removeElementsByClass(className){
    let elements = document.querySelectorAll(`.${className}`);
    for(const el of elements){
        el.parentNode.removeChild(el);
    }
}

function removeChildBySelector(parent, selector){
    parent.querySelector(selector).remove(); 
}

//function to clear variable UI
export function clearChangeableUI(){
    //remove all project buttons
    removeElementsByClass('proj-select');


    //remove all projects from drop down
    removeElementsByClass('proj-opt');
    
    //remove all todos
    removeElementsByClass('todo');
}

//function to set all variable UI
export function updateUI(array){
    //clear all variable UI present in DOM
    clearChangeableUI();

    //get relevant containers in DOM
    for(const obj of array){
        switch(obj.getType()) {
            case "project":
                addProjToScreen(obj);
                addProjToForm(obj);
                break;
            case "todo":
                addTodoToScreen(obj, array);
                //addTodoEdit(obj, array);
                break;
        }
    }
}

//function to show projects in sidebar
function addProjToScreen(obj){
    //remove color from textContent
    const elem = makeNewElem(obj);
    removeChildBySelector(elem, ".colorInput");

    const projNav = document.querySelector(".projectNav");
    const projBtn = document.createElement("button");
    
    //create button to add to nav
    projBtn.className = elem.className;
    projBtn.classList.add('proj-select'); //class for all proj buttons
    projBtn.textContent = elem.textContent;
    projNav.insertBefore(projBtn, projNav.lastChild);

    //add icon to project button
    const projIcon = makeIcon(["fa-solid", "fa-puzzle-piece", "nav-icons"], obj.colorInput);
    projBtn.insertBefore(projIcon, projBtn.firstChild);
}

//function to add projects to dropdown in todo creation form
function addProjToForm(obj){
    const projOpts = document.querySelectorAll('optgroup[label = "Projects"]');
    
    const newProj = document.createElement('option'); //create option for new project
    newProj.value = obj.getUUID();
    newProj.text = obj.name;
    newProj.classList.add("proj-opt");

    projOpts.forEach(projOpt => {
        projOpt.appendChild(newProj);
        filterOptgroups(projOpt);
    })
}

//function to only show project optgroup if projects have been created
function filterOptgroups(projOpt) {
    const hasChildren = projOpt.querySelectorAll("option").length > 0;
    projOpt.style.display = hasChildren ? "block" : "none";
  }

//function to show tasks on screen (incl. parameters to filter by project or date)
export function addTodoToScreen(obj, array){
    const todoContainer = document.querySelector("#todo-container");
    const priColor = setColorByPriority(obj); //get color to go with object priority
    const uuid = obj.getUUID();

    //make new todo element and remove extraneous content
    const elem = makeNewElem(obj);
    removeChildBySelector(elem, ".priority");
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
    console.log(obj.getState());
    if(obj.getState()){
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }

    //format deadline (if present)
    if(obj.deadline.length !== 0) {
        const date = new Date(obj.deadline);
        const formattedDate = datefns.format(date, 'EEE, MMM d');
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
    if(obj.project !== "default"){
        const projColor = setColorByProject(obj, array);
        const projIcon = makeIcon(["fa-solid", "fa-puzzle-piece"], projColor);
        projElem.appendChild(projIcon);
    }
    
    //add and format notes (if present)

    todoContainer.appendChild(elem);
}

//function to color code elements by project
function setColorByProject(obj, array){
    const projects = array.filter((project) => project.getType() === "project");
    const targetProj = projects.find((project) => project.getUUID() === obj.project);
    return targetProj.colorInput;
}

//function to select color to go with priority
function setColorByPriority(obj){
    let priColor;
    switch(obj.priority){
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
    }
    return(priColor);
}

function makeIcon(iconParams, color){
    const projIcon = document.createElement("i");
    projIcon.classList.add(...iconParams); //add classes
    projIcon.style.color = color;    //make icon color match selected project color
    return projIcon;
}
