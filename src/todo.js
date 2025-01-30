import {projFromForm} from './project-creation.js';
import {updateUI} from './DOM-manip.js';
//import {toggleShow} from "./DOM-manip.js";
const datefns = require('date-fns');

//todo object creator

export function createTodo (todo){
    
    todo = {...todo};
    
    let isComplete = false;
    const uuid = crypto.randomUUID();

    //add function to access uuid
    todo.getUUID = () => {
        return uuid;
    }

    //add function to get type
    todo.getType = () => {
        return "todo";
    }

    //format deadline date
    if(todo.deadline){
        const rawDate = new Date(todo.deadline);
        const formattedDate = datefns.format(rawDate, 'MM-dd-yyyy');
        todo.deadline = formattedDate;
    }

    todo.changeComplete = () => { //function to change completion status
        isComplete = !isComplete
        return isComplete;
    };

    todo.getState = () => isComplete; //function to get completion status
    
    return todo;
};

export function addObjToArray(arrayName, objName){
    arrayName.push(objName);
}

export function submitForm(form, type, arrayName){
    form.addEventListener("submit", (event) =>{
        event.preventDefault();
        if(type === "todo"){
            var todo = todoFromForm(form);
        } else if(type === "project"){
            var todo = projFromForm(form);
        }
        console.log(todo);
        addObjToArray(arrayName, todo);
        console.log(arrayName);
        updateUI(arrayName);
    })
}

export function todoFromForm(form){
    //add submit event listener to get todo data from form
        const todoData = objFromForm(form);
        console.log(todoData);
        const todo = createTodo(todoData);
        return todo;
}

export function objFromForm(form){
    const formData = new FormData(form);
    console.log(formData);
    const obj = Object.fromEntries(formData);
    console.log(obj);
    return obj;
}

